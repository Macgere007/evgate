import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { merge } from 'lodash-es';
import { FormDialogDialogComponent } from './dialog/dialog.component';
import { FormDialogConfig } from './confirmation.types';

@Injectable({
    providedIn: 'root'
  })
export class FormDialogService
{
    private _defaultConfig: FormDialogConfig = {
        title      : 'Confirm action',
        message    : 'Are you sure you want to confirm this action?',
        icon       : {
            show : true,
            name : 'heroicons_outline:exclamation',
            color: 'warn'
        },
        actions    : {
            confirm: {
                show : true,
                label: 'Confirm',
                color: 'warn'
            },
            cancel : {
                show : true,
                label: 'Cancel'
            }
        },
        form        :  [],
        formValue   : {},
        option      : [],
        option2     : [],
        option3     : [],
        option4     : [],
        dismissible: false
    };

    /**
     * Constructor
     */
    constructor(
        private _matDialog: MatDialog
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    open(config: FormDialogConfig = {}): MatDialogRef<FormDialogDialogComponent>
    {
        // Merge the user config with the default config
        const userConfig = merge({}, this._defaultConfig, config);
        // console.log(userConfig)
        // Open the dialog
        return this._matDialog.open(FormDialogDialogComponent, {
            autoFocus   : false,
            disableClose: !userConfig.dismissible,
            data        : userConfig,
            panelClass  : 'form-dialog-dialog-panel'
        });
    }
}
