export interface Company
{
    id: string;
    name?: string;
    description?: string;
    address?: string;
    phone?: string;
    fax?: string;
    taxId?: string;
    websiteUrl?: string;
    email?: string;
    logo?: string;
    createdAt?: Date;
    updatedAt?: Date | null;
}

export enum CompanyType
{
    vendor = 'Vendor',
    psc = 'Product Sharing Contract',
    skk = 'SKK Migas',
    sysAdmin = 'System Administrator'
}
