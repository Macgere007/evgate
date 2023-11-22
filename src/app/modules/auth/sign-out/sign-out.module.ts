import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { FuseCardModule } from '@fuse/components/card';
import { SharedModule } from 'app/shared/shared.module';
import { AuthSignOutComponent } from 'app/modules/auth/sign-out/sign-out.component';
import { authSignOutRoutes } from 'app/modules/auth/sign-out/sign-out.routing';
import { TranslocoModule } from '@ngneat/transloco';
import { LanguagesModule } from 'app/layout/common/languages/languages.module';

@NgModule({
    declarations: [
        AuthSignOutComponent
    ],
    imports     : [
        RouterModule.forChild(authSignOutRoutes),
        MatButtonModule,
        FuseCardModule,
        TranslocoModule,
        LanguagesModule,
        SharedModule
    ]
})
export class AuthSignOutModule
{
}
