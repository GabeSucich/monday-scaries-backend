import mongoose, { Document } from "mongoose";

import WagerModel from "./src/models/Wager";
import UserModel from "./src/models/User";
import BettorModel from "./src/models/Bettor";
import { Bettor, User } from "./src/interfaces/mongoose.gen";

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

const startTimestamp = 1704465519000

async function getBettors() {
    return await BettorModel.find()
}

async function adjustWagers(bettor: Bettor & Document<{}, {}, Bettor>) {
    const user = await UserModel.findOne({_id: bettor.user})
    console.log("Adjusting wagers for user: " + user.username)
    const allWagers = await WagerModel.find({bettor})
    allWagers.sort((w1, w2) => w1.createdAt - w2.createdAt)
    const wagerCount = allWagers.length
    let i=0
    const timestampInterval = (allWagers[allWagers.length - 1].createdAt - startTimestamp) / wagerCount
    for (const wager of allWagers) {
        wager.createdAt = Math.round(startTimestamp + timestampInterval*i)
        i++
        const d = new Date(wager.createdAt)
        console.log(d.toDateString())
        // await wager.save()
    }
}

async function main() {
    await connectToDb()
    const bettors = await getBettors()
    for (const bettor of bettors) {
        await adjustWagers(bettor)
    }
   
}

main().then(() => console.log("Wagers adjusted!"))