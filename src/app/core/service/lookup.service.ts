import { Injectable } from '@angular/core';
import { API, Auth } from 'aws-amplify';
import { environment } from 'environments/environment';
import { AuthService } from '../auth/auth.service';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';
import { DateTime } from 'luxon';
import { Temperature } from '../solar/temp.types';
import { AwsService } from './aws.service';
import { Observable, from, throwError } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import moment from 'moment';
import { Alarm } from 'app/models/EV gate/alarm.type';


@Injectable({
  providedIn: 'root'
})
export class LookupService {
  private _apiName: string = environment.lookupApiName;
  private _apiDashboardName: string = environment.dashboardApiName;
  private _siteName: string = environment.userApiName;
  private _evName: string = environment.evApiName;
  private _topUp: string = environment.topupApiName
  private _control: string = environment.breakerApiName

  /**
   * Constructor
   */
  constructor(private _awsService: AwsService,
    private _authService: AuthService) {

  }

  getSummary(): Observable<any> {
    return from(Auth.currentSession()).pipe(
      mergeMap((session) => {
        const headers = {
          Authorization: `Bearer ${session.getIdToken().getJwtToken()}`
        };
        const body = {};
        const options = { headers: headers, body: body };
        const path = `/user-mgmt/getSummary`;
        return from(API.get(this._siteName, path, options)).pipe(
          map((result: any) => {
            return result.message;
          }),
          catchError(error => {
            this._awsService.errorHandle(error);
            return throwError(error);
          })
        );
      })
    );
  }

  assignev(email, id, name): Observable<any> {
    return from(Auth.currentSession()).pipe(
      mergeMap((session) => {
        const headers = {
          Authorization: `Bearer ${session.getIdToken().getJwtToken()}`
        };
        const body = {
          email: email,
          id: id,
          name: name
        };
        const options = { headers: headers, body: body };
        const path = `/user-mgmt/assignEv`;
        return from(API.post(this._siteName, path, options)).pipe(
          map((result: any) => {
            return result.message;
          }),
          catchError(error => {
            return throwError(error);
          })
        );
      })
    );
  }

  unassignev(email, id): Observable<any> {
    return from(Auth.currentSession()).pipe(
      mergeMap((session) => {
        const headers = {
          Authorization: `Bearer ${session.getIdToken().getJwtToken()}`
        };
        const body = {
          email: email,
          id: id
        };
        const options = { headers: headers, body: body };
        const path = `/user-mgmt/unassignEv`;
        return from(API.del(this._siteName, path, options)).pipe(
          map((result: any) => {
            return result.message;
          }),
          catchError(error => {
            return throwError(error);
          })
        );
      })
    );
  }

  createSite(body): Observable<any> {
    return from(Auth.currentSession()).pipe(
      mergeMap((session) => {
        const headers = {
          Authorization: `Bearer ${session.getIdToken().getJwtToken()}`
        };
        const options = { headers: headers, body: body };
        const path = `/user-mgmt/createSite`;
        return from(API.post(this._siteName, path, options)).pipe(
          map((result: any) => {
            return result.message;
          }),
          catchError(error => {
            let errorMessage = 'An error occurred while creating the site.';

            if (error.response && error.response.data && error.response.data.message) {
              errorMessage = error.response.data.message;
            }
            return throwError(errorMessage);
          })
        );
      })
    );
  }

  updateSite(body): Observable<any> {
    return from(Auth.currentSession()).pipe(
      mergeMap((session) => {
        const headers = {
          Authorization: `Bearer ${session.getIdToken().getJwtToken()}`
        };
        const options = { headers: headers, body: body };
        const path = `/user-mgmt/updateSite`;
        return from(API.put(this._siteName, path, options)).pipe(
          map((result: any) => {
            return result.message;
          }),
          catchError(error => {
            return throwError(error);
          })
        );
      })
    );
  }

  deleteSite(email): Observable<any> {
    return from(Auth.currentSession()).pipe(
      mergeMap((session) => {
        const headers = {
          Authorization: `Bearer ${session.getIdToken().getJwtToken()}`
        };
        const body = {
          email: email
        };
        const options = { headers: headers, body: body };
        const path = `/user-mgmt/deleteSite`;
        return from(API.del(this._siteName, path, options)).pipe(
          map((result: any) => {
            return result.message;
          }),
          catchError(error => {
            return throwError(error);
          })
        );
      })
    );
  }

  getSite(): Observable<any> {
    return from(Auth.currentSession()).pipe(
      mergeMap((session) => {
        const headers = {
          Authorization: `Bearer ${session.getIdToken().getJwtToken()}`
        };
        const options = { headers: headers };
        const path = `/user-mgmt/getSite`;
        return from(API.get(this._siteName, path, options)).pipe(
          map((result: any) => {
            return result.message;
          })
        );
      }),
      catchError(error => {
        this._awsService.errorHandle(error);
        return throwError(error);
      })
    );
  }

  id = ''
  siteDetail: any

  getSiteById(id): Observable<any> {
    if (id === '' || !this.siteDetail) {
      return from(Auth.currentSession()).pipe(
        mergeMap((session) => {
          const headers = {
            Authorization: `Bearer ${session.getIdToken().getJwtToken()}`
          };
          id = this._authService.currentUserReal.id;
          const options = { headers: headers };
          const path = `/user-mgmt/getSite/${id}`;
          return from(API.get(this._siteName, path, options)).pipe(
            map((result: any) => {
              this.id = id
              this.siteDetail = result.message
              return result.message;
            }),
            catchError(error => {
              this._awsService.errorHandle(error);
              return throwError(error);
            })
          );
        })
      );
    } else {
      return from(Promise.resolve(this.siteDetail));
    }
  }

  getEVById(id): Observable<any> {
    return from(Auth.currentSession()).pipe(
      mergeMap((session) => {
        const headers = {
          Authorization: `Bearer ${session.getIdToken().getJwtToken()}`
        };
        const options = { headers: headers };
        const path = `/user-mgmt/evgate/${id}`;
        return from(API.get(this._siteName, path, options));
      }),
      catchError(error => {
        this._awsService.errorHandle(error);
        return throwError(error);
      }),
      map(result => result.message)
    );
  }

  getEnergyGraph(customerID: string, startTime: Date, stopTime: Date, interval?: string): Observable<any[]> {
    return from(Auth.currentSession()).pipe(
      mergeMap((session) => {
        const headers = {
          Authorization: `Bearer ${session.getIdToken().getJwtToken()}`
        };
        let start = (startTime.getTime() / 1000).toFixed(0)
        let stop = (stopTime.getTime() / 1000).toFixed(0)
        const options = { headers: headers };
        const path = `/get_energy_ev?customer_id=${customerID}&start=${start}&stop=${stop}&interval=${interval ? interval : '5m'}`;
        return from(API.get(this._apiName, path, options)).pipe(
          map((result: any) => {
            for (let i = 0; i < result.message.result.length; i++) {
              for (var item of result.message.result[i].data) {
                item.x = DateTime.fromISO(item.x);
              }
            }
            return result.message.result;
          })
        );
      }),
      catchError(error => {
        this._awsService.errorHandle(error);
        return throwError(error);
      })
    );
  }

  getTempGraph(customerID: string, startTime: Date, stopTime: Date, interval?: string): Observable<Temperature> {
    return from(Auth.currentSession()).pipe(
      mergeMap((session) => {
        const headers = {
          Authorization: `Bearer ${session.getIdToken().getJwtToken()}`
        };
        let start = (startTime.getTime() / 1000).toFixed(0)
        let stop = (stopTime.getTime() / 1000).toFixed(0)
        const options = { headers: headers };
        const path = `/temperature?customer_id=${customerID}&start=${start}&stop=${stop}&interval=${interval ? interval : '5m'}`;
        return from(API.get(this._apiName, path, options)).pipe(
          map((result: any) => {
            for (var item of result.message.MCU_temperature) {
              item.x = DateTime.fromISO(item.x);
            }
            for (var item of result.message.phase_terminal_temperature) {
              item.x = DateTime.fromISO(item.x);
            }
            for (var item of result.message.terminal_temperature_n) {
              item.x = DateTime.fromISO(item.x);
            }
            if (result.message?.phase_terminal_temperature2) {
              for (var item of result.message.phase_terminal_temperature2) {
                item.x = DateTime.fromISO(item.x);
              }
              for (var item of result.message.phase_terminal_temperature3) {
                item.x = DateTime.fromISO(item.x);
              }
            }
            return result.message;
          })
        );
      }),
      catchError(error => {
        this._awsService.errorHandle(error);
        return throwError(error);
      })
    );
  }

  getPowerGraph(customerID: string, startTime: Date, stopTime: Date, interval?: string): Observable<any> {
    return from(Auth.currentSession()).pipe(
      mergeMap((session) => {
        const headers = {
          Authorization: `Bearer ${session.getIdToken().getJwtToken()}`
        };
        let start = (startTime.getTime() / 1000).toFixed(0)
        let stop = (stopTime.getTime() / 1000).toFixed(0)
        const options = { headers: headers };
        const path = `/power?customer_id=${customerID}&start=${start}&stop=${stop}&interval=${interval ? interval : '5m'}`;
        return from(API.get(this._apiName, path, options)).pipe(
          map((result: any) => {
            for (var item of result.message.power) {
              item.x = DateTime.fromISO(item.x);
              item.y = item.y / 1000;
            }
            if (result.message.power_r) {
              for (var item of result.message.power_r) {
                item.x = DateTime.fromISO(item.x);
                item.y = item.y / 1000;
              }
              for (var item of result.message.power_s) {
                item.x = DateTime.fromISO(item.x);
                item.y = item.y / 1000;
              }
              for (var item of result.message?.power_t) {
                item.x = DateTime.fromISO(item.x);
                item.y = item.y / 1000;
              }
            }
            for (var item of result.message.reactive_power) {
              item.x = DateTime.fromISO(item.x);
              item.y = item.y / 1000;
            }
            for (var item of result.message.apparent_power) {
              item.x = DateTime.fromISO(item.x);
              item.y = item.y / 1000;
            }
            return result.message;
          })
        );
      }),
      catchError(error => {
        this._awsService.errorHandle(error);
        return throwError(error);
      })
    );
  }

  getPowerFactorGraph(customerID: string, startTime: Date, stopTime: Date, interval?: string): Observable<any> {
    return from(Auth.currentSession()).pipe(
      mergeMap((session) => {
        const headers = {
          Authorization: `Bearer ${session.getIdToken().getJwtToken()}`
        };
        let start = (startTime.getTime() / 1000).toFixed(0)
        let stop = (stopTime.getTime() / 1000).toFixed(0)
        const options = { headers: headers };
        const path = `/power_factor?customer_id=${customerID}&start=${start}&stop=${stop}&interval=${interval ? interval : '5m'}`;
        return from(API.get(this._apiName, path, options)).pipe(
          map((result: any) => {
            for (var item of result.message.power_factor) {
              item.x = DateTime.fromISO(item.x);
            }
            return result.message;
          })
        );
      }),
      catchError(error => {
        this._awsService.errorHandle(error);
        return throwError(error);
      })
    );
  }

  getCurrentGraph(customerID: string, startTime: Date, stopTime: Date, interval?: string): Observable<any> {
    return from(Auth.currentSession()).pipe(
      mergeMap((session) => {
        const headers = {
          Authorization: `Bearer ${session.getIdToken().getJwtToken()}`
        };
        let start = (startTime.getTime() / 1000).toFixed(0)
        let stop = (stopTime.getTime() / 1000).toFixed(0)
        const options = { headers: headers };
        const path = `/current?customer_id=${customerID}&start=${start}&stop=${stop}&interval=${interval ? interval : '5m'}`;
        return from(API.get(this._apiName, path, options)).pipe(
          map((result: any) => {
            for (var item of result.message.current) {
              item.x = DateTime.fromISO(item.x);
            }
            if (result.message.current2) {
              for (var item of result.message.current2) {
                item.x = DateTime.fromISO(item.x);
              }
              for (var item of result.message.current3) {
                item.x = DateTime.fromISO(item.x);
              }
              for (var item of result.message.current_n) {
                item.x = DateTime.fromISO(item.x);
              }
            }
            return result.message;
          })
        );
      }),
      catchError(error => {
        this._awsService.errorHandle(error);
        return throwError(error);
      })
    );
  }

  getLeakageGraph(customerID: string, startTime: Date, stopTime: Date, interval?: string): Observable<any> {
    return from(Auth.currentSession()).pipe(
      mergeMap((session) => {
        const headers = {
          Authorization: `Bearer ${session.getIdToken().getJwtToken()}`
        };
        let start = (startTime.getTime() / 1000).toFixed(0)
        let stop = (stopTime.getTime() / 1000).toFixed(0)
        const options = { headers: headers };
        const path = `/leakage?customer_id=${customerID}&start=${start}&stop=${stop}&interval=${interval ? interval : '5m'}`;
        return from(API.get(this._apiName, path, options)).pipe(
          map((result: any) => {
            // for (var item of result.message.leakage_event_current_value) {
            //   item.x = DateTime.fromISO(item.x);
            // }
            for (var item of result.message.leakage_current_value) {
              item.x = DateTime.fromISO(item.x);
            }
            return result.message;
          })
        );
      }),
      catchError(error => {
        this._awsService.errorHandle(error);
        return throwError(error);
      })
    );
  }

  getVoltageGraph(customerID: string, startTime: Date, stopTime: Date, interval?: string): Observable<any> {
    return from(Auth.currentSession()).pipe(
      mergeMap((session) => {
        const headers = {
          Authorization: `Bearer ${session.getIdToken().getJwtToken()}`
        };
        let start = (startTime.getTime() / 1000).toFixed(0)
        let stop = (stopTime.getTime() / 1000).toFixed(0)
        const options = { headers: headers };
        const path = `/voltage?customer_id=${customerID}&start=${start}&stop=${stop}&interval=${interval ? interval : '5m'}`;
        return from(API.get(this._apiName, path, options)).pipe(
          map((result: any) => {
            for (var item of result.message.voltage) {
              item.x = DateTime.fromISO(item.x);
            }
            if (result.message.voltage2) {
              for (var item of result.message.voltage2) {
                item.x = DateTime.fromISO(item.x);
              }
              for (var item of result.message?.voltage3) {
                item.x = DateTime.fromISO(item.x);
              }
            }
            return result.message;
          })
        );
      }),
      catchError(error => {
        this._awsService.errorHandle(error);
        return throwError(error);
      })
    );
  }

  getThdiGraph(customerID: string, startTime: Date, stopTime: Date, interval?: string): Observable<any> {
    return from(Auth.currentSession()).pipe(
      mergeMap((session) => {
        const headers = {
          Authorization: `Bearer ${session.getIdToken().getJwtToken()}`
        };
        let start = (startTime.getTime() / 1000).toFixed(0)
        let stop = (stopTime.getTime() / 1000).toFixed(0)
        const options = { headers: headers };
        const path = `/total_harmonic_of_current?customer_id=${customerID}&start=${start}&stop=${stop}&interval=${interval ? interval : '5m'}`;
        return from(API.get(this._apiName, path, options)).pipe(
          map((result: any) => {
            for (var item of result.message.total_harmonic_of_current) {
              item.x = DateTime.fromISO(item.x);
            }
            return result.message;
          })
        );
      }),
      catchError(error => {
        this._awsService.errorHandle(error);
        return throwError(error);
      })
    );
  }

  getOverCurrentGraph(customerID: string, startTime: Date, stopTime: Date, interval?: string): Observable<any> {
    return from(Auth.currentSession()).pipe(
      mergeMap((session) => {
        const headers = {
          Authorization: `Bearer ${session.getIdToken().getJwtToken()}`
        };
        let start = (startTime.getTime() / 1000).toFixed(0)
        let stop = (stopTime.getTime() / 1000).toFixed(0)
        const options = { headers: headers };
        const path = `/over_current?customer_id=${customerID}&start=${start}&stop=${stop}&interval=${interval ? interval : '5m'}`;
        return from(API.get(this._apiName, path, options)).pipe(
          map((result: any) => {
            for (var item of result.message.over_current) {
              item.x = DateTime.fromISO(item.x);
            }
            return result.message;
          })
        );
      }),
      catchError(error => {
        this._awsService.errorHandle(error);
        return throwError(error);
      })
    );
  }

  getActiveEnergyGraph(customerID: string, startTime: Date, stopTime: Date, interval?: string): Observable<any> {
    return from(Auth.currentSession()).pipe(
      mergeMap((session) => {
        const headers = {
          Authorization: `Bearer ${session.getIdToken().getJwtToken()}`
        };
        let start = (startTime.getTime() / 1000).toFixed(0)
        let stop = (stopTime.getTime() / 1000).toFixed(0)
        const options = { headers: headers };
        const path = `/energy?customer_id=${customerID}&start=${start}&stop=${stop}&interval=${interval ? interval : '5m'}`;
        return from(API.get(this._apiName, path, options)).pipe(
          map((result: any) => {
            let min = Math.min(...result.message.active_energy.map(item => item.y ))
            for (var item of result.message.active_energy) {
              item.x = DateTime.fromISO(item.x);
              item.y = item.y - min
            }
            for (var item of result.message.reactive_energy) {
              item.x = DateTime.fromISO(item.x);
            }
            return {...result.message, min: min};
          })
        );
      }),
      catchError(error => {
        this._awsService.errorHandle(error);
        return throwError(error);
      })
    );
  }

  getBreaker(customerID: string): Observable<any> {
    return from(Auth.currentSession()).pipe(
      mergeMap((session) => {
        const headers = {
          Authorization: `Bearer ${session.getIdToken().getJwtToken()}`
        };
        const path = `/breaker?customer_id=${customerID}`;
        const options = { headers: headers };
        return from(API.get(this._apiName, path, options)).pipe(
          map((result: any) => {
            for (var item of result.message.main_frequency) {
              item.x = DateTime.fromISO(item.x);
            }
            for (var item of result.message.breaker_open) {
              item.x = DateTime.fromISO(item.x);
            }
            for (var item of result.message.breaker_status) {
              item.x = DateTime.fromISO(item.x);
            }
            return result.message;
          })
        );
      }),
      catchError(error => {
        this._awsService.errorHandle(error);
        return throwError(error);
      })
    );
  }

  getDashboardGraph(clientID: string): Observable<any> {
    return from(Auth.currentSession()).pipe(
      mergeMap((session) => {
        const headers = {
          Authorization: `Bearer ${session.getIdToken().getJwtToken()}`
        };
        const path = `/dashboard?customer_id=${clientID}&interval=30s`;
        const options = { headers: headers };
        return from(API.get(this._apiDashboardName, path, options)).pipe(
          map((result: any) => {
            for (let i = 0; i < result.message.data.length; i++) {
              for (var item of result.message.data[i].power) {
                item.x = DateTime.fromISO(item.x);
              }
              for (var item of result.message.data[i].temperature) {
                item.x = DateTime.fromISO(item.x);
              }
              for (var item of result.message.data[i].leakage_current_value) {
                item.x = DateTime.fromISO(item.x);
              }
            }
            return result.message.data;
          })
        );
      }),
      catchError(error => {
        this._awsService.errorHandle(error);
        return throwError(error);
      })
    );
  }

  getActiveGraph(dateString: Date, type?: "daily" | "weekly" | "monthly", customerID?: string): Observable<any> {
    return from(Auth.currentSession()).pipe(
      mergeMap((session) => {
        const headers = {
          Authorization: `Bearer ${session.getIdToken().getJwtToken()}`
        };
        let path = '';
        let interval = '1h';
        let datenow = new Date(dateString);
        let stop = new Date(dateString);
        let url = '';
        datenow.setHours(0);
        stop.setDate(dateString.getDate() + 1);
        if (type !== "daily") {
          interval = '24h';
          path = `/energy_active?${customerID ? 'customer_id=' + customerID + '&' : ''}date=${datenow}&interval=${interval}&date_type=${type}`;
          url = this._apiDashboardName;
        } else {
          // datenow.setHours(31, 0, 0, 0);
          // stop.setHours(31, 0, 0, 0)
          // datenow.getHours() > 7? stop.setDate(stop.getDate() + 1) : datenow.setDate(datenow.getDate() - 1)
          interval = '300s';
          path = `/get_energy_ev?${customerID ? 'customer_id=' + customerID + '&' : ''}start=${(datenow.getTime() / 1000).toFixed(0)}&stop=${(stop.getTime() / 1000).toFixed(0)}&interval=${interval ? interval : '5m'}`;
          url = this._apiName;
        }
        const options = { headers: headers };
        return from(API.get(url, path, options)).pipe(
          map((result: any) => {
            for (var client of result.message.result) {
              for (var item of client.data) {
                item.x = DateTime.fromISO(item.x);
              }
            }
            return result.message.result;
          }),
          catchError(error => {
            this._awsService.errorHandle(error);
            return throwError(error);
          })
        );
      })
    );
  }

  putSettingDefault(leakage: number, power: number, temperature: number): Observable<any> {
    return from(Auth.currentSession()).pipe(
      mergeMap((session) => {
        const headers = {
          Authorization: `Bearer ${session.getIdToken().getJwtToken()}`
        };
        const body = {
          email: this._authService.currentUserReal.email,
          leakage: leakage,
          power: power,
          temperature: temperature
        };
        this.siteDetail = undefined
        const options = { headers: headers, body: body };
        const path = `/user-mgmt/setDefault`;
        return from(API.put(this._siteName, path, options)).pipe(
          map((result: any) => {
            this.getSiteById(this.id)
            return result.message;
          }),
          catchError(error => {
            this._awsService.errorHandle(error);
            return throwError(error);
          })
        );
      })
    );
  }

  putSettingTheme(layout): Observable<any> {
    return from(Auth.currentSession()).pipe(
      mergeMap((session) => {
        const headers = {
          Authorization: `Bearer ${session.getIdToken().getJwtToken()}`
        };
        const body = {
          email: this._authService.currentUserReal.email,
          config: layout
        };
        this.siteDetail = undefined
        const options = { headers: headers, body: body };
        const path = `/user-mgmt/setDefault`;
        return from(API.put(this._siteName, path, options)).pipe(
          map((result: any) => {
            this.getSiteById(this.id)
            return result.message;
          }),
          catchError(error => {
            this._awsService.errorHandle(error);
            return throwError(error);
          })
        );
      })
    );
  }

  putSettingLang(lang): Observable<any> {
    return from(Auth.currentSession()).pipe(
      mergeMap((session) => {
        const headers = {
          Authorization: `Bearer ${session.getIdToken().getJwtToken()}`
        };
        const body = {
          email: this._authService.currentUserReal.email,
          lang: lang
        };
        this.siteDetail = undefined
        const options = { headers: headers, body: body };
        const path = `/user-mgmt/setDefault`;
        return from(API.put(this._siteName, path, options)).pipe(
          map((result: any) => {
            this.getSiteById(this.id)
            return result.message;
          }),
          catchError(error => {
            this._awsService.errorHandle(error);
            return throwError(error);
          })
        );
      })
    );
  }



  webSocket(customerID: string): WebSocketSubject<any> {
    return new WebSocketSubject<any>(environment.wscat + '?customerid=' + customerID + '&dashboard=true');
  }

  getEvCar(): Observable<any>{
    return from(Auth.currentSession()).pipe(
        mergeMap((session) => {
          const headers = {
            Authorization: `Bearer ${session.getIdToken().getJwtToken()}`
          };
          this.siteDetail = undefined
          const options = { headers: headers};
          const path = `/user-mgmt/ev`;
          return from(API.get(this._evName, path, options)).pipe(
            map((result: any) => {
              return result.message;
            }),
            catchError(error => {
              this._awsService.errorHandle(error);
              return throwError(error);
            })
          );
        })
      );
  }

  getMeterID(customerID?: string): Observable<any>{
    return from(Auth.currentSession()).pipe(
        mergeMap((session) => {
          const headers = {
            Authorization: `Bearer ${session.getIdToken().getJwtToken()}`
          };
          this.siteDetail = undefined
          const options = { headers: headers};
          const path = `/getIdMeter/${customerID}`;
          return from(API.get(this._topUp, path, options)).pipe(
            map((result: any) => {
              return result.message.value;
            }),
            catchError(error => {
              this._awsService.errorHandle(error);
              return throwError(error);
            })
          );
        })
      );
  }

  createEvCar(brand: string, type: string, capacity: number): Observable<any>{
    return from(Auth.currentSession()).pipe(
        mergeMap((session) => {
          const headers = {
            Authorization: `Bearer ${session.getIdToken().getJwtToken()}`
          };
          const body = {
            brand: brand,
            type: type,
            capacity: capacity,
          }
          this.siteDetail = undefined
          const options = { headers: headers, body: body};
          const path = `/user-mgmt/ev`;
          return from(API.post(this._evName, path, options)).pipe(
            map((result: any) => {
              return result.message;
            }),
            catchError(error => {
              this._awsService.errorHandle(error);
              return throwError(error);
            })
          );
        })
      );
  }

  remoteTopUp(customerID: string, token: string): Observable<any>{
    return from(Auth.currentSession()).pipe(
        mergeMap((session) => {
          const headers = {
            Authorization: `Bearer ${session.getIdToken().getJwtToken()}`
          };
          const body = {
            id: customerID,
            token: token
          }
          this.siteDetail = undefined
          const options = { headers: headers, body: body};
          const path = `/remoteTopup`;
          return from(API.post(this._topUp, path, options)).pipe(
            map((result: any) => {
              return result.message;
            }),
            catchError(error => {
              // this._awsService.errorHandle(error);
              return throwError(error);
            })
          );
        })
      );
  }

  AddAutoTopUp(id_meter: string, type: 'autotopup', token: string,energy: string): Observable<any>{
    return from(Auth.currentSession()).pipe(
        mergeMap((session) => {
          const headers = {
            Authorization: `Bearer ${session.getIdToken().getJwtToken()}`
          };
          const body = {
            idmeter: id_meter,
            token: token,
            energi: energy
          }
          this.siteDetail = undefined
          const options = { headers: headers, body: body};
          const path = `/token`;
          return from(API.post(this._topUp, path, options)).pipe(
            map((result: any) => {
              return result.message;
            }),
            catchError(error => {
              // this._awsService.errorHandle(error);
              return throwError(error);
            })
          );
        })
      );
  }

  logTopUp(filter?: string, page?: number, limit?: number, date?: Date, date_type?: "daily" | "weekly" | "monthly" | "range", rangeFrom?, rangeTo?): Observable<any>{
    return from(Auth.currentSession()).pipe(
        mergeMap((session) => {
          const headers = {
            Authorization: `Bearer ${session.getIdToken().getJwtToken()}`
          };
          const dateTime = moment(date).format('YYYY-MM-DD')
          const options = { headers: headers};
          let id = 'all'
          let path = `/topUpLogs/${id}?filter=${filter}&page=${page}&limit=${limit}&date=${dateTime}&date_type=${date_type}`;
          if (date_type === 'range') {
            const dateRangeFrom = moment(rangeFrom).format('YYYY-MM-DD')
            const dateRangeEnd = moment(rangeTo).format('YYYY-MM-DD')
            path += `&from=${dateRangeFrom}&to=${dateRangeEnd}`
          }
          return from(API.get(this._topUp, path, options)).pipe(
            map((result: any) => {
              return result.message;
            }),
            catchError(error => {
            //   this._awsService.errorHandle(error);
              return throwError(error);
            })
          );
        })
      );
  }

  AutoTopUpList(): Observable<any>{
    return from(Auth.currentSession()).pipe(
        mergeMap((session) => {
          const headers = {
            Authorization: `Bearer ${session.getIdToken().getJwtToken()}`
          };
          const options = { headers: headers};
          let path = `/token`;
          return from(API.get(this._topUp, path, options)).pipe(
            map((result: any) => {
              return result.message;
            }),
            catchError(error => {
            //   this._awsService.errorHandle(error);
              return throwError(error);
            })
          );
        })
      );
  }

  deleteTokenFromList(token): Observable<any>{
    return from(Auth.currentSession()).pipe(
        mergeMap((session) => {
          const headers = {
            Authorization: `Bearer ${session.getIdToken().getJwtToken()}`
          };
          const options = { headers: headers, body: {token: token}};
          let path = `/token`;
          return from(API.del(this._topUp, path, options)).pipe(
            map((result: any) => {
              return result.message;
            }),
            catchError(error => {
            //   this._awsService.errorHandle(error);
              return throwError(error);
            })
          );
        })
      );
  }

  calibrationKwh(customerID: string, value: number): Observable<any>{
    return from(Auth.currentSession()).pipe(
        mergeMap((session) => {
          const headers = {
            Authorization: `Bearer ${session.getIdToken().getJwtToken()}`
          };
          const body = {
            id: customerID,
            energy: value
          }
          this.siteDetail = undefined
          const options = { headers: headers, body: body};
          const path = `/kalibrasiKwh`;
          return from(API.post(this._topUp, path, options)).pipe(
            map((result: any) => {
              return result.message;
            }),
            catchError(error => {
              this._awsService.errorHandle(error);
              return throwError(error);
            })
          );
        })
      );
  }

  updateEvCar(brand: string, type: string, capacity: number,carid: string): Observable<any>{
    return from(Auth.currentSession()).pipe(
        mergeMap((session) => {
          const headers = {
            Authorization: `Bearer ${session.getIdToken().getJwtToken()}`
          };
          const body = {
            brand: brand,
            type: type,
            capacity: capacity,
          }
          this.siteDetail = undefined
          const options = { headers: headers,body: body};
          const path = `/user-mgmt/ev/${carid}`;
          return from(API.put(this._evName, path, options)).pipe(
            map((result: any) => {
              return result.message;
            }),
            catchError(error => {
              this._awsService.errorHandle(error);
              return throwError(error);
            })
          );
        })
      );
  }

//   getAlarmandenbyte(): Observable<any>{
//     return from(Auth.currentSession()).pipe(
//       mergeMap((session) => {
//         const headers = {
//           Authorization: `Bearer ${session.getIdToken().getJwtToken()}`
//         };
//         let alarm = "1329630852"
//         let enbyte = "151193347"
//         const options = { headers: headers};
//         let path = `/decimalToBinary?alarm=${alarm}&enbyte=${enbyte}`;
//         return from(API.get(this._apiName, path, options)).pipe(
//           map((result: any) => {
//             console.log('result',result.message)
//             return result.message;
//           }),
//           catchError(error => {
//             return throwError(error);
//           })
//         );
//       })
//     );

//   }


  getBinerAlarmEnbyte(customerID: string, date?: string): Observable<any>{
    console.log(new Date(date).toString(), 'date')
    let path = `/alarmEnbyte?customer_id=${customerID}&time=${new Date(date).toISOString()}`;
    return from(API.get(this._apiDashboardName, path, {})).pipe(
      map((result: any) => {
        return result.message;
      }),
      catchError(error => {
        return throwError(error);
      })
    );

  }


}

