import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AauthenticateModel } from 'src/models/login';
import { BehaviorSubject, map, tap } from 'rxjs';
import { AuthResponse } from 'src/models/authResponse';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { UserModel } from 'src/models/user';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root',
})
export class VeriService {
  private url: string = environment.apiUrl;
  private websocketUrl: string = environment.websocketUrl; // Add this line
  private _isLogin = new BehaviorSubject<boolean>(this.cookieService.get('jwtToken') ? true : false);
  isLogin$ = this._isLogin.asObservable();
  user = new BehaviorSubject<AuthResponse | null>(null);

  constructor(
    private http: HttpClient,
    private router: Router,
    private cookieService: CookieService
  ) {}

  public register(veri: AuthResponse) {
    veri.role = 'USER';
    return this.http.post<AuthResponse>(`${this.url}auth/register`, veri).pipe(
      tap((response) => {
        console.log(response);
      })
    );
  }

  public authenticate(veri: AauthenticateModel) {
    return this.http
      .post<AauthenticateModel>(`${this.url}auth/authenticate`, veri)
      .pipe(
        map((response) => {
          let user: AuthResponse = jwtDecode(response.access_token);
          this.user.next(user);
          this.cookieService.set('jwtToken', response.access_token);
        })
      );
  }

  public getAllUsers() {
    return this.http.get<UserModel[]>(`${this.url}auth/getUsers`);
  }

  logout() {
    this.cookieService.delete('jwtToken');
    this.router.navigate(['/login']).then(() => {
      window.location.reload();
    });
  }

  isLogin() {
    this._isLogin.next(this.cookieService.get('jwtToken') ? true : false);
  }

  // New method to connect to WebSocket
  public connectWebSocket() {
    const webSocket = new WebSocket(this.websocketUrl);
    
    webSocket.onopen = () => {
      console.log('WebSocket connection established.');
    };

    webSocket.onmessage = (event) => {
      console.log('Message from server: ', event.data);
    };

    webSocket.onerror = (error) => {
      console.error('WebSocket error: ', error);
    };

    webSocket.onclose = () => {
      console.log('WebSocket connection closed.');
    };

    return webSocket; // Return the WebSocket instance if needed
  }
}
