import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { TransactionComponent } from './transaction.component';
import { TransactionEvgateModule } from '../transactions-list/transaction-evgate/transaction-evgate.module';

const routes: Routes = [
    { path: '', component: TransactionComponent }
];

@NgModule({
    declarations: [
        TransactionComponent,
    ],
    imports: [
        CommonModule,
        TransactionEvgateModule,
        RouterModule.forChild(routes)
    ]
})
export class TransactionModule { }
