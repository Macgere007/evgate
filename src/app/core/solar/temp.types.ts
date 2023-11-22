import { DateTime } from "luxon"

export interface MCU_temperature{
    x: DateTime,
    y: number
}

export interface terminal_temperature_n{
    x: DateTime,
    y: number
}

export interface phase_terminal_temperature{
    x: DateTime,
    y: number
    fillColor?: string
}
export interface Temperature{
    client_id:[string]
    phase_terminal_temperature: phase_terminal_temperature[],
    phase_terminal_temperature2?: phase_terminal_temperature[],
    phase_terminal_temperature3?: phase_terminal_temperature[],
    terminal_temperature_n: terminal_temperature_n[],
    MCU_temperature: MCU_temperature[],
    station?: string,
    highestPLTS?: number,
    unit?: string,
}
