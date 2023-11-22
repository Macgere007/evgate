import { Injectable } from '@angular/core';
import { Observable, catchError, from, map, mergeMap, switchMap, tap, throwError } from 'rxjs';
import { API, Auth } from 'aws-amplify';
import { environment } from 'environments/environment';
import { AwsService } from './aws.service';
import moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class TransactionServices {
  private _siteName: string = environment.userApiName;

  constructor(
    private _awsService: AwsService
  ) {
  }

  getTransaction(site_id: string, filter?: string, page?: number, limit?: number, date?: Date, date_type?: "daily" | "weekly" | "monthly" | "range", rangeFrom?, rangeTo?): Observable<any> {
    return from(Auth.currentSession()).pipe(
      mergeMap((session) => {
        const headers = {
          Authorization: `Bearer ${session.getIdToken().getJwtToken()}`
        };
        const dateTime = moment(date).format('YYYY-MM-DD')
        const options = { headers: headers };
        let path = `/user-mgmt/transaction/${site_id}?filter=${filter}&page=${page}&limit=${limit}&date=${dateTime}&date_type=${date_type}`;
        if (date_type === 'range') {
          const dateRangeFrom = moment(rangeFrom).format('YYYY-MM-DD')
          const dateRangeEnd = moment(rangeTo).format('YYYY-MM-DD')  
          path += `&from=${dateRangeFrom}&to=${dateRangeEnd}`
        }
        return from(API.get(this._siteName, path, options)).pipe(
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

  deleteTransaction(id: string): Observable<any> {
    return from(Auth.currentSession()).pipe(
      mergeMap((session) => {
        const headers = {
          Authorization: `Bearer ${session.getIdToken().getJwtToken()}`
        };
        const options = { headers: headers };
        const path = `/user-mgmt/transaction/${id}`;
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

}
