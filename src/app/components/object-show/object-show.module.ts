import { NgModule } from '@angular/core';

import { ObjectShowComponent } from './object-show.component';
import { TranslocoModule } from '@ngneat/transloco';
import { SharedModule } from 'app/shared/shared.module';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    TranslocoModule,
    SharedModule
  ],
  exports     : [
    ObjectShowComponent
],
  declarations: [ObjectShowComponent],
  providers: [],
})
export class ObjectShowModule { }
