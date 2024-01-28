import {InferSchemaType, model, Schema} from "mongoose"
import {ModelConstants} from "./constants"
import { ServerError } from "../interfaces/mongoose.gen"

const serverErrorSchema = new Schema({
    createdAt: {type: Date, default: Date.now, required: true},
    errorString: {type: String, required: true},
    traceback: String,
    description: {type: String, required: true}
}, {collection: ModelConstants.SERVER_ERROR.collectionName, versionKey: false})

const ServerErrorModel = model<ServerError>(ModelConstants.SERVER_ERROR.modelName, serverErrorSchema)

export default ServerErrorModel