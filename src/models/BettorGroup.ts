import { model, Schema, Types } from "mongoose"

import {ModelConstants} from "./constants"
import { BettorGroup } from "../interfaces/mongoose.gen"

const bettorGroupSchema = new Schema({
    name: {type: String, required: true, unique: true},
    createdAt: {type: Date, default: Date.now, required: true},
    adminBettor: {type: Types.ObjectId, ref: "User"},
    maxDeposit: {type: Number, required: true},
    maxDepositBalance: {type: Number },
    bettors: [{
        type: Types.ObjectId,
        ref: ModelConstants.BETTOR.modelName
    }],
    startTimestamp: {type: Number},
    endTimestamp: {type: Number}
})

const BettorGroupModel = model<BettorGroup>(ModelConstants.BETTOR_GROUP.modelName, bettorGroupSchema)

export default BettorGroupModel