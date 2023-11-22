export interface card{
    EV_count: number,
    online: number,
    offline: number,
    charging: number,
    assigned: number,
    unassigned: number,
    EV?: EV[]
}

export interface EV{
    id:string
    status:string
    charging?: boolean
}