import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable, of, switchMap } from 'rxjs';
import { AuthService } from 'app/core/auth/auth.service';
import { FuseConfigService } from '@fuse/services/config';
import { TranslocoService } from '@ngneat/transloco';

@Injectable({
    providedIn: 'root'
})
export class NoAuthGuard implements CanActivate, CanActivateChild, CanLoad
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
                           
                           if ( authenticated )
                           {
                            
                                let currentUser = this._authService.currentUserReal
                                if (currentUser.config && currentUser.config !== '' && currentUser.config !== 'null'){
                                    const config = JSON.parse(currentUser.config)
                                    this._fuseConfigService.config = {theme: config !== null? config.theme : 'theme-rose', scheme: config !== null? config.scheme : 'dark'}
                                }
                                if (currentUser.lang && currentUser.lang !== '' && currentUser.lang !== 'null'){
                                this._translocoService.setActiveLang(currentUser.lang);
                                }
                               // Redirect to the root
                               if (currentUser.role === 'admin'){
                                this._router.navigate(['/admin-dashboard']);
                               } else {
                                this._router.navigate(['/dashboard']);
                               }
                               
                               // Prevent the access
                               return of(false);
                           }
                           
                           localStorage.clear()
                           // Allow the access
                           return of(true);
                       })
                   );
    }
}
