export interface Itopup{
    token: string,
    evgate: string,
    status: string,
    created_at: string,
    updated_at: string
}

export interface IDataToken {
    data: Itopup[];
    total_data: number;
    total_success: number;
    total_error: number;
  }

export interface top{
    topup: Itopup,
    count: string
}
