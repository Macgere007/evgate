import { Routes, RouterModule } from '@angular/router';
import { UserSettingsComponent } from './user-settings.component';
import { UserSettingsResolver } from './user-settings.resolver';

export const usersettingsRoutes: Routes = [
  {  path     : '',
  component: UserSettingsComponent,
  resolve: {
      initialData: UserSettingsResolver
  } },
];


