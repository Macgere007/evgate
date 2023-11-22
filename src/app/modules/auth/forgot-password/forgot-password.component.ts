import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { finalize, take } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { Router } from '@angular/router';
import { environment } from 'environments/environment';
import { TranslocoService } from '@ngneat/transloco';

@Component({
    selector     : 'auth-forgot-password',
    templateUrl  : './forgot-password.component.html',
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class AuthForgotPasswordComponent implements OnInit
{
    @ViewChild('forgotPasswordNgForm') forgotPasswordNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type   : 'success',
        message: ''
    };
    forgotPasswordForm: FormGroup;
    showAlert: boolean = false;
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
        // Create the form
        this.forgotPasswordForm = this._formBuilder.group({
            email: ['', [Validators.required, Validators.email]]
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Send the reset link
     */
    sendResetLink(): void
    {
        // Return if the form is invalid
        if ( this.forgotPasswordForm.invalid )
        {
            return;
        }

        // Disable the form
        this.forgotPasswordForm.disable();

        // Hide the alert
        this.showAlert = false;

        // Forgot password
        this._authService.forgotPassword(this.forgotPasswordForm.get('email').value)
            .pipe(
                finalize(() => {

                    // Re-enable the form
                    this.forgotPasswordForm.enable();

                    // Reset the form
                    this.forgotPasswordNgForm.resetForm();

                    // Show the alert
                    this.showAlert = true;
                })
            )
            .subscribe(
            {
                next: (response) => {

                    // Set the alert
                    this.alert = {
                        type   : 'success',
                        message: this._translocoService.translate('Password reset request sent! You\'ll receive an email if you are registered on our system.')
                    };

                    this._router.navigateByUrl('/reset-password');
                },
                error: (response) => {

                    // Set the alert
                    this.alert = {
                        type   : 'error',
                        message: this._translocoService.translate('Email does not found! Are you sure you are already a member?')
                    };
                }
            });
    }
}
