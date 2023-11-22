export interface energy_active{
    x: Date,
    y: number
}

export interface energy{
    active_energy:energyRespond
    reactive_energy: energy_active[]
    customer_id: []
    min?: number
    total_energy:number
}

export interface energyRespond{
    data: energy_active[],
    min?: number
}
