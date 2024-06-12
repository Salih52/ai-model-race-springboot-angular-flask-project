import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { AauthenticateModel } from 'src/models/login';
import { BehaviorSubject, Subject, map, tap } from 'rxjs';
import { AuthResponse } from 'src/models/authResponse';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { UserModel } from 'src/models/user';

@Injectable({
  providedIn: 'root',
})
export class VeriService{
  private url: string;
  private token: string;
  private _isLogin = new BehaviorSubject<boolean>(this.cookieService.get('jwtToken') ? true : false);
  isLogin$ = this._isLogin.asObservable();
  user = new BehaviorSubject<AuthResponse | null>(null);

  constructor(
    private http: HttpClient,
    private router: Router,
    private cookieService: CookieService
  ) {
    this.url = 'http://backend:8080/api/v1/auth';
  }

  public register(veri: AuthResponse) {
    veri.role = 'user';
    return this.http.post<AuthResponse>(`${this.url}/register`, veri).pipe(
      tap((response) => {
        console.log(response);
      })
    );
  }

  public authenticate(veri: AauthenticateModel) {
    return this.http
      .post<AauthenticateModel>(`${this.url}/authenticate`, veri)
      .pipe(
        map((response) => {
          let user: AuthResponse = jwtDecode(response.access_token);
          this.user.next(user);
          this.cookieService.set('jwtToken',response.access_token);
        })
      );
  }

  public getAllUsers(){
    return this.http.get<UserModel[]>(`${this.url}/getUsers`);
  }

  logout() {
    this.cookieService.delete('jwtToken');
    this.router.navigate(['/login']).then(() => {
      window.location.reload();
    });
  }

  isLogin(){
    this._isLogin.next(this.cookieService.get('jwtToken') ? true : false);
  }
}
