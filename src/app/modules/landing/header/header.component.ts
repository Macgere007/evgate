import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { AuthService } from 'app/core/auth/auth.service';

@Component({
  selector: 'header-component',
  templateUrl: './header.component.html',
  exportAs: 'headerShow',
})

export class HeaderComponent implements OnInit {
  
  authenticated = false
  @Input() public params = {}

  constructor(private _router: Router, private _authService:AuthService) { }

  ngOnInit(): void {
    this.authenticated = this._authService.isAuthenticated()
    if (!this.authenticated) {
        localStorage.clear()
    } 
  }

  goToLogin() {
    console.log('login', this.params)
    this._router.navigate([this.authenticated ? '/sign-out' : 'sign-in'], { queryParams: this.params})
  }
}