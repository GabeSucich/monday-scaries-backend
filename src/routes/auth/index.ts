import {Router } from "express"
import UserModel from "../../models/User"
import passport from 'passport';
import {  RouterUtil, handleRequestError, sendResponse, sendResponseCallback } from "../request"
import { User } from "../../interfaces/mongoose.gen";
import { ModifiedUser, modifyUser, parseUserRegistrationData } from "./data";

const router = Router()

RouterUtil.post(router, "/register", parseUserRegistrationData, (req, send, data) => {
    const sender = send<ModifiedUser>
    return UserModel.findOne<User>({username: data.username}).then(existingUser => {
        if (existingUser) {
            return send(undefined, "A user with that username already exists")
        } else {
            UserModel.register(new UserModel({username: data.username, firstName: data.firstName, lastName: data.lastName}), data.password, (err) => {
                if (err) {
                    return sender(undefined, `There was an error creating your account: ${err}`)
                } else {
                    UserModel.findOne<User>({username: data.username}).then(user => {
                        if (user !== null) {
                            return sender(modifyUser(user), undefined)
                        } else {
                            return sender(undefined, `Something went registering the new user`)
                        }
                        
                    })
                }
            })
        }
    })
})

router.post("/login", passport.authenticate("local"), (req, res, next) => {
    const user: any | undefined = req.user
    if (!user) {
        handleRequestError("The user authenticated, but there was a problem establishing the session", sendResponseCallback(res))
    } else {
        sendResponse<ModifiedUser>(res, modifyUser(user))
    }
})

export default router