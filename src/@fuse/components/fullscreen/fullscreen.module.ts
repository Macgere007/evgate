import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FuseFullscreenComponent } from '@fuse/components/fullscreen/fullscreen.component';
import { CommonModule } from '@angular/common';
import { TranslocoCoreModule } from 'app/core/transloco/transloco.module';
@NgModule({
    declarations: [
        FuseFullscreenComponent
    ],
    imports     : [
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
        CommonModule,
        TranslocoCoreModule
    ],
    exports     : [
        FuseFullscreenComponent
    ]
})
export class FuseFullscreenModule
{
}
