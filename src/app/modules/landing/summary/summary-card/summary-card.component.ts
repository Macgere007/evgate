import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';
import { ToastService } from 'angular-toastify';
import moment from 'moment';
// import { CustomerServices } from 'app/modules/customer/customer.service';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatDialog } from '@angular/material/dialog';
import { AlarmEnbyteDetailDialogComponent } from 'app/modules/user/dashboard/dashboard-card/alarm-enbyte-detail-dialog/alarm-enbyte-detail-dialog.component';
import { AuthService } from 'app/core/auth/auth.service';
import { StationService } from 'app/core/service/station.service';
import { LookupService } from 'app/core/service/lookup.service';
import { repeat, retry, share } from 'rxjs';
import { AwsService } from 'app/core/service/aws.service';
import { SummaryDialogComponent } from '../summary-dialog/summary-dialog.component';
import { SummaryService } from '../summary.service';
import { FormDialogService } from 'app/layout/form-dialog';

@Component({
  selector: 'summary-card',
  templateUrl: './summary-card.component.html',
  styleUrls: ['./summary-card.component.scss'],
  exportAs: 'summaryCard',
})
export class SummaryCardComponent implements OnInit, OnDestroy {
  activeLang: string
  status = 'Inactive'
  // signal = -80
  moment: any = moment;
  switchBg: string = '#3aff3a'
  switchWidth: number = 100;
  public energyCharging: number = 0;
  ws = null
  data = {power:0, phase_terminal_temperature: 0, energy_akumulatif: 0, current: 0, voltage:0, signal:-60, status: 'sleep'}

  @Input() evgate_id = ''
  @Input() auth = false
  // @Input() summary: ISummary

  constructor(
    protected _translateService: TranslocoService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _authService: AuthService,
    private _matDialog: MatDialog,
    private _toastService: ToastService,
    private _stationService: StationService,
    private _lookupService: LookupService,
    private _awsService: AwsService,
    private _formDialogService: FormDialogService,
    private _summaryService: SummaryService
  ) {
  }
  
  ngOnInit(): void {
    this._translateService.langChanges$.subscribe((activeLang) => {
      this.activeLang = activeLang;
      this._changeDetectorRef.markForCheck();
    })
    this._summaryService.summary$.subscribe(
      res => {
        this.data = res
        let newStatus = (this.data.status === 'charging' ? 'Charging' : this.data.status === 'standby' ? 'Active' : 'Inactive')
        this.status = newStatus
      }
    )

    this.websocket()

    this._changeDetectorRef.markForCheck();
  }

  public websocket() {
    this.ws = this._lookupService.webSocket(this.evgate_id).pipe(
      share(),
      retry({ delay: 1500 }),
      repeat({ delay: 1500 })
    ).subscribe(
      (msg: any) => {
        const a: any = msg;
        a.kwh_meter && delete a.kwh_meter
        console.log(a.kwh_meter)
        this.data = a
        this.energyCharging = a.energy
        let newStatus = (a.status === 'charging' ? 'Charging' : a.status === 'standby' ? 'Active' : 'Inactive')
        this.status = newStatus

        console.log(a)
        this._changeDetectorRef.markForCheck();
      },
    );
  }

  ngOnDestroy(): void {
    this.ws && this.ws.unsubscribe()
  }

  turnOnOff(breaker) {
    if (this.auth) {
      let dialog = this._formDialogService.open({formValue: 'confirmed'})
      dialog.afterClosed().subscribe(
        res => {
          if (res === 'confirmed') {
            // this.status = breaker
            this._stationService.turnOnOffCharger(this.evgate_id, (breaker === 'Inactive' ? 'off' : 'on')).subscribe()      
          }
        }
      )
    } else {
      this._toastService.error('Login terlebih dahulu sebelum ' + (breaker === 'Inactive' ? 'mematikan' : 'menyalakan') + ' Charger')
    }
  }

  public clickAlarm(){
    const dialogRef = this._matDialog.open(AlarmEnbyteDetailDialogComponent,{
      width : '100%',
      data : {id: this.evgate_id}
    })
    dialogRef.afterClosed().subscribe(result => {

    });
  }

  public clickSummary(){
    const dialogRef = this._matDialog.open(SummaryDialogComponent,{
      width : '100%',
      data : this.data
    })
    dialogRef.afterClosed().subscribe(result => {

    });
  }

  formatNumberWithLocale(numberValue: number, decimal?: number): string {
    return this._awsService.formatNumberWithLocale(this.activeLang, numberValue, decimal);
  }

}
