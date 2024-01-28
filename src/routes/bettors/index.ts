import {Router} from "express"
import { AuthenticatedRouterUtil, handleUnauthenticatedRequest, sendResponse } from "../request"
import { Bettor, BettorDeposit } from "../../interfaces/mongoose.gen"
import BettorModel from "../../models/Bettor"
import { parseCreateDepositData } from "./data"

const router = Router()

AuthenticatedRouterUtil.get(router, "/:_id", (req, send, user) => {
    const bettorId = req.params._id
    return BettorModel.findById(bettorId).then(bettor => {
        return send(bettor)
    })
})

AuthenticatedRouterUtil.get(router, "/user/:_id", (req, send, user) => {
    const requestedUserId = req.params._id
    if (!user._id.equals(requestedUserId)) {
        return handleUnauthenticatedRequest(send, `User is not authenticated to access this data.`)
    } else {
        return BettorModel.find<Bettor>({user: requestedUserId}).populate("bettorGroup").then(send<Bettor[]>)
    }
})

AuthenticatedRouterUtil.post(router, "/deposit", parseCreateDepositData,  (req, send, user, data) => {
    const sender = send<boolean>
    const {amount} = data
    return BettorModel.findById(data.bettor).populate("bettorGroup").then(bettor => {
        if (!bettor) {
            return sender(undefined, `No bettor with id ${data.bettor} to deposit for`)
        }
        if (!bettor.user._id.equals(user._id)) {
            return handleUnauthenticatedRequest(send, "User is not authenticated to deposit for this bettor")
        }
        const bettorGroup = bettor.bettorGroup
        if (bettorGroup.maxDepositBalance && bettor.balance > bettorGroup.maxDepositBalance) {
            return sender(undefined, `The current bettor balance is $${bettor.balance} -- must be $${bettorGroup.maxDepositBalance} or less to deposit.`)
        }
        if (data.amount > bettorGroup.maxDeposit) {
            return sender(undefined, `Cannot deposit $${amount} -- the max deposit is $${bettorGroup.maxDeposit}`)
        }
        bettor.deposits.push({amount} as BettorDeposit)
        bettor.balance += amount
        return bettor.save().then(() => sender(true))
    })
})

export default router