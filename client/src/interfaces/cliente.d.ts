import { BaseKey } from '@refinedev/core';
import { FatturaProps } from './fattura';

export interface ClienteCardProp {
    id?: BaseKey | undefined,
    name: string | any
    email?: string | any | undefined
    piva?: string | any
    citta?: string| any,
    cap?: string | any
    rea?: string | any
    cf?: string | any
    contoterzi?: boolean
    indirizzo: string| any
    telefono?: number| any
    noOfFatture?: number
    allFatture?: Array<FatturaProps> | []
}

export interface InfoBarProps {
    icon: ReactNode,
    name: string
}

export interface ClienteProps{
    cliente: ClienteCardProp
}
