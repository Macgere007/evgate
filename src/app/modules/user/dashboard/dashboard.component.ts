import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation, } from '@angular/core';
import { AvailableLangs, TranslocoService } from '@ngneat/transloco';
import { ApexOptions } from 'ng-apexcharts';
import { dashboard, leakage_current_value, power, temperature } from 'app/core/solar/dashboard.types';
import { LookupService } from 'app/core/service/lookup.service';
import { energy, energy_active } from 'app/core/solar/energyactive.types';
import moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { StationService } from 'app/core/service/station.service';
import { AuthService } from 'app/core/auth/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { AwsService } from 'app/core/service/aws.service';
import { Subscription } from 'rxjs';
import { FormDialogService } from 'app/layout/form-dialog';
import { ShareService } from 'app/core/service/shere.service';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name'];
  public powerChart: ApexOptions[] = [];
  public temperChart: ApexOptions[] = [];
  public activeChart: ApexOptions;
  public dashboard?: dashboard[] = [];
  public power?: power;
  public temp?: temperature;
  public energy?: energy;
  public energy_active?: energy_active;
  public availableLangs: AvailableLangs;
  public activeLang: string;
  public isloadingGraph: boolean = true
  public activeDate: Date = new Date(Date.now())
  public ActiveType: "daily" | "weekly" | "monthly" = "weekly"
  public ActiveDate: Date = new Date(Date.now())
  public DateActiveLabelNow: string = moment(Date.now()).locale("id").format("MMMM DD, YYYY")
  public DateActiveWeekLabel: string = moment(Date.now()).locale("id").subtract(7, 'day').format("MMMM DD, YYYY")
  public DateActiveStartMonthLabel: string = moment(Date.now()).locale("id").startOf('month').format("MMMM DD, YYYY")
  public DateActiveEndMonthLabel: string = moment(Date.now()).locale("id").endOf('month').format("MMMM DD, YYYY")
  public ws: Subscription
  public numheartbeat = 30
  public labelGraphCol = 'white'

  public stationClientID = []
  public stationClientIDAll = []

  public authCheck: any = { role: 'operator' }
  public id = ''

  //pagination
  public sizePage = 3
  public CountOfData = 0
  public pageIndex = 0
    car: any;

  /**
   * Constructor
   */
  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _lookupService: LookupService,
    private _translateService: TranslocoService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _stationService: StationService,
    private _authService: AuthService,
    private _cookieService: CookieService,
    private _awsService: AwsService,
    private _shareService: ShareService
  ) { }

  async ngOnInit(): Promise<void> {
    this._translateService.langChanges$.subscribe((activeLang) => {
      // Get the active lang
      this.activeLang = activeLang;
      this.setDateLabels();
    });
    this._awsService.getScheme().subscribe(res => {
      res.scheme === 'dark' ? (this.labelGraphCol = 'white') : res.scheme === 'light' ? (this.labelGraphCol = 'white') : (this.labelGraphCol = '#D3D3D3')
    })
    this.getEvCar()
    setTimeout(() => {
      this._changeDetectorRef.detectChanges();
    }, 1000);
    let param = this._route.queryParams
    param.subscribe(async (res) => {
      this.authCheck = this._authService.currentUserReal
      this.id = (this._authService.currentUserReal.role === 'admin' ? res.site_id : this._authService.currentUserReal.id)
      const savedPageSize = this._cookieService.get('pageSize-'+ this.id);
      const savedPageIndex = this._cookieService.get('pageIndex-'+ this.id);
      if (savedPageSize) {
        this.sizePage = parseInt(savedPageSize, 10);
      }
      if (savedPageIndex) {
        this.pageIndex = parseInt(savedPageIndex, 10);
      }
      this.getStation(this.id)
    })
    this._changeDetectorRef.markForCheck();
  }

  getStation(site_id) {
    this._stationService.getEvgate(site_id).subscribe(
      getStation => {
        this.stationClientIDAll = getStation.sort((a, b) => b.active - a.active)
        this.stationClientID = [...this.stationClientIDAll.filter((item, index) => (index >= this.pageIndex * this.sizePage) && (index < (this.pageIndex + 1) * this.sizePage))]
        this.CountOfData = getStation.length
        if (this.stationClientID.length === 0) {
          if (this.authCheck.role !== 'admin') {
            this._router.navigate(['/not-assign']);
          } else {
            this._router.navigate(['/admin-dashboard']);
          }
        } else {
          this.getDashboardGraph()
          this.getActiveGraph()
        }
      }, err => {
        if (this.authCheck.role !== 'admin') {
          this._router.navigate(['/not-assign']);
        } else {
          this._router.navigate(['/admin-dashboard']);
        }
      }
    )
  }

  public changeDateActive(e) {
    const date = new Date(e)
    date.setHours(7)
    this.activeDate = new Date(e)
    this.DateActiveStartMonthLabel = moment.utc(date).locale((this.activeLang === 'en'?'en':'id')).startOf('month').format(this.activeLang === 'en' ? "MMMM DD, YYYY" : "DD MMMM YYYY")
    this.DateActiveEndMonthLabel = moment.utc(date).locale((this.activeLang === 'en'?'en':'id')).endOf('month').format(this.activeLang === 'en' ? "MMMM DD, YYYY" : "DD MMMM YYYY")
    this.DateActiveWeekLabel = moment.utc(date).locale((this.activeLang === 'en'?'en':'id')).subtract(6, 'days').format(this.activeLang === 'en' ? "MMMM DD, YYYY" : "DD MMMM YYYY")
    this.DateActiveLabelNow = moment.utc(date).locale((this.activeLang === 'en'?'en':'id')).format(this.activeLang === 'en' ? "MMMM DD, YYYY" : "DD MMMM YYYY")
    this.getActiveGraph()
  }

  public handleChangeActiveType(type: "daily" | "weekly" | "monthly") {
    this.ActiveType = type
    console.log(this.ActiveType)
    this.getActiveGraph()
  }

  public updateData(i) {
    this.isloadingGraph = true
    this._stationService.updateEvgate(this.stationClientID[i].id, 'active', !this.stationClientID[i].active).subscribe(
      res => {
        this.stationClientID[i].active = !this.stationClientID[i].active
        this.getActiveGraph()
        this.isloadingGraph = false
      }, err => {
        this.isloadingGraph = false
      }
    )
  }

  public updateDataEv(e) {
    let data = JSON.parse(e)
    this.stationClientID.filter(item => item.id === data.id)[0].name = data.Name
    this.stationClientID.filter(item => item.id === data.id)[0].active && this.getActiveGraph()
    // this.dashboard.filter(i => i.customer_id = data.id)[0][data.key] = data.value
  }

  public getActiveGraph() {
    let clientID = this.stationClientID.filter(item => item.active).map(item => item.id).join('%26')
    this.isloadingGraph = true
    if (!clientID || clientID === ''){
      this._ActiveChartData([], this.ActiveType, this.activeDate);
      this.isloadingGraph = false
      this._changeDetectorRef.detectChanges();
    } else {
      this._lookupService.getActiveGraph(this.activeDate, this.ActiveType, clientID).subscribe(
        (listing) => {
          if (this.ActiveType === 'daily' && listing[0]) {
            for (let item of listing[0]?.data) {
              if (item.y === 0) {
                item.y = null
              }
            }
          }
          //this.dashboard.map(item=> item.)
          this.energy_active = listing
          for (let i in this.energy_active) {
            let data = this.energy_active;
            let cust_id = this.dashboard.map(item => item.customer_id);
            if (cust_id.includes(data[i].client_id)) {
              let checkIndex = cust_id.indexOf(data[i].client_id);
              this.dashboard[checkIndex].total_energy = data[i]?.total_energy ? data[i].total_energy : 0
            }
          }
          this._ActiveChartData(listing, this.ActiveType, this.activeDate);
          this.isloadingGraph = false
          this._changeDetectorRef.detectChanges();
        },
        (err) => {
          this.isloadingGraph = false
        }
      )
    }
  }



  public getDashboardGraph() {
    let clientID = this.stationClientID.map(item => item.id).join('%26')
    this._lookupService.getDashboardGraph(clientID).subscribe(
      (list) => {
        this.dashboard = list;
        for (var item of this.dashboard) {
          item.name = this.stationClientID.filter(i => i.id === item.customer_id)[0].name
          item.active = this.stationClientID.filter(i => i.id === item.customer_id)[0].active
          item.leakage_current_limit = this.stationClientID.filter(i => i.id === item.customer_id)[0].leakage_limit
          item.id_meter = this.stationClientID.filter(i => i.id === item.customer_id)[0].id_meter
          item.alarm = this.stationClientID.filter(i => i.id === item.customer_id)[0].id_alarm
          item.enbyte = this.stationClientID.filter(i => i.id === item.customer_id)[0].id_enbtye
          item.power_limit = this.stationClientID.filter(i => i.id === item.customer_id)[0].power_limit
          item.temperature_limit = this.stationClientID.filter(i => i.id === item.customer_id)[0].temperature_limit
          item.energy_limit = this.stationClientID.filter(i => i.id === item.customer_id)[0]?.energy_limit
          item.topUp_limit = this.stationClientID.filter(i => i.id === item.customer_id)[0]?.topUp_limit
          item.AutoTopUp = this.stationClientID.filter(i => i.id === item.customer_id)[0]?.AutoTopUp
          item.email = this.stationClientID.filter(i => i.id === item.customer_id)[0].email
          item.car_id = this.stationClientID.filter(i => i.id === item.customer_id)[0].car_id
          item.brand = this.stationClientID.filter(i => i.id === item.customer_id)[0].brand
          item.type = this.stationClientID.filter(i => i.id === item.customer_id)[0].type
          item.capacity = this.stationClientID.filter(i => i.id === item.customer_id)[0].capacity
        }
        this.isloadingGraph = false
        this._changeDetectorRef.detectChanges();

      },
      (err) => {
        this.isloadingGraph = false
      }
    )
  }

  public getEvCar() {
    this._lookupService.getEvCar().subscribe(
      (carlist) => {
        this.car = carlist;
        this._changeDetectorRef.detectChanges();

      },
      (err) => {
      }
    )
  }

  generateRandomColorArray(length: number): string[] {
    const defaultColors = ['#34D399', '#63B3ED', '#FB7185', '#FFFF00'];
    const randomColors = [];

    if (length <= defaultColors.length) {
      return defaultColors.slice(0, length);
    }

    randomColors.push(...defaultColors);

    for (let i = defaultColors.length; i < length; i++) {
      let newColor: string;

      do {
        newColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
      } while (randomColors.includes(newColor));

      randomColors.push(newColor);
    }

    return randomColors;
  }

  private _ActiveChartData(energy_active: any, type: string, date: Date): void {
    let data_chart = []
    for (let i = 0; i < energy_active.length; i++) {
      data_chart.push({
        'name': this.stationClientID.filter(item => item.id === energy_active[i].client_id)[0].name,
        'data': energy_active[i].data
      })
    }

    const colors = this.generateRandomColorArray(data_chart.length);
    
    this.activeChart = this._shareService.createGraph(data_chart, 'kWh', this.activeLang, false, false, colors, 0, null, "straight", false, type === 'daily' ? 'area' : 'bar')
    //  = {
    //   chart: {
    //     foreColor: 'inherit',
    //     width:'100%',
    //     height: '100%',
    //     type: `${type == 'daily' ? 'area' : 'bar'}`,
    //     toolbar: {
    //       show: true,
    //       offsetY: 40,
    //       offsetX: 0,
    //       tools: {
    //         download: false,
    //         pan: true,
    //         reset: false
    //       }
    //     },
    //     zoom: {
    //       enabled: true
    //     }
    //   },
    //   plotOptions: {
    //     bar: {
    //       horizontal: false,
    //       columnWidth: '55%',
    //     },
    //   },
    //   colors: colors,
    //   dataLabels: {
    //     enabled: false,

    //   },
    //   fill: {
    //     colors: colors,
    //     gradient: {
    //       opacityFrom: 0.5,
    //       opacityTo: 0.5
    //     }
    //   },
    //   grid: {
    //     show: true,
    //     borderColor: 'rgba(192,192,192,0.2)',
    //     padding: {
    //       top: 10,
    //       bottom: 0,
    //       left: 0,
    //       right: 0
    //     },
    //     position: 'back',
    //     xaxis: {
    //       lines: {
    //         show: true
    //       }
    //     }
    //   },
    //   legend: {
    //     onItemClick: {
    //       toggleDataSeries: false
    //     },
    //     position: 'top',
    //     offsetY: 0,
    //   },
    //   markers: {
    //     radius: 12,
    //   },
    //   series: activeChart.series['daily'],
    //   stroke: {
    //     curve: 'straight',
    //     width: 1,
    //   },
    //   tooltip: {
    //     followCursor: false,
    //     theme: 'dark',
    //     onDatasetHover: {
    //       highlightDataSeries: true
    //     },
    //     x: {
    //       format: type === 'daily' ? 'HH:mm' : 'MMM dd, yyyy, HH:mm',
    //     },
    //     y: {
    //       formatter: (value: number, options: any): string => `${value && value !== null ? this.formatNumberWithLocale(value) : 0} kWh`,
    //     }
    //   },
    //   xaxis: {
    //     axisBorder: {
    //       show: false
    //     },
    //     axisTicks: {
    //       show: false
    //     },
    //     labels: {
    //       offsetY: 0,
    //       offsetX: 0,
    //       style: {
    //         colors: this.labelGraphCol,
    //         fontWeight: 500,
    //       },
    //       datetimeUTC: false
    //     },
    //     tooltip: {
    //       enabled: false
    //     },
    //     type: 'datetime'
    //   },
    //   yaxis: {
    //     labels: {
    //       offsetY: 0,
    //       offsetX: 50,
    //       style: {
    //         colors: this.labelGraphCol,
    //         fontSize: '15px'
    //       },
    //     },
    //     floating: true,
    //     decimalsInFloat: 0,
    //     axisTicks: {
    //       show: false
    //     },
    //     axisBorder: {
    //       show: false
    //     },
    //     tickAmount: 6,
    //     show: true,
    //     min: 0,
    //     max: (max) => max + 2,
    //   }
    // }
  }

  formatNumberWithLocale(numberValue: number): string {
    return this._awsService.formatNumberWithLocale(this.activeLang, numberValue, 1);
  }
  private setDateLabels(): void {
    this.DateActiveLabelNow = this.activeLang === "id" ? moment(Date.now()).locale("id").format("DD MMMM YYYY") : moment(Date.now()).locale("en").format("MMMM DD, YYYY");
    this.DateActiveWeekLabel = this.activeLang === "id" ? moment(Date.now()).locale("id").subtract(6,'days').format("DD MMMM YYYY") : moment(Date.now()).locale("en").subtract(6,'days').format("MMMM DD, YYYY");
    this.DateActiveStartMonthLabel = this.activeLang === "id" ? moment(Date.now()).locale("id").startOf('month').format("DD MMMM YYYY") : moment(Date.now()).locale("en").startOf('month').format("MMMM DD, YYYY");
    this.DateActiveEndMonthLabel = this.activeLang === "id" ? moment(Date.now()).locale("id").endOf('month').format("DD MMMM YYYY") : moment(Date.now()).locale("en").endOf('month').format("MMMM DD, YYYY");
  }

  setCoockies(key, value){
    const threeHoursInSeconds = 3 * 60 * 60;
    const expirationDate = new Date();
    expirationDate.setTime(expirationDate.getTime() + threeHoursInSeconds * 1000);
    this._cookieService.set(key, value, expirationDate)
  }
  public async onPageChange(e) {
    this.sizePage = e.pageSize
    this.pageIndex = e.pageIndex
    if (this.stationClientIDAll.length > 3) {
      this.setCoockies('pageSize-'+ this.id, this.sizePage)
      this.setCoockies('pageIndex-'+ this.id, this.pageIndex)
    }
    this.stationClientID = [...this.stationClientIDAll.filter((item, index) => (index >= e.pageIndex * e.pageSize) && (index < (e.pageIndex + 1) * e.pageSize))]
    this.getDashboardGraph()
    this.getActiveGraph()
    this._changeDetectorRef.detectChanges();
  }

  trackByFn(index: number, item: any): any {
    return item.id || index;
  }
}
