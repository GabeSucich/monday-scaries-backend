import mongoose from "mongoose";
import { RequestBodyExtractor } from "../utilities";
import { User } from "../../interfaces/mongoose.gen";

export type ModifiedUser = {
    _id: mongoose.Types.ObjectId,
    username: string,
    firstName: string,
    lastName: string,
    email?: string,
    isAdmin: boolean
}

export function modifyUser(user: User): ModifiedUser {
    return {
        _id: user._id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isAdmin: user.isAdmin,
    }
}

export type UserRegistrationData = {
    firstName: string,
    lastName: string,
    username: string,
    password: string
}

export function parseUserRegistrationData(e: RequestBodyExtractor) {
    return {
        firstName: e.required<string>("firstName"),
        lastName: e.required<string>("lastName"),
        username: e.required<string>("username"),
        password: e.required<string>("password")
    } as UserRegistrationData
}