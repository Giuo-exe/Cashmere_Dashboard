import { BaseKey } from "@refinedev/core"

export interface ColoreCardProps{
    _id: BaseKey | undefined
    name: string
    codice: string
    lotti?: string
    hex: string | undefined
}