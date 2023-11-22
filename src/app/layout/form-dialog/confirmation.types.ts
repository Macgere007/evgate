export interface FormDialogConfig
{
    title?: string;
    message?: string;
    icon?: {
        show?: boolean;
        name?: string;
        color?: 'primary' | 'accent' | 'warn' | 'basic' | 'info' | 'success' | 'warning' | 'error';
    };
    actions?: {
        confirm?: {
            show?: boolean;
            label?: string;
            color?: 'primary' | 'accent' | 'warn' | 'basic' | string;
        };
        cancel?: {
            show?: boolean;
            label?: string;
        };
    };
    form?: string[];
    formValue?: any;
    dismissible?: boolean;
    option?: any[];
    remove?: boolean
    option2?: any[];
    option3?: any[];
    option4?: any[]
}
