import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';
import { ToastService } from 'angular-toastify';
import { AuthService } from 'app/core/auth/auth.service';
import { AwsService } from 'app/core/service/aws.service';
import { TransactionServices } from 'app/core/service/transaction.service';
import { FormDialogService } from 'app/layout/form-dialog';
import { LookupService } from 'app/core/service/lookup.service';

@Component({
  selector: 'token-list',
  templateUrl: './token-list.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TokenListComponent implements OnInit {
  public activeLang: string;
  public isloading: boolean = true

  public timePicker = new FormGroup({
    start: new FormControl(new Date(Date.now() - 64000000)),
    end: new FormControl(new Date(Date.now())),
  });

  locale = this._translateService.getActiveLang();
  public data
  constructor(
    private _translateService: TranslocoService,
    private _authService: AuthService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _transactionService: TransactionServices,
    private _formDialogService: FormDialogService,
    private _route: ActivatedRoute,
    private _toastService: ToastService,
    private _lookupService: LookupService,
    private _awsService: AwsService
  ) { }

  public authCheck: any = { role: 'operator' };

  // Pagination
  public filter = '';
  public sizePage = 6;
  public pageIndex = 0;

  ngOnInit(): void {
    this._translateService.langChanges$.subscribe((activeLang) => {
      this.activeLang = activeLang;
      this._changeDetectorRef.detectChanges();
    });

    this.authCheck = this._authService.currentUserReal;
    this.getTokenList();
    this._changeDetectorRef.detectChanges();
  }

  copyToClipboard(text: string) {
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    this._toastService.info((this.activeLang == "en" ? `Success copy id to clipboard` : `Berhasil salin id ke clipboard`))
    this._changeDetectorRef.markForCheck();
  }

  public getTokenList() {
    this._lookupService.AutoTopUpList().subscribe(
      (list) => {
        this.data = list;
        this.isloading = false
        this._changeDetectorRef.detectChanges();
      },
      (err) => {
        this.isloading = false
      }
    )
  }

  public deleteToken(token) {
    const dialogDeleteToken = this._formDialogService.open({
        title:`Delete Token`,
        message:`Are you sure you want ot delete this token?This action can't be undone!`,
        icon:{
            show:true,
            name:'heroicons_outline:trash',
            color:'warn'
        },
        actions:{
            confirm:
            {
                show:true,
                label:'OK',
                color:'warn'
            },
        },
        formValue: 'confirmed',
    });
    dialogDeleteToken.afterClosed().subscribe(async (result) =>{
        try{
            if(result === 'confirmed'){
                this._lookupService.deleteTokenFromList(token).subscribe(
                    (list) => {
                      this.data = this.data.filter(i => i.token !== token)
                      this._toastService.success((this.activeLang == "en" ? `Success delete token` : `Sukses hapus token`));
                      this._changeDetectorRef.detectChanges();
                    },
                    (err) => {
                      this._toastService.error((this.activeLang == "en" ? `Error delete token` : `Gagal hapus token`))
                      this._changeDetectorRef.detectChanges();
                    }
                  )
            }
        }catch (err){
            this._toastService.error((this.activeLang == "en" ? `Error delete token` : `Gagal hapus token`))
            this._changeDetectorRef.detectChanges();
        }
    })

  }

  trackByFn(index: number, item: any): any {
    return item.id || index;
  }
}
