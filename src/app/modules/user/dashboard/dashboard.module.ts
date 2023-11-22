import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { NgApexchartsModule } from 'ng-apexcharts';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FuseCardModule } from '@fuse/components/card';
import { SharedModule } from 'app/shared/shared.module';
import { DashboardComponent } from 'app/modules/user/dashboard/dashboard.component';
import { TranslocoCoreModule } from 'app/core/transloco/transloco.module';
import {MatTableModule} from '@angular/material/table';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DashboardCardComponent } from './dashboard-card/dashboard-card.component';
import { AngularToastifyModule } from 'angular-toastify';
import { MatPaginatorModule } from '@angular/material/paginator';
import { AlarmEnbyteDetailDialogComponent } from './dashboard-card/alarm-enbyte-detail-dialog/alarm-enbyte-detail-dialog.component';
import {MatExpansionModule} from '@angular/material/expansion';
import {
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule,
    NgxMatTimepickerModule
} from '@angular-material-components/datetime-picker';
import { ObjectShowModule } from 'app/components/object-show/object-show.module';
import { ExpantionComponent } from './dashboard-card/alarm-enbyte-detail-dialog/expantion/expantion.component';
import { MatMomentDateModule } from '@angular/material-moment-adapter';



export const routes: Route[] = [
    {
        path     : '',
        component: DashboardComponent
    }
];

@NgModule({
    declarations: [
        DashboardComponent,
        DashboardCardComponent,
        AlarmEnbyteDetailDialogComponent,
        ExpantionComponent,
        // TableDataComponent
    ],
    imports     : [
        RouterModule.forChild(routes),
        MatButtonModule,
        MatMomentDateModule,
        MatButtonToggleModule,
        NgxMatDatetimePickerModule,
        NgxMatNativeDateModule,
        NgxMatTimepickerModule,
        MatTableModule,
        ObjectShowModule,
        MatCheckboxModule,
        MatExpansionModule,
        MatDividerModule,
        AngularToastifyModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        NgApexchartsModule,
        MatMenuModule,
        MatProgressSpinnerModule,
        MatProgressBarModule,
        MatTooltipModule,
        FuseCardModule,
        TranslocoCoreModule,
        SharedModule,
        MatPaginatorModule,
    ]
})
export class DashboardModule
{
}
