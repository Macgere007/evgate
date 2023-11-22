export interface dataMainFrequency{
    x:Date,
    y:Number
}
export interface dataBreakerOpen{
    x:Date,
    y:Number
}
export interface dataBreakerStatus{
    x:Date,
    y:Number
}

export interface breaker{
    length: number
    client_id:[string]
    main_frequency:[dataMainFrequency],
    breaker_open:[dataBreakerOpen],
    breaker_status:[dataBreakerStatus]
}
