import { Injectable } from '@angular/core';
import { API, Auth } from 'aws-amplify';
import { environment } from 'environments/environment';
import { AwsService } from './aws.service';
import { Observable, ReplaySubject, catchError, from, map, mergeMap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class StationService {
  private _siteName: string = environment.userApiName;

  constructor(private _awsService: AwsService, private http: HttpClient) { }

  getEvgate(id: string): Observable<any> {
    return from(Auth.currentSession()).pipe(
      mergeMap((session) => {
        const headers = {
          Authorization: `Bearer ${session.getIdToken().getJwtToken()}`
        };
        const path = `/user-mgmt/evgate/${id}`;
        return API.get(this._siteName, path, { headers }).then((result) => result.message);
      }),
      map((message) => {
        return message.map((item) => (item));
      }),
      catchError((error) => {
        return throwError([]);
      })
    );
  }

  updateEvgate(id: string, type: 'name' | 'power' | 'leakage' | 'topup' | 'temperature' | 'email' | 'reset' | 'energy' | 'active' | 'car_id' | 'id_meter' | 'topupnum', value: string | number | boolean): Observable<any> {
    return from(Auth.currentSession()).pipe(
      mergeMap((session) => {
        const headers = {
          Authorization: `Bearer ${session.getIdToken().getJwtToken()}`
        };
        let body: any = {};
        body[type] = value;

        const path = `/user-mgmt/configure/${id}`;
        return API.put(this._siteName, path, { headers, body });
      }),
      catchError((error) => {
        console.error(error);
        return throwError('error');
      })
    );
  }

  deleteEvgate(id: string): Observable<any> {
    return from(Auth.currentSession()).pipe(
      mergeMap((session) => {
        const headers = {
          Authorization: `Bearer ${session.getIdToken().getJwtToken()}`
        };
        const path = `/user-mgmt/evgate/${id}`;
        return API.del(this._siteName, path, { headers }).then((result) => result.message);
      }),
      map((message) => {
        return message
      }),
      catchError((error) => {
        return throwError([]);
      })
    );
  }

  turnOnOffCharger(id: string, type: 'on' | 'off'): Observable<any> {
    return from(Auth.currentSession()).pipe(
      mergeMap((session) => {
        const headers = {
          Authorization: `Bearer ${session.getIdToken().getJwtToken()}`
        };
        let path = type === 'on' ? '/breakerClose' : '/breakerOpen'
        path +=`?customer_id=${id}`;
        return API.post(environment.breakerApiName, path, { headers });
      }),
      catchError((error) => {
        console.error(error);
        return throwError(error);
      })
    );
  }

  startCharging(id: string): Observable<any> {
    return from(Auth.currentSession()).pipe(
      mergeMap((session) => {
        const headers = {
          Authorization: `Bearer ${session.getIdToken().getJwtToken()}`
        };
        let path = '/start-charging'
        path +=`?customer_id=${id}`;
        return API.post(environment.breakerApiName, path, { headers });
      }),
      catchError((error) => {
        console.error(error);
        return throwError(error);
      })
    );
  }

}

