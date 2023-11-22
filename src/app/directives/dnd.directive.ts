import {
    Directive,
    Output,
    Input,
    EventEmitter,
    HostBinding,
    HostListener
  } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';

  @Directive({
    selector: '[appDnd]'
  })
  export class DndDirective {
    @HostBinding('class.fileover') fileOver: boolean;
    @Output() fileDropped = new EventEmitter<any>();
    @Output() fileDragOver = new EventEmitter<any>();
    @Output() fileDragLeave = new EventEmitter<any>();

    // Dragover listener
    @HostListener('dragover', ['$event']) onDragOver(evt): void {
        //console.log('dragover event');
      evt.preventDefault();
      evt.stopPropagation();
      this.fileOver = true;
      this.fileDragOver.emit();
    }

    // Dragleave listener
    @HostListener('dragleave', ['$event']) public onDragLeave(evt): void {
        //console.log('dragleave event');
      evt.preventDefault();
      evt.stopPropagation();
      this.fileOver = false;
      this.fileDragLeave.emit();
    }

    // Drop listener
    @HostListener('drop', ['$event']) public ondrop(evt): void {
        //console.log('drop event');
      evt.preventDefault();
      evt.stopPropagation();
      this.fileOver = false;
      const files = evt.dataTransfer.files;
      if (files.length > 0) {
        this.fileDropped.emit(files);
      }
    }
  }
