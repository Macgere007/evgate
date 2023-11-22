import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
declare const google: any;

@Injectable({
    providedIn: 'root'
})
export class CustomerServices {
    private autocompleteService: any;
    private _data: BehaviorSubject<any> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {
        this.autocompleteService = new google.maps.places.AutocompleteService();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for data
     */

    getPlacePredictions(input: string): Observable<any[]> {
        return new Observable<any[]>((observer) => {
            this.autocompleteService.getPlacePredictions(
                { input: input },
                (predictions: any[], status: any) => {
                    if (status === google.maps.places.PlacesServiceStatus.OK) {
                        observer.next(predictions);
                        observer.complete();
                    } else {
                        observer.error(status);
                    }
                }
            );
        });
    }

    get data$(): Observable<any> {
        return this._data.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get data
     */
    getData(): Observable<any> {
        return this._httpClient.get('api/dashboards/finance').pipe(
            tap((response: any) => {
                this._data.next(response);
            })
        );
    }
}
