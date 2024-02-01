import {Router} from "express"
import {  AuthenticatedRouterUtil, ResponseObj, RouterUtil, handleUnauthenticatedRequest, sendResponse } from "../request"
import UserModel from "../../models/User"
import { Bettor, BettorGroup, User } from "../../interfaces/mongoose.gen"
import { ModifiedUser, modifyUser } from "../auth/data"
import BettorGroupModel from "../../models/BettorGroup"
import BettorModel from "../../models/Bettor"

const router = Router()

// All routes start with prefix /api/users
AuthenticatedRouterUtil.get(router, "/:_id", (req, send, user) => {
    if (user._id.toString() !== req.params._id) {
        return handleUnauthenticatedRequest(send, `User does not have access to the requested user data.`)
    } else {
        return UserModel.findOne<User>({_id: req.params._id})
            .then(user => {
                return send<ModifiedUser | null>(modifyUser(user as any))
        })
    }
})

AuthenticatedRouterUtil.get(router, "/bettor/:_id", (req, send, user) => {
    const bettorId = req.params._id

    const sender = send<ModifiedUser>
    return BettorModel.findById(bettorId).populate({path: 'bettorGroup', populate: {path: 'bettors'}}).then(bettor => {
        if (!bettor) {
            return send(undefined, `No bettor with _id ${bettorId}`)
        }
        
        const allBettors = bettor.bettorGroup.bettors as Bettor[]

        if (!allBettors.some(b => b.user._id.equals(user._id))) {
            return handleUnauthenticatedRequest(send, `User does not have access to the requested bettor data`)
        }
        return UserModel.findById(bettor.user._id).then(user => {
            if (!user) {
                return sender(undefined, "Could not find user for request bettor")
            }
            return sender(user)
        })
    })
})

export default router