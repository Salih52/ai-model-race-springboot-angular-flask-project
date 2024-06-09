import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserModel } from 'src/models/user';
import { AssignService } from 'src/services/assign.service';
import { VeriService } from 'src/services/auth.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-show-users-modal',
  templateUrl: './show-users-modal.component.html',
  styleUrls: ['./show-users-modal.component.scss']
})
export class ShowUsersModalComponent implements OnInit{
  users: UserModel[] = [];
  constructor(
    private authService:VeriService,
  ) { }

  ngOnInit(): void {
    this.authService.getAllUsers().subscribe(data => {
      this.users = data;
    });
  }

  
  exportExcel(){
    const ws = XLSX.utils.json_to_sheet(this.users);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb,ws, 'Placeholder');

    XLSX.writeFile(wb, 'UserList.xlsx')
  }

  
}
