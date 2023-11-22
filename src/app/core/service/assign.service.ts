import { Injectable } from '@angular/core';
import { API, Auth } from 'aws-amplify';
import { environment } from 'environments/environment';
import { AuthService } from '../auth/auth.service';
import { Assign } from '../solar/assign.types';
import { UnAssign } from '../solar/UnAssign.types';
import { from, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AssignService {

  private _assignUrl: string = '/assign';
  private _apiName: string = environment.userApiName;

  constructor(private _authService: AuthService) { }

  assignStation(assign: Assign): Observable<any> {
    return from(Auth.currentSession()).pipe(
      map(session => session.getIdToken().getJwtToken()),
      map(jwtToken => ({
        headers: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          Authorization: `Bearer ${jwtToken}`
        },
        body: assign
      })),
      map(options => ({
        ...options,
        path: `${this._assignUrl}/assignStation`
      })),
      map(options => API.post(this._apiName, options.path, options)),
      catchError(err => throwError(err))
    );
  }

  unassignStation(unassign: UnAssign): Observable<any> {
    return from(Auth.currentSession()).pipe(
      map(session => session.getIdToken().getJwtToken()),
      map(jwtToken => ({
        headers: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          Authorization: `Bearer ${jwtToken}`
        },
        body: unassign
      })),
      map(options => ({
        ...options,
        path: `${this._assignUrl}/unassignStation`
      })),
      map(options => API.del(this._apiName, options.path, options)),
      catchError(err => throwError(err))
    );
  }
}
