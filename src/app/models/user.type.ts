export interface User
{
    id: string;
    companyId?: string;
    company?: string;
    companyType?: string;
    name?: string;
    email?: string;
    title?: string;
    status?: string;
    about?: string;
    phone?: string;
    station?: string[];
    stationname?: string[];
    language?: string;
    action?: string;
    roleId?: string;
    userRole?: string;
    avatar?: string;
    type?: string;
    createdAt?: Date;
    updatedAt?: Date | null;
    isAdmin?:boolean |null;
    cognito?: boolean | null;
}


export enum UserStatus
{
    signOut = 'sign-out',
    online = 'online',
    away = 'away',
    busy = 'busy',
    notVisible = 'not-visible'
}

export enum UserRole
{
    owner = 'Owner',
    readOnly = 'Readonly',
    readWrite = 'Readwrite',
    administrator = 'Administrator',
    manager = 'Manager'
}

export interface ChangePassword{
    accessToken:string,
    oldPassword:string,
    newPassword:string,
    confirmPassword:string

 }
