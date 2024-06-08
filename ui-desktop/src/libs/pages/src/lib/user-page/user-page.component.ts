import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AssignModel } from 'src/models/assignModel';
import { VeriService } from 'src/services/auth.service';
import { AssignService } from 'src/services/assign.service';
import { AssignModalComponent } from '../admin-page/admin-assign-modal/assign-modal/assign-modal.component';
import { UserAssignModalComponent } from './user-assign-modal/user-assign-modal.component';
import { CookieService } from 'ngx-cookie-service';
import { jwtDecode } from 'jwt-decode';
import { AuthResponse } from 'src/models/authResponse';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss'],
})
export class UserPageComponent implements OnInit {
  public assigns: AssignModel[] = [];
  public student: AuthResponse | null;

  constructor(
    private veriService: VeriService,
    private assignService: AssignService,
    private router: Router,
    private dialogRef: MatDialog,
    private authService: VeriService,
    private cdRef: ChangeDetectorRef,
    private cookieService: CookieService
  ) {}

  ngOnInit(): void {
    this.authService.user.subscribe((user) => {
      this.student = user;
      if (this.student) {
        this.assignService.getAssignsBySchoolNo(this.student?.schoolNo).subscribe((data) => {
          this.assigns = data;
          console.log('Assigns:', this.assigns);
        });
      }    
    });
  }

  odevModal(title: string) {
    this.dialogRef.open(UserAssignModalComponent, {
      data: {
        assigns: this.assigns
          .map((assign) => assign)
          .filter((assign) => assign.title == title),
      },
      width: '1200px',
      height: '900px',
    });
  }

  logout() {
    this.authService.logout();
  }
}
