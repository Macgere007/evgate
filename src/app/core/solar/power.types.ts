import { DateTime } from "luxon"

export interface apparent_power{
    x: DateTime,
    y: number
}

export interface reactive_power{
    x: DateTime,
    y: number
}

export interface power{
    x: DateTime,
    y: number
    fillColor?: string
}
export interface Power{
    client_id:[string]
    power: [power],
    power_r: [power],
    power_s: [power],
    power_t: [power],
    reactive_power: [reactive_power],
    apparent_power: [apparent_power],
    station: string,
    highestPLTS?: number,
    unit?: string,
}
