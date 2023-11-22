import { User } from "app/models/user.type"

export interface IStation{
    stationId: number,
    stationName: string,
    stationType: string,
    gridType: string,
    capacity: number,
    longitude: number,
    latitude: number,
    address: string,
    creator: null,
    angle: string,
    slope: string,
    users: User[]
}
