import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { FuseConfigService } from '@fuse/services/config';
import { API, Auth } from 'aws-amplify';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';
@Injectable({
  providedIn: 'root'
})
export class AwsService {
  constructor(
    private _router: Router,
    private _fuseConfigService: FuseConfigService,) {
  }

  public errorHandle(err) {
    console.log(err)
    // localStorage.clear()
    // window.location.reload()
  }

  public promise(api: string, path: string, method: string){
    API[method](api, path, {}).then(
      (result) => {
        return result.message;
      },
      (err) => {
        throw (err);
      }
    );
  }

  webSocket(): WebSocketSubject<any> {
    return new WebSocketSubject<any>(environment.wscat + '?dashboard=true');
  }

  formatNumberWithLocale(activeLang, numberValue: number, tofixed?: number): string {
    let a = parseFloat(`${numberValue}`)

    const options = {
      style: 'decimal',
      minimumFractionDigits: tofixed,
      maximumFractionDigits: tofixed
    };

    if (activeLang === 'en') {
      options['useGrouping'] = true;
      options['minimumFractionDigits'] = tofixed;
    } else if (activeLang === 'id') {
      options['useGrouping'] = true;
      options['minimumFractionDigits'] = tofixed;
    }

    return a.toLocaleString(activeLang, options);
  }

  getScheme(): Observable<any> {
    return this._fuseConfigService.config$;
  }

}

