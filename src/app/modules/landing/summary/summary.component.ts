import { Component, ViewEncapsulation } from '@angular/core';
import { CloudUserService } from 'app/core/user/cloud.user.service';
import { CloudUser, User } from 'app/core/user/user.types';
import { environment } from 'environments/environment';
// import { IProject } from 'app/models/user.type';
import { AuthService } from 'app/core/auth/auth.service';
import { ActivatedRoute } from '@angular/router';
import { SummaryService } from './summary.service';

@Component({
    selector     : 'landing-summary',
    templateUrl  : './summary.component.html',
    encapsulation: ViewEncapsulation.None
})
export class LandingSummaryComponent
{
    appTitle = environment.appTitle;
    // data: IProject[] = []
    authenticated = false
    dataFound = true
    evgate_id = 'TM21b20cad165e18'
    isLoading: boolean = true;

    constructor(
      private route: ActivatedRoute,
      private _cloudUserService: CloudUserService,
      private _authService: AuthService,
      private _summaryService: SummaryService,
    ) {  
    }
    

    ngOnInit(): void {
      this.authenticated = this._authService.isAuthenticated()
      this.route.params.subscribe(params => {
        this.evgate_id = params['evgate_id']
        this._summaryService.getSummary(this.evgate_id).subscribe(
          res => {
            this.isLoading = false
          }, err => {
            this.isLoading = false
          }
        )
      });

      this._summaryService.summary$.subscribe(
        res => {
          this.dataFound = (res !== null)
        }
      )
        
    }
}
