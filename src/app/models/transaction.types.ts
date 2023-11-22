export interface ITransaction{
    id: string
    evgate: string
    energy: number
    duration: number
    start_charging: string
    stop_charging: string
    created_at: Date
    updated_at: Date
    durationFormatted?: string;
}

export interface IDataTransaction {
    data: ITransaction[];
    total_energy: number;
    total_duration: string;
    total_data: number
  }

export interface IFilter{
    evgate: string;
}
