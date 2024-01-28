import {Router} from "express"
import { AuthenticatedRouterUtil, RouterUtil, SendResponseCallback, handleRequestError, handleUnauthenticatedRequest, sendResponse, sendResponseCallback } from "../request"
import { UpdateWagerResultData, WagerResult, parseCreateWagerData, parseUpdateWagerInfoData, parseUpdateWagerResultsData } from "./data"
import WagerModel from "../../models/Wager"
import { Bettor, User, Wager } from "../../interfaces/mongoose.gen"
import BettorModel from "../../models/Bettor"
import { ClientSession, Document } from "mongoose"
import { withDbSessions } from "../utilities"
import { ModelConstants } from "../../models/constants"

const router = Router()

async function authenticateBettorWagerAccess(user: User, bettorId: string): Promise<boolean | null> {
    return BettorModel.findOne({_id: bettorId}).then(bettor => {
        if (!bettor) {
            return null
        } else {
            return user._id.equals(bettor.user._id.toString())
        }
    })
}

async function authenticateUserWagerAccess(user: User, wagerId: string): Promise<boolean | null> {
    return WagerModel.findOne({_id: wagerId}).then(wager => {
        if (!wager) {
            return null
        } else {
            return authenticateBettorWagerAccess(user, wager.bettor.toString())
        }
    })
}

AuthenticatedRouterUtil.get(router, "/bettor/:_id", (req, send, user) => {
    return WagerModel.find({bettor: req.params._id})
        .then(send<Wager[]>)
})

RouterUtil.get(router, "/betTypes", (req, send) => {
    return send<string[]>(ModelConstants.WAGER.betTypes)
})

RouterUtil.get(router, "/sports", (res, send) => {
    return send<string[]>(ModelConstants.WAGER.sports)
})

AuthenticatedRouterUtil.post(router, "/create", parseCreateWagerData, (req, send, user, data) => {
    const sender = send<Wager>
    return authenticateBettorWagerAccess(user, data.bettor).then(authenticated => {
        if (authenticated === null) {
            return sender(undefined, `No bettor was found with id ${data.bettor} for whom to create the wager`)
        } else {
            if (authenticated) {
                return BettorModel
                    .findById(data.bettor).then(bettor => {
                        if (!bettor) {
                            return sender(undefined, `Could not find bettor ${data.bettor} for whom to create the wager`)
                        }
                        if (bettor.balance < data.amount) {
                            return sender(undefined, `Bettor only has a balance of $${bettor.balance}. Cannot place a wager of $${data.amount}`)
                        }
                        return WagerModel.create(data).then(wager => {
                            bettor.balance = bettor.balance - wager.amount
                            return bettor.save().then(b => sender(wager))
                        })
                    })
     
            } else {
                return handleUnauthenticatedRequest(send, `User ${user._id.toString()} not authorized to create wagers for Bettor ${data.bettor}`)
            }
        }
    })
})

const WAGER_RESULT_ERROR = "WAGER_RESULT_ERROR"

function calculateWagerPayout(wager: Wager, cashOutValue?: number): number | undefined {
    const result = wager.result as WagerResult | undefined
    if (!result) {
        return undefined
    } else {
        switch (result) {
            case "Loss":
                return 0
            case "Push":
                return wager.amount
            case "Win":
                const unrounded = (wager.odds > 0 ? (wager.amount * (wager.odds / 100)) : (wager.amount * (100 / Math.abs(wager.odds)))) + wager.amount
                return Math.round(unrounded * 100) / 100
            case "Cash Out":
                if (cashOutValue) {
                    return cashOutValue
                } else {
                    throw {
                        type: WAGER_RESULT_ERROR,
                        message: "Cannot set the result to 'Cash Out' without a cashOutValue"
                    }
                }
            default:
                throw {
                    type: WAGER_RESULT_ERROR,
                    message: `Unrecognized wager result: '${result}'`
                }
        }
    }
    
}

async function handleWagerResultsUpdate(bettor: Document<unknown, {}, Bettor> & Bettor, wager: Document<unknown, {}, Wager> & Wager, data: UpdateWagerResultData, send: SendResponseCallback): Promise<any> {
    const sender = send<Wager>
    const existingWagerCopy = {...wager.toObject()}
    const {amount, cashOutValue, odds, result} = data
    if (wager.result) {
        if (amount || odds) {
            return sender(undefined, "Cannot update the wager amount or odds after a result has been recorded")
        }
    }
    if (amount) {
        wager.amount = amount
    }
    if (odds) {
        wager.odds = odds
    }
    if (result !== undefined) {
        wager.result = result ?? undefined
    }
    if (cashOutValue !== undefined && result !== "Cash Out") {
        return sender(undefined, "Cannot update a wager where the result is not 'Cash Out' but there is a cashOutValue provided", 400)
    }
    try {
        wager.payout = calculateWagerPayout(wager, cashOutValue)
        const thisAmount = wager.amount
        const existingAmount = existingWagerCopy.amount
        const thisPayout = wager.payout ?? 0
        const existingPayout = existingWagerCopy.payout ?? 0
        const payoutChange = thisPayout - existingPayout
        const amountChange = thisAmount - existingAmount
        if (payoutChange === 0 && amountChange === 0) {
            return wager.save().then(sender)
        } else {
            const existingBalance = bettor.balance
            bettor.balance = bettor.balance + payoutChange - amountChange
            if (bettor.balance <= 0) {
                return sender(undefined, `Changing the bet size from ${existingAmount} to ${amount}. Bettor only has a balance of ${existingBalance}`)
            }
            return bettor.save().then(b => wager.save().then(sender))
        }
    } catch (e: any) {
        if (e.type === WAGER_RESULT_ERROR) {
           return sender(undefined, "There was an error while trying to update the wager results: " + e.message, 400) 
        } else {
            throw e
        }
    }
}

AuthenticatedRouterUtil.post(router, "/update-results", parseUpdateWagerResultsData, (req, send, user, data) => {
    return authenticateUserWagerAccess(user, data.wager).then(authenticated => {
        if (authenticated === null) {
            return send(undefined, `No wager was found with id ${data.wager}`)
        } else {
            if (authenticated) {
                return WagerModel.findById(data.wager).then(wager => {
                    if (!wager) return send(undefined, `No wager was found with id ${data.wager}`)
                    return BettorModel.findById(wager.bettor).then(bettor => {
                        if (!bettor) return send(undefined, `No bettor was found with id ${wager.bettor.toString()} for wager ${wager._id.toString()}`)
                        return handleWagerResultsUpdate(bettor, wager, data, send)
                    })
                })
            } else {
               return handleUnauthenticatedRequest(send, `User ${user._id.toString()} not authorized to update wager ${data.wager}`)
            }
        }
    })
})

AuthenticatedRouterUtil.post(router, "/update-info", parseUpdateWagerInfoData, (req, send, user, data) => {
    return authenticateUserWagerAccess(user, data.wager).then(authenticated => {
        if (authenticated === null) {
            return send(undefined, `No wager was found with id ${data.wager}`)
        } else {
            if (authenticated) {
                const wagerId = data.wager
                const fieldsToSet = {
                    details: {betType: data.betType, sport: data.sport},
                    ...(data.contestDate ? {contestDate: data.contestDate} : {}),
                    ...(data.description ? {description: data.description} : {}),
                    ...(data.live !== undefined ? {live: data.live} : {})
                }
                return WagerModel.findByIdAndUpdate(wagerId, fieldsToSet, {new: true}).then(result => {
                    if (result) {
                        return send<Wager>(result)
                    } else {
                        return send<Wager>(undefined, "Failed to update the wager.")
                    }
                })
            } else {
                return handleUnauthenticatedRequest(send, `User ${user._id.toString()} not authorized to update wager ${data.wager}`)
            }
        }
    })
})

AuthenticatedRouterUtil.delete(router, "/delete/:_id", (req, send, user) => {
    const wagerId = req.params._id
    return authenticateUserWagerAccess(user, wagerId).then(authenticated => {
        if (authenticated === null) {
            return send(undefined, `No wager was found with id ${wagerId}`)
        } else {
            if (authenticated) {
                return WagerModel.findByIdAndDelete(wagerId).then(wager => {
                    if (!wager) {
                        return send<Wager>(undefined, `Failed to delete wager ${wagerId}`)
                    }
                    return BettorModel.findById(wager.bettor._id).then(bettor => {
                        if (!bettor) {
                            throw `Unexpected error trying to adjust the balance after wager deletion`
                        }
                        bettor.balance += wager.amount - (wager.payout ?? 0)
                        return bettor.save().then(b => send<Wager>(wager))
                    })
                    
                })

            }
        }
    })
})


export default router