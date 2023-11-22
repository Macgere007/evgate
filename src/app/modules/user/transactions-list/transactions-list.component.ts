import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { UserService } from 'app/core/user/user.service';
import { Role } from 'app/models/role.type';
import { User } from 'app/models/user.type';
import { Observable, Subject, takeUntil } from 'rxjs';
import { TeamService } from './team/team.service';
import { CookieService } from 'ngx-cookie-service';
import { AwsService } from 'app/core/service/aws.service';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-transactions-list',
  templateUrl: './transactions-list.component.html',
  styleUrls: ['./transactions-list.component.scss']
})
export class TransactionsListComponent {
  @ViewChild('drawer') drawer: MatDrawer;

  drawerMode: 'over' | 'side' = 'side';
  drawerOpened: boolean = true;
  panels: any[] = [];
  selectedPanel: string = 'autotopup';

  teamLookup$: Observable<User[]>;
  roleLookup$: Observable<Role[]>;

  private _unsubscribeAll: Subject<any> = new Subject<any>();


  /**
   * Constructor
   */
  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _translateService: TranslocoService,
      private _fuseMediaWatcherService: FuseMediaWatcherService,
      private _teamService: TeamService,
      private _userService: UserService,
      private _cookieService: CookieService,
      private _awsService: AwsService,
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
            id         : 'transactionsetup',
            icon       : 'mat_outline:ev_station',
            title      : 'Charging History',
            description: 'Show the history of EVgate that has been successfully charged'
        },
        {
            id         : 'autotopup',
            icon       : 'mat_outline:payment',
            title      : 'Top up History',
            description: 'Show the history of EVgate that has been topuped via PIN'
        },
        {
            id         : 'token-list',
            icon       : 'mat_outline:pin',
            title      : 'Token List',
            description: 'Show the unused token and can be used for topup'
        }
      ];
      let panelCookies = this._cookieService.get('panel')
      panelCookies && (this.selectedPanel = panelCookies)


      // Subscribe to user changes
      this._userService.user$
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe((user: User) => {
            this.panels = defaultPanels;
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
    let i = this.panels.find(panel => panel.id === id)
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
