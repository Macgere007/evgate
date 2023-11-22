import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { ApexOptions } from 'ng-apexcharts';
import { dashboard, leakage_current_value, power, temperature } from 'app/core/solar/dashboard.types';
import { LookupService } from 'app/core/service/lookup.service';
import { DateTime } from 'luxon';
import { FormBuilder } from '@angular/forms';
import { FormDialogService } from 'app/layout/form-dialog';
import { StationService } from 'app/core/service/station.service';
import { ToastService } from 'angular-toastify';
import { Subscription, repeat, retry, share } from 'rxjs';
import { AwsService } from 'app/core/service/aws.service';
import { CookieService } from 'ngx-cookie-service';
import { evcar } from 'app/core/solar/evcar.types';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { AlarmEnbyteDetailDialogComponent } from './alarm-enbyte-detail-dialog/alarm-enbyte-detail-dialog.component';
import { ShareService } from 'app/core/service/shere.service';
// import audio from '../../../../../assets/sound'
@Component({
  selector: 'app-dashboard-card',
  templateUrl: './dashboard-card.component.html',
  styleUrls: ['./dashboard-card.component.scss']
})
export class DashboardCardComponent implements OnInit, OnDestroy {
  public env = environment.type
  public topup= environment.topup
  public activeLang: string;
  public powerChart: ApexOptions;
  public temperChart: ApexOptions;
  public dashboard?: dashboard[] = [];
  public power?: power;
  public temp?: temperature;
  public leakage?: leakage_current_value;
  public numheartbeat = 30
  public wsInterval = 30
  public powerSetting: power[]
  public energyCharging: number = 0;
  public ws: Subscription
  public simAccCharging = ['TMsimcp000000001', 'HEI235', 'HEI239', 'HEI240','HEI244']
  public brandEv
  public typeEv
  public signal:number
  public capacity: number
  public alarm:string
  public enbyte:string
  public alarmBiner:string
  public enbyteBiner:string
  public add = false
  public kwh_meter: string
  public pathImg = ''
  public imgNow = ''
  //   public pathNull = '../../../../../assets/images/MobilEV/null.png'
  chargePercentage: number = 0;
  switchWidth: number = 1;
  switchBg: string = '#3aff3a'
  assignedCar: string = '';
  assignedCarBrand: string = '';

  @Input() public item: dashboard
  @Input() public ActiveType: string
  @Input() public auth
  @Input() public car: evcar[]
  @Input() public energy: number = 0
  @Output() public updateData = new EventEmitter();
  @Output() public updateDataEv = new EventEmitter<string>();
  @Input() receivedCarId: string;

  public Form = this.formBuilder.group({
    PowerLimit: 10000,
    LeakageLimit: 0.02,
    TemperatureLimit: 100,
    EnergyLimit: 70,
    TopUpLimit: 100,
    EmailNotification: '',
    Name: '',
    Brand: '',
    Type: '',
    Energy: '',
    Capacity: 0,
    Id_Meter: '',
    topupnum: '',
    AutoTopup: '',
    carlist: ''
  });

  public FormQr = this.formBuilder.group({code:''})

  public audioOn = new Audio('assets/sound/on.mp3');
  public audioOff = new Audio('assets/sound/off.mp3')
  public setCar: string
  disableConfirmButton: boolean;

  constructor(
    private _translateService: TranslocoService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _lookupService: LookupService,
    private _formDialogService: FormDialogService,
    private formBuilder: FormBuilder,
    private _stationService: StationService,
    private _toastService: ToastService,
    private _awsService: AwsService,
    private _matDialog: MatDialog,
    private _cookieService: CookieService,
    private _shareService: ShareService,
    private http: HttpClient
  ) { }

  async ngOnInit(): Promise<void> {
    console.log('item',this.item)
    this.assignedCar = this.item.type;
    this.assignedCarBrand = this.item.brand;
    this.checkImageExistence(this.assignedCarBrand, this.assignedCar)
    this._translateService.langChanges$.subscribe((activeLang) => {
      this.activeLang = activeLang;
      this._changeDetectorRef.markForCheck();
    });
    this._PowerChartData(this.item.power);
    this._TemperChartData(this.item.temperature);
    this.websocket();
    setInterval(() => {
      this.numheartbeat--;
      this.wsInterval--;
      // this.item.status !== 'Inactive' && this.numheartbeat <= -5 && (this.item.status = 'Inactive')
      this._changeDetectorRef.markForCheck();
    }, 1005)
    if (this.item.status === 'Charging') {
      let energyChargeCookies = this._cookieService.get(this.item.customer_id + 'energyCharging')
      energyChargeCookies && (this.energyCharging = parseFloat(energyChargeCookies))
      energyChargeCookies && this.startCounting()
    }
    // this.startCounting();

    this._changeDetectorRef.markForCheck();
  }

  public wsStep = 0
  public websocket() {
    this.item.active && (this.ws = this._lookupService.webSocket(this.item.customer_id).pipe(
      share(),
      retry({ delay: 1500 }),
      repeat({ delay: 1500 })
    ).subscribe((a: any) => {
      this.cdNum(30);
      let date = DateTime.fromISO(a.time, { zone: 'utc' });
      if(a.alarm){
        this.alarm = a.alarm
        this._cookieService.set('alarm',a.alarm)
      }
      if(a.enbyte){
        this.enbyte = a.enbyte
        this._cookieService.set('enbyte',a.enbyte)
      }
      if(a.signal){
        this.signal = a.signal
      }
      if (a.topup) {
        if (a.topup === "success") {
          this.wsStep = 2
          this._toastService.success(this.activeLang === 'en'?`Evgate ${a.customerid} topup success with ${a.topup_energy} kWh`:`Evgate ${a.customerid} sukses topup ${a.topup_energy} kWh`)
          this.kwh_meter = `${parseFloat(`${a.last_credit}`)}`
        }else {
          this._toastService.error(this.activeLang === 'en'?`Evgate ${a.customerid} failed to topup`:`Evgate ${a.customerid} gagal topup`)
        }
      }
      if (a.active) {
        this.item.status === 'Inactive' && this.audioOn.play();
        if (a.power !== undefined && (a.power * 1000) >= 1000) {
          this.item.status = 'Charging'
        } else {
          if (this.item.power.length > 0) {
            (this.item.status = 'Active');
          }
        }
        this._changeDetectorRef.markForCheck();
      } else if (!a.topup) {
        (this.item.status !== 'Inactive') && this.audioOff.play();
        (this.item.status !== 'Inactive') && (this.item.status = 'Inactive')
        this.wsInterval = 30
        this._changeDetectorRef.markForCheck();
      }
      if (a.frequency) {
        if (a.energy !== undefined) {
          this.energyCharging = a.energy
          this.startCounting()
          this.item.status === 'Charging' ? this._shareService.setCoockies(this.item.customer_id + 'energyCharging', `${this.energyCharging}`) : this._cookieService.delete(this.item.customer_id + 'energyCharging')
        }
        if (a.phase_terminal_temperature !== undefined && a.phase_terminal_temperature !== null) {
          this.updateDataGraphWs('temperature', a.phase_terminal_temperature, date, this.item?.temperature_limit);
        }
        if (a.power !== undefined && a.power !== null) {
          this.updateDataGraphWs('power', a.power * 1000, date, this.item?.power_limit);
        }
        if (a.leakage_current_value !== undefined && a.leakage_current_value !== null) {
          this.updateDataGraphWs('leakage_current_value', a.leakage_current_value, date, this.item?.leakage_current_limit, 'leakage_current_value');
        }
        if (this.wsStep <= 0) {
          this.kwh_meter = a.kwh_meter
          console.log(this.kwh_meter)
          this.wsStep === 0
        } else {
          this.wsStep --
        }
      }
      this._changeDetectorRef.markForCheck();
    },
    (error: any) => {
      console.error('WebSocket error:', error);
      // Handle error or take appropriate action
    }
    ));
  }

  checkImageExistence(carBrand, carName) {

    if (carBrand && carName !== null) {
      let carimg = '../../../../../assets/images/MobilEV/' + carBrand.toLowerCase() + '/' + carName.replace(/\s+/g, '').toLowerCase() + '.png'
      this.http.head(carimg).subscribe(
        () => {
          this.pathImg = carimg
          this._changeDetectorRef.detectChanges();
        },
        () => {
          this.pathImg = '../../../../../assets/images/MobilEV/null.png'
          this._changeDetectorRef.detectChanges();
        })
    }
    else {
      this.pathImg = '../../../../../assets/images/MobilEV/' + null + '/' + null + '.png'
      this._changeDetectorRef.detectChanges();
    }
    return this.pathImg
  }

  startCounting() {
    let count = 0;
    if (this.item.capacity !== null) {
      (this.energyCharging / this.item.capacity) > 1 ? (count = 100) : (count = (this.energyCharging / this.item.capacity) * 100);
    } else if (this.item.energy_limit !== null) {
      (this.energyCharging / this.item.energy_limit) > 1 ? (count = 100) : (count = (this.energyCharging / this.item.energy_limit) * 100);
    } else {
      count = 99
    }
    this.switchWidth = count;
    this.chargePercentage = count
    count < 5 ? (this.switchBg = '#ff3a3a') : count < 10 ?
      (this.switchBg = '#ff573a') : count < 15 ?
        (this.switchBg = '#ff783a') : count < 20 ?
          (this.switchBg = '#ffde3a') : count < 25 ?
            (this.switchBg = '#efff3a') : count < 30 ?
              (this.switchBg = '#e8ff3a') : count < 35 ?
                (this.switchBg = '#e8ff3a') : count < 40 ?
                  (this.switchBg = '#d1ff3a') : count < 45 ?
                    (this.switchBg = '#baff3a') : count < 50 ?
                      (this.switchBg = '#a0ff3a') : count < 55 ?
                        (this.switchBg = '#78ff3a') : count < 60 ?
                          (this.switchBg = '#5eff3a') : count < 65 ?
                            (this.switchBg = '#47ff3a') : count < 70 ?
                              (this.switchBg = '#40ff3a') : count < 75 ?
                                (this.switchBg = '#3aff47') : count < 80 ?
                                  (this.switchBg = '#2bfe3a') : count < 85 ?
                                    (this.switchBg = '#24ff49') : count < 80 ?
                                      (this.switchBg = '#19ff40') : count < 95 ?
                                        (this.switchBg = '#13ff62') : count < 90 ?
                                          (this.switchBg = '#00ff55') : (this.switchBg = '#3aff3a');
    this._changeDetectorRef.markForCheck();
  }

  public clickUpdateData() {
    this.updateData.emit();
    if (this.item.active === false) {
      this.ws?.unsubscribe();
    }
    else if (this.item.active === true) {
      this.cdNum(30)
      this.websocket();
    }
  }

  ngOnDestroy(): void {
    if (this.ws) {
      this.ws.unsubscribe();
    }
  }


  public generateQRCode(values:any){
    console.log(values, 'vall')
    this.FormQr.value.code = values
    this._formDialogService.open({
        title: `QR Code`,
        message: ``,
        icon: {
            show: true,
            name: 'heroicons_outline:qrcode',
            color: 'primary',
        },
        actions: {
            confirm: {
                show: true,
                label: 'OK',
                color: 'primary',
            },
            cancel: {
                show: false,
                label: 'Cancel'
                },
        },
        form: ['code'],
        formValue: this.FormQr,
        dismissible: true
    });
  }

  getChargePercentageWidth(): string {
    return `${this.chargePercentage}%`;
  }

  public updateDataGraphWs(title, a, date, limit?: number, title2?: string) {
    if (title === 'power' && this.item[title].length > 0 && this.item[title][this.item[title].length - 1].y > 1000 && a < 70) {
      this._toastService.info((this.activeLang == "en" ? `Charger ${this.item.name} is stop charging` : `Charger ${this.item.name} berhenti mengisi daya`));
    }
    this.item[title].push({
      x: date,
      y: a
    });
    this.item[title2 || title].length > 10 && this.item[title2 || title].shift();
    title === 'power' ? this._PowerChartData(this.item[title]) : title === 'temperature' ? this._TemperChartData(this.item[title]) : '';
    this._changeDetectorRef.markForCheck();
  }

  public createDialog(title, message, iconname, iconcolor, form, formvalue, remove?, option?, option2?) {
    this.Form.value.PowerLimit = this.item?.power_limit;
    this.Form.value.LeakageLimit = this.item?.leakage_current_limit;
    this.Form.value.TemperatureLimit = this.item?.temperature_limit;
    this.Form.value.EnergyLimit = this.item?.energy_limit;
    this.Form.value.TopUpLimit = this.item?.topUp_limit;
    this.Form.value.EmailNotification = this.item?.email;
    this.Form.value.Name = this.item.name;
    this.Form.value.Brand = this.item.brand;
    this.Form.value.Type = this.item.type;
    this.Form.value.Id_Meter = this.item.id_meter;
    this.Form.value.carlist = this.item.car_id
    return this._formDialogService.open({
      title: title,
      message: message,
      icon: { show: true, name: iconname, color: iconcolor},
      actions: {
        confirm: { show: true, label: this.activeLang ? 'Apply' : 'Terapkan', color: 'primary' },
      },
      form: form,
      formValue: formvalue,
      remove: remove,
      option: option,
      option2: option2,
      dismissible: true,
    });
  }

  public turnOnOff(turn: 'on' | 'off') {
    let title = `Turn ${turn} Charger`;
    let msg =  `Are you sure you want to turn ${turn} this charger?`;
    const dialog = this.createDialog(title, msg, 'mat_outline:electrical_services', 'primary', undefined, 'confirmed');
    dialog.afterClosed().subscribe(async (result) => {
      if (result === 'confirmed') {
        if (this.item.power.length > 0) {
          this._stationService.turnOnOffCharger(this.item.customer_id, turn).subscribe((res) => {
            this._toastService.info( this.activeLang === 'en' ? `Success Turn ${turn} charger` : `Sukses ${turn === 'off' ? 'Matikan' : 'Nyalakan'} Charger`);
            this._changeDetectorRef.markForCheck();
          })
        } else {
          this._toastService.error(this.activeLang === 'en' ? `Can't Turn ${turn} charger, beacause this charger has a bad connectivity` : `Tidak bisa ${turn === 'off' ? 'matikan' : 'menghidupkan'} Charger, karena charger ini tidak memiliki koneksi internet yang baik`);
        }
      }
    })
  }

  public startCharging() {
    let title = `Start Charging`;
    let msg = `Are you sure you want to start charger?`;
    const dialog = this.createDialog(title, msg, 'mat_outline:electrical_services', 'primary', undefined, 'confirmed');
    dialog.afterClosed().subscribe(async (result) => {
      if (result === 'confirmed') {
        this._stationService.startCharging(this.item.customer_id).subscribe((res) => {
          this._toastService.info( this.activeLang === 'en' ? `Success start charging` : `Sukses memulai pengecasan`);
          this._changeDetectorRef.markForCheck();
        })
      }
    })
  }

  public async editLeakage() {
    let title =  `Set Leakage Limit` ;
    let msg = `Fill in the field of form to edit your leakage limit safety, Fill in units of Amperes (A)` ;
    const dialog = this.createDialog(title, msg, 'feather:zap-off', 'primary', ['Leakage*Limit'], this.Form, this.item.leakage_current_limit !== null);
    dialog.afterClosed().subscribe(async (result) => {
      if (result && result !== 'cancelled') {
        if (result.remove === true) {
          this._stationService.updateEvgate(this.item.customer_id, 'leakage', null).subscribe(res => {
            this.item.leakage_current_limit = null
            this._toastService.success((this.activeLang == "en" ? `Charger ${this.item.name} success update leakage limit` : `Charger ${this.item.name} sukses mengubah batas kebocoran`));
            this._changeDetectorRef.markForCheck();
          }
          )
        }
        else {
          this._stationService.updateEvgate(this.item.customer_id, 'leakage', parseFloat(`${result.value.LeakageLimit}`)).subscribe(res => {
            this.item.leakage_current_limit = result.value.LeakageLimit
            this._toastService.info((this.activeLang == "en" ? `Charger ${this.item.name} success update leakage limit` : `Charger ${this.item.name} sukses mengubah batas kebocoran`));            this._changeDetectorRef.markForCheck();
          }
          )
        }
      }
    });
  }

  public async addAutoTopup() {
    let title = `Add Auto Top Up Token`;
    let msg =  `Fill in the field of form to add your auto top up token`;
    const dialog = this.createDialog(title, msg, 'mat_outline:add_box', 'primary', ['AutoTopup', 'Energy'], this.Form);
    dialog.afterClosed().subscribe(async (result) => {
      if (result && result !== 'cancelled') {
          this._lookupService.AddAutoTopUp(this.item.id_meter, 'autotopup', result.value.AutoTopup, result.value.Energy).subscribe(res => {
            this.Form.value.AutoTopup = null
            this._toastService.info(( this.activeLang === 'en'?`Charger ${this.item.name} success add auto top up token`:`Charger ${this.item.name} berhasil menambahkan token auto top up`));
            this._changeDetectorRef.markForCheck();
          }, err => {
            this._toastService.error((  this.activeLang === 'en'?`Charger ${this.item.name} error add auto top up token`:`Charger ${this.item.name} gagal menambahkan token auto top up`));
          }
          )
        }

    });
  }


  public async editEnergy() {
    let title = `Set Energy Charging Limit`;
    let msg = `Fill in the field of form to edit your energy on charging limit, Fill in units of kWh`;
    const dialog = this.createDialog(title, msg, 'mat_outline:offline_bolt', 'primary', ['Energy*Limit'], this.Form, this.item.energy_limit !== null);
    dialog.afterClosed().subscribe(async (result) => {
      if (result && result !== 'cancelled') {
        if (result.remove === true) {
          result && result !== 'cancelled' && this._stationService.updateEvgate(this.item.customer_id, 'energy', null).subscribe(res => {
            this.item.energy_limit = null
            this._toastService.info((this.activeLang == "en" ? `Charger ${this.item.name} success update energy limit` : `Charger ${this.item.name} sukses mengubah batas energi`));            this._changeDetectorRef.markForCheck();
          }
          )
        }
        else {
          this._stationService.updateEvgate(this.item.customer_id, 'energy', parseFloat(`${result.value.EnergyLimit}`)).subscribe(res => {
            this.item.energy_limit = result.value.EnergyLimit
            this._toastService.info((this.activeLang == "en" ? `Charger ${this.item.name} success update energy limit` : `Charger ${this.item.name} sukses mengubah batas energi`));            this._changeDetectorRef.markForCheck();
          }, err => {
            this._toastService.error(err);
          }
          )
        }
      }
    });
  }

  public async editName() {
    let title = `Edit Name` ;
    let msg = `Fill in the field of form to edit your station name`;
    const dialog = this.createDialog(title, msg, 'drive_file_rename_outline', 'primary', ['Name'], this.Form);
    dialog.afterClosed().subscribe(async (result) => {
      result && result !== 'cancelled' && this._stationService.updateEvgate(this.item.customer_id, 'name', result.value.Name).subscribe(res => {
        this.item.name = result.value.Name;
        this.updateDataEv.emit(JSON.stringify({ ...result.value, id: this.item.customer_id }));
        this._changeDetectorRef.markForCheck();
      }
      )
    });
  }

  public async assignCarEV() {
    let title =  `Register EV Car` ;
    let msg =  `Fill in the field of form to register your EV car`;
    const dialog = this.createDialog(title, msg, 'directions_car', 'primary', ['carlist'], this.Form, this.item.type !== null && this.item.brand !== null, this.car, this.car)
    dialog.afterClosed().subscribe(async (result) => {
      if (result !== 'cancelled' && result) {
        if (result.remove === true) {
          this._stationService.updateEvgate(this.item.customer_id, 'car_id', null).subscribe(res => {
            this.assignedCarBrand = null;
            this.assignedCar = null;
            this.item.brand = null
            this.item.type = null
            this.item.car_id = null
            this._changeDetectorRef.markForCheck();
            this._toastService.success((this.activeLang == "en" ? `EV car has been successfully removed` : `Mobil ev telah berhasil dihapus`));          }, err => this._toastService.error(err));
        } else {
          this._stationService.updateEvgate(this.item.customer_id, 'car_id', result.value.carlist).subscribe(res => {
            const selectedCarId = result.value.carlist;
            const selectedCar = this.car.find(car => car.car_id === selectedCarId);
            this.assignedCarBrand = selectedCar.brand;
            this.assignedCar = selectedCar.type;
            this.item.brand = selectedCar.brand;
            this.item.type = selectedCar.type;
            this.item.car_id = selectedCarId
            this.checkImageExistence(this.assignedCarBrand, this.assignedCar)
            this._changeDetectorRef.markForCheck();
            this._toastService.success((this.activeLang == "en" ? `EV car has been successfully set` : `Mobil ev telah berhasil diset`));          }, err => this._toastService.error(err));
        }
      }
    });

  }


  public async editPower() {
    let title = `Set Power Limit`;
    let msg =  `Fill in the field of form to edit your power limit safety, Fill in units of Watt (W)`;
    const dialog = this.createDialog(title, msg, 'mat_outline:electrical_services', 'primary', ['Power*Limit'], this.Form, this.item.power_limit !== null);
    dialog.afterClosed().subscribe(async (result) => {
      if (result && result !== 'cancelled') {
        if (result.remove === true) {
          this._stationService.updateEvgate(this.item.customer_id, 'power', null).subscribe(
            res => {
              this.item.power_limit = null
              this._toastService.info((this.activeLang == "en" ? `Charger ${this.item.name} success update power limit` : `Charger ${this.item.name} sukses mengubah batas daya`));              this._changeDetectorRef.markForCheck();
            }
          )
        }
        else {
          this._stationService.updateEvgate(this.item.customer_id, 'power', parseFloat(`${result.value.PowerLimit}`)).subscribe(
            res => {
              this._toastService.info((this.activeLang == "en" ? `Charger ${this.item.name} success update power limit` : `Charger ${this.item.name} sukses mengubah batas daya`));
              this.item.power_limit = result.value.PowerLimit;
              this._PowerChartData(this.item.power);
              this._changeDetectorRef.markForCheck();              this.item.power_limit = result.value.PowerLimit;
              this._PowerChartData(this.item.power);
              this._changeDetectorRef.markForCheck();
            }
          )
        }
      }
    });
  }

  public async editTemperature() {
    let title = `Set Temperature Limit` ;
    let msg =`Fill in the form to change your temperature safety limits, Fill in Celsius (C)`;
    const dialog = this.createDialog(title, msg, 'mat_outline:device_thermostat', 'primary', ['Temperature*Limit'], this.Form, this.item.temperature_limit !== null);
    dialog.afterClosed().subscribe(async (result) => {
      if (result && result !== 'cancelled') {
        if (result.remove === true) {
          this._stationService.updateEvgate(this.item.customer_id, 'temperature', null).subscribe(res => {
            this.item.temperature_limit = null
            this._toastService.info((this.activeLang == "en" ? `Charger ${this.item.name} success update temperature limit` : `Charger ${this.item.name} sukses mengubah batas suhu`));            this._changeDetectorRef.markForCheck();
          }
          )
        }
        else {
          this._stationService.updateEvgate(this.item.customer_id, 'temperature', parseFloat(`${result.value.TemperatureLimit}`)).subscribe(res => {
            this._toastService.info((this.activeLang == "en" ? `Charger ${this.item.name} success update temperature limit` : `Charger ${this.item.name} sukses mengubah batas suhu`));            this.item.temperature_limit = result.value.TemperatureLimit;
            this._TemperChartData(this.item.temperature);
            this._changeDetectorRef.markForCheck();
          }
          )
        }
      }
    })
  }

  public async editMailNotif() {
    let title = `Set Email Notification`;
    let msg =  `Fill in the email delivery target for notification and details of this charger transaction when charger stop charging.`;
    const dialog = this.createDialog(title, msg, 'mat_outline:mark_email_unread', 'primary', ['Email*Notification'], this.Form, this.item.email !== null);
    dialog.afterClosed().subscribe(async (result) => {
      if (result && result !== 'cancelled') {
        if (result.remove === true) {
          this._stationService.updateEvgate(this.item.customer_id, 'email', null).subscribe(res => {
            this.item.email = null
            this._toastService.info((this.activeLang == "en" ? `Charger ${this.item.name} success update email notification` : `Charger ${this.item.name} sukses mengubah notifikasi email`));            this._changeDetectorRef.markForCheck();
          }
          )
        }
        else {
          this._stationService.updateEvgate(this.item.customer_id, 'email', result.value.EmailNotification).subscribe(res => {
            this.item.email = result.value.EmailNotification
            this._toastService.info((this.activeLang == "en" ? `Charger ${this.item.name} success update email notification` : `Charger ${this.item.name} sukses mengubah notifikasi email`));            this._changeDetectorRef.markForCheck();
          }
          )
        }
      }
    })
  }

  public async topUpNumber() {
    let title =  `Top Up Token` ;
    let msg =  `Fill in the form to top up your electricity.` ;
    const dialog = this.createDialog(title, msg, 'mat_outline:pin', 'primary', ['topupnum'], this.Form);
    dialog.afterClosed().subscribe(async (result) => {
      if (result && result !== 'cancelled') {
        this._lookupService.remoteTopUp(this.item.customer_id, result.value.topupnum).subscribe(res => {
          console.log(result.value.topupnum)
          this._toastService.info((this.activeLang == "en" ? `Charger ${this.item.name} Send Top Up Electric` : `Charger ${this.item.name} Mengirim Isi Listrik`));         
           this._changeDetectorRef.markForCheck();
        }
        )
      }
    })
  }

  public async setCustomerId() {
    let title = `Calibrate ID Meter`;
    let msg =  `Do you want to update your meter?`;
    const dialog = this.createDialog(title, msg, 'heroicons_outline:identification', 'primary', undefined, 'confirmed');
    dialog.afterClosed().subscribe(async (result) => {
      result === 'confirmed' && this._lookupService.getMeterID(this.item.customer_id).subscribe(res => {
        if (res === 'Please Refresh Again') {
        //   this.item.id_meter = res
        this._toastService.info((this.activeLang == "en" ? `Charger ${this.item.name} Send Top Up Electric` : `Charger ${this.item.name} Mengirim Isi Listrik`));          this._changeDetectorRef.markForCheck();
        }
        else {
          this.item.id_meter = res
          this._toastService.info((this.activeLang == "en" ? `Charger ${this.item.name} Send Top Up Electric` : `Charger ${this.item.name} Mengirim Isi Listrik`));          this._changeDetectorRef.markForCheck();
        }
      }
      )
    })
  }

  public resetLimit() {
    let title = `Reset Limit`;
    let msg =  `Are you sure you want to reset the limit this charger?` ;
    const dialog = this.createDialog(title, msg, 'mat_outline:electrical_services', 'primary', undefined, 'confirmed');
    dialog.afterClosed().subscribe(async (result) => {
      result === 'confirmed' && this._stationService.updateEvgate(this.item.customer_id, 'reset', true).subscribe(res => {
        this.item.power_limit = null;
        this.item.temperature_limit = null;
        this.item.leakage_current_limit = null;
        this.Form.value.PowerLimit = null;
        this.Form.value.TemperatureLimit = null;
        this.Form.value.LeakageLimit = null;
        this._toastService.info((this.activeLang == "en" ? `Charger ${this.item.name} Send Top Up Electric` : `Charger ${this.item.name} Mengirim Isi Listrik`));        this._changeDetectorRef.markForCheck();
      }
      )
    })
  }

  private async _PowerChartData(data: power[]): Promise<void> {
    let default_limit = JSON.parse(this.auth.default_limit)
    let colors = ['#34D399'];
    (this.item?.power_limit === null) ?
      (this.item.power.length !== 0 && this.item.power.length && this.item.power[this.item.power.length - 1].y <= default_limit.power ? colors = ['#34D399'] : colors = ['#FB7185'])
      : (this.item.power.length !== 0 && this.item.power.length && this.item.power[this.item.power.length - 1].y <= this.item?.power_limit ? colors = ['#34D399'] : colors = ['#FB7185'])

    let series = [{
      'name': 'Power',
      'data': data
    }]
    this.powerChart = this._shareService.createGraph(series, 'W', this.activeLang, true, true, colors)
    this._changeDetectorRef.markForCheck();
  }

  private async _TemperChartData(data: temperature[]): Promise<void> {
    let default_limit = JSON.parse(this.auth.default_limit)
    let colors = ['#34D399'];
    this.item?.temperature_limit === null ?
      (this.item.temperature.length !== 0 && this.item.temperature.length && this.item.temperature[this.item.temperature.length - 1].y <= default_limit.temperature ? colors = ['#34D399'] : colors = ['#FB7185'])
      : (this.item.temperature.length !== 0 && this.item.temperature.length && this.item.temperature[this.item.temperature.length - 1].y <= this.item?.temperature_limit ? colors = ['#34D399'] : colors = ['#FB7185'])
    let series = [{
      'name': 'Temperature',
      'data': data
    }]
    this.temperChart = this._shareService.createGraph(series, 'C', this.activeLang , true, true, colors);
    this._changeDetectorRef.markForCheck();
  }

  formatNumberWithLocale(numberValue: number, decimal?: number): string {
    return this._awsService.formatNumberWithLocale(this.activeLang, numberValue, decimal);
  }

  cdNum(num) {
    if (this.numheartbeat >= - 10 && this.item.leakage_current_value.length > 0) {
      let int = setInterval(() => {
        this.numheartbeat += 1
        if (this.numheartbeat >= num) { clearInterval(int) }
        this._changeDetectorRef.markForCheck();
      }, 50)
    } else {
      this.numheartbeat = 30;
      this._changeDetectorRef.markForCheck();
    }

  }

  getRotateClass(item: number): string {
    return 'rotate-' + item;
  }

  public clickDetail(id) {
    const dialogRef = this._matDialog.open(AlarmEnbyteDetailDialogComponent, {
      width: '100%',
      data: { id }
    });

    dialogRef.afterClosed().subscribe(result => {
      // Handle the result if needed
    });
  }
}
