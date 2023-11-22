import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SharedModule } from 'app/shared/shared.module';
import { UserAnalyticsComponent } from 'app/modules/user/analytics/user-analytics.component';
import { useranalyticsRoutes } from 'app/modules/user/analytics/user-analytics.routing';
import { FuseCardModule } from "../../../../@fuse/components/card/card.module";
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';
import {MatFormFieldControl, MatFormFieldModule} from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { TranslocoCoreModule } from 'app/core/transloco/transloco.module';
import {
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule,
    NgxMatTimepickerModule
} from '@angular-material-components/datetime-picker';
import { StationService } from 'app/core/service/station.service';
import { CookieService } from 'ngx-cookie-service';
import { GraphCardComponent } from './graph/graph.component';

@NgModule({
    declarations: [
        UserAnalyticsComponent,
        GraphCardComponent
    ],
    imports: [
        RouterModule.forChild(useranalyticsRoutes),
        MatButtonModule,
        MatButtonToggleModule,
        MatDividerModule,
        MatIconModule,
        MatMenuModule,
        NgxMatDatetimePickerModule,
        NgxMatTimepickerModule,
        NgxMatNativeDateModule,
        MatProgressBarModule,
        MatSortModule,
        MatTableModule,
        MatTooltipModule,
        MatListModule,
        NgApexchartsModule,
        SharedModule,
        FuseCardModule,
        MatExpansionModule,
        MatProgressSpinnerModule,
        MatDatepickerModule,
        MatSelectModule,
        MatFormFieldModule,
        MatNativeDateModule,
        MatInputModule,
        TranslocoCoreModule
    ],
    providers:[StationService, CookieService]
})
export class UserAnalyticsModule
{
}
