import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { TranslocoService } from '@ngneat/transloco';
import { AuthService } from 'app/core/auth/auth.service';
import { environment } from 'environments/environment';
import * as CryptoJS from 'crypto-js';
import { take } from 'rxjs';
//import { CompanyType } from 'app/models/company.type';

@Component({
    selector     : 'auth-sign-up',
    templateUrl  : './sign-up.component.html',
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class AuthSignUpComponent implements OnInit
{
    @ViewChild('signUpNgForm') signUpNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type   : 'success',
        message: ''
    };
    signUpForm: FormGroup;
    showAlert: boolean = false;
    appTitle: string = '';
    isLock: boolean = false;
    invitationToken: string;
    invitation: any;
    invitationCompany: string = 'Harapan Energie Indonesia'; // Hard coded
    invitationCompanyType: string = '';
    invitationEmail: string = '';
    //companyTypes: string[] = [CompanyType.vendor,CompanyType.psc, CompanyType.skk];

    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _formBuilder: FormBuilder,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _translateService: TranslocoService
    )
    {
        this._translateService.langChanges$.subscribe(()=> {
            this._translateService.selectTranslate(environment.appTitle).pipe(take(1))
                .subscribe((translation) => {
                    this.appTitle = translation;
                }
            );
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this._activatedRoute.queryParams
            .subscribe((params) => {
                this.invitationToken = params['invitation'];
                if (this.invitationToken) {
                    const decryptData = CryptoJS.AES.decrypt(this.invitationToken, 'R4745374N').toString(CryptoJS.enc.Utf8);
                    this.invitation = JSON.parse(decryptData);
                    const now = new Date();

                    const validInvitaionDate = new Date(this.invitation.valid);
                    if (validInvitaionDate >= now) {
                        this.isLock = true;
                        this.invitationCompany = this.invitation.company;
                        this.invitationCompanyType = this.invitation.type;
                        this.invitationEmail = this.invitation.email;
                    }
                }
            }
        );

        // Create the form
        this.signUpForm = this._formBuilder.group({
                name      : ['', Validators.required],
                email     : [{value:this.invitationEmail, disabled: this.isLock}, [Validators.required, Validators.email]],
                password  : ['', Validators.required],
                company   : [{value:this.invitationCompany, disabled: this.isLock}],
                companyType: [{value:this.invitationCompanyType, disabled: this.isLock}],
                agreements: ['', Validators.requiredTrue]
            }
        );
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign up
     */
    signUp(): void
    {
        // Do nothing if the form is invalid
        if ( this.signUpForm.invalid )
        {
            return;
        }

        // Disable the form
        this.signUpForm.disable();

        // Hide the alert
        this.showAlert = false;

        // Sign up
        this._authService.signUp(this.signUpForm.value)
            .subscribe(
            {
                next: (response) => {

                    const navExtras: NavigationExtras = {
                        queryParams: {
                          signUpEmail: this._authService.signupEmail,
                          signUpDestination: this._authService.signupEmailDestination
                        }
                      };

                    // Navigate to the confirmation required page
                    this._router.navigate(['/sign-up-confirmation'], navExtras);
                },
                error: (error) => {

                    // Re-enable the form
                    this.signUpForm.enable();

                    // Reset the form
                    // this.signUpNgForm.resetForm();

                    // Set the alert
                    this.alert = {
                        type   : 'error',
                        message: this._translateService.translate('Something went wrong, please try again.') + `\n(${error.message})`
                    };

                    // Show the alert
                    this.showAlert = true;
                }
            });
    }
}
