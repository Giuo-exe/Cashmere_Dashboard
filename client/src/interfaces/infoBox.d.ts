import { PagamentiProps } from "./grid";

export interface AllPagamenti{
    title: String,
    list: Array<PagamentiProps> | undefined,
    navigation: string,
    fatturaid?: string
    rimanente?: number | string
}