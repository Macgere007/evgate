import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FuseLoadingService } from '@fuse/services/loading';
import { TranslocoService } from '@ngneat/transloco';
import { ToastService } from 'angular-toastify';
import { AuthService } from 'app/core/auth/auth.service';
import { AwsService } from 'app/core/service/aws.service';
import { LookupService } from 'app/core/service/lookup.service';
import { IDataToken, Itopup, top } from 'app/core/solar/topup.types';
import { FormDialogService } from 'app/layout/form-dialog';
import moment from 'moment';
import { Observable } from 'rxjs';


@Component({
  selector: 'settings-autotopup',
  templateUrl: './autotopup.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutotopupComponent implements OnInit {
  public loading: boolean = false
  public topup?: Itopup[] = [];

  public activeLang: string;
  public isloading: boolean = true
  public data: IDataToken = {
    data: [],
    total_data: 0,
    total_success: 0,
    total_error: 0
  }
  public tokenDate: Date = new Date(Date.now())
  public dateType: "daily" | "weekly" | "monthly" | "range" = "weekly";
  public timePicker = new FormGroup({
    start: new FormControl(new Date(Date.now() - 64000000)),
    end: new FormControl(new Date(Date.now())),
  });

  locale = this._translateService.getActiveLang();
  public DateTokenNowLabel: string = '';
  public DateTokenOneWeekBeforeNowLabel: string = '';
  public DateTokenRangeFrom: string = '';
  public DateTokenRangeTo: string = '';
  public DateTokenMonthFrom: string;
  public DateTokenMonthTo: string;

  /**
   * Constructor
   */
  constructor(
    private _lookupService: LookupService,
    private _translateService: TranslocoService,
    private _authService: AuthService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _toastService: ToastService,
    private _awsService: AwsService
  ) {
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  public authCheck: any = { role: 'operator' };
  // Pagination
  public filter = '';
  public sizePage = 6;
  public pageIndex = 0;
  
  ngOnInit(): void {
    this._translateService.langChanges$.subscribe((activeLang) => {
      this.activeLang = activeLang;
      this.DateTokenNowLabel = moment(Date.now()).locale((activeLang === 'en'?'en':'id')).format(activeLang === 'en' ? "MMMM DD, YYYY" : "DD MMMM YYYY")
      this.DateTokenOneWeekBeforeNowLabel = moment(Date.now()).subtract(6, 'days').locale((activeLang === 'en'?'en':'id')).format(activeLang === 'en' ? "MMMM DD, YYYY" : "DD MMMM YYYY")
      this.DateTokenRangeFrom = activeLang === 'id' ? moment(new Date(this.timePicker.value.start)).locale('id').format('DD MMMM YYYY') : moment(new Date(this.timePicker.value.start)).locale('en').format('MMMM DD, YYYY');
      this.DateTokenRangeTo = activeLang === 'id' ? moment(new Date(this.timePicker.value.end)).locale('id').format('DD MMMM YYYY') : moment(new Date(this.timePicker.value.end)).locale('en').format('MMMM DD, YYYY');

    });
    // this.getTopupLogs()
    this.authCheck = this._authService.currentUserReal;
    this.showToken(this.tokenDate);

    this._changeDetectorRef.detectChanges();
  }

  copyToClipboard(text: string) {
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    this._toastService.info((this.activeLang == "en" ? `Success copy id to clipboard` : `Berhasil salin id ke clipboard`))
    this._changeDetectorRef.markForCheck();
  }

  public async onPageChange(e) {
    this.sizePage = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.showToken(this.tokenDate);
  }

  formatDuration(totalDurationInMs: number): string {
    const totalSeconds = Math.floor(totalDurationInMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    const formattedDuration = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    return formattedDuration;
  }

    // updateDurationFormatted() {
    //   for (let i = 0; i < this.data.data.length; i++) {
    //     this.data.data[i].durationFormatted = this.formatDuration(this.data.data[i].duration);
    //   }
    //   this._changeDetectorRef.detectChanges();
    // }

  public onSearch(e) {
    this.filter = e;
    this.pageIndex = 0

    this.showToken(this.tokenDate);
    this._changeDetectorRef.detectChanges();
  }

  public dateTypeTokenTable(type: "daily" | "weekly" | "monthly" | "range") {
    this.dateType = type;
    this.pageIndex = 0
    if (this.dateType === 'range') {
      this.DateTokenRangeFrom = moment(new Date(this.timePicker.value.start)).format('MMMM DD, YYYY');
      this.DateTokenRangeTo = moment(new Date(this.timePicker.value.end)).format('MMMM DD, YYYY');
    }
    if (this.dateType === 'monthly') {
      let dateMonth = new Date(this.tokenDate);;
      dateMonth.setDate(1);
      this.DateTokenMonthFrom = moment(new Date(dateMonth)).format('MMMM DD, YYYY');
      dateMonth.setMonth(this.tokenDate.getMonth() + 1);
      dateMonth.setDate(0);
      this.DateTokenMonthTo = moment(new Date(dateMonth)).format('MMMM DD, YYYY');
    }
    this.showToken(this.tokenDate);
    this._changeDetectorRef.detectChanges();
  }

  public showToken(e) {
    let date = new Date(e);
    this.tokenDate = date;

    const dateformat = this.activeLang === 'en' ? 'MMMM DD, YYYY' : 'DD MMMM YYYY';
    this.DateTokenNowLabel = moment(new Date(date)).locale(this.activeLang).format(dateformat);
    this.DateTokenOneWeekBeforeNowLabel = moment(new Date(date)).subtract(6, 'days').locale(this.activeLang).format(dateformat);

    if (this.dateType == 'monthly') {
      let dateMonth = new Date(e);;
      dateMonth.setDate(1);
      this.DateTokenMonthFrom = moment(new Date(dateMonth)).locale(this.activeLang).format(dateformat);
      dateMonth.setMonth(date.getMonth() + 1);
      dateMonth.setDate(0);
      this.DateTokenMonthTo = moment(new Date(dateMonth)).locale(this.activeLang).format(dateformat);
    }
    if (this.dateType === 'range') {
      const startDate = this.timePicker.value.start;
      this.DateTokenRangeFrom = moment(new Date(this.timePicker.value.start)).format(dateformat);
      if (this.timePicker.value.end !== null) {
        this.DateTokenRangeTo = moment(new Date(this.timePicker.value.end)).format(dateformat);
        const endDate = this.timePicker.value.end;
        setTimeout(() => this.timePicker.value.end !== null && this.gettokenData(startDate, endDate), 50);
      } else {
        this.DateTokenRangeTo = this.activeLang === 'en' ? 'Choise End Date' : 'Pilih Akhiran Tanggal';
        this._changeDetectorRef.markForCheck();
      }
    } else {
      this.gettokenData();
    }
    this._changeDetectorRef.markForCheck();
  }

  private gettokenData(startDate?: Date, endDate?: Date) {
    this.isloading = true
    this._lookupService.logTopUp(
      this.filter,
      this.pageIndex + 1,
      this.sizePage,
      startDate || this.tokenDate,
      this.dateType,
      startDate,
      endDate
    ).subscribe(
      (response: IDataToken) => {
        this.data = response
        for (let i = 0; i < response.data.length; i++) {
          const startToken = moment.utc(response.data[i].created_at).local();
          const stopToken = moment.utc(response.data[i].updated_at).local();
          response.data[i].created_at = startToken.format('HH:mm, DD/MM/YYYY');
          response.data[i].updated_at = stopToken.format('HH:mm, DD/MM/YYYY');
        }
        this.topup = response.data;
        //   this.updateDurationFormatted();
        this.isloading = false
        this._changeDetectorRef.detectChanges();
      },
      error => {
        this.isloading = false
        this._changeDetectorRef.detectChanges();
      }
    );
  }

  formatNumberWithLocale(numberValue: number): string {
    return this._awsService.formatNumberWithLocale(this.activeLang, numberValue);
  }

  trackByFn(index: number, item: any): any {
    return item.id || index;
  }
}
