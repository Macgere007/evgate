import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable, of, switchMap } from 'rxjs';
import { AuthService } from 'app/core/auth/auth.service';
import { FuseConfigService } from '@fuse/services/config';
import { TranslocoService } from '@ngneat/transloco';

@Injectable({
    providedIn: 'root'
})
export class AdminAuthGuard implements CanActivate, CanActivateChild, CanLoad
{
    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _router: Router,
        private _fuseConfigService: FuseConfigService,
        private _translocoService: TranslocoService
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Can activate
     *
     * @param route
     * @param state
     */
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean
    {
        return this._check();
    }

    /**
     * Can activate child
     *
     * @param childRoute
     * @param state
     */
    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
    {
        return this._check();
    }

    /**
     * Can load
     *
     * @param route
     * @param segments
     */
    canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean
    {
        return this._check();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Check the authenticated status
     *
     * @private
     */
    private _check(): Observable<boolean>
    {
        // Check the authentication status
        return this._authService.check()
                   .pipe(
                       switchMap((authenticated) => {
                           // If the user is authenticated...
                           if ( !authenticated )
                           {
                               // Redirect to the root
                               this._router.navigate(['sign-in']);

                               // Prevent the access
                               return of(false);
                           } else {
                            
                            const cekadmin = this._authService.currentUserReal
                            if (cekadmin.config && cekadmin.config !== '' && cekadmin.config !== 'null'){
                                const config = JSON.parse(cekadmin.config)
                                this._fuseConfigService.config = {theme: config !== null? config.theme : 'theme-rose', scheme: config !== null? config.scheme : 'dark'}
                            }
                            if (cekadmin.lang && cekadmin.lang !== '' && cekadmin.lang !== 'null'){
                                this._translocoService.setActiveLang(cekadmin.lang);
                            }
                            if (cekadmin.user_role){
                                // Allow the access
                                return of(true);
                            }
                            this._router.navigate(['/dashboard']);
                            return of(false);
                           }
                       })
                   );
    }
}
