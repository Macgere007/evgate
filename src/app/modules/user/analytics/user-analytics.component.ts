import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation, Inject, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApexOptions } from 'ng-apexcharts';

import { MatMenuTrigger } from '@angular/material/menu';
import { TranslocoService } from '@ngneat/transloco';
import { LookupService } from 'app/core/service/lookup.service';
import { Power } from 'app/core/solar/power.types';
import { Energy } from 'app/core/solar/energy.types';
import { Temperature } from 'app/core/solar/temp.types';
import { power_factor } from 'app/core/solar/powerfactor.types';
import { leakage } from 'app/core/solar/leakage.types';
import { over_current } from 'app/core/solar/over_current.types';
import { total_harmonic_of_current } from 'app/core/solar/thdi.types';
import { current } from 'app/core/solar/current.types';
import { voltage } from 'app/core/solar/voltage.types';
import { breaker } from 'app/core/solar/breaker.types';
import { CookieService } from 'ngx-cookie-service';
import { StationService } from 'app/core/service/station.service';
import { AuthService } from 'app/core/auth/auth.service';
import { DateTime } from 'luxon';
import { IDataAnalitic } from 'app/core/solar/data-analitic.types';
import { UserAnalyticsService } from './user-analytics.service';
import { Subscription, repeat, retry, share } from 'rxjs';
import moment from 'moment';
import { AwsService } from 'app/core/service/aws.service';
import { ShareService } from 'app/core/service/shere.service';

@Component({
  selector: 'user-analytics',
  templateUrl: './user-analytics.component.html',
  styleUrls: ['./user-analytics.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserAnalyticsComponent implements OnInit, OnDestroy {
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  public isloading: boolean = false
  public isloadingdash: boolean = false
  public isloadingGraph: boolean = true
  public activeLang: string;
  public clientID: any;

  public chartPower: ApexOptions;
  public chartTemp: ApexOptions;
  public chartEnergy: ApexOptions;
  public chartCurrent: ApexOptions;
  public chartPowerFactor: ApexOptions;
  public chartVoltage: ApexOptions;
  public chartLeakage: ApexOptions;
  public chartTotalHarmonic: ApexOptions;
  public chartOverload: ApexOptions;
  public chartReactiveActiveEnergy: ApexOptions;
  public breaker: breaker;
  public breaker_open: Number = 0;
  public main_frequency: string = '0';
  public status_breaker = true;
  public status_connectivity: string = '';
  public startTime: Date;
  public stopTime: Date;
  public time_interval_type: boolean = true
  public interval_show: string = 'Now'
  public power?: Power;
  public temp?: Temperature;
  public powerfactor?: power_factor;
  public leakage?: leakage;
  public overload?: over_current;
  public thdi?: total_harmonic_of_current;
  public energy?: Energy;
  public current?: current;
  public voltage?: voltage;
  public active: string = '';
  public clientIdActive: string = '';
  public interval = '30m'
  public stationClientID = []
  public datePickerInstant = this._userAnalyticsService.getDatePickerInstant()
  dataAll: IDataAnalitic = {};
  public count_connectivity = 35
  public realtime: boolean = false
  public nameTime: string = ''
  public authCheck = this._authService.currentUserReal
  public modeColor
  DateActiveStartMonthLabel: string;
  DateActiveStartLabel: string;
  DateActiveStopLabel: string
  public labelGraphCol = 'black'
  public ws: Subscription
  
  /**
   * Constructor
   */

  constructor(
    private _router: Router,
    private _translateService: TranslocoService,
    private _lookupService: LookupService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _stationService: StationService,
    private _authService: AuthService,
    private _userAnalyticsService: UserAnalyticsService,
    private _cookieService: CookieService,
    private _route: ActivatedRoute,
    private _awsService: AwsService,
    private _shareService: ShareService
  ) {
  }
  ngOnDestroy(): void {
    this.ws?.unsubscribe()
  }


  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */

  async ngOnInit(): Promise<void> {
    this._awsService.getScheme().subscribe(res => {
        res.scheme === 'dark' ? (this.labelGraphCol = 'white') : res.scheme === 'light' ? (this.labelGraphCol = 'black') : (this.labelGraphCol = '#D3D3D3')
      })
    setTimeout(() => {
      this.isloadingdash = true
      this._changeDetectorRef.detectChanges();
    }, 1800);
 
    this.modeColor = JSON.parse(this.authCheck.config);
    this._translateService.langChanges$.subscribe((activeLang) => {
      this.activeLang = activeLang;
      this.setDateLabels()
      this.callGraph()
      this._changeDetectorRef.markForCheck();
    });
    this.getStation()
  }
  private setDateLabels(): void {
    this.DateActiveStartLabel = this.activeLang === "id" ? moment(this.startTime).locale("id").format("DD MMMM YYYY") : moment(this.startTime).locale("en").format("MMMM DD, YYYY");
    this.DateActiveStopLabel = this.activeLang === "id" ? moment(this.stopTime).locale("id").format("DD MMMM YYYY") : moment(this.stopTime).locale("en").format("MMMM DD, YYYY");
    this._changeDetectorRef.markForCheck();
  }
  public checkConnectivity() {
    setInterval(() => {
      if (this.count_connectivity > 0) {
        this.count_connectivity --
        this._changeDetectorRef.markForCheck();
      }
      if (this.count_connectivity <= 0) {
        this.status_connectivity = 'Offline'
        this._changeDetectorRef.markForCheck();
      }
    }, 1000)
  }


  getStation() {
    this.startTime = new Date(new Date(Date.now()))
    this.stopTime = new Date(new Date(Date.now()))
    this.startTime.setHours(0, 0, 0, 0)
    this.startTime.setDate(this.startTime.getDate() - 6)
    if (this.authCheck.role !== 'admin') {
      this._stationService.getEvgate(this.authCheck.id).subscribe(
        getStation => {
          this.stationClientID = getStation
          if (getStation.length !== 0) {
            this.clientIdActive = getStation[0].id
            this.active = getStation[0].name
            this.checkConnectivity()
            if (this._cookieService.get('data')) {
              let data = JSON.parse(this._cookieService.get('data'))
              this.startTime = new Date(data.startTime)
              data.time_interval_type && (this.stopTime = new Date(data.stopTime))
              this.clientIdActive = data.id
              this.nameTime = data.nameTime
              this.interval = data.interval
              this.realtime = data.realtime,
              this.interval_show = data.interval_show,
              this.time_interval_type = data.time_interval_type
            }
            this.websocket(this.clientIdActive)
            this.getAllGraph(this.clientIdActive, this.startTime, this.stopTime)

          } else {
            this._router.navigate(['/not-assign']);
          }
        }
      )
    } else {
      let param = this._route.queryParams
      this.stationClientID = []
      param.subscribe((res) => {
        if (res.id) {
          this.clientIdActive = res.id
          this.active = res?.name
          this.websocket(this.clientIdActive)
          this.getAllGraph(this.clientIdActive, this.startTime, this.stopTime)
        } else {
          this._router.navigate(['/admin-dashboard']);
        }
      })
    }

  }

  public updateDataRealtime(arr, a, time) {

    // Menggunakan timeZoneName untuk mengatur zona waktu
    let date1 = DateTime.fromISO(time, {zone: 'utc'});
    arr.splice(0, 0, {
      x: date1,
      y: a
    })
    arr.pop()
  }

  public websocket(clientID) {
    this.ws = this._lookupService.webSocket(clientID).pipe(
      share(),
      retry({ delay: 1500 }),
      repeat({ delay: 1500 })
    ).subscribe(
      (msg: any) => {
        const a: any = msg;
        this.status_breaker === a.active
        this.status_connectivity = 'Online'
        this.count_connectivity = 35
        if (this.realtime) {
          if (a.phase_terminal_temperature !== undefined && this.dataAll?.power?.apparent_power !== undefined) {
            this.updateDataRealtime(this.dataAll.temp.phase_terminal_temperature, a['phase_terminal_temperature'], a.time)
            this.updateDataRealtime(this.dataAll.temp.terminal_temperature_n, a['terminal_temperature_n'], a.time)
            this.updateDataRealtime(this.dataAll.temp.MCU_temperature, a['MCU_temperature'], a.time)
            this.updateDataRealtime(this.dataAll.power.reactive_power, a['reactive_power'], a.time)
            this.updateDataRealtime(this.dataAll.power.apparent_power, a['apparent_power'], a.time)
            this.updateDataRealtime(this.dataAll.power.power, a['power'], a.time)
            this.updateDataRealtime(this.dataAll.curr.current, a['current'], a.time)
            this.updateDataRealtime(this.dataAll.leak.leakage_current_value, a['leakage_current_value'], a.time)
            // this.updateDataRealtime(this.dataAll.leak.leakage_event_current_value, a['leakage_event_current_value'], a.time)
            this.updateDataRealtime(this.dataAll.ocurr, a['over_current'], a.time)
            this.updateDataRealtime(this.dataAll.powerf, a['power_factor'], a.time)
            this.updateDataRealtime(this.dataAll.thdi, a['thdi'], a.time)
            this.updateDataRealtime(this.dataAll.volt.voltage, a['voltage'], a.time)
            if (this.dataAll.power.power_r) {
              this.updateDataRealtime(this.dataAll.power.power_r, a['power_r'], a.time)
              this.updateDataRealtime(this.dataAll.power.power_s, a['power_s'], a.time)
              this.updateDataRealtime(this.dataAll.power.power_t, a['power_t'], a.time)
              this.updateDataRealtime(this.dataAll.temp.phase_terminal_temperature2, a['phase_terminal_temperature2'], a.time)
              this.updateDataRealtime(this.dataAll.temp.phase_terminal_temperature3, a['phase_terminal_temperature3'], a.time)
              this.updateDataRealtime(this.dataAll.curr.current2, a['current2'], a.time)
              this.updateDataRealtime(this.dataAll.curr.current3, a['current3'], a.time)
              this.updateDataRealtime(this.dataAll.curr.current_n, a['current_n'], a.time)
              this.updateDataRealtime(this.dataAll.volt.voltage2, a['voltage2'], a.time)
              this.updateDataRealtime(this.dataAll.volt.voltage3, a['voltage3'], a.time)
            }
            // this.updateDataRealtime(this.dataAll.energyAcRe.active_energy, a['energy'] - this.dataAll.energyAcRe.min, a.time)
            let energy_ev = 0
            if (this.dataAll.ev_energy.length > 0) {
              if (a['energy'] > 0.01) {
                energy_ev = a['energy']
              } else {
                energy_ev = null
              }
              let date: DateTime = DateTime.fromISO(a.time, {zone: 'utc'});
              this.dataAll.ev_energy.push({
                x: date,
                y: energy_ev
              })
              this.dataAll.ev_energy.slice()
              // this.updateDataRealtime(this.dataAll.ev_energy, energy_ev, a.time)
              this._EnergyChartData(this.dataAll.ev_energy);
            }
            this.callGraph()
            // this._ActiveReactiveChartData(this.dataAll.energyAcRe)
          }
        }

        this._changeDetectorRef.markForCheck();
      },
    );
  }

  callGraph(){
    this._TempChartData(this.dataAll.temp)
    this._PowerChartData(this.dataAll.power)
    this._CurrentChartData(this.dataAll.curr)
    this._LeakageChartData(this.dataAll.leak)
    this._OverloadChartData(this.dataAll.ocurr)
    this._PowerFactorChartData(this.dataAll.powerf)
    this._ThdiChartData(this.dataAll.thdi)
    this._VoltageChartData(this.dataAll.volt)
  }

  formatNumberWithLocale(numberValue: number): string {
    return this._awsService.formatNumberWithLocale(this.activeLang, numberValue, 1);
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Track by function for ngFor loops
   *
   * @param index
   * @param item
   */
  trackByFn(index: number, item: any): any {
    return item.id || index;
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Fix the SVG fill references. This fix must be applied to all ApexCharts
   * charts in order to fix 'black color on gradient fills on certain browsers'
   * issue caused by the '<base>' tag.
   *
   * Fix based on https://gist.github.com/Kamshak/c84cdc175209d1a30f711abd6a81d472
   *
   * @param element
   * @private
   */

  public openDatepickerRange() {
    this.time_interval_type = true
    this.realtime = false
    // this.interval = '500s'
    // console.log(this.startTime, 'start')
    // console.log(this.stopTime, 'stop')
    // if (this.stopTime.getFullYear() - this.startTime.getFullYear() === 0 && this.stopTime.getMonth() - this.startTime.getMonth() === 0 && this.stopTime.getDate() - this.startTime.getDate() < 2) {
    //   this.interval = '30s'
    //   this.time_interval_type = false
    // }
    this.getInterval()
    this.nameTime = ''
    this.getAllGraph(this.clientIdActive, this.startTime, this.stopTime)
  }

  getInterval() {
    let range = (this.stopTime.getTime() - this.startTime.getTime())/1000
    if (range < 86400) {
      this.interval = `30s`
    } else {
      let jumlah_data = 400
      let interval = parseInt(`${range/jumlah_data}`)
      this.interval = `${interval}s`
    }
    console.log(this.interval)
  }

  public openDatepickerInstant(start: number, interval: string, name: string, realtime) {
    this.realtime = realtime
    this.startTime = new Date(Date.now() - start * 60000)
    this.nameTime = name
    this.interval_show = interval
    this.getInterval()
    this.stopTime = new Date()
    this.time_interval_type = false
    this.getAllGraph(this.clientIdActive, this.startTime, new Date(Date.now()))
  }

  public async updateData(clientID, name) {
    this.active = name
    this.ws?.unsubscribe()
    this.clientIdActive = clientID
    this.getAllGraph(this.clientIdActive, this.startTime, this.stopTime)
    this._changeDetectorRef.detectChanges();
    this.websocket(clientID)
  }

  //Button Change Data
  public getAllGraph(clientID, startTime, stopTime): void {
    this.isloadingGraph = true
    this.getEnergyGraph(clientID, startTime, stopTime)
    this.getPowerGraph(clientID, startTime, stopTime)
    this.getTempGraph(clientID, startTime, stopTime)
    this.getCurrentGraph(clientID, startTime, stopTime)
    this.getPowerFactorGraph(clientID, startTime, stopTime)
    this.getVoltageGraph(clientID, startTime, stopTime)
    this.getLeakageGraph(clientID, startTime, stopTime)
    this.getThdiGraph(clientID, startTime, stopTime)
    this.getOverCurrentGraph(clientID, startTime, stopTime)
    // this.getActiveReactiveGraph(clientID, startTime, stopTime)
    console.log('masuk')
    this.breakerData(clientID)
    this.setDateLabels()
    this._shareService.setCoockies('data', JSON.stringify({
      id: this.clientIdActive,
      interval: this.interval,
      startTime: this.startTime,
      stopTime: this.stopTime,
      nameTime: this.nameTime,
      realtime: this.realtime,
      interval_show: this.interval_show,
      time_interval_type: this.time_interval_type,
    }))
    this._changeDetectorRef.detectChanges();
  }

  public breakerData(clientID) {
    console.log('masuk b')
    this._lookupService.getBreaker(clientID).subscribe(
      (data) => {
        console.log(data, 'masuk c')
        if (data.main_frequency.length > 0) {
          this.main_frequency = (data.main_frequency[data.main_frequency.length - 1].y).toFixed(1)
          this.status_breaker = data?.breaker_status[data?.breaker_status.length - 1]?.y === 26 ? true : false
          this._changeDetectorRef.detectChanges();
        }
      }
    )
  }

  public getEnergyGraph(clientID, startTime, stopTime) {
    this._lookupService.getEnergyGraph(clientID, startTime, stopTime, this.interval).subscribe(
      (energy) => {
        !energy.length ? (energy[0] = {data: []}) : ''
        if (energy.length && energy[0]?.data.length > 0) {
          for (let j = 0; j < energy[0].data.length; j++) {
            if (energy[0]?.data[j].y === 0) {
              energy[0].data[j] = { ...energy[0].data[j], y: null }
            }
          }
        }
        this.dataAll.ev_energy = energy[0]?.data
        this._EnergyChartData(energy[0]?.data);
        this.isloadingGraph = false
        this._changeDetectorRef.detectChanges();
      },
      (err) => {
        this.isloadingGraph = false
      }
    )
  }

  // public getActiveReactiveGraph(clientID, startTime, stopTime) {
  //   this._lookupService.getActiveEnergyGraph(clientID, startTime, stopTime, this.interval).subscribe(
  //     (data) => {
  //       this.dataAll.energyAcRe = data
  //       this._ActiveReactiveChartData(data);
  //       this.isloadingGraph = false
  //       this._changeDetectorRef.detectChanges();
  //     },
  //     (err) => {
  //       this.isloadingGraph = false
  //     }
  //   )
  // }

  public getOverCurrentGraph(clientID, startTime, stopTime) {
    this._lookupService.getOverCurrentGraph(clientID, startTime, stopTime, this.interval).subscribe(
      (data) => {
        this.dataAll.ocurr = data.over_current
        this._OverloadChartData(data.over_current);
        this.isloadingGraph = false
        this._changeDetectorRef.detectChanges();
      },
      (err) => {
        this.isloadingGraph = false
      }
    )
  }

  public getThdiGraph(clientID, startTime, stopTime) {
    this._lookupService.getThdiGraph(clientID, startTime, stopTime, this.interval).subscribe(
      (data) => {
        this.dataAll.thdi = data.total_harmonic_of_current
        this._ThdiChartData(data.total_harmonic_of_current);
        this.isloadingGraph = false
        this._changeDetectorRef.detectChanges();
      },
      (err) => {
        this.isloadingGraph = false
      }
    )
  }

  public getVoltageGraph(clientID, startTime, stopTime) {
    this._lookupService.getVoltageGraph(clientID, startTime, stopTime, this.interval).subscribe(
      (data) => {
        this.dataAll.volt = data
        this._VoltageChartData(data);
        this.isloadingGraph = false
        this._changeDetectorRef.detectChanges();
      },
      (err) => {
        this.isloadingGraph = false
      }
    )
  }

  public getLeakageGraph(clientID, startTime, stopTime) {
    this._lookupService.getLeakageGraph(clientID, startTime, stopTime, this.interval).subscribe(
      (data) => {
        this.dataAll.leak = data
        this._LeakageChartData(data);
        this.isloadingGraph = false
        this._changeDetectorRef.detectChanges();
      },
      (err) => {
        this.isloadingGraph = false
      }
    )
  }

  public getPowerFactorGraph(clientID, startTime, stopTime) {
    this._lookupService.getPowerFactorGraph(clientID, startTime, stopTime, this.interval).subscribe(
      (data) => {
        for (let i of data.power_factor) {
          if (i.y > 1) {
            i.y = 1
          }
        }
        this.dataAll.powerf = data.power_factor
        this._PowerFactorChartData(data.power_factor);
        this.isloadingGraph = false
        this._changeDetectorRef.detectChanges();
      },
      (err) => {
        this.isloadingGraph = false
      }
    )
  }

  public getCurrentGraph(clientID, startTime, stopTime) {
    this._lookupService.getCurrentGraph(clientID, startTime, stopTime, this.interval).subscribe(
      (data) => {
        this.dataAll.curr = data
        this._CurrentChartData(data);
        this.isloadingGraph = false
        this._changeDetectorRef.detectChanges();
      },
      (err) => {
        this.isloadingGraph = false
      }
    )
  }

  public getTempGraph(clientID, startTime, stopTime) {
    this._lookupService.getTempGraph(clientID, startTime, stopTime, this.interval).subscribe(
      (data) => {
        this.dataAll.temp = { ...data }
        this._TempChartData(data);
        this.isloadingGraph = false
        this._changeDetectorRef.detectChanges();
      },
      (err) => {
        this.isloadingGraph = false
      }
    )
  }


  public getPowerGraph(clientID, startTime, stopTime) {
    this._lookupService.getPowerGraph(clientID, startTime, stopTime, this.interval).subscribe(
      (data) => {
        this.dataAll.power = data
        this._PowerChartData(data);
        this.isloadingGraph = false
        this._changeDetectorRef.detectChanges();
      },
      (err) => {
        this.isloadingGraph = false
      }
    )
  }

  private _VoltageChartData(voltage: any): void {
    let voltageChart: any = {
      series: {
        'daily':[
          {
            name: this.activeLang === 'en' ? 'Voltage' : 'Tegangan',
            data: voltage?.voltage
          }
        ]
      }
    }

    if (voltage?.voltage2) {
      voltageChart.series.daily[0].name = ' R'
      voltageChart.series.daily.push({
        name: this.activeLang === 'en' ? 'S' : 'S',
        data: voltage.voltage2
      })
      voltageChart.series.daily.push({
        name: this.activeLang === 'en' ? 'T' : 'T',
        data: voltage.voltage3
      })
    }
    
    this.chartVoltage = this._shareService.createGraph(voltageChart.series, 'A', this.activeLang, false, this.realtime)

    this._changeDetectorRef.markForCheck();
  }

  private _CurrentChartData(current: any): void {
    let currentChart: any = {
      series: {
        'daily':[
          {
            name: this.activeLang === 'en' ? 'Current' : 'Arus',
            data: current?.current
          }
        ]
      }
    }

    if (current?.current2) {
      currentChart.series.daily[0].name = ' R'
      currentChart.series.daily.push({
        name: this.activeLang === 'en' ? 'S' : 'S',
        data: current.current2
      })
      currentChart.series.daily.push({
        name: this.activeLang === 'en' ? 'T' : 'T',
        data: current.current3
      })
      currentChart.series.daily.push({
        name: this.activeLang === 'en' ? 'N' : 'N',
        data: current.current_n
      })
    }
    this.chartCurrent = this._shareService.createGraph(currentChart.series, 'A', this.activeLang, false, this.realtime)
    this._changeDetectorRef.markForCheck();
  }

  // private _ActiveReactiveChartData(energy: any): void {
  //   let name = this.activeLang === 'en' ? 'Energy' : 'Energi'
  //   let data = energy.active_energy
  //   let activeReactiveChart: any = {
  //     series: {
  //       'daily': [
  //         {
  //           name: name,
  //           data: data
  //         }
  //       ],
  //     }
  //   }
  //   this.createGraph('Energy', activeReactiveChart, 5,0,'#fffff',0,0)
  //   this._changeDetectorRef.markForCheck();
  // }

  private _PowerChartData(power: any): void {
    let powerChart: any = {
      series: {
        'daily': [
          {
            name: this.activeLang === 'en' ? 'Active (kW)' : 'Aktif (kW)',
            data: power?.power
          },
          {
            name: this.activeLang === 'en' ? 'Apparent (kVA)' : 'Nyata (kVA)',
            data: power?.apparent_power
          },

          {
            name: this.activeLang === 'en' ? 'Reactive (kVAR)' : 'Reaktif (kVAR)',
            data: power?.reactive_power
          },
        ],
      }
    }

    if (power?.power_r) {
      powerChart.series.daily[0].name = this.activeLang === 'en' ? 'Total' : 'Total'
      powerChart.series['daily'].splice(1,0,{
        name: 'T (kW)',
        data: power.power_t
      })
      powerChart.series['daily'].splice(1,0,{
        name: 'S (kW)',
        data: power.power_s
      })
      powerChart.series['daily'].splice(1,0,{
        name: 'R (kW)',
        data: power.power_r
      })
    }

    this.chartPower = this._shareService.createGraph(powerChart.series, '', this.activeLang, false, this.realtime)
    this._changeDetectorRef.markForCheck();
  }

  private _TempChartData(temp: Temperature): void {
    let tempChart: any = {
      series: {
        'daily': [
          {
            'name': this.activeLang === 'en' ? 'Phase' : 'Fasa',
            'data':temp?.phase_terminal_temperature
          },
          {
            'name': this.activeLang === 'en' ? 'Neutral' : 'Netral',
            'data': temp?.terminal_temperature_n
          },
          {
            'name': this.activeLang === 'en' ? 'MCU' : 'MCU',
            'data': temp?.MCU_temperature
          },
        ],
      }
    }
    
    if (temp?.phase_terminal_temperature2) {
      tempChart.series.daily[0].name = 'R'
      tempChart.series.daily[1].name = 'N'
      tempChart.series['daily'].splice(1,0,           {
        name: this.activeLang === 'id' ? 'T' : 'T',
        data: temp.phase_terminal_temperature3
      })
      tempChart.series['daily'].splice(1,0,           {
        name: this.activeLang === 'id' ? 'S' : 'S',
        data: temp.phase_terminal_temperature2
      })
    }

    this.chartTemp = this._shareService.createGraph(tempChart.series, 'C', this.activeLang, false, this.realtime)
    this._changeDetectorRef.markForCheck();
  }

  private _LeakageChartData(leakage: any) {
    let leakageChart: any = {
      series: {
        'daily': [
          // {
          //   'name': this.activeLang === 'en' ? 'event' : 'Kebocoran',
          //   'data': leakage.leakage_event_current_value,
          // },
          {
            'name': this.activeLang === 'en' ? 'leakage' : 'kebocoran',
            'data': leakage?.leakage_current_value,
          },
        ],
      }
    }

    this.chartLeakage = this._shareService.createGraph(leakageChart.series, 'A', this.activeLang, false, this.realtime)
    this._changeDetectorRef.markForCheck();
  }

  private _PowerFactorChartData(powerfactor: any): void {
    let powerFactorChart: any = {
      series: {
        'daily': [
          {
            'name': this.activeLang === 'en' ? 'Power Factor' : 'Faktor Daya',
            'data': powerfactor,
          },
        ],
      }
    }
    this.chartPowerFactor = this._shareService.createGraph(powerFactorChart.series, 'ƛ', this.activeLang, false, this.realtime,['#34D399'], 0,1, 'smooth',true)
    this._changeDetectorRef.markForCheck();
  }

  private _OverloadChartData(over_current: any): void {
    let overloadChart: any = {
      series: {
        'daily': [
          {
            'name': this.activeLang === 'en' ? 'Overload' : 'Kelebihan Muatan',
            'data': over_current,
          },
        ],
      }
    }
    this.chartOverload = this._shareService.createGraph(overloadChart.series, 'kW', this.activeLang, false, this.realtime)
    this._changeDetectorRef.markForCheck();
  }

  private _ThdiChartData(thdi: any): void {
    let thdiChart: any = {
      series: {
        'daily': [
          {
            'name': this.activeLang === 'en' ? 'Harmonic Distortion Current' : 'Arus Distorsi Harmonik',
            'data': thdi,
          },
        ],
      }
    }
    this.chartTotalHarmonic = this._shareService.createGraph(thdiChart.series, 'A', this.activeLang, false, this.realtime)
    this._changeDetectorRef.markForCheck();
  }

  private _EnergyChartData(energy: any): void {
    let energyChart: any = {
      series: {
        'daily': [{
          'name': this.activeLang === 'en' ? `Active Energy` : `Energi aktif`,
          'data': energy
        }]
      }
    }
    this.chartEnergy = this._shareService.createGraph(energyChart.series, 'kWh', this.activeLang, false, this.realtime,['#34D399'], null,null, 'straight')
    this._changeDetectorRef.markForCheck();
  }
}
