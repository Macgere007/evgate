import { Route } from '@angular/router';
import { AuthSignUpConfirmationComponent } from 'app/modules/auth/sign-up-confirmation/sign-up-confirmation.component';

export const authSignUpConfirmationRoutes: Route[] = [
    {
        path     : '',
        component: AuthSignUpConfirmationComponent
    }
];
