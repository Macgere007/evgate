import { Component, Inject, ElementRef, ViewChild, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormDialogService } from 'app/layout/form-dialog';

@Component({
  selector: 'app-all-ev-dialog',
  templateUrl: './all-ev-dialog.component.html',
})
export class AllEvDialogComponent implements OnInit {
  @ViewChild('labelInput') labelInput: ElementRef<HTMLInputElement>;
  public showdata = []
  constructor(
    public matDialogRef: MatDialogRef<AllEvDialogComponent>,
    private _formDialogService: FormDialogService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
  }
  ngOnInit(): void {
    this.showdata = this.data
  }

  onSearch(e){
    this.showdata = this.data.filter(i => JSON.stringify(i).includes(e))
  }

  selectIcon(i) {
    if (this.showdata[i].charging) {
      return {icon:'offline_bolt', color: 'text-yellow-500', status: 'charging'}
    } else if (this.showdata[i].status === 'offline') {
      return {icon:'ev_station', color: 'text-slate-500', status: 'sleep'}
    } else {
      return {icon:'ev_station', color: 'text-blue-500', status: 'standby'}
    }
  }

  deleteEvgate(id){
    const dialogDeleteEV = this._formDialogService.open({
      title: `Delete EVgate`,
      message: `Are you sure you want to delete this EVgate? This Action can't be undone!`,
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
    dialogDeleteEV.afterClosed().subscribe(async (result) => {
      try {
        if (result === 'confirmed') {
           this.matDialogRef.close(id);
        }
      }catch (error) {
    // console.log(error)
      }
    });
}
}
