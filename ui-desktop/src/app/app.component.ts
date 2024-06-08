import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { VeriService } from 'src/services/auth.service';
import { map, tap } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { jwtDecode } from 'jwt-decode';
import { AuthResponse } from 'src/models/authResponse';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit{
  isDropdownOpen: boolean = false;
  constructor(public veriService: VeriService,public authService:VeriService,private cookieService:CookieService) {}

  isLogin: boolean = false;
  user:AuthResponse | null;

  ngOnInit(): void {
    if(this.cookieService.get('jwtToken')){
      this.authService.user.next(jwtDecode(this.cookieService.get('jwtToken')))
    }
    this.veriService.isLogin$.subscribe((isLogin) => {
      this.isLogin = isLogin;
    });
    this.authService.user.subscribe((user) => {
      this.user = user;
    });
  }

  openDropdown() {
    this.isDropdownOpen = true;
  }

  closeDropdown() {
    this.isDropdownOpen = false;
  }

  logout(){
    this.authService.logout();
  }
}
