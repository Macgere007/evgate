import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';
import { MatIconModule } from '@angular/material/icon';
import { FuseCardModule } from '@fuse/components/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';

import { SummaryCardComponent } from './summary-card/summary-card.component';
import { EvCardComponent } from './ev-card/ev-card.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'app/shared/shared.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AngularToastifyModule } from 'angular-toastify';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { TranslocoCoreModule } from 'app/core/transloco/transloco.module';
import { SearchModules } from 'app/components/search/search.module';
import { CardModule } from 'app/components/card/card.module';
import { AllEvDialogComponent } from './all-ev-dialog/all-ev-dialog.component';

const routes: Routes = [
    { path: '', component: AdminComponent }
];

@NgModule({
    declarations: [
        AdminComponent,
        SummaryCardComponent,
        EvCardComponent,
        AllEvDialogComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        MatProgressSpinnerModule,
        MatMenuModule,
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        TranslocoCoreModule,
        SharedModule,
        AngularToastifyModule,
        MatTooltipModule,
        MatFormFieldModule,
        MatInputModule,
        SearchModules,
        MatButtonModule,
        MatPaginatorModule,
        SharedModule,
        CardModule,
        FuseCardModule,
        RouterModule.forChild(routes)
    ]
})
export class AdminModule { }
