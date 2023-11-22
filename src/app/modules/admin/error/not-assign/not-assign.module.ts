import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NotAssignComponent } from 'app/modules/admin/error/not-assign/not-assign.component';
import { NotAssignRoutes } from 'app/modules/admin/error/not-assign/not-assign.routing';

@NgModule({
    declarations: [
        NotAssignComponent
    ],
    imports     : [
        RouterModule.forChild(NotAssignRoutes)
    ]
})
export class NotAssignModule
{
}
