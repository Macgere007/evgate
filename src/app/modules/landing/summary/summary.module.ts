import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from 'app/shared/shared.module';
import { TranslocoModule } from '@ngneat/transloco';
import { NgxScannerQrcodeModule } from 'ngx-scanner-qrcode';
import { LandingSummaryComponent } from './summary.component';
import { landingSummaryRoutes } from './summary.routing';
import { SummaryCardModules } from './summary-card/summary-card.module';
import { AngularToastifyModule } from 'angular-toastify';
import { SummaryDialogComponent } from './summary-dialog/summary-dialog.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ObjectShowModule } from 'app/components/object-show/object-show.module';
import { HeaderModule } from '../header/header.module';

// LOAD_WASM().subscribe();

@NgModule({
    declarations: [
        LandingSummaryComponent,
        SummaryDialogComponent
    ],
    imports     : [
        RouterModule.forChild(landingSummaryRoutes),
        MatButtonModule,
        SummaryCardModules,
        MatIconModule,
        NgxScannerQrcodeModule,
        AngularToastifyModule,
        HeaderModule,
        ObjectShowModule,
        MatProgressSpinnerModule,
        TranslocoModule,
        SharedModule
    ],
})
export class LandingSummaryModule
{
}
