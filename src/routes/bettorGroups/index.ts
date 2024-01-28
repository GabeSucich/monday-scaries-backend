import { Router } from "express"
import { AuthenticatedRouterUtil, handleUnauthenticatedRequest, sendResponse } from "../request"
import BettorGroupModel from "../../models/BettorGroup"
import { Bettor, BettorGroup } from "../../interfaces/mongoose.gen"


const router = Router()

AuthenticatedRouterUtil.get(router, "/:_id", (req, send, user) => {
    return BettorGroupModel.findOne({_id: req.params._id}).populate("bettors").then(bettorGroup => {
        if (bettorGroup) {
            const userIncluded = bettorGroup?.bettors.some(b => user._id.equals(b._id))
            if (!userIncluded) {
                return handleUnauthenticatedRequest<Bettor | null>(send, "The user is not authorized to access this data")
            }
        }
        return send<BettorGroup | null>(bettorGroup)
    })
})

export default router