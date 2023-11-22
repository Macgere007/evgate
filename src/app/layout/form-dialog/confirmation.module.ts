import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { FormDialogService } from './confirmation.service';
import { FormDialogDialogComponent } from './dialog/dialog.component';
import { CommonModule } from '@angular/common';
import { TranslocoCoreModule } from 'app/core/transloco/transloco.module';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';

@NgModule({
    declarations: [
        FormDialogDialogComponent
    ],
    imports     : [
        MatButtonModule,
        TranslocoCoreModule,
        MatDialogModule,
        MatIconModule,
        NgxQRCodeModule,
        CommonModule
    ],
    providers   : [
        FormDialogService
    ]
})
export class FormDialogModule
{
    /**
     * Constructor
     */
    constructor(private _FormDialogService: FormDialogService)
    {
    }
}
