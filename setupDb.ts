import mongoose, { Document } from "mongoose";
import { Bettor, BettorGroup, User } from "./src/interfaces/mongoose.gen";
import UserModel from "./src/models/User";
import BettorModel from "./src/models/Bettor";
import BettorGroupModel from "./src/models/BettorGroup";
import WagerModel from "./src/models/Wager";

import data from "./src/keith.json"

async function connectToDb() {
    return await mongoose.connect("mongodb+srv://mondayScaries-user:fQWARBE512jFtRKo@mondayscariesserverless.elhzdmd.mongodb.net/mondayScaries-dev?retryWrites=true&w=majority")
}

async function findUser(): Promise<User> {
    const user = await UserModel.findOne<User>({username: "kmarshall"})
    if (user) {
        return user
    } else {
        const u = await UserModel.create({
            isAdmin: false,
            firstName: "Keith",
            lastName: "Marshall",
            username: "kmarshall",
            createdAt: "2024-01-21T00:48:42.321+00:00",
            salt: "b939c8cf269fc433ff5122ad88c5bd59732f98f1c58ebc0a1d9ab2d74a824af4",
            hash: "0fd11174a2a2b6d1b0aea1f39e6461b78f78fd6678aaf5078e99d39cf55b92f729db3406ba6af37b0540a48af94af3107d2cef69851c49127a9d55ea8c9cb8ec9991e89d5336fc50cee568473e16847f5847aba98e35ada68fab810e3fb73f52f13567e84286d593b23eb57e898d7bada168c39b060bd11a42e88bdd1fa8acfd25a98f6618fd5e6f7fc84549958f074fd1ca03fdacb33a0af6b671001d1d94b5ea5018c1501f75ab3cb3df62bd6c478c7897118c1a77b3b327002b19968785305e91d98ff695b1652aab70b8c3bfdca3f85d827c3b3d16a14cc3c82cb2f21e94c239859ee0b07d68c61ff8711b1f7b9396d3d79f9c7e0f9ee5010e1b76ef6d6d467ad916e0b042851ede986f875064c0b4c13316cc99c99f3926cea7727c7b4134db3540aeb7585b3a7d9cb6c7b2252d5059efc01014e889d01dfeae842433ff08f0066d3df8dcccc10e698a3b5108f42f493b1e9fbdf34a8b967bfec40f48f6c52b275e0b2cd651668b98e3de96f36d11a6f844285d591303389f030376c616de92d3ff610fa866d306eeb7be359d68bbad29c5d8f8ccc091df496030318989f57d11d676268bdcb79bb22e866a39f40959fc4711dfb0ffd48a095085538a049bb4b048d05bab4557ceb3f957f2118833a2bb0d172dfee41d8816618aaccb776a85e7ee06ce0cea2385665ce76931b0622579edbd7d6fe32b08695148b6d649"
        })
        await u.save()
        return u as Document<unknown, {}, User> & User 
    }
}


async function setupBettors(dbUser: User) {
    await BettorModel.collection.drop()
    await BettorModel.init()
    await BettorGroupModel.collection.drop()
    await BettorGroupModel.init()
    const bettorGroup = await BettorGroupModel.create({
        adminBettor: dbUser,
        maxDeposit: 100,
        maxDepositBalance: 5,
        name: "Monday Scaries"
    })
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

async function setupWagers(bettor: Bettor) {
    await WagerModel.collection.drop()
    await WagerModel.init()
    for (const wager of data) {
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
            payout = wager["cashoutValue"] as number + amount
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
            balanceAfter: 0
        })
        bettor.balance += (payout - amount)
        await (bettor as any).save()
        await w.save()
    }

}

async function main() {
    await connectToDb()
    const user = await findUser()
    if (!user) {
        console.log("User not found!")
        return
    }
    const bettor = await setupBettors(user)
    await setupWagers(bettor)
}


main().then(() => console.log("Setup database successfully!"))