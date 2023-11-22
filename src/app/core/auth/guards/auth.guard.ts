import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable, of, switchMap } from 'rxjs';
import { AuthService } from 'app/core/auth/auth.service';
import { FuseConfigService } from '@fuse/services/config';
import { TranslocoService } from '@ngneat/transloco';
import { LookupService } from 'app/core/service/lookup.service';
// import { CompanyType } from 'app/models/company.type';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad
{
    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _router: Router,
        private _route: ActivatedRoute,
        private _fuseConfigService: FuseConfigService,
        private _translocoService:TranslocoService,
        private _lookupService: LookupService
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
        const redirectUrl = state.url === '/sign-out' ? '/' : state.url;
        return this._check(redirectUrl);
    }

    /**
     * Can activate child
     *
     * @param childRoute
     * @param state
     */
    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
    {
        const redirectUrl = state.url === '/sign-out' ? '/' : state.url;
        return this._check(redirectUrl);
    }
    

    /**
     * Can load
     *
     * @param route
     * @param segments
     */
    canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean
    {
        return this._check('/dashboard');
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Check the authenticated status
     *
     * @param redirectURL
     * @private
     */
    private first = true
    private _check(redirectURL: string): Observable<boolean>
    {
        // Check the authentication status
        return this._authService.check()
                   .pipe(
                       switchMap((authenticated) => {
                            // If the user is not authenticated...
                            if ( !authenticated )
                            {
                                // Redirect to the sign-in page
                                localStorage.clear()
                                this._router.navigate(['sign-in']);
                                // Prevent the access
                                return of(false);
                            }
                            let currentUser = this._authService.currentUserReal
                            
                            if (currentUser.role === 'user') {
                                this._router.navigate(['/']);
                            }
                            if (currentUser.role !== 'admin' && redirectURL === '/admin-dashboard') {
                                this._router.navigate(['/dashboard']);
                            }
                            if (this.first) {
                                this._lookupService.getSiteById(currentUser.id).subscribe(
                                    res => {
                                        if (res['custom:config'] && res['custom:config'] !== '' && res['custom:config'] !== 'null'){
                                            const config = JSON.parse(res['custom:config'])
                                            
                                            this._fuseConfigService.config = {theme: config !== null? config.theme : 'theme-rose', scheme: config !== null? config.scheme : 'dark'}
                                        }
                                        if (res['custom:language'] !== '' && res['custom:language'] !== 'null' && res['custom:language']){
                                            this._translocoService.setActiveLang(res['custom:language']);
                                        }
                                    }
                                )
                                this.first = false
                            }

                            // Allow the access
                            return of(true);
                       })
                   );
    }

}
