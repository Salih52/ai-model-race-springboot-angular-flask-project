import { Component, OnInit } from '@angular/core';
import { FormBuilder , FormGroup, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { CookieService } from 'ngx-cookie-service';
import { AssignModel } from 'src/models/assignModel';
import { AuthResponse } from 'src/models/authResponse';
import { VeriService } from 'src/services/auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit{

  constructor(
    private formBuilder: FormBuilder,
    private routerModule: Router,
    private authService:VeriService,
    private cookieService:CookieService
  ) { 
  }
  ngOnInit(): void {
    this.authService.user.subscribe((user) => {
      if (user) {
        if (user.role == "ADMIN") {
          this.routerModule.navigate(['/admin']);
        }
        else if (user.role == "USER") {
          this.routerModule.navigate(['/userPage']);
        }
      }
      });
  }
  onSubmit(form:NgForm){
    this.authService.authenticate(form.value).subscribe(
      (response) => {
        this.authService.user.subscribe(data => {
          if (data?.role == "ADMIN") {
            this.routerModule.navigate(['/admin']).then(() => {
              window.location.reload();
            });
          }
          else if (data?.role == "USER") {
            this.routerModule.navigate(['/userPage']).then(() => {
              window.location.reload();
            });
          }
        });
      },
      (error) => {
        console.log(error);
        alert("Kullanıcı adı veya şifre hatalı");
      }
    )
  }
}
