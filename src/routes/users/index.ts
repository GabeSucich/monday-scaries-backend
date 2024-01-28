import {Router} from "express"
import {  AuthenticatedRouterUtil, ResponseObj, RouterUtil, handleUnauthenticatedRequest, sendResponse } from "../request"
import UserModel from "../../models/User"
import { User } from "../../interfaces/mongoose.gen"
import { ModifiedUser, modifyUser } from "../auth/data"

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

export default router