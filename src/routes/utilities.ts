import { Request, Response } from "express";
import mongoose, { ClientSession, Model, startSession } from "mongoose";
import { SendResponseCallback, handleRequestError } from "./request";

export const PARSER_FIELD_ERROR = "fieldError"

export function extractRequiredField<T>(requestBody: any, field: string): T {
    const fieldPath = field.split(".").map(s => s.trim())
    let value: T | undefined = undefined
    let pathTraversed = ""
    for (const segment of fieldPath) {
        value = (value ? value : requestBody)[segment]
        pathTraversed += `${pathTraversed.length > 0 ? '.' : ''}${segment}`
        if (value === undefined) {
            break
        }
    }
    if (value === undefined) {
        throw {
            _type: PARSER_FIELD_ERROR,
            message: `The following path does not exist on the request body: '${pathTraversed}'`
        }
    }
    return value
}

export function extractOptionalField<T>(requestBody: any, field: string): T | undefined {
    const fieldPath = field.split(".").map(s => s.trim())
    let value: T | undefined = undefined
    let pathTraversed = ""
    for (const segment of fieldPath) {
        value = (value ? value : requestBody)[segment]
        pathTraversed += `${pathTraversed.length > 0 ? '.' : ''}${segment}`
        if (value === undefined) {
            break
        }
    }
    return value
}

export interface RequestBodyExtractor {
    required: <U>(field: string) => U
    optional: <U>(field: string) => U | undefined
}

export type Extracted<T> = {
    fieldErrors?: string[],
    extracted?: T
}

export function parseRequestData<V>(req: Request, usingExtractor: (e: RequestBodyExtractor) => V): V {
    const body = req.body

    const extractor = {
        required: <U>(field: string) => extractRequiredField<U>(body, field),
        optional: <U>(field: string) => extractOptionalField<U>(body, field)
    } as RequestBodyExtractor

    return usingExtractor(extractor)
}

export async function withDbSessions(sessions: ClientSession[], block: () => Promise<any>, send: SendResponseCallback, sessionErrorMessage: string): Promise<any> {
    function startTransactions() {
        for (const s of sessions) {
            s.startTransaction()
        }
    }

    function commitTransactions() {
        let p = sessions[0].commitTransaction()
        for (const s of sessions.slice(1)) {
            p = p.then(() => s.commitTransaction())
        }
        return p
    }

    function abortTransactions() {
        let p = sessions[0].abortTransaction()
        for (const s of sessions.slice(1)) {
            p = p.then(() => s.abortTransaction())
        }
        return p
    }

    function endSessions() {
        let p = sessions[0].endSession()
        for (const s of sessions.slice(1)) {
            p = p.then(() => s.endSession())
        }
        return p
    }

    startTransactions()
    return mongoose.startSession().then(mongooseSession => {
        return block()
            .then(() => commitTransactions())
            .catch(e => {
                return abortTransactions()
                .then(() => {
                    return handleRequestError(e, send, undefined, sessionErrorMessage)
                })
            }).finally(() => {
                endSessions().then(() => mongooseSession.endSession())
            })
    })
}
