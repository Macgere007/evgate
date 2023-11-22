import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BlockScrollStrategy, Overlay } from '@angular/cdk/overlay';
import { MAT_AUTOCOMPLETE_SCROLL_STRATEGY, MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { SharedModule } from 'app/shared/shared.module';
import { SearchComponents } from './search.component';
import { TranslocoCoreModule } from 'app/core/transloco/transloco.module';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';

@NgModule({
    declarations: [
        SearchComponents
    ],
    imports     : [
        RouterModule.forChild([]),
        MatAutocompleteModule,
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        TranslocoCoreModule,
        SharedModule,
        MatDatepickerModule, 
        MatNativeDateModule
    ],
    exports     : [
        SearchComponents
    ],
    providers   : [
        {
            provide   : MAT_AUTOCOMPLETE_SCROLL_STRATEGY,
            useFactory: (overlay: Overlay) => (): BlockScrollStrategy => overlay.scrollStrategies.block(),
            deps      : [Overlay]
        }
    ]
})
export class SearchModules
{
}
