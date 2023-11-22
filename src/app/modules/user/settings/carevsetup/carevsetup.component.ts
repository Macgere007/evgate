import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslocoService } from '@ngneat/transloco';
import { ToastService } from 'angular-toastify';
import { AuthService } from 'app/core/auth/auth.service';
import { LookupService } from 'app/core/service/lookup.service';

@Component({
  selector: 'settings-carevsetup',
  templateUrl: './carevsetup.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CarevsetupComponent implements OnInit {
  sendData: any = {};
  form: FormGroup;
  public activeLang: string;
  public loading: boolean = false
  car: any[] = []; // Initialize it as an empty array
  selectedCarBrand: string;
  selectedCarType: string;
  selectedCarBrandTypes: string[] = []; // Initialize as an empty array


  constructor(
    private _lookupService: LookupService,
    private _translateService: TranslocoService,
    private _authService: AuthService,
    private _toastService: ToastService,
    private _changeDetectorRef: ChangeDetectorRef,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      brand: [null, [Validators.required]],
      type: [null, [Validators.required]],
      capacity: [null, [Validators.required, Validators.min(1)]],
    //   brandupdate: [null, [Validators.required]],
    //   typeupdate: [null, [Validators.required]],
    //   capacityupdate: [null, [Validators.required, Validators.min(1)]]
    });

  }

  async ngOnInit() {
    // this.getEvCar();
    this._translateService.langChanges$.subscribe((activeLang) => {
      this.activeLang = activeLang;
    });
  }

  async onSubmit(form: any) {
    if (this.form.valid) {
      this.loading = true;
      this._lookupService.createEvCar(
        this.sendData.brandname.toLowerCase().split(' ').join(''),
        this.sendData.typename.toLowerCase(),
        this.sendData.capacityname
      ).subscribe(res => {
        setTimeout(() => {
          this.loading = false;
          this._toastService.success((this.activeLang == "en" ? `Car successfully added!` : `Mobil telah berhasil ditambahkan!`));
          this._changeDetectorRef.detectChanges();

          // Clear the form after successful submission
          this.resetAll();
        }, 2000);
      }, err => {
        this._toastService.error((this.activeLang == "en" ? `Car add failed!` : `Mobil gagal ditambahkan!`));
        this.loading = false;
        this._changeDetectorRef.detectChanges();
      });
    } else {
      this._toastService.error((this.activeLang == "en" ? `Form is invalid. Please fill in all data correctly.` : `Form tidak valid. Mohon isi semua data dengan benar`));
    }
  }

  public resetAll() {
    this.form.reset();
  }


}
