import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FuseDrawerModule } from '@fuse/components/drawer';
import { SettingModeComponent } from 'app/layout/common/settings/settingmode.component';
import { MatButtonModule } from '@angular/material/button';
import { TranslocoCoreModule } from 'app/core/transloco/transloco.module';

@NgModule({
    declarations: [
        SettingModeComponent
    ],
    imports     : [
        CommonModule,
        RouterModule,
        TranslocoCoreModule,
        MatIconModule,
        MatTooltipModule,
        FuseDrawerModule,
        MatButtonModule
    ],
    exports     : [
        SettingModeComponent
    ]
})
export class SettingLayoutModule
{
}
