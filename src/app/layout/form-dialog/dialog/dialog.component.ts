import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslocoService } from '@ngneat/transloco';
import { FormDialogConfig } from '../confirmation.types';
import { FormBuilder } from '@angular/forms';
import { CustomerServices } from 'app/core/service/gmaps-address.service';
import { LookupService } from 'app/core/service/lookup.service';
import { input } from 'aws-amplify';
import { Router } from '@angular/router';
import { environment } from 'environments/environment';

@Component({
  selector: 'form-dialog-dialog',
  templateUrl: './dialog.component.html',
  styles: [
    `
            .form-dialog-dialog-panel {

                @screen md {
                    @apply w-128;
                }

                .mat-mdc-dialog-container {

                    .mat-mdc-dialog-surface {
                        padding: 0 !important;
                    }
                }
            }
        `
  ],
  encapsulation: ViewEncapsulation.None
})
export class FormDialogDialogComponent implements OnInit {
  errorMessage: string = '';
  errorMessages: string = '';
  errorTopUp: string = '';
  errorAutoTopup: string = '';
  errorCar: string = '';
  errorMessageLimit: string = '';
  public dataForm: any
  public predictions: any[] = [];
  public onSearch:boolean = false
  public hide: boolean = true;
  public uniqueBrandData: { brand: string; types: string[] }[] = [];
  public brandDefault:string = 'Select Car Brand'
  public brandHyundai:string = 'Hyundai'
  public typeDefault:string  = 'Select Car Type';
  public Id_MeterDefault:string = 'Input Id Meter';
  env = environment.type
  topup = environment.topup
  feUrl = environment.feUrl

  /**
   * Constructor
   */
  constructor(@Inject(MAT_DIALOG_DATA) public data: FormDialogConfig,
    public _translateService: TranslocoService,
    public _customerService: CustomerServices,
    private _changeDetectorRef: ChangeDetectorRef,
    private _route: Router) {
  }
  ngOnInit(): void {
    this.dataForm = this.data.formValue
    if (this.data.formValue !== 'confirmed' && this.data.option) {
      const uniqueBrands = Array.from(new Set(this.data.option.map(car => car.brand)));
      const uniqueCarTypes = Array.from(new Set(this.data.option.map(car => car.type)));
      uniqueBrands.map(brand => {
        this.uniqueBrandData.push({
          brand: brand,
          types: uniqueCarTypes.filter(type =>
            this.data.option.some(car => car.brand === brand && car.type === type)
          )
        });
      });
      this.dataForm?.value['Brand'] ? this.brandDefault = this.dataForm.value['Brand'] : this.brandDefault = 'Select Car Brand';
      this.typeDefault = this.dataForm.value['Type'] || 'Select Car Type'
      this.Id_MeterDefault = this.dataForm.value['Id_Meter']
    }
    this._changeDetectorRef.markForCheck()
  }

  public dataChange(data: any, title: string) {
    if (title === 'itemList') {
      this.dataForm.value[title] = data.target.checked;
    } else if (title == 'address') {
      this.dataForm.value[title] = data.target.value;
      this.onSearch = true;
      this.onSearchInput();
    } else if (title == 'carlist') {
      if(this.env === 'hyundai'){
        const desiredCar = this.data.option.find(car => car.type === data.target.value);
      this.typeDefault = 'Select Car Type';
      if (desiredCar) {
        const carId = desiredCar.car_id;
        this.dataForm.value[title] = carId;
        this.dataForm.value['Type'] = data.target.value;
            this.validateCarList(data.target.value);
      } else {
        this.errorCar = 'Please select a valid Car.';
      }
      }
      else{
        const desiredCar = this.data.option.find(car => car.brand === this.dataForm.value['Brand'] && car.type === data.target.value);
      this.typeDefault = 'Select Car Type';
      if (desiredCar) {
        const carId = desiredCar.car_id;
        this.dataForm.value[title] = carId;
        this.dataForm.value['Type'] = data.target.value;
        if(this.env === 'hyundai'){
            this.validateCarList(data.target.value);
        }
        else{
            this.validateCarList(data.target.value, this.dataForm.value['Brand']);
        }
      } else {
        this.errorCar = 'Please select a valid Car.';
      }
      }
    } else if (title === 'Id_Meter' || title === 'topupnum' || title === 'AutoTopup') {
      const inputValue = data.target.value;

      // Remove all non-digit characters
      const numericValue = inputValue.replace(/[^0-9]/g, '');

      // Insert a space after every 4 digits
      const formattedValue = numericValue
        .replace(/\s+/g, '') // Remove existing spaces
        .replace(/(\d{4}(?=\d))/g, '$1 ');

      data.target.value = formattedValue; // Set the formatted value back to the input
      this.dataForm.value[title] = formattedValue; // Store the formatted value
    } else {
      this.dataForm.value[title] = data.target.value;
    }
  }

  myFunction() {
    this.hide = !this.hide;
  }
  onSearchInput() {
    if (this.dataForm.value['address'].trim() === '') {
      this.predictions = [];
      return;
    }

    this._customerService.getPlacePredictions(this.dataForm.value['address']).subscribe(
      (predictions) => {
        this.predictions = predictions;
      },
      (error) => {
        console.error('Error fetching predictions:', error);
      }
    );
  }

  // Update the onBrandSelected method to update the selectedBrand
  onBrandSelected(event: any) {
    this.dataForm.value['Brand'] = event.target.value;
    this.brandDefault = 'Select Car Brand';
    this.typeDefault = 'Select Car Type';
    this.brandHyundai = 'Hyundai'
    this._changeDetectorRef.markForCheck();
  }

  getCarTypesForBrand(brandId: string): string[] {
    const brandData = this.uniqueBrandData.find(brandData => brandData.brand === brandId);
    return brandData ? brandData.types : [];
  }

  validatePassword(password: string) {
    if (password.length < 6) {
      this.errorMessage = 'Password should be at least 6 characters long';
    } else {
      this.errorMessage = '';
    }
  }

  validateId_Meter(id_meter: string) {
    if (id_meter.length < 13) {
      this.errorMessages = 'ID Customer must 11 characters';
    } else {
      this.errorMessages = '';
    }
  }

  validateCarList(type: string,brand?: string) {
    if(this.env === 'hyundai'){
        if (!type || type === 'Select Car Type') {
            this.errorCar = 'Both Brand and Type are required.';
          } else {
            this.errorCar= '';
          }
    }
    else{
        if (!brand || brand === 'Select Car Brand' || !type || type === 'Select Car Type') {
            this.errorCar = 'Both Brand and Type are required.';
          } else {
            this.errorCar= '';
          }
    }
  }


  validateTopUp(topupnum: string) {
    if (topupnum.length < 24) {
      this.errorTopUp = 'Top up number must 20 characters';
    } else {
      this.errorTopUp = '';
    }
  }

  validateAutoTopUp(autotopupnum: string) {
    if (autotopupnum.length < 24) {
      this.errorAutoTopup = 'Top up number must 20 characters';
    } else {
      this.errorAutoTopup = '';
    }
  }

  onPredictionClick(prediction: any) {
    this.dataForm.value['address'] = prediction.description;
    this.predictions = []; // Clear the predictions list after selecting one
  }

  selectAddress(e) {
    this.dataForm.value['address'] = e;
  }

  closeSearch() {
    this.onSearch = false
  }
}
