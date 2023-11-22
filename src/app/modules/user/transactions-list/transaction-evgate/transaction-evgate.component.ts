import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';
import { ToastService } from 'angular-toastify';
import { AuthService } from 'app/core/auth/auth.service';
import { AwsService } from 'app/core/service/aws.service';
import { TransactionServices } from 'app/core/service/transaction.service';
import { FormDialogService } from 'app/layout/form-dialog';
import { IDataTransaction, IFilter, ITransaction } from 'app/models/transaction.types';
import moment from 'moment';
import { DateTime } from 'luxon';

@Component({
    selector       : 'transaction-evgate',
    templateUrl    : './transaction-evgate.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransactionEvgateComponent implements OnInit
{
  @Input() title = ''
  public activeLang: string;
  public isloading: boolean = true
  public data: IDataTransaction = {
    data: [],
    total_energy: 0,
    total_duration: '',
    total_data: 0
  }
  public transactionDate: Date = new Date(Date.now())
  public dateType: "daily" | "weekly" | "monthly" | "range" = "weekly";
  public timePicker = new FormGroup({
    start: new FormControl(new Date(Date.now() - 64000000)),
    end: new FormControl(new Date(Date.now())),
  });

  locale = this._translateService.getActiveLang();
  public DateTransactionNowLabel: string = '';
  public DateTransactionOneWeekBeforeNowLabel: string = '';
  public DateTransactionRangeFrom: string = '';
  public DateTransactionRangeTo: string = '';
  public DateTransactionMonthFrom: string;
  public DateTransactionMonthTo: string;

  constructor(
    private _translateService: TranslocoService,
    private _authService: AuthService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _transactionService: TransactionServices,
    private _formDialogService: FormDialogService,
    private _route: ActivatedRoute,
    private _toastService: ToastService,
    private _awsService: AwsService
  ) { }

  public authCheck: any = { role: 'operator' };

  // Pagination
  public filter = '';
  public sizePage = 6;
  public pageIndex = 0;

  ngOnInit(): void {
    this._translateService.langChanges$.subscribe((activeLang) => {
      this.activeLang = activeLang;
      this.DateTransactionNowLabel = moment(Date.now()).locale((activeLang === 'en'?'en':'id')).format(activeLang === 'en' ? "MMMM DD, YYYY": "DD MMMM YYYY")
      this.DateTransactionOneWeekBeforeNowLabel = moment(Date.now()).subtract(6, 'days').locale((activeLang === 'en'?'en':'id')).format(activeLang === 'en' ? "MMMM DD, YYYY": "DD MMMM YYYY")
      this.DateTransactionRangeFrom = activeLang === 'id' ? moment(new Date(this.timePicker.value.start)).locale('id').format('DD MMMM YYYY') : moment(new Date(this.timePicker.value.start)).locale('en').format('MMMM DD, YYYY');
      this.DateTransactionRangeTo = activeLang === 'id' ? moment(new Date(this.timePicker.value.end)).locale('id').format('DD MMMM YYYY') : moment(new Date(this.timePicker.value.end)).locale('en').format('MMMM DD, YYYY');

    });

    this.authCheck = this._authService.currentUserReal;
    this.showTransaction(this.transactionDate);
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
    this.showTransaction(this.transactionDate);
  }

  formatDuration(totalDurationInMs: number): string {
    const totalSeconds = Math.floor(totalDurationInMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    const formattedDuration = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    return formattedDuration;
  }

  updateDurationFormatted() {
    for (let i = 0; i < this.data.data.length; i++) {
      this.data.data[i].durationFormatted = this.formatDuration(this.data.data[i].duration);
    }
    this._changeDetectorRef.detectChanges();
  }

  public deleteTransaction(id: string) {
    const dialogDeleteSite = this._formDialogService.open({
      title: `Delete Transaction`,
      message: this.activeLang == "en" ? `Are you sure you want to delete this transaction? After deletion, you cannot restore data` : `Apakah kamu yakin ingin menghapus transaksi ini? Setelah hapus, kamu tidak bisa kembalikan data` ,
      icon: {
        show: true,
        name: 'mat_outline:delete',
        color: 'error',
      },
      actions: {
        confirm: {
          show: true,
          label: 'OK',
          color: 'bg-red-500',
        },
      },
      formValue: 'confirmed',
    });

    dialogDeleteSite.afterClosed().subscribe(async (result) => {
      if (result === 'confirmed') {
        const transactionId = id;
        this._transactionService.deleteTransaction(id).subscribe(
          res => {
            this.showTransaction(this.transactionDate);
            this._toastService.info((this.activeLang == "en" ? `Success delete transaction,` : `Berhasil menghapus transaksi`))
          },
          error => {
            this._toastService.error((this.activeLang == "en" ? `Error delete transaction` : `Gagal menghapus transaksi`))
          }
        );
      }
    });
  }

  public onSearch(e) {
    this.filter = e;
    this.pageIndex = 0

    this.showTransaction(this.transactionDate);
    this._changeDetectorRef.detectChanges();
  }

  public dateTypeTransactionTable(type: "daily" | "weekly" | "monthly" | "range") {
    this.dateType = type;
    this.pageIndex = 0
    if (this.dateType === 'range') {
      this.DateTransactionRangeFrom = moment(new Date(this.timePicker.value.start)).format('MMMM DD, YYYY');
      this.DateTransactionRangeTo = moment(new Date(this.timePicker.value.end)).format('MMMM DD, YYYY');
    }
    if (this.dateType === 'monthly') {
      let dateMonth = new Date(this.transactionDate);;
      dateMonth.setDate(1);
      this.DateTransactionMonthFrom = moment(new Date(dateMonth)).format('MMMM DD, YYYY');
      dateMonth.setMonth(this.transactionDate.getMonth() + 1);
      dateMonth.setDate(0);
      this.DateTransactionMonthTo = moment(new Date(dateMonth)).format('MMMM DD, YYYY');
    }
    this.showTransaction(this.transactionDate);
    this._changeDetectorRef.detectChanges();
  }

  public showTransaction(e) {
    let date = new Date(e);
    this.transactionDate = date;

    const dateformat = this.activeLang === 'en' ?'MMMM DD, YYYY': 'DD MMMM YYYY';
    this.DateTransactionNowLabel = moment(new Date(date)).locale(this.activeLang).format(dateformat);
    this.DateTransactionOneWeekBeforeNowLabel = moment(new Date(date)).subtract(6, 'days').locale(this.activeLang).format(dateformat);

    if (this.dateType == 'monthly') {
      let dateMonth = new Date(e);;
      dateMonth.setDate(1);
      this.DateTransactionMonthFrom = moment(new Date(dateMonth)).locale(this.activeLang).format(dateformat);
      dateMonth.setMonth(date.getMonth() + 1);
      dateMonth.setDate(0);
      this.DateTransactionMonthTo = moment(new Date(dateMonth)).locale(this.activeLang).format(dateformat);
    }
    let id
    if (this.authCheck.role === 'admin') {
      const queryParams = this._route.snapshot.queryParams;
      if (queryParams.hasOwnProperty('site_id')) {
        id = queryParams['site_id'];
      } else {
        id = 'all';
      }
    } else {
      id = this.authCheck.id;
    }
    if (this.dateType === 'range') {
      const startDate = this.timePicker.value.start;
      this.DateTransactionRangeFrom = moment(new Date(this.timePicker.value.start)).format(dateformat);
      if (this.timePicker.value.end !== null) {
        this.DateTransactionRangeTo = moment(new Date(this.timePicker.value.end)).format(dateformat);
        const endDate = this.timePicker.value.end;
        setTimeout(() => this.timePicker.value.end !== null && this.getTransactionData(id, startDate, endDate), 50);
      } else {
        this.DateTransactionRangeTo = this.activeLang === 'en' ? 'Choise End Date': 'Pilih Akhiran Tanggal';
        this._changeDetectorRef.markForCheck();
      }
    } else {
      this.getTransactionData(id);
    }
    this._changeDetectorRef.markForCheck();
  }

  private getTransactionData(id: string, startDate?: Date, endDate?: Date) {
    this.isloading = true
    this._transactionService.getTransaction(
      id,
      this.filter,
      this.pageIndex + 1,
      this.sizePage,
      startDate || this.transactionDate,
      this.dateType,
      startDate,
      endDate
    ).subscribe(
      (response: IDataTransaction) => {
        this.data = response
        for (let i = 0; i < this.data.data.length; i++) {

          const startCharging = moment.utc(this.data.data[i].start_charging).local();
          const stopCharging = moment.utc(this.data.data[i].stop_charging).local();
          this.data.data[i].start_charging = startCharging.format('HH:mm, DD/MM/YYYY');
          this.data.data[i].stop_charging = stopCharging.format('HH:mm, DD/MM/YYYY');
        }
        this.updateDurationFormatted();
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
