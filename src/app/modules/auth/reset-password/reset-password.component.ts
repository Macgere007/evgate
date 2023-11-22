import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { finalize, take } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { FuseValidators } from '@fuse/validators';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { NavigationExtras, Router } from '@angular/router';
import { environment } from 'environments/environment';
import { TranslocoService } from '@ngneat/transloco';


@Component({
    selector     : 'auth-reset-password',
    templateUrl  : './reset-password.component.html',
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class AuthResetPasswordComponent implements OnInit
{
    @ViewChild('resetPasswordNgForm') resetPasswordNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type   : 'success',
        message: ''
    };
    resetPasswordForm: FormGroup;
    showAlert: boolean = false;
    forgotPasswordEmail: string;
    emailDestination: string;
    appTitle: string = '';

    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _formBuilder: FormBuilder,
        private _router: Router,
        private _translocoService: TranslocoService
    )
    {
        this._translocoService.langChanges$.subscribe(()=> {
            this._translocoService.selectTranslate(environment.appTitle).pipe(take(1))
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
        this.emailDestination = this._authService.forgotPasswordDestination;
        this.forgotPasswordEmail = this._authService.forgotPasswordEmail;

        // Create the form
        this.resetPasswordForm = this._formBuilder.group({
                email          : [this.forgotPasswordEmail, Validators.required],
                code           : ['', Validators.required],
                password       : ['', Validators.required],
                passwordConfirm: ['', Validators.required]
            },
            {
                validators: FuseValidators.mustMatch('password', 'passwordConfirm')
            }
        );
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Reset password
     */
    resetPassword(): void
    {
        // Return if the form is invalid
        if ( this.resetPasswordForm.invalid )
        {
            return;
        }

        // Disable the form
        this.resetPasswordForm.disable();

        // Hide the alert
        this.showAlert = false;

        // Send the request to the server
        this._authService.resetPassword(this.resetPasswordForm.value)
            .pipe(
                finalize(() => {

                    // Re-enable the form
                    this.resetPasswordForm.enable();

                    // Reset the form
                    this.resetPasswordNgForm.resetForm();

                    // Show the alert
                    this.showAlert = true;
                })
            )
            .subscribe(
            {
                next: (response) => {

                    const navExtras: NavigationExtras = {
                        state: {
                          message: this._translocoService.translate('Your password has been reset!')
                        }
                    };

                    this._router.navigate(['/sign-in-transition'], navExtras);
                },
                error: (error) => {

                    // Set the alert
                    this.alert = {
                        type   : 'error',
                        message: this._translocoService.translate('Something went wrong, please try again.') + `\n (${error.message})`
                    };
                }
            });
    }
}
