import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { UserService } from 'app/core/user/user.service';
import { Role } from 'app/models/role.type';
import { User } from 'app/models/user.type';
import { Observable, Subject, takeUntil } from 'rxjs';
import { TeamService } from './team/team.service';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent {
  @ViewChild('drawer') drawer: MatDrawer;

  drawerMode: 'over' | 'side' = 'side';
  drawerOpened: boolean = true;
  panels: any[] = [];
  selectedPanel: string = 'egatewaysetup';

  teamLookup$: Observable<User[]>;
  roleLookup$: Observable<Role[]>;

  private _unsubscribeAll: Subject<any> = new Subject<any>();


  /**
   * Constructor
   */
  constructor(
      private _changeDetectorRef: ChangeDetectorRef,
      private _fuseMediaWatcherService: FuseMediaWatcherService,
      private _teamService: TeamService,
      private _userService: UserService,
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
      this.teamLookup$ = this._teamService.teamLookup$;
      this.roleLookup$ = this._teamService.roleLookup$;

      // Setup available panels
      // set the title and description in assets/i18n/en.json & id.json
      const defaultPanels = [

          {
              id         : 'egatewaysetup',
              icon       : 'heroicons_outline:light-bulb',
              title      : 'EVgate Setup',
            //   description: 'Manage your password and 2-step verification preferences'
          },
        //   {
        //     id         : 'carevsetup',
        //     icon       : 'directions_car',
        //     title      : 'EV Car Setup',
        //   //   description: 'Manage your password and 2-step verification preferences'
        // },
        // {
        //     id         : 'notifications',
        //     icon       : 'heroicons_outline:bell',
        //     title      : 'Notifications',
        //     description: 'Manage your company information'
        // },

          // {
          //     id         : 'team',
          //     icon       : 'heroicons_outline:user-group',
          //     title      : 'User',
          //     //description: 'Manage your existing users and change roles/permissions'
          // },
          // {
          //     id         : 'plan-billing',
          //     icon       : 'heroicons_outline:credit-card',
          //     title      : 'Plan & Billing',
          //     //description: 'Manage your subscription plan, payment method and billing information'
          // },
      ];

      const userPanels = [

          {
              id         : 'egatewaysetup',
              icon       : 'heroicons_outline:light-bulb',
              title      : 'EVgate Setup',
            //   description: 'Manage your password and 2-step verification preferences'
          },
        //   {
        //     id         : 'autotopup',
        //     icon       : 'mat_outline:payment',
        //     title      : 'Auto Topup',
        //     description: 'Topup EVgate pin here'
        // },
        // {
        //     id         : 'notifications',
        //     icon       : 'mat_outline:bell',
        //     title      : 'Notifications',
        //     description: 'Manage your public profile and private information'
        // },
      ];


      // Subscribe to user changes
      this._userService.user$
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe((user: User) => {
              // if (this._userService.isServerAdmin(user)) {
              //     this.panels = adminPanels;
              // }
              // else if (this._userService.isSKK(user)) {
              //     this.panels = skkPanels;
              // }
              // else {
                  this.panels = defaultPanels;
              // }
          }
      );

      // Subscribe to media changes
      this._fuseMediaWatcherService.onMediaChange$
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe(({matchingAliases}) => {

              // Set the drawerMode and drawerOpened
              if ( matchingAliases.includes('lg') )
              {
                  this.drawerMode = 'side';
                  this.drawerOpened = true;
              }
              else
              {
                  this.drawerMode = 'over';
                  this.drawerOpened = false;
              }

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
   * Navigate to the panel
   *
   * @param panel
   */
  goToPanel(panel: string): void
  {
      this.selectedPanel = panel;

      // Close the drawer on 'over' mode
      if ( this.drawerMode === 'over' )
      {
          this.drawer.close();
      }
  }

  /**
   * Get the details of the panel
   *
   * @param id
   */
  getPanelInfo(id: string): any
  {
      return this.panels.find(panel => panel.id === id);
  }

  /**
   * Track by function for ngFor loops
   *
   * @param index
   * @param item
   */
  trackByFn(index: number, item: any): any
  {
      return item.id || index;
  }
}
