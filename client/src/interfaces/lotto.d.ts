
import { BeneProps, FatturaGridProps } from "./grid"

export interface lottoCardProps{
    _id?: string | BaseKey
    navigazione: string
    name: string | BaseKey | "" ,
    data: string | Date,
    cashmere: Array<Cashmere>
    contoterzi?: boolean
    vendita?: boolean
    lavorata: number 
    lottoid?: BaseKey | string
    stats?: any
    venditacheck?: boolean
    ids?: Array<number>
}

export interface lottoCart{
    navigazione: string
    name: string | BaseKey | "" ,
    data: string | Date,
    cashmere: Array<Cashmere>
    contoTerzi: number 
    lavorata: number 
    lottoid?: BaseKey | string
}

interface Cashmere{
    kg: number
    colore: string
    hex?: string
    lotto?: string
    n: number
}

interface ContoTerzi {
    contoid?: string | BaseKey | number
    beni: Array<BeneProps> ;
    lavorata?: Array<BeneProps> ;
    dataentrata: Date | string;
    datauscita?: Date | string | undefined;
    lotti?: Array<string> | string 
    navigazione?: string | undefined
    ddt: string
    stats?: any
  }

interface ContoTerziCard{
    beni: Array<BeneProps> ;
    dataentrata: Date | string;
    lavorata?: Array<BeneProps> ;
    ddt: string
    id: string | BaseKey
    Conto? : any
}

interface ContoTerziCardProps{
    id: string | BaseKey
    Conto? : any
}

export interface lottoShowCardProps{
    navigazione?: string | undefined
    allFatture?: FatturaGridProps[]
    name: string | BaseKey,
    data:  Date,
    cashmere: Array<Cashmere>
    contoterzi: Array<any> | boolean
    lavorata: number | 0
    balle: number | 0
    fornitore: string | ""
    id : BaseKey 
    fattura?: string | ""
    stats?: any
}

export interface lottoSingle{
    lotto : lottoShowCardProps
}

export interface updateContoTerzi{
    quantity: number
    dataentrata: Date
}