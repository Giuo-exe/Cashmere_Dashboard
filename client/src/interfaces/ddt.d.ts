import { ClienteCardProp } from "./cliente";
import { BeneProps } from "./grid";

export interface DdtProps{
    _id?: String | BaseKey,
    causale: String,
    id: String | BaseKey
    data: Date,
    destinatario: {
        id?: BaseKey | undefined,
        name: string | any
        email?: string | any | undefined
        piva?: string | any
        citta?: string| any,
        cap?: string | any
        rea?: string | any
        cf?: string | any
        indirizzo: string| any
        telefono?: string| any
        noOfFatture?: number
    },
    destinazione: String,
    beni: Array<BeneProps>
    tara: number
}

export interface DdtCard{
    id: string | BaseKey
    kg: number,
    titolo: string | BaseKey
    data: string,
    destinatario: string,
    beni: Array<BeneProps>
    idfattura?: string | BaseKey
}