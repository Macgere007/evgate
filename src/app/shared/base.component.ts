import { ChangeDetectorRef, Component, Injectable, OnInit } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { AwsService } from 'app/core/service/aws.service';
import moment from 'moment';
import { CookieService } from 'ngx-cookie-service';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BaseComponent implements OnInit {

  public test = 'oke'
  public activeLang: any;
  public DateActiveLabelNow: string = moment(Date.now()).locale("id").format("MMMM DD YYYY")
  public DateActiveWeekLabel: string = moment(Date.now()).locale("id").subtract(7, 'day').format("MMMM DD YYYY")
  public DateActiveStartMonthLabel: string = moment(Date.now()).locale("id").startOf('month').format("MMMM DD YYYY")
  public DateActiveEndMonthLabel: string = moment(Date.now()).locale("id").endOf('month').format("MMMM DD YYYY")
  public DateActiveStopLabel: string;
  public DateActiveStartLabel: string;
  public startTime: Date = new Date();
  public stopTime: Date = new Date();
  public labelGraphCol: string = 'black';

  constructor(
    protected _cookieService: CookieService,
    protected _awsService: AwsService,
    protected _translateService: TranslocoService,
    protected _changeDetectorRef: ChangeDetectorRef
    ) {}

  ngOnInit(): void {
    this._translateService.langChanges$.subscribe((activeLang) => {
      this.activeLang = activeLang;
      this.setDateLabels();
      this.setCoockies('preferredLang', activeLang);
    });
  }

  setCoockies(key, value){
    const threeHoursInSeconds = 3 * 60 * 60;
    const expirationDate = new Date();
    expirationDate.setTime(expirationDate.getTime() + threeHoursInSeconds * 1000);
    this._cookieService.set(key, value, expirationDate)
  }

  formatNumberWithLocale(numberValue: number, decimal?: number): string {
    return this._awsService.formatNumberWithLocale(this.activeLang, numberValue, decimal);
  }

  setStartStop(start, stop){
    this.startTime = start
    this.stopTime = stop
  }

  public setDateLabels(): void {
    this.DateActiveLabelNow = this.activeLang === "id" ? moment(Date.now()).locale("id").format("DD MMMM YYYY") : moment(Date.now()).locale("en").format("MMMM DD YYYY");
    this.DateActiveWeekLabel = this.activeLang === "id" ? moment(Date.now()).locale("id").subtract(6,'days').format("DD MMMM YYYY") : moment(Date.now()).locale("en").subtract(6,'days').format("MMMM DD YYYY");
    this.DateActiveStartMonthLabel = this.activeLang === "id" ? moment(Date.now()).locale("id").startOf('month').format("DD MMMM YYYY") : moment(Date.now()).locale("en").startOf('month').format("MMMM DD YYYY");
    this.DateActiveEndMonthLabel = this.activeLang === "id" ? moment(Date.now()).locale("id").endOf('month').format("DD MMMM YYYY") : moment(Date.now()).locale("en").endOf('month').format("MMMM DD YYYY");
    this.DateActiveStartLabel = this.activeLang === "id" ? moment(this.startTime).locale("id").format("DD MMMM YYYY") : moment(this.startTime).locale("en").format("MMMM DD YYYY");
    this.DateActiveStopLabel = this.activeLang === "id" ? moment(this.stopTime).locale("id").format("DD MMMM YYYY") : moment(this.stopTime).locale("en").format("MMMM DD YYYY");
    this._changeDetectorRef.markForCheck()
  }
}
