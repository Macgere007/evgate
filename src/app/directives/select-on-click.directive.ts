import {Directive, ElementRef, HostListener} from '@angular/core';

@Directive({
  selector: '[selectOnClick]'
})

export class SelectOnClickDirective {

  constructor(private elementRef: ElementRef) {
  }

  @HostListener('click') onClick(): void {
    this.elementRef.nativeElement.select();
  }
}
