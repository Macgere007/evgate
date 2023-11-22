
export interface User
{
    id: string;
    companyId?: string;
    company?: string;
    companyType?: string;
    name: string;
    email: string;
    title?: string;
    status?: string;
    about?: string;
    phone?: string;
    language?: string;
    action?: string;
    roleId?: string;
    userRole?: string;
    station: string[];
    avatar?: string;
    type?: string;
    createdAt?: Date;
    updatedAt?: Date | null;
    cognito?: boolean | null;
}

export class CloudUser implements User {
    id: string;
    companyId: string;
    company: string;
    companyType: string;
    name: string;
    email: string;
    title: string;
    status: string;
    about: string;
    phone: string;
    language: string;
    action: string;
    roleId: string;
    userRole: string;
    station: [string];
    avatar: string;
    type: string;
    createdAt: Date;
    updatedAt: Date | null;
    cognito: boolean | null;

    constructor(user: CloudUser) {
        
        this.name = user.name;
        this.email = user.email;
        this.userRole = user.userRole;
    }
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

