import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FuseCardModule } from '@fuse/components/card';
import { SharedModule } from 'app/shared/shared.module';
import { AuthSignUpConfirmationComponent } from 'app/modules/auth/sign-up-confirmation/sign-up-confirmation.component';
import { authSignUpConfirmationRoutes } from 'app/modules/auth/sign-up-confirmation/sign-up-confirmation.routing';
import { FuseAlertModule } from '@fuse/components/alert';
import { TranslocoModule } from '@ngneat/transloco';
import { LanguagesModule } from 'app/layout/common/languages/languages.module';

@NgModule({
    declarations: [
        AuthSignUpConfirmationComponent
    ],
    imports     : [
        RouterModule.forChild(authSignUpConfirmationRoutes),
        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatProgressSpinnerModule,
        FuseCardModule,
        FuseAlertModule,
        TranslocoModule,
        LanguagesModule,
        SharedModule
    ]
})
export class AuthSignUpConfirmationModule
{
}
