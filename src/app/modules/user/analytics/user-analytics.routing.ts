import { Route } from '@angular/router';
import { UserAnalyticsComponent } from 'app/modules/user/analytics/user-analytics.component';
import { UserAnalyticsResolver } from 'app/modules/user/analytics/user-analytics.resolvers';

export const useranalyticsRoutes: Route[] = [
    {
        path     : '',
        component: UserAnalyticsComponent,
        resolve  : {
            data: UserAnalyticsResolver
        }
    }
];
