export interface leakage_event_current_value{
    x: Date,
    y: number
}

export interface leakage_current_value{
    x: Date,
    y: number
    fillColor?: string
}
export interface leakage{
    client_id:[string]
    // leakage_event_current_value: leakage_event_current_value[],
    leakage_current_value: leakage_current_value[],
    station: string,
    highestPLTS?: number,
    unit?: string,
}
