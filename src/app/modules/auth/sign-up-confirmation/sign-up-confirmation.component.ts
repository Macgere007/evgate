import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { TranslocoService } from '@ngneat/transloco';
import { AuthService } from 'app/core/auth/auth.service';
import { Auth } from 'aws-amplify';
import { environment } from 'environments/environment';
import { take } from 'rxjs';

@Component({
    selector     : 'auth-sign-up-confirmation',
    templateUrl  : './sign-up-confirmation.component.html',
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class AuthSignUpConfirmationComponent implements OnInit
{
    @ViewChild('confirmSignUpNgForm') signUpNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type   : 'success',
        message: ''
    };
    confirmSignUpForm: FormGroup;
    showAlert: boolean = false;
    signUpEmail: string;
    signUpDestination: string;
    appTitle: string = '';

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
         if (this._authService.signupEmail) {
            this.signUpEmail = this._authService.signupEmail;
            this.signUpDestination = this._authService.signupEmailDestination;
        } else {
            this._extractParamsFromRoute();
        }

        this._setDefaultValueToFormGroup();
     }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * * Confirm Sign up
     * */
    confirmSignUp(): void
    {
        // Do nothing if the form is invalid
        if ( this.confirmSignUpForm.invalid )
        {
            return;
        }

        // Disable the form
        this.confirmSignUpForm.disable();

        // Hide the alert
        this.showAlert = false;

        // Confirm Sign up
        this._authService.confirmSignUp(this.confirmSignUpForm.value)
            .subscribe(
            {
                next: (response) => {

                    const navExtras: NavigationExtras = {
                        state: {
                          message: this._translateService.translate('Account confirmation succeed!')
                        }
                    };

                    this._router.navigate(['/sign-in-transition'], navExtras);
                },
                error: (error) => {
                    
                    // Re-enable the form
                    this.confirmSignUpForm.enable();

                    // Reset the form
                    this.signUpNgForm.resetForm();
                    this._setDefaultValueToFormGroup();

                    // Set the alert
                    this.alert = {
                        type   : 'error',
                        message: this._translateService.translate('Something went wrong, please try again.')
                    };

                    // Show the alert
                    this.showAlert = true;
                }
            });
    }

    resendVerificationCode(): void
    {

        Auth.resendSignUp(this.signUpEmail).then(
            (success) => {
                this.alert = {
                    type    : 'success',
                    message : this._translateService.translate('Verification code successfully sent.')
                };

                this.showAlert = true;
            },
            (error) => {
                this.alert = {
                    type    : 'error',
                    message : this._translateService.translate('Error sending verification code, try again in a moment.')
                };

                this.showAlert = true;
            }
        );
    }

    private _extractParamsFromRoute(): void {
        this._activatedRoute.queryParams
            .subscribe((params) => {
                this.signUpEmail = params['signUpEmail'];
                this.signUpDestination = params['signUpDestination'];
            }
        );
    }

    private _setDefaultValueToFormGroup(): void {
            // Create the form
        this.confirmSignUpForm = this._formBuilder.group({
                email     : [this.signUpEmail, [Validators.required, Validators.email]],
                code      : ['', Validators.required],
            }
        );
    }

}
