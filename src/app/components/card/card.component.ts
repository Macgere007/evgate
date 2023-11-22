import { Component, Input, OnInit } from '@angular/core';


@Component({
  selector: 'app-card',
  templateUrl: './card.component.html'
})
export class CardComponent{
  @Input() public title = ''
  @Input() public value = null
  @Input() public unit = undefined
  @Input() public icon = null
  @Input() public icon_color = ''
  @Input() public style = ''
  @Input() public loading = false
  @Input() public icon_bottom=false
}
