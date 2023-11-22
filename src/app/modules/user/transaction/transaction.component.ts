import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';
import { ToastService } from 'angular-toastify';
import { AuthService } from 'app/core/auth/auth.service';
import { AwsService } from 'app/core/service/aws.service';
import { TransactionServices } from 'app/core/service/transaction.service';
import { FormDialogService } from 'app/layout/form-dialog';
import { IDataTransaction, IFilter, ITransaction } from 'app/models/transaction.types';
import moment from 'moment';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
})
export class TransactionComponent implements OnInit {
  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this._changeDetectorRef.detectChanges();
  }
}
