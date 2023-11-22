/* eslint-disable */
import { FuseNavigationItem } from '@fuse/components/navigation';


export const defaultNavigation: FuseNavigationItem[] = [
    {
        id      : 'main',
        title   : 'Main',
        type    : 'group',
        icon    : 'heroicons_outline:home',
        children: [
            {
                id   : 'dashboard',
                title: 'Dashboard',
                type : 'basic',
                icon : 'heroicons_outline:home',
                link : 'dashboard',
            },
            {
                id   : 'analytics',
                title: 'Analytics',
                type : 'basic',
                icon : 'heroicons_outline:lightning-bolt',
                link : 'analitic-dashboard',
            },
            {
                id   : 'transaction',
                title: 'Transactions',
                type : 'basic',
                icon : 'receipt',
                link : 'transaction',
            },
            {
                id   : 'EVgate-settings',
                title: 'Settings',
                type : 'basic',
                icon : 'heroicons_outline:cog',
                link : 'EVgate-settings',
            }
        ]
    },
];

export const defaultEvProNavigation: FuseNavigationItem[] = [
    {
        id      : 'main',
        title   : 'Main',
        type    : 'group',
        icon    : 'heroicons_outline:home',
        children: [
            {
                id   : 'dashboard',
                title: 'Dashboard',
                type : 'basic',
                icon : 'heroicons_outline:home',
                link : 'dashboard',
            },
            {
                id   : 'analytics',
                title: 'Analytics',
                type : 'basic',
                icon : 'heroicons_outline:lightning-bolt',
                link : 'analitic-dashboard',
            },
            {
                id   : 'transactions-list',
                title: 'Transaction List',
                type : 'basic',
                icon : 'heroicons_outline:receipt-refund',
                link : 'transactions-list',
            },
            {
                id   : 'EVgate-settings',
                title: 'Settings',
                type : 'basic',
                icon : 'heroicons_outline:cog',
                link : 'EVgate-settings',
            }
        ]
    },
];

export const adminNavigation: FuseNavigationItem[] = [
    {
        id      : 'main',
        title   : 'Main',
        type    : 'group',
        icon    : 'heroicons_outline:home',
        children: [
            {
                id   : 'admin-dashboard',
                title: 'Dashboard Admin',
                type : 'basic',
                icon : 'heroicons_outline:home',
                link : 'admin-dashboard',
            },
            {
                id   : 'EVgate-settings',
                title: 'Settings',
                type : 'basic',
                icon : 'heroicons_outline:cog',
                link : 'EVgate-settings',
            },
            {
                id   : 'transaction',
                title: 'Transactions',
                type : 'basic',
                icon : 'receipt',
                link : 'transaction',
            },
        ]
    },
];

export const adminEvProNavigation: FuseNavigationItem[] = [
    {
        id      : 'main',
        title   : 'Main',
        type    : 'group',
        icon    : 'heroicons_outline:home',
        children: [
            {
                id   : 'admin-dashboard',
                title: 'Dashboard Admin',
                type : 'basic',
                icon : 'heroicons_outline:home',
                link : 'admin-dashboard',
            },
            {
                id   : 'EVgate-settings',
                title: 'Settings',
                type : 'basic',
                icon : 'heroicons_outline:cog',
                link : 'EVgate-settings',
            },
            {
                id   : 'transactions-list',
                title: 'Transaction List',
                type : 'basic',
                icon : 'heroicons_outline:receipt-refund',
                link : 'transactions-list',
            }
        ]
    },
];

export const compactNavigation: FuseNavigationItem[] = [
    {
        id   : 'dashboard',
        title: 'Dashboard',
        type : 'basic',
        icon : 'heroicons_outline:home',
        link : 'dashboard',
    },
    {
        id   : 'settings',
        title: 'Settings',
        type : 'basic',
        icon : 'heroicons_outline:cog',
        link : 'settings',
    },
    {
        id      : 'main',
        title   : 'Main',
        type    : 'group',
        icon    : 'heroicons_outline:home',
        children: [ ]
    },
];
export const futuristicNavigation: FuseNavigationItem[] = [

    {
        id      : 'main',
        title   : 'Main',
        type    : 'group',
        icon    : 'heroicons_outline:home',
        children: []
    },
];
export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id   : 'dashboard',
        title: 'Dashboard',
        type : 'basic',
        icon : 'heroicons_outline:home',
        link : 'dashboard',
    },
    {
        id   : 'settings',
        title: 'Settings',
        type : 'basic',
        icon : 'heroicons_outline:cog',
        link : 'settings',
    },
];

