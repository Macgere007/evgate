import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { FuseConfigService } from '@fuse/services/config';
import { AppConfig, Scheme, Theme, Themes } from 'app/core/config/app.config';
import { Layout } from 'app/layout/layout.types';
import { AuthService } from 'app/core/auth/auth.service';
import { LookupService } from 'app/core/service/lookup.service';
import { TranslocoService } from '@ngneat/transloco';

@Component({
    selector     : 'settingmode',
    templateUrl  : './settingmode.component.html',
    styles       : [
        `
            settingss {
                position: static;
                display: block;
                flex: none;
                width: auto;
            }

            @media (screen and min-width: 1280px) {

                empty-layout + settingss .settings-cog {
                    right: 0 !important;
                }
            }
        `
    ],
    encapsulation: ViewEncapsulation.None
})
export class SettingModeComponent implements OnInit, OnDestroy
{
    config: AppConfig;
    layout: Layout;
    scheme: 'dark' | 'light';
    theme: string;
    themes: Themes;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    public activeLang: string;

    /**
     * Constructor
     */
    constructor(
        private _router: Router,
        private _fuseConfigService: FuseConfigService,
        private _authService: AuthService,
        private _lookupService: LookupService,
        private _translateService: TranslocoService,
        private _changeDetectorRef: ChangeDetectorRef,
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
            this._changeDetectorRef.markForCheck();
          });
        // Subscribe to config changes
        this._fuseConfigService.config$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((config: AppConfig) => {
                // Store the config
                this.config = config;
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
     * Set the layout on the config
     *
     * @param layout
     */
    setLayout(layout: string): void
    {
        // Clear the 'layout' query param to allow layout changes
        this._router.navigate([], {
            queryParams        : {
                layout: null
            },
            queryParamsHandling: 'merge'
        }).then(() => {

            // Set the config
            this._fuseConfigService.config = {layout};
        });
    }

    /**
     * Set the scheme on the config
     *
     * @param scheme
     */
    setScheme(scheme: Scheme): void
    {
        this._fuseConfigService.config = {scheme};
        this.post(this.config)
    }

    /**
     * Set the theme on the config
     *
     * @param theme
     */
    setTheme(theme: Theme): void
    {
        this._fuseConfigService.config = {theme};
        this.post(this.config)
    }

    post(config){
        this._lookupService.putSettingTheme(JSON.stringify(config)).subscribe(
            res => {
                this._authService.currentUserReal = {...this._authService.currentUserReal, config: JSON.stringify(this.config)}
                this.config = config;
            }
        )
    }
}
