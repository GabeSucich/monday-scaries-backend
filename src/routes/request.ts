import { Request, Response, NextFunction, Router } from "express"
import ServerError from "../models/ServerError"
import { User } from "../interfaces/mongoose.gen"
import { RequestBodyExtractor, PARSER_FIELD_ERROR, parseRequestData } from "./utilities"

export type ResponseObj<T> = {
    data?: T,
    error?: string
}

export function sendResponse<T>(res: Response, data?: T, error?: string, status?: number): Promise<any> {
    return new Promise((resolve, reject) => {
        try {
            (status ? res.status(status) : res).send({
            data,
            error
            } as ResponseObj<T>)
            return resolve(0)
        } catch (e) {
            return reject(e)
        }
        
    })
}

export function handleRequestError<T>(error: any, sendResponseCallback: SendResponseCallback, status?: number, responseMessage?: string) {
    const {_type, message} = error
    const isParserError = _type === PARSER_FIELD_ERROR
    status = status ?? (isParserError ? 400 : 500)
    const description = isParserError ? 'Bad request data' : `Unhandled server error`
    const errorString = isParserError ? message : String(error)
    try {
        new ServerError({
            description,
            traceback: error.stack ?? undefined,
            errorString
        }).save().then((error: any) => {
            sendResponseCallback<T>(undefined, `${responseMessage ?? error.description}: ${error.errorString}`, status)
        })
    } catch(e) {
        let errorMessage = `The following unhandled error was caught: ${error} \n\n`
        errorMessage += `While attempting to log this error, another error was raised: ${e}`
        sendResponseCallback(undefined, errorMessage, 500)
    }
}

export type SendResponseCallback = <U>(data?: U, error?: string, status?: number) => Promise<any>
export function sendResponseCallback<U>(res: Response) {
    return (data?: U, error?: string, status?: number) => sendResponse<U>(res, data, error, status)
}



export function handleRequest<T>(block: (req: Request, sendResponseCallback: SendResponseCallback) => Promise<any>) {
    return (req: Request, res: Response, next: NextFunction) => {
        const send = sendResponseCallback(res)
        try {
            block(req, send).catch(e => handleRequestError(e, send))
        } catch (e) {
            handleRequestError<T>(e, send)
        }
    }
}

export function handleRequestWithData<T>(usingExtractor: (e: RequestBodyExtractor) => T, block: (req: Request, sendResponseCallback: SendResponseCallback, data: T) => Promise<any>) {
    return (req: Request, res: Response, next: NextFunction) => {
        const send = sendResponseCallback(res)
        try {
            const data = parseRequestData<T>(req, usingExtractor)
            return block(req, sendResponseCallback(res), data).catch(e => handleRequestError(e, send))
        } catch (e) {
            handleRequestError<T>(e, send)
        }
        
    }
}

export function handleUnauthenticatedRequest<T>(send: SendResponseCallback, message: string) {
    return send<T>(undefined, message, 401)
}

export function handleAuthenticatedRequest(block: (req: Request, send: SendResponseCallback, user: User) => Promise<any>) {
    return (req: Request, res: Response, next: NextFunction) => {
        const send = sendResponseCallback(res)
        try {
            const user = req.user as User
            if (!user) {
                handleRequestError("Could not extract _id from req.user object", send)
            } else {
                block(req, sendResponseCallback(res), user).catch(e => handleRequestError(e, send))
            }
        } catch (e) {
            handleRequestError(e, send)
        }
    }
}

export function handleAuthenticatedRequestWithData<T>(usingExtractor: (e: RequestBodyExtractor) => T, block: (req: Request, send: SendResponseCallback, user: User, data: T) => Promise<any>) {
    return handleAuthenticatedRequest((req: Request, send: SendResponseCallback, user: User) => {
        const data = parseRequestData(req, usingExtractor)
        return block(req, send, user, data).catch(e => handleRequestError(e, send))
    })
}


export const RouterUtil = {

    get(router: Router, url: string, block: (req: Request, send: SendResponseCallback) => Promise<any>) {
        router.get(url, handleRequest(block))
    },

    post<T>(router: Router, url: string, usingExtractor: (e: RequestBodyExtractor) => T, block: (req: Request, send: SendResponseCallback, data: T) => Promise<any>) {
        router.post(url, handleRequestWithData<T>(usingExtractor, block))
    },

    delete(router: Router, url: string, block: (req: Request, send: SendResponseCallback) => Promise<any>) {
        router.delete(url, handleRequest(block))
    },

}

function isAuthenticated(req: Request, res: Response, next: NextFunction) {
    if (req.isAuthenticated()) {
        next()
    } else {
        handleUnauthenticatedRequest<any>(sendResponseCallback(res), "User is not authenticated")
    }
}

export const AuthenticatedRouterUtil = {

    get(router: Router, url: string, block: (req: Request, send: SendResponseCallback, user: User) => Promise<any>) {
        router.get(url, isAuthenticated, handleAuthenticatedRequest(block))
    },

    post<T>(router: Router, url: string, usingExtractor: (e: RequestBodyExtractor) => T, block: (req: Request, send: SendResponseCallback, user: User, data: T) => Promise<any>) {
        router.post(url, isAuthenticated, handleAuthenticatedRequestWithData<T>(usingExtractor, block))
    },

    delete(router: Router, url: string, block: (req: Request, send: SendResponseCallback, user: User) => Promise<any>) {
        router.delete(url, isAuthenticated, handleAuthenticatedRequest(block))
    },

}
