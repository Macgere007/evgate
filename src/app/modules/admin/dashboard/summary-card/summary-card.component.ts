import { Component, Input, OnInit } from '@angular/core';
import { card } from 'app/core/solar/card.types';

@Component({
  selector: 'app-summary-card',
  templateUrl: './summary-card.component.html'
})
export class SummaryCardComponent implements OnInit {
  @Input() public statusCard : card

  constructor() {
}

async ngOnInit(): Promise<void> {
  
 }




}
