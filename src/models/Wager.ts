import { InferSchemaType, Types } from "mongoose"
import {Schema, model} from "mongoose"
import { ModelConstants } from "./constants"
import { Wager } from "../interfaces/mongoose.gen"

const wagerSchema = new Schema({
    createdAt: { type: Number, default: Date.now, required: true },
    bettor: { type: Types.ObjectId, ref: ModelConstants.BETTOR.modelName, required: true },
    amount: { type: Number, required: true,
        validate: {
            validator: (val: number) => val > 0
        }
    },
    odds: {
        type: Number,
        required: true,
        validate: {
            validator: (val: number) => val >= 100 || val <= -100,
            message: `The supplied value {VALUE} is not a legitimate value for betting odds.`
        }
    },
    contestDate: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    live: {
        type: Boolean,
        required: true,
        default: false,
    },
    details: {
        betType: {
            type: String,
            enum: {
                values: ModelConstants.WAGER.betTypes,
                message: "'{VALUE}' is not a valid bet type."
            }
        },
        sport: {
            type: String,
            enum: {
                values: ModelConstants.WAGER.sports,
            }
        }
    },
    result: {
        type: String,
        enum: {
            values: ["Win", "Push", "Loss", "Cash Out"],
            message: "'{VALUE}' field is not a legitimate result. Legitimate options are: 'Win', 'Push', 'Loss', 'Cash Out'."
        },
    },
    payout: {
        type: Number,
        required: function() {
            return (this as any).result ?? false
        }
    },
})


const WagerModel = model<Wager>(ModelConstants.WAGER.modelName, wagerSchema)

export default WagerModel
