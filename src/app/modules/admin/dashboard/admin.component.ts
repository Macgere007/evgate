import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';
import { card } from 'app/core/solar/card.types';
import { LookupService } from 'app/core/service/lookup.service';
import { siteCard } from 'app/core/solar/sitecard.types';
import { CookieService } from 'ngx-cookie-service';
import { AwsService } from 'app/core/service/aws.service';
import { ShareService } from 'app/core/service/shere.service';
import { ToastService } from 'angular-toastify';
import { FormBuilder } from '@angular/forms';
import { FormDialogService } from 'app/layout/form-dialog';
import { AllEvDialogComponent } from './all-ev-dialog/all-ev-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { StationService } from 'app/core/service/station.service';

@Component({
  selector: 'app-admin',
  styles: [
    `
        app-admin fuse-card {
            margin: 16px;
        }
    `,
  ],
  templateUrl: './admin.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminComponent implements OnInit {
  public siteCard: siteCard[] = []
  public siteCardAll: siteCard[] = []
  public activeLang: string
  public dataSummary: card = {
    EV_count: 0,
    online: 0,
    offline: 0,
    charging: 0,
    assigned: 0,
    unassigned: 0,
    EV: []
  }
  public isloading = true
  public searchEvNotAssigned = []
  private requiresSorting = false;
  public SITEForm = this.formBuilder.group({
    name: '',
    email: '',
    password: '',
    address: '',
    longitude: '',
    latitude: '',
  });

  constructor(
    private _translateService: TranslocoService,
    private _getSiteService: LookupService,
    private _stationService: StationService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _cookieService: CookieService, 
    private _shareService: ShareService,
    private _toastService: ToastService,
    private formBuilder: FormBuilder,
    private _formDialogService: FormDialogService,
    private _matDialog: MatDialog
  ) {}

  //pagination
  public filter = ''
  public sizePage = 12
  public CountOfData = 100
  public pageIndex = 0

  ngOnInit(){
    const savedPageSize = this._cookieService.get('pageSize');
    const savedPageIndex = this._cookieService.get('pageIndex');
    const savedFilter = this._cookieService.get('filter');
    const savedLang = this._cookieService.get('preferredLang');
    savedLang ? this._translateService.setActiveLang(savedLang) : '';
    savedPageSize ? (this.sizePage = parseInt(savedPageSize, 10)) : '';
    savedPageIndex ? (this.pageIndex = parseInt(savedPageIndex, 10)) : '';
    savedFilter ? (this.filter = savedFilter) : '';

    this._getSiteService.getSummary().subscribe(
      (result) => {
        this.dataSummary = result
        this.getSite()
        this.updateOnlineOfflineCounts();
        this._changeDetectorRef.detectChanges();
      }
    )

    this._translateService.langChanges$.subscribe((activeLang) => {
      this.activeLang = activeLang;
      this._cookieService.set('preferredLang', activeLang); // Save the new language in a cookie
      this._changeDetectorRef.markForCheck();
    });
    this._changeDetectorRef.markForCheck();
  }

  public getSite() {
    this._getSiteService.getSite().subscribe(
      async (result) => {
        let allasign = []
        result.length > 0 ? this.siteCardAll = result.sort((a, b) => a.name.localeCompare(b.name)) : []
        this.siteCardAll?.map(item => {
          item['custom:coordinates'] = item['custom:coordinates'].map(i => parseFloat(i).toFixed(8));
          item['online'] = 0;
          item['offline'] = 0;
          if (this.requiresSorting) {
            this.siteCardAll = this.siteCardAll.sort((a, b) => a.name.localeCompare(b.name));
            this.requiresSorting = false; // Reset the flag
          }
          this.dataSummary?.EV.map(ev => {
            if (item['custom:EV_assign'].includes(ev.id)) {
              allasign.push(ev.id)
              ev.status === 'online' ? item['online']++ : (item['offline']++);
            }
          })
        })
        this.searchEvNotAssigned = this.dataSummary.EV.filter(ev => !allasign.includes(ev.id))
        this.CountOfData = this.siteCardAll.length
        this.siteCard = [...this.siteCardAll.filter(item => JSON.stringify(item).toLowerCase().includes(this.filter)).filter((item, index) => (index >= this.pageIndex * this.sizePage) && (index < (this.pageIndex + 1) * this.sizePage))]
        this.isloading = false
        this._changeDetectorRef.detectChanges();
      }
    )
  }

  private updateOnlineOfflineCounts() {
    this.siteCardAll.forEach(item => {
      const onlineCount = this.dataSummary?.EV.reduce((count, ev) => {
        if (item['custom:EV_assign'].includes(ev.id) && ev.status === 'online') {
          return count + 1;
        }
        return count;
      }, 0);
      const offlineCount = this.dataSummary?.EV.reduce((count, ev) => {
        if (item['custom:EV_assign'].includes(ev.id) && ev.status !== 'online') {
          return count + 1;
        }
        return count;
      }, 0);

      item['online'] = onlineCount;
      item['offline'] = offlineCount;
    });
  }

  public onSearch(e) {
    this.filter = e.toLowerCase()
    if (!e || e.trim() === '') {
      this.siteCard = [...this.siteCardAll.filter((item, index) => index < this.sizePage)]
      this.CountOfData = this.siteCardAll.length
      this._cookieService.delete('filter')
    } else {
      this.siteCard = this.siteCardAll.filter((item, index) =>
        JSON.stringify(item).toLowerCase().includes(this.filter)
      );
      this.CountOfData = this.siteCard.length
      this.pageIndex = 0
      this.siteCard = [...this.siteCard.filter((item, index) => index < this.sizePage)]
      this._shareService.setCoockies('filter', this.filter);
    }
    this._changeDetectorRef.detectChanges();
  }

  public async onPageChange(e) {
    this.sizePage = e.pageSize
    this.pageIndex = e.pageIndex
    this.siteCard = [...this.siteCardAll.filter(item => JSON.stringify(item).toLowerCase().includes(this.filter)).filter((item, index) => (index >= e.pageIndex * e.pageSize) && (index < (e.pageIndex + 1) * e.pageSize))]
    this._shareService.setCoockies('pageSize', this.sizePage);
    this._shareService.setCoockies('pageIndex', this.pageIndex);
    this._changeDetectorRef.detectChanges();
  }

  public async addSite() {
    this.SITEForm.value.name = ''
    this.SITEForm.value.email = ''
    this.SITEForm.value.password = ''
    this.SITEForm.value.address = ''
    this.SITEForm.value.longitude = ''
    this.SITEForm.value.latitude = ''
    const dialogAddSite = this._formDialogService.open({
      title: `Add Site`,
      message: `Fill in the field of form to add station site`,
      icon: {
        show: true,
        name: 'heroicons_outline:location-marker',
        color: 'primary',
      },
      actions: {
        confirm: {
          show: true,
          label: 'Add',
          color: 'bg-primary',
        },
      },
      form: ['name', 'email', 'password', 'address', 'longitude','latitude'],
      formValue: this.SITEForm,
      dismissible: true
    });
    dialogAddSite.afterClosed().subscribe(async (result) => {
      if (result && result !== 'cancelled') {
        this._getSiteService.createSite(result.value).subscribe(
          newdata => {
            const newSite = {
              id: newdata.id,
              address: newdata.address,
              'custom:coordinates': [newdata.longitude, newdata.latitude],
              'custom:EV_assign': [],
              name: newdata.name,
              email: newdata.email
            };
            this.siteCardAll.unshift(newSite); // Add at the beginning
            this.CountOfData++;
            this.requiresSorting = true; // Set the flag
            this.siteCard = [...this.siteCardAll.filter(item => JSON.stringify(item).toLowerCase().includes(this.filter)).filter((item, index) => (index >= this.pageIndex * this.sizePage) && (index < (this.pageIndex + 1) * this.sizePage))];
            this.updateOnlineOfflineCounts();
            this._toastService.success(this.activeLang == 'en'? 'Success create site': 'Sukses membuat site')
            this._changeDetectorRef.detectChanges();
          }, err => {
            if (err && err.error.includes('An account with the given email already exists')) {
                this._toastService.error(this.activeLang == 'en' ? 'Email already exists' : 'Email sudah ada');
            } else {
                this._toastService.error(this.activeLang == 'en' ? 'Error create site' : 'Error membuat site');
            }
          }
        );
      }
    })
  }

  public deleteSite(id: string) {
    this.siteCardAll = this.siteCardAll.filter(i => i.id !== id)
    this.CountOfData--
    this.siteCard = [...this.siteCardAll.filter(item => JSON.stringify(item).toLowerCase().includes(this.filter)).filter((item, index) => (index >= this.pageIndex * this.sizePage) && (index < (this.pageIndex + 1) * this.sizePage))]
  }

  public assignUnassign(t) {
    this.dataSummary.assigned += t.n
    this.dataSummary.unassigned -= t.n
    if (t.n > 0) {
      this.searchEvNotAssigned = this.searchEvNotAssigned.filter(i => i.id !== t.ev)
    } else {
      this.searchEvNotAssigned.push({ id: t.ev, status: '', charging: false })
    }
    this._cookieService.deleteAll()
    this._changeDetectorRef.detectChanges();
  }

  public showAllEvgate(){
    const dialogRef = this._matDialog.open(AllEvDialogComponent,{
      width : '100%',
      data : this.dataSummary.EV
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const isAssign = this.searchEvNotAssigned.findIndex(i => i.id === result)
        console.log(isAssign)
        isAssign >=0 ? this._stationService.deleteEvgate(result).subscribe(
          res => {
            this.dataSummary.EV = this.dataSummary.EV.filter(i => i.id !== result)
            this.searchEvNotAssigned = this.searchEvNotAssigned.filter(i => i.id !== result)
            this.dataSummary.EV_count --     
            this._toastService.success('Success delete EVGate')
          }, err => {
            this._toastService.error('Error delete EVGate')
          }
        ) : this._toastService.error('EVGate Is Assigned')
        
      }
    });
  }

}
