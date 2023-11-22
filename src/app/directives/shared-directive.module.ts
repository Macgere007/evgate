import { NgModule } from '@angular/core';
import { DndDirective } from './dnd.directive';
import { LocalizedNumericInputDirective } from './localized-numeric-input.directive';
import { SelectOnClickDirective } from './select-on-click.directive';

@NgModule({
  exports: [DndDirective, LocalizedNumericInputDirective, SelectOnClickDirective],
  declarations: [DndDirective, LocalizedNumericInputDirective, SelectOnClickDirective],
  providers: []
})
export class SharedDirectiveModule {}
