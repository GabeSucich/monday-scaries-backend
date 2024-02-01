import mongoose, { Document } from "mongoose";
import { Bettor, BettorGroup, User } from "./src/interfaces/mongoose.gen";
import UserModel from "./src/models/User";
import BettorModel from "./src/models/Bettor";
import BettorGroupModel from "./src/models/BettorGroup";
import WagerModel from "./src/models/Wager";

import data from "./src/data.json"
import users from "./src/users.json"

export const config = {
    local: "mongodb://127.0.0.1:27017/volumeBets",
    dev: "mongodb+srv://mondayScaries-user:fQWARBE512jFtRKo@mondayscariesserverless.elhzdmd.mongodb.net/volumeBets-dev?retryWrites=true&w=majority",
    live: "mongodb+srv://mondayScaries-user:fQWARBE512jFtRKo@mondayscariesserverless.elhzdmd.mongodb.net/volumeBets?retryWrites=true&w=majority"
}

const DB_TO_USE = config.live

async function connectToDb() {
    
    if (DB_TO_USE === config.live) {
        throw "About to mess with live!"
    }
    return await mongoose.connect(DB_TO_USE)
}

async function findUser(username: string): Promise<User> {
    const user = await UserModel.findOne<User>({username})
    if (user) {
        return user
    } else {
        throw "Cannot find user with username: " + username
    }
}

async function setupUsers() {
    for (const user of users) {
        const u = await UserModel.create({...user, _id: user["_id"]["$oid"], createdAt: undefined})
        u.save()
    }
}


async function setupBettors(dbUser: User, bettorGroup: BettorGroup & Document<{}, {}, BettorGroup>) {
    const bettor = await BettorModel.create({
        user: dbUser,
        bettorGroup: bettorGroup,
        balance: 100,
    })
    bettorGroup.bettors.push(bettor)
    await bettorGroup.save()
    await bettor.save()
    return bettor
    
}

async function setupWagers(bettor: Bettor & Document<{}, {}, Bettor>, username: string) {
    console.log(username, "BET COUNT: ", data[username]["wagers"].length)
    for (const wager of data[username]["wagers"]) {
        const result = wager["result"]
        const odds = wager["odds"]
        const amount = wager["amount"]
        let payout = 0;
        if (result === "Loss") {
            payout = 0
        } else if (result === "Win") {
            payout = (odds >= 100 ? amount * odds / 100 : amount * 100 / Math.abs(odds)) + amount
            payout = parseFloat(payout.toFixed(2))
        } else if (result === "Cash Out") {
            payout = wager["cashOutValue"] as number
        } else if (result === "Push") {
            payout = amount
        }
        const w = await WagerModel.create({
            bettor,
            description: wager["description"],
            amount: wager["amount"],
            live: wager["live"],
            contestDate: wager["contestDate"],
            details: {
                sport: wager["sport"],
                betType: wager["betType"]
            },
            result: wager["result"],
            odds: wager["odds"],
            payout,
        })
        bettor.balance += (payout - amount)
        if (username === "kmarshall") {
            console.log("BALANCE: ", bettor.balance)
        }
        await (bettor as any).save()
        await w.save()
    }
    for (const deposit of data[username]["deposits"]) {
        bettor.deposits.push({amount: deposit["amount"], createdAt: deposit["createdAt"], isReBuy: true} as any)
        bettor.balance += deposit.amount
        await bettor.save()
    }

    console.log("USERNAME: ", username)
    console.log("BALANCE: ", bettor.balance)

}

async function main() {
    await connectToDb()
    await UserModel.collection.drop()
    await BettorModel.collection.drop()
    await BettorModel.init()
    await BettorGroupModel.collection.drop()
    await BettorGroupModel.init()
    await WagerModel.collection.drop()
    await WagerModel.init()
    await setupUsers()
    const gabeUser = await UserModel.findOne({username: "gsucich"})
   
    const bettorGroup = await BettorGroupModel.create({
        adminBettor: gabeUser,
        maxDeposit: 100,
        maxDepositBalance: 5,
        name: "Monday Scaries"
    })
    for (const [username, userData] of Object.entries(data)) {
        console.log("SETTING UP FOR " + username)
        const user = await findUser(username)
        const bettor = await setupBettors(user, bettorGroup)
        await setupWagers(bettor, username)
    }
    

}


main().then(() => console.log("Setup database successfully!"))