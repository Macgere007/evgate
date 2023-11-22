import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from 'app/shared/shared.module';
import { LandingHomeComponent } from 'app/modules/landing/home/home.component';
import { landingHomeRoutes } from 'app/modules/landing/home/home.routing';
import { TranslocoModule } from '@ngneat/transloco';
import { NgxScannerQrcodeModule } from 'ngx-scanner-qrcode';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LanguagesModule } from 'app/layout/common/languages/languages.module';
import { HeaderModule } from '../header/header.module';
// LOAD_WASM().subscribe();

@NgModule({
    declarations: [
        LandingHomeComponent
    ],
    imports     : [
        RouterModule.forChild(landingHomeRoutes),
        MatButtonModule,
        LanguagesModule,
        MatIconModule,
        NgxScannerQrcodeModule,
        MatFormFieldModule,
        MatInputModule,
        HeaderModule,
        MatProgressSpinnerModule,
        MatTooltipModule,
        TranslocoModule,
        SharedModule
    ],
})
export class LandingHomeModule
{
}
