import { BaseKey } from "@refinedev/core"
import { DdtProps } from "./ddt"

export interface FatturaProps {
    _id: BaseKey | undefined
    data: Date,
    id: String,
    cliente: String,
    totale: Number,
    iva: Number,
    note: String,
    scadenza: Date,
    incassato: Number,
    saldo: Number,
    pagamenti: PagamentiProps | undefined,
    ddt: DdtProps | undefined
}

export interface PagamentiProps{
    data: Date,
    id: String, 
    ammount: Number, 
    note: String, 
    kg: Number
}

export interface PagamentiFattureProps{
    _id: BaseKey | undefined | String
    name: BaseKey | undefined | String
    totale: Number
    pagamenti: Array | undefined
    cliente: String
}

export interface FattureLottoProps{
    _id: BaseKey | undefined | String
    name: BaseKey | undefined | String
    totale: Number
    pagamenti: Array | undefined
    cliente: String
    lotto:  BaseKey | undefined | String
}
