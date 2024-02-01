import mongoose, { Document } from "mongoose"
import BettorModel from "./src/models/Bettor"
import { Bettor, BettorDeposit } from "./src/interfaces/mongoose.gen"


const startTimestamp = 1704067201000

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

async function getBettors() {
    return await BettorModel.find()
}

async function addInitialDeposits(bettor: Bettor & Document<{}, {}, Bettor>) {
    bettor.deposits.push({
        createdAt: startTimestamp,
        isReBuy: false,
        amount: 100
    } as BettorDeposit)
    await bettor.save()
}

async function main() {
    await connectToDb()
    const bettors = await getBettors()
    for (const bettor of bettors) {
        await addInitialDeposits(bettor)
    }
}

main().then(() => console.log("Added deposits!"))