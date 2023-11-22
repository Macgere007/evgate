import { DateTime } from "luxon"

export interface power{
    x: DateTime,
    y: number
}

export interface temperature{
    x: DateTime,
    y: number
}

export interface leakage_current_value{
    x: DateTime,
    y: number
}

export interface active_energy{
    x: DateTime,
    y: number
}

export interface dashboard{
    email?: string
    alarm?:string
    enbyte?:string
    leakage_current_limit: any
    power_limit: any
    temperature_limit: any
    energy_limit?: any
    topUp_limit?: any
    AutoTopUp?: any
    power:power[]
    temperature:temperature[]
    leakage_current_value:leakage_current_value[]
    active_energy:active_energy[]
    status: string
    customer_id: string
    name?: string
    active?: boolean
    total_energy?: number
    car_id: string
    brand: string
    type: string
    capacity?: number,
    id_meter: string,
}
