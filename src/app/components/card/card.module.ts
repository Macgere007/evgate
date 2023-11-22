import { NgModule } from '@angular/core';
import { CardComponent } from './card.component';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoCoreModule } from 'app/core/transloco/transloco.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    TranslocoCoreModule,
    MatProgressSpinnerModule
  ],
  exports: [
    CardComponent, 
  ],
  declarations: [CardComponent]
})
export class CardModule { }
