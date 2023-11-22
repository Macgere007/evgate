import { Route } from '@angular/router';
import { AuthSignInTransitionComponent } from 'app/modules/auth/sign-in-transition/sign-in-transition.component';

export const authSignInTransitionRoutes: Route[] = [
    {
        path     : '',
        component: AuthSignInTransitionComponent
    }
];
