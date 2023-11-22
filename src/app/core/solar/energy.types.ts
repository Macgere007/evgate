export interface dataPLTS{
    x: Date,
    y: number
}
export interface active_energy{
    x: Date,
    y: number
}
export interface reactive_energy{
    x: Date,
    y: number
}
export interface final_energy{
    x: Date,
    y: number
}


export interface energyStatisticOutputs{
    station: string,
    dataPLTS: [dataPLTS],
    totalEnergy?: string
}

export interface data{
    x: Date,
    y: number
}
export interface Energy{
    client_id:[string]
    data:[data]
    final_energy:[final_energy]
    active_energy: [active_energy],
    reactive_energy: [reactive_energy],
    energyStatisticOutputs: energyStatisticOutputs,
    dataPLTS: [dataPLTS],
    unit: string,
}

