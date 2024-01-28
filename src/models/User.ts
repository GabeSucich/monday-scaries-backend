import {InferSchemaType, model, Types, Schema, PassportLocalModel, Document} from "mongoose"
import {ModelConstants} from "./constants"
import passportLocalMongoose from 'passport-local-mongoose'

export const userSchema = new Schema({
    isAdmin: {type: Boolean, default: false, required: true},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    username: {type: String, required: true},
    email: String,
    createdAt: {type: Date, default: Date.now, required: true}
}, {
    collection: ModelConstants.USER.collectionName, 
    versionKey: false,
})

userSchema.plugin(passportLocalMongoose)

const UserModel = model(ModelConstants.USER.modelName, userSchema)

export default UserModel