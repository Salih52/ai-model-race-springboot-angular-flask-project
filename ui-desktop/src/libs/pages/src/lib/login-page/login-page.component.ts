import { Component, OnInit } from '@angular/core';
import { FormBuilder, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { VeriService } from 'src/services/auth.service';
import { AuthResponse } from 'src/models/authResponse';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
  private webSocket: WebSocket | null = null; // Store the WebSocket instance

  constructor(
    private router: Router,
    private authService: VeriService,
  ) {}

  ngOnInit(): void {
    this.authService.user.subscribe((user) => {
      if (user) {
        if (user.role === "ADMIN") {
          this.router.navigate(['/admin']);
        } else if (user.role === "USER") {
          this.router.navigate(['/userPage']);
        }
      }
    });
  }

  onSubmit(form: NgForm) {
    this.authService.authenticate(form.value).subscribe(
      (response) => {
        this.authService.user.subscribe(data => {
          if (data) {
            this.connectWebSocket(); // Connect to WebSocket on successful login
            if (data.role === "ADMIN") {
              this.router.navigate(['/admin']).then(() => {
                window.location.reload();
              });
            } else if (data.role === "USER") {
              this.router.navigate(['/userPage']).then(() => {
                window.location.reload();
              });
            }
          }
        });
      },
      (error) => {
        console.log(error);
        alert("Kullanıcı adı veya şifre hatalı");
      }
    );
  }

  private connectWebSocket() {
    this.webSocket = this.authService.connectWebSocket(); // Use the method from your service

    this.webSocket.onmessage = (event) => {
      console.log('Message from server:', event.data);
      // Handle incoming messages here
    };

    this.webSocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.webSocket.onclose = () => {
      console.log('WebSocket connection closed.');
    };
  }
}
