import { ChangeDetectorRef, Component, OnDestroy, OnInit, Inject, ElementRef, ViewChild, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatAccordion } from '@angular/material/expansion';
import { LookupService } from 'app/core/service/lookup.service';
import { Alarm, AlarmByte, ENByte } from 'app/models/EV gate/alarm.type';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-summary-dialog',
  templateUrl: './summary-dialog.component.html',
  styleUrls: ['./summary-dialog.component.scss'],
})
export class SummaryDialogComponent implements OnInit {
  @ViewChild('labelInput') labelInput: ElementRef<HTMLInputElement>;
  @ViewChild(MatAccordion) accordion: MatAccordion;
  @Input() expanded: boolean = false;

  constructor(
    public matDialogRef: MatDialogRef<SummaryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _changeDetectorRef: ChangeDetectorRef,
    private _lookupService: LookupService,
  ) {
  }

  ngOnInit(): void {
    console.log(this.data, 'aa')
  }

}
