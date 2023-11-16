import { BaseKey } from "@refinedev/core"

export interface FatturaG {
    Fatture: Array | any
}

export interface FatturaGridProps {
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
    pagato: Boolean,
    pagamenti: Number | Array | PagamentiGridProps,
    totKg?: Number,
    ddt?: Number 
}

export interface FatturaGridPropsDash {
    _id: BaseKey | undefined
    id: string | BaseKey | undefined
    cliente: String,
    totale: Number,
    scadenza: Date,
    incassato: Number,
    saldo: Number
}
export interface PagamentiGridProps{
    data: Date,
    id?: String | BaseKey | undefined
    identificativo?: String | BaseKey | undefined
    ammount: Number, 
    note: String, 
    kg: Number,
    cliente?: String,
    _id: BaseKey | undefined
    fattura?: String
}

export interface FatturaShowGridProps {
    _id: BaseKey | undefined
    data: Date,
    id: String | undefined | Number,
    cliente: String,
    totale: Number,
    note: String,
    incassato: Number,
    scadenza: Date,
    allPagamenti: Number,
    allDdt?: Number
    pagato: Boolean
}

export interface PagamentiProps{
    id: string;
    data: Date| '';
    note: string;
    ammount: number | '';
    kg: number | '';
    fattura: string | undefined;
    _id?: BaseKey
    totale?: number
}

export interface BeneProps {
    id?: String | undefined | Number,
    colore?: string,
    datauscita?: Date,
    scarto?: number
    lotto?: string | LottoUtils
    lottoname?: string,
    hex?: string | undefined,
    kg: Number,
    n: number
}

export interface BeniGridProps {
    bene: string
    hex?: string | undefined,
    kg: Number,
    n: Number
}

export interface DdtGridProps {
    _id: BaseKey | undefined
    data: Date,
    causale: String,
    id: string,
    destinatario: String,
    beni: Number,
    kg: Number,
    contoterzi?: string,
    balle?: Number
    fattura?: string
}

interface LottoUtils{
    name: string
    id?: number
}