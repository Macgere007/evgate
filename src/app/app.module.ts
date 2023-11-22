import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ExtraOptions, PreloadAllModules, Route, RouterModule } from '@angular/router';
import { FuseModule } from '@fuse';
import { FuseConfigModule } from '@fuse/services/config';
import { FuseMockApiModule } from '@fuse/lib/mock-api';
import { CoreModule } from 'app/core/core.module';
import { AppConfig } from 'app/core/config/app.config';
import { mockApiServices } from 'app/mock-api';
import { LayoutModule } from 'app/layout/layout.module';
import { AppComponent } from 'app/app.component';
import { environment } from 'environments/environment';
import { NoAuthGuard } from './core/auth/guards/noAuth.guard';
import { LayoutComponent } from './layout/layout.component';
import { AuthGuard } from './core/auth/guards/auth.guard';
import { InitialDataResolver } from './app.resolvers';
import { AdminAuthGuard } from './core/auth/guards/adminAuth.guard';
import { ServiceWorkerModule } from '@angular/service-worker';
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';






const routerConfig: ExtraOptions = {
    preloadingStrategy       : PreloadAllModules,
    scrollPositionRestoration: 'enabled'
};

const routes: Route[] = [
    // Redirect empty path to '/dashboards/project'
    // {path: '', pathMatch : 'full', redirectTo: 'sign-in'},

    // Redirect signed in user to the '/dashboards/project'
    //
    // After the user signs in, the sign in page will redirect the user to the 'signed-in-redirect'
    // path. Below is another redirection for that path to redirect the user to the desired
    // location. This is a small convenience to keep all main routes together here on this file.
    {path: 'user-in-redirect', pathMatch : 'full', redirectTo: ''},
    {path: 'operator-in-redirect', pathMatch : 'full', redirectTo: 'dashboard'},
    {path: 'admin-in-redirect', pathMatch : 'full', redirectTo: 'admin-dashboard'},
    {
        path: '',
        component  : LayoutComponent,
        data: {
            layout: 'empty'
        },
        children   : [
            {path: 'summary/:evgate_id', loadChildren: () => import('app/modules/landing/summary/summary.module').then(m => m.LandingSummaryModule)},
            {path: '', loadChildren: () => import('app/modules/landing/home/home.module').then(m => m.LandingHomeModule)},
            {path: 'sign-out', loadChildren: () => import('app/modules/auth/sign-out/sign-out.module').then(m => m.AuthSignOutModule)}
        ]
    },
    // Landing routes
    {
        path: '',
        canActivate: [NoAuthGuard],
        canActivateChild: [NoAuthGuard],
        component  : LayoutComponent,
        data: {
            layout: 'empty'
        },
        children   : [
            {path: 'sign-in', loadChildren: () => import('app/modules/auth/sign-in/sign-in.module').then(m => m.AuthSignInModule)},
        ]
    },
];


if (environment.allowSignUp) {
    routes.push(
        // Auth routes for guests
        {
            path: '',
            canActivate: [NoAuthGuard],
            canActivateChild: [NoAuthGuard],
            component: LayoutComponent,
            data: {
                layout: 'empty'
            },
            children: [
                {path: 'confirmation-required', loadChildren: () => import('app/modules/auth/confirmation-required/confirmation-required.module').then(m => m.AuthConfirmationRequiredModule)},
                {path: 'forgot-password', loadChildren: () => import('app/modules/auth/forgot-password/forgot-password.module').then(m => m.AuthForgotPasswordModule)},
                {path: 'reset-password', loadChildren: () => import('app/modules/auth/reset-password/reset-password.module').then(m => m.AuthResetPasswordModule)},
                {path: 'sign-in', loadChildren: () => import('app/modules/auth/sign-in/sign-in.module').then(m => m.AuthSignInModule)},
                {path: 'sign-in-transition', loadChildren: () => import('app/modules/auth/sign-in-transition/sign-in-transition.module').then(m => m.AuthSignInTransitionModule)},
                {path: 'sign-up', loadChildren: () => import('app/modules/auth/sign-up/sign-up.module').then(m => m.AuthSignUpModule)},
                {path: 'sign-up-confirmation', loadChildren: () => import('app/modules/auth/sign-up-confirmation/sign-up-confirmation.module').then(m => m.AuthSignUpConfirmationModule)},
            ]
        }
    );
}
else {
    routes.push(
        // Auth routes for guests
        {
            path: '',
            canActivate: [NoAuthGuard],
            canActivateChild: [NoAuthGuard],
            component: LayoutComponent,
            data: {
                layout: 'empty'
            },
            children: [
                {path: 'confirmation-required', loadChildren: () => import('app/modules/auth/confirmation-required/confirmation-required.module').then(m => m.AuthConfirmationRequiredModule)},
                {path: 'forgot-password', loadChildren: () => import('app/modules/auth/forgot-password/forgot-password.module').then(m => m.AuthForgotPasswordModule)},
                {path: 'reset-password', loadChildren: () => import('app/modules/auth/reset-password/reset-password.module').then(m => m.AuthResetPasswordModule)},
                {path: 'sign-in', loadChildren: () => import('app/modules/auth/sign-in/sign-in.module').then(m => m.AuthSignInModule)},
                {path: 'sign-in-transition', loadChildren: () => import('app/modules/auth/sign-in-transition/sign-in-transition.module').then(m => m.AuthSignInTransitionModule)},
            ]
        }
    );
}

routes.push(
    // Auth routes for authenticated users
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {path: 'sign-out', loadChildren: () => import('app/modules/auth/sign-out/sign-out.module').then(m => m.AuthSignOutModule)},
        ]
    },


    // Admin routes
    {
        path       : 'admin',
        canActivate: [AdminAuthGuard],
        canActivateChild: [AdminAuthGuard],
        component  : LayoutComponent,
        resolve    : {
            initialData: InitialDataResolver,
        },
        children   : [

            // Dashboards
            {path: 'dashboard', loadChildren: () => import('./modules/user/dashboard/dashboard.module').then(m => m.DashboardModule) },
            {path: 'admin-dashboard', loadChildren: () => import('./modules/admin/dashboard/admin.module').then(m => m.AdminModule) },
            {path: 'transaction', loadChildren: () => import('./modules/user/transaction/transaction.module').then(m => m.TransactionModule) },
            {path: 'EVgate-settings', loadChildren: () => import('app/modules/user/settings/user-settings.module').then(m => m.UserSettingsModule)},
            {path: 'transactions-list', loadChildren: () => import('app/modules/user/transactions-list/transactions-list.module').then(m => m.TransactionsListModule)},
            {path: 'analitic', loadChildren: () => import('app/modules/user/analytics/user-analytics.module').then(m => m.UserAnalyticsModule)},
            {path: '404-not-found', pathMatch: 'full', loadChildren: () => import('app/modules/admin/error/error-404/error-404.module').then(m => m.Error404Module)},
            {path: '**', redirectTo: '404-not-found'}
        ]
    },
    {
        path       : '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component  : LayoutComponent,
        resolve    : {
            initialData: InitialDataResolver,
        },
        children   : [

            // Dashboards
            {path: 'admin', loadChildren: () => import('./modules/admin/dashboard/admin.module').then(m => m.AdminModule) },
            {path: 'dashboard', loadChildren: () => import('./modules/user/dashboard/dashboard.module').then(m => m.DashboardModule) },
            {path: 'admin-dashboard', loadChildren: () => import('./modules/admin/dashboard/admin.module').then(m => m.AdminModule) },
            {path: 'transaction', loadChildren: () => import('./modules/user/transaction/transaction.module').then(m => m.TransactionModule) },
            {path: 'analitic-dashboard', loadChildren: () => import('app/modules/user/analytics/user-analytics.module').then(m => m.UserAnalyticsModule)},
            {path: 'EVgate-settings', loadChildren: () => import('app/modules/user/settings/user-settings.module').then(m => m.UserSettingsModule)},
            {path: 'transactions-list', loadChildren: () => import('app/modules/user/transactions-list/transactions-list.module').then(m => m.TransactionsListModule)},
            {path: '404-not-found', pathMatch: 'full', loadChildren: () => import('app/modules/admin/error/error-404/error-404.module').then(m => m.Error404Module)},
            {path: 'not-assign', pathMatch: 'full', loadChildren: () => import('app/modules/admin/error/not-assign/not-assign.module').then(m => m.NotAssignModule)},
            {path: '**', redirectTo: '404-not-found'},
        ]
    }
)

const appConfigs: AppConfig = {
    layout : 'dense',
    scheme : 'auto',
    screens: {
        sm: '600px',
        md: '960px',
        lg: '1280px',
        xl: '1440px'
    },
    theme  : 'theme-default',
    themes : [
        {
            id  : 'theme-default',
            name: 'Default'
        },
        {
            id  : 'theme-brand',
            name: 'Brand'
        },
        {
            id  : 'theme-teal',
            name: 'Teal'
        },
        {
            id  : 'theme-rose',
            name: 'Rose'
        },
        {
            id  : 'theme-purple',
            name: 'Purple'
        },
        {
            id  : 'theme-amber',
            name: 'Amber'
        }
    ]
};


@NgModule({
    declarations: [
        AppComponent,
    ],
    imports     : [
        BrowserModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(routes, routerConfig),
        NgxMatNativeDateModule,
        NgxMatDatetimePickerModule,
        NgxMatTimepickerModule,
        // Fuse, FuseConfig & FuseMockAPI
        FuseModule,
        FuseConfigModule.forRoot(appConfigs),
        FuseMockApiModule.forRoot(mockApiServices),

        // Core module of your application
        CoreModule,

        // Layout module of your application
        LayoutModule,
        ServiceWorkerModule.register('ngsw-worker.js', {
            enabled: !isDevMode(),
            // Register the ServiceWorker as soon as the application is stable
            // or after 30 seconds (whichever comes first).
            registrationStrategy: 'registerWhenStable:30000'
          })
    ],
    bootstrap   : [
        AppComponent
    ]
})
export class AppModule
{
}
