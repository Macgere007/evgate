import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { FuseLoadingService } from '@fuse/services/loading';
import { forkJoin, Observable } from 'rxjs';
import { TeamService } from './team/team.service';


@Injectable({
    providedIn: 'root'
})
export class UserSettingsResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(
        private _teamService: TeamService,
        private _fuseLoading: FuseLoadingService
    )
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
        this._fuseLoading.show();
        return forkJoin([
            this._teamService.getTeamCurentUser(),
        ]);
    }
}
