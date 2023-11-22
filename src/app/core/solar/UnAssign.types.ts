import { StationList, StationListName } from "./assign.types"

export interface UnAssign {
    id: string
    deleteList: [StationList,StationListName]
}

