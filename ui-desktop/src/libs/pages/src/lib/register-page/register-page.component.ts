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

  onSubmit(form:NgForm){
    this.service.register(form.value).subscribe(
      (response) => console.log(response),
      (error) => console.log(error)
    )
      this.routing.navigate(["/login"])
  }
}
