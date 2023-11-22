import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable, ReplaySubject, tap } from 'rxjs';
import { User, UserRole, UserStatus } from 'app/models/user.type';
import { CloudUserService } from 'app/core/user/cloud.user.service';
import { HttpClient } from '@angular/common/http';
import { FuseNavigationItem } from '@fuse/components/navigation';
import { DataOperation } from 'app/models/data-operation.type';
import { Power } from 'app/core/solar/power.types';
const camelcaseKeysDeep = require('camelcase-keys-deep');

@Injectable({
    providedIn: 'root'
})
export class UserAnalyticsService
{
    private _data: BehaviorSubject<any> = new BehaviorSubject(null);
    private _user: ReplaySubject<User> = new ReplaySubject<User>(1);
    private _power: BehaviorSubject<any> = new BehaviorSubject(null);
    private _currentuser: BehaviorSubject<any> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient ,private _cloudUserService: CloudUserService)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------
    set currentuser (value: User){
        this._currentuser.next(value);
    }

    get currentuser$(): Observable<User>
    {
        return this._currentuser.asObservable();
    }
    
    set user(value: User)
    {
        // Store the value
        this._user.next(value);
    }

    // eslint-disable-next-line @typescript-eslint/member-ordering
    get user$(): Observable<User>
    {
        return this._user.asObservable();
    }
    /**
     * Getter for data
     */
    get data$(): Observable<any>
    {
        return this._data.asObservable();
    }

   
    //PowerGraph
    set power(value: Power){
        this._power.next(value)
    }

    get power$(): Observable<Power>{
        return this._power.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    get(): Observable<User>
    {
        return from(this._cloudUserService.getCurrentUser()).pipe(
            tap((userItem) => {
                const user = camelcaseKeysDeep(userItem.item);

                if (user.status === UserStatus.signOut ||
                    user.status === null ||
                    user.status === '') {
                    user.status = UserStatus.online;
                    this.update(user);
                }

                this._user.next(user);
            })
        );
    }

    update(user: User): Observable<any>
    {
        return from(this._cloudUserService.updateUserStatus(user)).pipe(
            tap((response) => {
                this._user.next(response);
            })
        );
    }

    isAllow(user: User, object: string, operation: DataOperation): boolean
    {
        switch (user.userRole) {
            case UserRole.owner:
                return true;
            case UserRole.administrator:
                return true;
            case UserRole.readWrite:
                if (object === 'team') {
                    return false;
                }
                return true;
            case UserRole.readOnly:
                if (operation === DataOperation.delete || operation === DataOperation.write)
                {
                    return false;
                }
                return true;
            default:
                return false;
        }
    }

    isMenuAllow(user: User, navItem: FuseNavigationItem): boolean {
        let isAllow = true;
        if (!user) {return isAllow;}

        // switch(user.companyType) {
        //     case CompanyType.psc:
        //         if (navItem.id === 'clientgroup') {isAllow = false;};
        //         break;
        //     case CompanyType.vendor:
        //         if (navItem.id === 'vendorgroup') {isAllow = false;};
        //         break;
        //}

        return isAllow;
    }
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get data
     */
    getData(): Observable<any>
    {
        return this._httpClient.get('api/dashboards/analytics').pipe(
            tap((response: any) => {
                this._data.next(response);
            })
        );
    }

    getDatePickerInstant(){
        let data =  [
            {name: 'Last 5 minutes', minutes: 5, interval: '30s', realtime: true},
            {name: 'Last 15 minutes', minutes: 15, interval: '30s', realtime: true},
            {name: 'Last 30 minutes', minutes: 30, interval: '30s', realtime: true},
            {name: 'Last 1 hour', minutes: 60, interval: '30s', realtime: true},
            {name: 'Last 3 hours', minutes: 180, interval: '30s', realtime: true},
            {name: 'Last 6 hours', minutes: 360, interval: '30s', realtime: true},
            {name: 'Last 12 hours', minutes: 720, interval: '30s', realtime: true},
            {name: 'Last 1 day', minutes: 1440, interval: '30s', realtime: true},
            {name: 'Last 2 days', minutes: 2880, interval: '30m', realtime: false},
            {name: 'Last 1 week', minutes: 10080, interval: '1h', realtime: false},
            {name: 'Last 1 month', minutes: 43200, interval: '3h', realtime: false},
            // {name: 'Last 1 year', minutes: 525600, interval: '1d', realtime: false},
          ]
          return data
    }
}