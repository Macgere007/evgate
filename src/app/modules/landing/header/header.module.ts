import { NgModule } from '@angular/core';

import { HeaderComponent } from './header.component';
import { TranslocoModule } from '@ngneat/transloco';
import { SharedModule } from 'app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  imports: [
    TranslocoModule,
    MatButtonModule,
    MatIconModule,
    SharedModule
  ],
  exports     : [
    HeaderComponent
],
  declarations: [HeaderComponent],
  providers: [],
})
export class HeaderModule { }
