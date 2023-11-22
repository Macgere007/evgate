import { Component, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { TranslocoService } from '@ngneat/transloco';
import { environment } from 'environments/environment';
import { take } from 'rxjs';

@Component({
    selector     : 'auth-confirmation-required',
    templateUrl  : './confirmation-required.component.html',
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class AuthConfirmationRequiredComponent
{
    appTitle: string = '';

    /**
     * Constructor
     */
    constructor(private _translateService: TranslocoService)
    {
        this._translateService.langChanges$.subscribe(()=> {
            this._translateService.selectTranslate(environment.appTitle).pipe(take(1))
                .subscribe((translation) => {
                    this.appTitle = translation;
                }
            );
        });
    }
}
