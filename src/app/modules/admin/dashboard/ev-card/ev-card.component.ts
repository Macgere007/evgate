
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';
import { LookupService } from 'app/core/service/lookup.service';
import { siteCard } from 'app/core/solar/sitecard.types';
import { FormDialogService } from 'app/layout/form-dialog';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { EV } from 'app/core/solar/card.types';
import { ToastService } from 'angular-toastify';


@Component({
  selector: 'app-ev-card',
  templateUrl: './ev-card.component.html',
  styleUrls: ['./ev-card.component.scss']
})
export class EvCardComponent implements OnInit {
  public activeLang: string;
  @Input() public item: siteCard
  @Input() public dataEV : EV[] = []
  @Output() public deleteSiteUi = new EventEmitter<any>();
  @Output() public assignUnassign = new EventEmitter<any>();
  public searchEvAssign = new FormControl()
  public searchEvId = [];
  public selectedEVId: string = '';


  public EDITFORM = this.formBuilder.group({
    email: '',
    name: '',
    address: '',
    password: '',
    longitude: '',
    latitude: ''
  })

  constructor(
    private route: ActivatedRoute,
    private _translateService: TranslocoService,
    private _formDialogService: FormDialogService,
    private formBuilder: FormBuilder,
    private _getSiteService: LookupService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _toastService: ToastService
  ) {
  }
  async ngOnInit(): Promise<void> {
    this.route.queryParams.subscribe(params => {
      params['site_id'];
    });

    this.searchEvAssign.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(async (query: string) => {
        let arr = []
        if (query.length > 1) {
          arr = [...this.dataEV]
          console.log(arr)
          this.searchEvId = arr.filter((ev) => ev.id.includes(query));
        } else {
          this.searchEvId = [];
        }
        this._changeDetectorRef.markForCheck();
      });

    this._translateService.langChanges$.subscribe((activeLang) => {

      // Get the active lang
      this.activeLang = activeLang;
    });
  }

  public assignev() {
    this.EDITFORM.patchValue({ name: this.selectedEVId });
    const dialogAssignEV = this._formDialogService.open({
      title: `Change this Station Name and Assign to this Station`,
      message: `Fill this form to change the station name`,
      icon: {
        show: true,
        name: 'mat_outline:ev_station',
        color: 'primary',
      },
      actions: {
        confirm: {
          show: true,
          label: 'Apply',
          color: 'primary',
        },
      },
      form: ['name'],
      formValue: this.EDITFORM,
      dismissible: true
    });

    dialogAssignEV.afterClosed().subscribe(async (result) => {
        if (result && result !== 'cancelled') {
          this._getSiteService.assignev(this.item.email, this.selectedEVId, result?.value?.name || this.selectedEVId).subscribe(
            res => {
              this.assignUnassign.emit({n:1, ev:this.selectedEVId});
              this._toastService.success((this.activeLang == "en" ? `EV has been assign` : `EV telah di tambahkan`));
              this.searchEvId = [];
              this.searchEvAssign.setValue('')
              this.item['custom:EV_assign'].push(this.selectedEVId)
              res?.status === "0" ? (this.item["offline"] ++ ) : (this.item["online"] ++ )
              this._changeDetectorRef.markForCheck();
            }, err => {
              err.message === 'Request failed with status code 400' ?
              this._toastService.error((this.activeLang == "en" ? `EV ${result?.value?.name || this.selectedEVId} failed to add because it was already connected to another location` : `EV ${result?.value?.name || this.selectedEVId} gagal ditambahkan karena sudah terhubung ke lokasi lain`))
              : this._toastService.error(err);
              this.searchEvId = [];
            });
        }
    });
  }

  public unassignev(index: number) {
    const dialogUnAssignEV = this._formDialogService.open({
      title: `Unassign Station Name to this Station`,
      message: `Are you sure you want to unassign this station? This Action can't be undone!`,
      icon: {
        show: true,
        name: 'heroicons_outline:trash',
        color: 'warn',
      },
      actions: {
        confirm: {
          show: true,
          label: 'OK',
          color: 'warn',
        },
      },
      formValue: 'confirmed',
    });

    dialogUnAssignEV.afterClosed().subscribe(async (result) => {
      try {
        if (result === 'confirmed') {
          const idAssign = this.item['custom:EV_assign'];
          this.assignUnassign.emit({n:-1, ev: idAssign[index]})
          if (index >= 0 && index < idAssign.length) {
            const removedElement = idAssign.splice(index, 1);
            const id = removedElement[0];
            this._getSiteService.unassignev(this.item.email, id).subscribe(res => {
              res?.status === "0" ? (this.item["offline"] -- ) : (this.item["online"] -- )
              this._toastService.success((this.activeLang == "en" ? `EV has been unassign` : `EV telah di hapus`))
              this._changeDetectorRef.markForCheck();
            });
          }
        }

      } catch (error) {
        // console.log(error)
      }
    });
  }


  public deletesite() {
    const dialogDeleteSite = this._formDialogService.open({
      title: `Delete Station Site`,
      message: `Are you sure you want to delete this station site? This Action can't be undone!`,
      icon: {
        show: true,
        name: 'heroicons_outline:trash',
        color: 'warn',
      },
      actions: {
        confirm: {
          show: true,
          label: 'OK',
          color: 'warn',
        },
      },
      formValue: 'confirmed',
    });
    dialogDeleteSite.afterClosed().subscribe(async (result) => {
      try {
        if (result === 'confirmed') {
          this._getSiteService.deleteSite(this.item.email).subscribe(res => {
            this.deleteSiteUi.emit(this.item.id)
            this._toastService.success((this.activeLang == "en" ? `Site has been deleted` : `Lokasi telah di hapus`))
          }, err => {
            this._toastService.error((this.activeLang == "en" ? `Unassign EV first before delete site` : `Hapus EV dahulu sebelum hapus lokasi`))
          })
        }
      } catch (error) {
        this._toastService.success((this.activeLang == "en" ? `Site failed to be deleted` : `Lokasi telah gagal hapus`))
      }

    })
  }

  public updatesite() {
    this.EDITFORM.value.name = this.item.name
    this.EDITFORM.value.address = this.item.address
    this.EDITFORM.value.email = this.item.email
    this.EDITFORM.value.longitude = this.item['custom:coordinates'][0]
    this.EDITFORM.value.latitude = this.item['custom:coordinates'][1]
    const dialogAssignEV = this._formDialogService.open({
      title: `Update Station Site`,
      message: `Fill this form to edit station site`,
      icon: {
        show: true,
        name: 'mat_outline:ev_station',
        color: 'primary',
      },
      actions: {
        confirm: {
          show: true,
          label: 'Apply',
          color: 'primary',
        },
      },
      form: ['name', 'address', 'longitude', 'latitude'],
      formValue: this.EDITFORM,
      dismissible: true
    });

    dialogAssignEV.afterClosed().subscribe(async (result) => {
      try {
        if (result !== 'cancelled') {
          this._getSiteService.updateSite(result.value).subscribe(res => {})
          this._changeDetectorRef.detectChanges();
          this._toastService.success((this.activeLang == "en" ? `Site has been updated` : `Lokasi telah di ubah`))
          this.item.address = result.value.address
          this.item.name = result.value.name
          this.item['custom:coordinates'][0] = result.value.longitude
          this.item['custom:coordinates'][1] = result.value.latitude
          this.item.email = result.value.email
          this._changeDetectorRef.markForCheck();
        }
      } catch (error) {
        // console.log(error)
      }
    });
  }
}
