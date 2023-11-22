import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewEncapsulation, } from '@angular/core';
import { AvailableLangs, TranslocoService } from '@ngneat/transloco';
import { ApexOptions } from 'ng-apexcharts';
import { dashboard, leakage_current_value, power, temperature } from 'app/core/solar/dashboard.types';
import { LookupService } from 'app/core/service/lookup.service';
import moment from 'moment';
import { DateTime } from 'luxon';
import { FormBuilder } from '@angular/forms';
import { FormDialogService } from 'app/layout/form-dialog';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { StationService } from 'app/core/service/station.service';
import { ToastService } from 'angular-toastify';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-dashboard-card',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss']
})
export class GraphCardComponent implements OnInit {

  @Input() public title: string
  @Input() public data: any
  @Input() public isloadingGraph: boolean

  constructor(
  ) { }

  async ngOnInit(){
    console.log(this.data, 'adas')
  }
}
