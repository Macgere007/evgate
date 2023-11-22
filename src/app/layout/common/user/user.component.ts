import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { BooleanInput } from '@angular/cdk/coercion';
import { Subject, takeUntil } from 'rxjs';
import { CloudUser, UserStatus } from 'app/core/user/user.types';
import { UserService } from 'app/core/user/user.service';
import { AuthService } from 'app/core/auth/auth.service';
import { TranslocoService } from '@ngneat/transloco';

@Component({
    selector       : 'user',
    templateUrl    : './user.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs       : 'user'
})
export class UserComponent implements OnInit, OnDestroy
{
    /* eslint-disable @typescript-eslint/naming-convention */
    static ngAcceptInputType_showAvatar: BooleanInput;
    /* eslint-enable @typescript-eslint/naming-convention */

    @Input() showAvatar: boolean = true;
    user: CloudUser = {
        id: '',
        companyId: '',
        company: '',
        companyType: '',
        name: '',
        email: '',
        title: '',
        status: '',
        about: '',
        phone: '',
        language: '',
        action: '',
        roleId: '',
        userRole: '',
        station: [''],
        avatar: '',
        type: '',
        createdAt: undefined,
        updatedAt: undefined,
        cognito: false
    };

    private _unsubscribeAll: Subject<any> = new Subject<any>();
    activeLang: string;

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router,
        private _userService: UserService,
        private _authService: AuthService,
        private _translateService: TranslocoService,
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this._translateService.langChanges$.subscribe((activeLang) => {
            this.activeLang = activeLang;
            this._changeDetectorRef.detectChanges();
          });
        // Subscribe to user changes
        this._userService.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user: CloudUser) => {
                this.user = user;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Update the user status
     *
     * @param status
     */
    updateUserStatus(status: string): void
    {
        // Return if user is not available
        if ( !this.user )
        {
            return;
        }

        // Update the user
        this._userService.update({
            ...this.user,
            status
        }).subscribe();
    }

    showSettings(): void
    {
        const navExtras: NavigationExtras = {
            queryParams: {
            },
            state: {
            }
        };
        this._router.navigate(['/settings'], navExtras);
    }

    /**
     * Sign out
     */
    signOut(): void
    {
        // save active language before calling signout for a federated login user type
        this._authService.activeLanguage = this._translateService.getActiveLang();

        // update user status to sign-out
        this.updateUserStatus(UserStatus.signOut);

        if (this.user.type) { // social login user type
            this._authService.signOut();
        }
        else {
            this._router.navigate(['/sign-out']);
        }
    }
}
