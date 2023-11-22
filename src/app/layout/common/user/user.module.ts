import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { TranslocoCoreModule } from 'app/core/transloco/transloco.module';
import { UserComponent } from 'app/layout/common/user/user.component';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
    declarations: [
        UserComponent
    ],
    imports     : [
        MatButtonModule,
        TranslocoCoreModule,
        MatDividerModule,
        MatIconModule,
        MatMenuModule,
        SharedModule
    ],
    exports     : [
        UserComponent
    ]
})
export class UserModule
{
}
