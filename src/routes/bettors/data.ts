import { RequestBodyExtractor } from "../utilities";

export type CreateDepositData = {
    bettor: string,
    amount: number
}

export function parseCreateDepositData(extractor: RequestBodyExtractor): CreateDepositData {
    const bettor = extractor.required<string>("bettor")
    const amount = extractor.required<number>("amount")
    return {
        bettor,
        amount
    }
}