import { NgModule } from '@angular/core';

import { TransactionEvgateComponent } from './transaction-evgate.component';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FuseCardModule } from '@fuse/components/card';
import { AngularToastifyModule } from 'angular-toastify';
import { SearchModules } from 'app/components/search/search.module';
import { TranslocoCoreModule } from 'app/core/transloco/transloco.module';
import { SharedModule } from 'app/shared/shared.module';
import { CardModule } from 'app/components/card/card.module';

@NgModule({
  imports: [
    MatIconModule,
      FormsModule,
      MatProgressSpinnerModule,
      MatMenuModule,
      MatButtonModule,
      MatFormFieldModule,
      MatSelectModule,
      MatIconModule,
      SharedModule,
      MatInputModule,
      TranslocoCoreModule,
      MatButtonToggleModule,
      SharedModule,
      MatDatepickerModule,
      MatNativeDateModule,
      AngularToastifyModule,
      MatProgressBarModule,
      MatTooltipModule,
      MatFormFieldModule,
      MatInputModule,
      MatButtonModule,
      CardModule,
      MatPaginatorModule,
      SharedModule,
      SearchModules,
      FuseCardModule
  ],
  exports: [TransactionEvgateComponent],
  declarations: [TransactionEvgateComponent],
  providers: [],
})
export class TransactionEvgateModule { }
