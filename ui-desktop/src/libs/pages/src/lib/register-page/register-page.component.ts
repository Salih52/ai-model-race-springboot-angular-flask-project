import { Component } from '@angular/core';
import { FormGroup, NgForm ,FormControl, FormBuilder } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { VeriService } from 'src/services/auth.service';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss']
})
export class RegisterPageComponent {

  constructor(
    private service:VeriService,
    private routing:Router
  ) { }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      Object.keys(form.controls).forEach(field => {
        const control = form.control.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
      return;
    }
    this.service.register(form.value).subscribe(
      response => alert("Kayıt başarılı"),
      error => alert("Kayıt başarısız,Email veya Okul no kullanılmış olabilir.")
    );
    this.routing.navigate(["/login"]);
  }
}
