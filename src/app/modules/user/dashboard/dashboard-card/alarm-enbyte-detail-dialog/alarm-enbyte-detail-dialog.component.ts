import { ChangeDetectorRef, Component, OnDestroy, OnInit, Inject, ElementRef, ViewChild, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatAccordion } from '@angular/material/expansion';
import { LookupService } from 'app/core/service/lookup.service';
import { Alarm, AlarmByte, ENByte } from 'app/models/EV gate/alarm.type';
import moment from 'moment';
import { Subject, debounceTime } from 'rxjs';

@Component({
  selector: 'app-alarm-enbyte-detail-dialog',
  templateUrl: './alarm-enbyte-detail-dialog.component.html',
  styleUrls: ['./alarm-enbyte-detail-dialog.component.scss'],
})
export class AlarmEnbyteDetailDialogComponent implements OnInit, OnDestroy {
  @ViewChild('labelInput') labelInput: ElementRef<HTMLInputElement>;
  @ViewChild(MatAccordion) accordion: MatAccordion;
  @Input() expanded: boolean = false;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  private dateSubject: Subject<string> = new Subject<string>();
  public dateTime: Date = new Date;
  public selectedDate: string;
  public alarmBiner: any = null;
  public  enbyteBiner: any = {};
  public rawData: boolean = false
  public isloading:boolean = false

  constructor(
    public matDialogRef: MatDialogRef<AlarmEnbyteDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _changeDetectorRef: ChangeDetectorRef,
    private _lookupService: LookupService,
)
{
  
}
ngOnInit(): void {
  this.setDateNow();

  this.dateSubject.pipe(debounceTime(1000)).subscribe(() => this.getValue());
}

getValue(): void {
  this.isloading = true;
  this._lookupService.getBinerAlarmEnbyte(this.data.id, this.selectedDate)
    .subscribe(
      (result) => {
        this.handleServiceResult(result);
        this.isloading = false;
        this.detectChanges();
      },
      (err) => {
        this.handleServiceError();
        this.isloading = false;
        this.detectChanges();
      }
    );
}

setDateNow(): void {
  this.selectedDate = this.formatDate(moment(Date.now()));
  this.getValue();
}

clickNow(dateInput: HTMLInputElement): void {
  this.isloading = true;
  this.selectedDate = this.formatDate(moment(new Date()));
  dateInput.value = this.selectedDate;
  this.getValue();
}

onDateChange(): void {
  this.isloading = true;
  this.dateSubject.next(this.selectedDate);
  console.log('onDateChange:', this.selectedDate);
}

private formatDate(dateMoment: any): string {
  const formattedDate = dateMoment.locale("id").format("YYYY-MM-DDTHH:mm:ss");
  console.log('Formatted Date:', formattedDate);
  return formattedDate;
}

private handleServiceResult(result: any): void {
  if (result !== null && Object.keys(result?.alarm).length) {
    this.alarmBiner = result?.alarm;
    this.enbyteBiner = result?.enbyte;
  } else {
    this.alarmBiner = null;
  }
}

private handleServiceError(): void {
  this.alarmBiner = null;
  this.enbyteBiner = null;
}

private detectChanges(): void {
  this._changeDetectorRef.detectChanges();
}




ngOnDestroy(): void
{
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
}


trackByFn(index: number, item: any): any
{
    return item.id || index;
}
}
