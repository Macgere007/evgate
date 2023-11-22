import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector       : 'not-assign',
    templateUrl    : './not-assign.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotAssignComponent
{
    /**
     * Constructor
     */
    constructor()
    {
    }
}
