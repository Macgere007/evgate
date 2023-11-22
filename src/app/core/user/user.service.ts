import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, tap, from } from 'rxjs';
import { User, UserRole, UserStatus } from 'app/models/user.type';
import { CloudUserService } from './cloud.user.service';
import { DataOperation } from 'app/models/data-operation.type';
import { FuseNavigationItem } from '@fuse/components/navigation';
//import { CompanyType } from 'app/models/company.type';

const camelcaseKeysDeep = require('camelcase-keys-deep');

@Injectable({
    providedIn: 'root'
})
export class UserService
{
    private _user: ReplaySubject<User> = new ReplaySubject<User>(1);

    /**
     * Constructor
     */
    constructor(
        private _cloudUserService: CloudUserService)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for user
     *
     * @param value
     */
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

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get the current logged in user data
     */
    get(): Observable<User>
    {
        return from(this._cloudUserService.getCurrentUser()).pipe(
            tap((userItem) => {
                const user = camelcaseKeysDeep(userItem.item);
                //user.avatar = 'assets/images/avatars/brian-hughes.jpg';

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

    /**
     * Update the user
     *
     * @param user
     */
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

    // isServerAdmin(user: User): boolean {
    //     return user.companyType === CompanyType.sysAdmin;
    // }

    // isSKK(user: User): boolean {
    //     return user.companyType === CompanyType.skk;
    // }
}
