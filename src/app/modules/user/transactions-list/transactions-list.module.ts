import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FuseAlertModule } from '@fuse/components/alert';
import { SharedModule } from 'app/shared/shared.module';

import { TranslocoModule } from '@ngneat/transloco';
import { SharedDirectiveModule } from 'app/directives/shared-directive.module';
import { AutotopupComponent } from './autotopup/autotopup.component';
import { transactionslistRoutes } from './transactions-list.routing';
import { SettingLayoutModule } from "../../../layout/common/settings/settingmode.module";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularToastifyModule } from 'angular-toastify';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TransactionsListComponent } from './transactions-list.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {MatAutocompleteModule } from '@angular/material/autocomplete';
import { TranslocoCoreModule } from 'app/core/transloco/transloco.module';
import { TokenListComponent } from './token-list/token-list.component';
import { TransactionEvgateModule } from './transaction-evgate/transaction-evgate.module';
import { SearchModules } from 'app/components/search/search.module';
import { CardModule } from 'app/components/card/card.module';

@NgModule({
    declarations: [
        TransactionsListComponent,
        AutotopupComponent,
        TokenListComponent
    ],
    imports: [
        RouterModule.forChild(transactionslistRoutes),
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        TransactionEvgateModule,
        MatTooltipModule,
        TranslocoCoreModule,
        MatAutocompleteModule,
        MatRadioModule,
        MatMenuModule,
        MatButtonToggleModule,
        MatSelectModule,
        MatSidenavModule,
        FormsModule,
        AngularToastifyModule,
        ReactiveFormsModule,
        MatSlideToggleModule,
        MatPaginatorModule,
        MatSortModule,
        MatProgressBarModule,
        FuseAlertModule,
        TranslocoModule,
        MatDatepickerModule,
        SearchModules,
        MatNativeDateModule,
        SharedDirectiveModule,
        SharedModule,
        CardModule,
        SettingLayoutModule,
        MatProgressSpinnerModule,
    ],
})
export class TransactionsListModule {
}
