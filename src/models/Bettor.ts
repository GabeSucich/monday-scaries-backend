import {InferSchemaType, model, ObjectId, Schema, Types } from "mongoose"

import {ModelConstants} from "./constants"
import { Bettor } from "../interfaces/mongoose.gen"

const depositSchema = new Schema({
    amount: {
        type: Number, 
        required: true
    },
    isReBuy: {
        type: Boolean,
        required: true,
        default: true
    },
    isQuarterlySupplement: {
        type: Boolean,
        required: true,
        default: false
    },
    createdAt: {
        type: Number,
        default: Date.now,
        required: true
    }
})

const bettorSchema = new Schema({
    user: {
        required: true,
        ref: ModelConstants.USER.modelName,
        type: Types.ObjectId
    },
    bettorGroup: {
        required: true,
        ref: ModelConstants.BETTOR_GROUP.modelName,
        type: Types.ObjectId
    },
    createdAt: { type: Number, default: Date.now, required: true },
    balance: {type: Number, required: true},
    deposits: [depositSchema]
}, {collection: ModelConstants.BETTOR.collectionName})

bettorSchema.pre("save", function (next) {
    if (this.balance) {
        this.balance = parseFloat(this.balance.toFixed(2))
    }
    next()
})

const BettorModel = model<Bettor>(ModelConstants.BETTOR.modelName, bettorSchema)

export default BettorModel
