import { Injectable } from '@angular/core';
import { ApexOptions } from 'ng-apexcharts';
import { AwsService } from './aws.service';
import { CookieService } from 'ngx-cookie-service';

@Injectable({providedIn: 'root'})
export class ShareService {
  constructor(
    private _awsService: AwsService,
    private _cookieService: CookieService
  ) { }
  
  formatNumberWithLocale(numberValue: number, lang, dec? : number): string {
    return this._awsService.formatNumberWithLocale(lang, numberValue, dec ? dec : 1);
  }

  public setCoockies(topic, msg) {
    const twoHInSeconds = 2 * 60 * 60;
    const expirationDate = new Date();
    expirationDate.setTime(expirationDate.getTime() + twoHInSeconds * 1000);
    this._cookieService.set(topic, msg, expirationDate)
  }

  public createGraph(series, unit: string, lang: string, isdashboard:boolean, realtime: boolean, colors?: string[], minx?: number, maxx?: number, stroke?: "smooth" | "straight" | "stepline", ispower_factor?: boolean, type?: 'area' | 'bar') {
    let labelGraphCol = 'white'
    this._awsService.getScheme().subscribe(res => {
      res.scheme !== 'dark' && (labelGraphCol = '#D3D3D3')
    })

    let charts: ApexOptions = {
      chart: {
        animations: {
          enabled: type !== undefined
        },
        fontFamily: 'inherit',
        foreColor: isdashboard ? 'inherit': '#fffff',
        height: isdashboard ? '120%' : '100%',
        width: isdashboard ? '120%' : '100%',
        offsetY: 0,
        offsetX: 0,
        type: type ? type : "area",
        toolbar: {
          show: !isdashboard,
          offsetY: 10,
          offsetX: 0,
          tools: {
            download: false,
            pan: true,
            reset: false
          }
        },
        zoom: {
          enabled: !isdashboard
        }
      },
      colors: colors ? colors : ['#34D399', '#63B3ED', '#FB7185', '#fcee50', '#fcc350', '#f950fc']
      ,
      dataLabels: {
        enabled: false
      },
      fill: {
        colors: colors ? colors : ['#34D399', '#63B3ED', '#FB7185', '#fcee50', '#fcc350', '#f950fc'],
        opacity: 0.5
      },
      grid: {
        show: !isdashboard,
        borderColor: 'rgba(192,192,192,0.2)',
        padding: {
          bottom: isdashboard ? -20 : 0,
          right: isdashboard ? 40 : 0,
        },
        position: 'back',
        xaxis: {
          lines: {
            show: true
          }
        }
      },
      legend: {
        onItemClick: {
          toggleDataSeries: false
        },
        position: 'top',
        offsetY: 0,
      },
      series: series,
      stroke: {
        curve: stroke ? stroke : 'smooth',
        width: 1,
      },
      tooltip: {
        followCursor: false,
        theme: 'dark',
        x: {
          format: isdashboard ? 'HH:mm, dd/MM/yy' : 'MMM dd, yyyy, HH:mm'
        },
        y: {
          formatter: (value: number, options: any): string => `${value === null ? 0 : (this.formatNumberWithLocale(value, lang))} ${unit}`,
        },
        fixed: {
          enabled: isdashboard,
          offsetX: isdashboard ? -80 : 0,
          offsetY: isdashboard ? -20 : 0
        }
      },
      xaxis: {
        axisBorder: {
          show: isdashboard,
        },
        axisTicks: {
          show: isdashboard
        },
        labels: {
          rotate: 0,
          style: {
            colors: labelGraphCol,
            fontSize: '15px'
          },
          datetimeUTC: false,
          format: realtime ? 'HH:mm': undefined,
        },
        tickAmount: isdashboard ? 5 : 20,
        tooltip: {
          enabled: false
        },
        type: 'datetime'
      },
      yaxis: {
        title: {
          rotate: 0,
          offsetX: !isdashboard ? 80 : 0,
          offsetY: !isdashboard ? -140 : 0,
          style: {
            color: 'rgba(128, 128, 128,0.6)',
            fontSize: '20px',
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 500,
            cssClass: 'apexcharts-yaxis-title',
          },
        },
        labels: {
          offsetY: 0,
          offsetX: 40,
          style: {
            colors: labelGraphCol,
            fontSize: '15px'
          },
          formatter: (value: number): string => {
            if(ispower_factor){
            return this.formatNumberWithLocale(value, lang, 1);
            }
            else{
              return this.formatNumberWithLocale(value, lang, 0)
            }
          },
        },
        floating: true,
        decimalsInFloat: 1,
        axisTicks: {
          show: false
        },
        axisBorder: {
          show: false
        },
        min: (min): number => minx ? minx : min,
        max: (max): number => maxx ? maxx : max + 1,
        tickAmount: isdashboard ? 7 : 6,
        show: !isdashboard
      }
    };
    return charts
  }

}