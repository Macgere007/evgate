import { Routes, RouterModule } from '@angular/router';
import { TransactionsListComponent } from './transactions-list.component';
import { TransactionsListResolver } from './transactions-list.resolver';

export const transactionslistRoutes: Routes = [
  {  path     : '',
  component: TransactionsListComponent,
  resolve: {
      initialData: TransactionsListResolver
  } },
];


