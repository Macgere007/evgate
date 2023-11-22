import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslocoService } from '@ngneat/transloco';
import { ToastService } from 'angular-toastify';
import { AuthService } from 'app/core/auth/auth.service';
import { LookupService } from 'app/core/service/lookup.service';

@Component({
  selector: 'settings-egatewaysetup',
  templateUrl: './egatewaysetup.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EgatewaysetupComponent implements OnInit {
  sendData: any = {};
  form: FormGroup;
  public activeLang: string;
  public loading: boolean = false

  constructor(
    private _lookupService: LookupService,
    private _translateService: TranslocoService,
    private _authService: AuthService,
    private _toastService: ToastService,
    private _changeDetectorRef: ChangeDetectorRef,
    private fb: FormBuilder
    ) {
      this.form = this.fb.group({
        leakage: [null, [Validators.required, Validators.min(0.2)]],
        power: [null, [Validators.required, Validators.min(8000)]],
        temperature: [null, [Validators.required, Validators.min(60)]]
      });
    }

  async ngOnInit() {
    this._translateService.langChanges$.subscribe((activeLang) => {
      this.activeLang = activeLang;
    });
    this._lookupService.getSiteById(this._authService.currentUserReal.id).subscribe(
      (res) => {
        const defaultLimit = res['custom:default_limit'];
        this.sendData.DefaultLeakage = parseFloat(defaultLimit.leakage);
        this.sendData.DefaultPower = defaultLimit.power;
        this.sendData.DefaultTemperature = defaultLimit.temperature;
        this._changeDetectorRef.detectChanges();
      }, err => {
        // console.error('Error fetching site data:', err);
      });
  }

  async onSubmit(form: any) {
    if (this.form.valid) {
      this.loading = true
      this._lookupService.putSettingDefault(
        this.sendData.DefaultLeakage,
        this.sendData.DefaultPower,
        this.sendData.DefaultTemperature
      ).subscribe(res => {
        setTimeout(()=>{
          this.loading = false
          console.log('g')
          this._authService.currentUserReal = {...this._authService.currentUserReal, default_limit: JSON.stringify(this.form.value)}
          this._toastService.success((this.activeLang == "en" ? `Settings updated successfully!` : `Pengaturan berhasil diupdate!`))    
          this._changeDetectorRef.detectChanges();  
        }, 2000)
      }, err => {
        this._toastService.error((this.activeLang == "en" ? `Settings updated failed!` : `Pengaturan gagal diupdate!`))
        this.loading = false
        this._changeDetectorRef.detectChanges();  
      });
    } else {
      this._toastService.error((this.activeLang == "en" ? `Form is invalid. Please fill in all data correctly.` : `Form tidak valid. Mohon isi semua data dengan benar`))
    }
  }
  public resetAll(){
    this.form.reset()
  }
}
