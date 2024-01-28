import { RequestBodyExtractor } from "../utilities"

export type WagerDataDetails = {
    betType?: string,
    sport?: string,
}

export type CreateWagerData = {
    bettor: string,
    amount: number,
    description: string,
    odds: number,
    contestDate: string,
    details: WagerDataDetails,
    live?: boolean
}

export function parseCreateWagerData(extractor: RequestBodyExtractor) {
    const bettor = extractor.required<string>("bettor")
    const amount = extractor.required<number>("amount") as number
    const description = extractor.required<string>("description") as string
    const odds = extractor.required<number>("odds") as number
    const contestDate = extractor.required<string>("contestDate") as string
    const details = extractor.required<WagerDataDetails>("details")
    const live = extractor.optional<boolean>("live")
    return {
        bettor,
        amount,
        description,
        odds,
        contestDate,
        details,
        live
    } as CreateWagerData
}

export type WagerResult = "Win" | "Push" | "Loss" | "Cash Out"

export type UpdateWagerResultData = {
    wager: string,
    amount?: number,
    result?: WagerResult | null,
    cashOutValue?: number,
    odds?: number
}

export function parseUpdateWagerResultsData(extractor: RequestBodyExtractor) {
    const wager = extractor.required<string>("wager")
    const amount = extractor.optional<number>("amount")
    const result = extractor.optional<string | null>("result")
    const cashOutValue = extractor.optional<number>("cashOutValue")
    const odds = extractor.optional<number>("odds")
    return {
        wager,
        amount,
        result,
        cashOutValue,
        odds
    } as UpdateWagerResultData
}

export type UpdateWagerInfoData = {
    wager: string,
    description?: string,
    contestDate?: string,
    betType?: string,
    sport?: string,
    live?: boolean
}

export function parseUpdateWagerInfoData(extractor: RequestBodyExtractor) {
    const wager = extractor.required<string>("wager")
    const description = extractor.optional<string>("description")
    const contestDate = extractor.optional<string>("contestDate")
    const betType = extractor.optional<string>("betType")
    const sport = extractor.optional<string>("sport")
    const live = extractor.optional<boolean>("live")
    return {
        wager,
        contestDate,
        description,
        betType,
        sport,
        live
    } as UpdateWagerInfoData
}