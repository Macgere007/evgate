import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { FuseCardModule } from '@fuse/components/card';
import { SharedModule } from 'app/shared/shared.module';
import { AuthSignInTransitionComponent } from 'app/modules/auth/sign-in-transition/sign-in-transition.component';
import { authSignInTransitionRoutes } from 'app/modules/auth/sign-in-transition/sign-in-transition.routing';
import { TranslocoModule } from '@ngneat/transloco';
import { LanguagesModule } from 'app/layout/common/languages/languages.module';

@NgModule({
    declarations: [
        AuthSignInTransitionComponent
    ],
    imports     : [
        RouterModule.forChild(authSignInTransitionRoutes),
        MatButtonModule,
        FuseCardModule,
        TranslocoModule,
        LanguagesModule,
        SharedModule
    ]
})
export class AuthSignInTransitionModule
{
}
