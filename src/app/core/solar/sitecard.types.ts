
export interface siteCard{
  id:string,
  address: string,
  'custom:coordinates': string[],
  'custom:EV_assign': string[],
  name: string,
  online?: number,
  offline?: number,
  email: string;
}

