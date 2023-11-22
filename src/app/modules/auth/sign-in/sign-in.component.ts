import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { environment } from 'environments/environment';
import { Auth } from 'aws-amplify';
import { CognitoHostedUIIdentityProvider } from '@aws-amplify/auth';
import { TranslocoService } from '@ngneat/transloco';
import { take } from 'rxjs';
import { UserRole } from 'app/core/user/user.types';
import { CookieService } from 'ngx-cookie-service';

//import { CompanyType } from 'app/models/company.type';

@Component({
    selector     : 'auth-sign-in',
    templateUrl  : './sign-in.component.html',
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class AuthSignInComponent implements OnInit
{
    @ViewChild('signInNgForm') signInNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type   : 'success',
        message: ''
    };
    signInForm: FormGroup;
    showAlert: boolean = false;
    appTitle: string = '';
    allowSignUp: boolean = environment.allowSignUp;

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
        private _formBuilder: FormBuilder,
        private _router: Router,
        private _translateService: TranslocoService,
        private _cookieService: CookieService
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
        let check = localStorage.getItem('accessToken')
        if ( check !== null ) {
            this._router.navigate(['./dashboard'])
        }
        // Create the form
        this.signInForm = this._formBuilder.group({
            email     : ['', [Validators.required, Validators.email]],
            password  : ['', Validators.required],
            rememberMe: ['']
        });
        this._cookieService.delete('data')
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign in
     */
    signIn(): void
    {
        // Return if the form is invalid
        if ( this.signInForm.invalid )
        {
            return;
        }

        // Disable the form
        this.signInForm.disable();

        // Hide the alert
        this.showAlert = false;

        // Sign in
        this._authService.signIn(this.signInForm.value)
            .subscribe({
                next: () => {

                    // Set the redirect url.
                    // The '/signed-in-redirect' is a dummy url to catch the request and redirect the user
                    // to the correct page after a successful sign in. This way, that url can be set via
                    // routing file and we don't have to touch here.
                    let redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/signed-in-redirect';

                    // if (this._authService.currentUser.UserRole === 'owner') {
                    //     redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/admin-in-redirect';
                    //  }
                    if (this._authService.currentUserReal.role === 'admin') {
                         redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/admin-in-redirect';
                     } else if (this._authService.currentUserReal.role === 'operator') {
                        redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/operator-in-redirect';
                     }else{
                        redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/user-in-redirect';
                     }

                    // Navigate to the redirect url
                    this._router.navigateByUrl(redirectURL);

                },
                error: (response) => {

                    if(response.message === 'User is not confirmed.') {
                        this._router.navigate(['sign-up-confirmation'], {queryParams: {signUpEmail: this.signInForm.value.email, signUpDestination: this.signInForm.value.email }})
                    }

                    // Re-enable the form
                    this.signInForm.enable();

                    // Reset the form
                    // this.signInNgForm.resetForm();

                    // Set the alert
                    this.alert = {
                        type   : 'error',
                        message: 'Wrong email or password'
                    };

                    // Show the alert
                    this.showAlert = true;
                }
            });
    }

    googleSignIn(): void
    {
        // pass active language to customState during federatedSignIn
        // to pass active language when social login return to app routing flow
        const customState = {
            lang: this._translateService.getActiveLang()
        };

        Auth.federatedSignIn({
            provider: CognitoHostedUIIdentityProvider.Google,
            customState: JSON.stringify(customState)
        }).then(
            (credentials) => {
            },
            (error) => {
            }
        );
    }

    facebookSignIn(): void
    {
        // Set the alert
        this.alert = {
            type   : 'info',
            message: 'Facebook login not implemented yet...'
        };

        // Show the alert
        this.showAlert = true;

        return;

    }
}
