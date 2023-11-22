import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { UserAnalyticsService } from 'app/modules/user/analytics/user-analytics.service';

@Injectable({
    providedIn: 'root'
})
export class UserAnalyticsResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _useranalyticsService: UserAnalyticsService)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>
    {
        return this._useranalyticsService.getData();
    }
}
