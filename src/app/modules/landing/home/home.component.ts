import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { CloudUserService } from 'app/core/user/cloud.user.service';
import { CloudUser, User } from 'app/core/user/user.types';
import { environment } from 'environments/environment';
// import { IProject } from 'app/models/user.type';
import { AuthService } from 'app/core/auth/auth.service';
import { ActivatedRoute, Route, Router, Routes } from '@angular/router';

@Component({
    selector     : 'landing-home',
    templateUrl  : './home.component.html',
    encapsulation: ViewEncapsulation.None
})
export class LandingHomeComponent implements OnDestroy
{
    appTitle = environment.appTitle;
    // data: IProject[] = []
    authenticated = false
    edit = false
    evgate = ''
    isLoading: boolean = false;
    /**
     * Constructor
     */
    constructor(
            private _authService: AuthService,
            private _router: Router
        )
    {  
    }
    ngOnDestroy(): void {
        this.act && this.act['stop']().subscribe() 
    }
    

    ngOnInit(): void {
        this.authenticated = this._authService.isAuthenticated()
        if (!this.authenticated) {
            localStorage.clear()
        } 
    }

    public config: Object = {
        isAuto: false,
        text: { font: '25px serif' }, // Hiden { font: '0px', bottom: 40 },
        frame: { lineWidth: 8 },
        medias: {
          audio: false,
          video: {
            facingMode: 'environment', // To require the rear camera https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
            width: { ideal: 300 },
            height: { ideal: 300 }
          }
        }
    };

    public barcodeData : any = null
    public interval = null

    act = null

    public openCamera(action: any) {
        console.log(Date())
        if (action && action['isStart']) {
            action['stop']().subscribe()   
        } else {
            action['start']().subscribe()
        }
        this.act = action
    }

    public handle(action: any, fn: string): void {
        action.data._value && (this.evgate = action.data._value)
        this.barcodeData = action.data._value
        this.interval = setInterval(async ()=>{
          if (this.evgate !== null && this.evgate !== '' && this.barcodeData === this.evgate && !this.isLoading) {
            this.isLoading = true
            setTimeout(() => {
                this.goToSummary()
                this.isLoading = false
                action['stop']().subscribe()    
            }, 1000);
          }
        }, 1000)
    }

    goToSummary() {
        this.interval && clearInterval(this.interval)
        setTimeout(() => {
            if (this.evgate.includes( environment.feUrl + '/summary')) {
                // window.open(this.evgate)
                window.location.href = this.evgate;
                // this._router.navigate([this.evgate])
            } else {
                this._router.navigate(['./summary/' + this.evgate])
            }
        }, 200);
    }
}
