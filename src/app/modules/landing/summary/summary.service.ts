import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, from, map, Observable, of, switchMap, take, tap, throwError } from 'rxjs';
import { API, Auth } from 'aws-amplify';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SummaryService
{
    _apiName = environment.lookupApiName
    // Private
    private _summary: BehaviorSubject<any | null>;

    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient
    )
    {
        // Set the private defaults
        this._summary = new BehaviorSubject(null)
    }

    /**
     * Getter for team
     */
    get summary$(): Observable<any>
    {
        return this._summary.asObservable();
    }

    getSummary(id): Observable<any> {
      return from(API.get(this._apiName, '/summary?customer_id=' + id, {})).pipe(
        map((response) => {
          this._summary.next(response.message)
          return response.message;
        }),
        catchError(error => {
          // return ''
          this._summary.next(null)
          return throwError('');
        })
      );
    }


}
