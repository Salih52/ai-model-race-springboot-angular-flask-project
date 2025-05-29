import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FileService } from 'src/services/file.service';
import { VeriService } from 'src/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { NewAssignComponent } from './new-assign/new-assign.component';
import { AssignModel } from 'src/models/assignModel';
import { AssignService } from 'src/services/assign.service';
import { AssignModalComponent } from './admin-assign-modal/assign-modal/assign-modal.component';
import { AdminAssignModalComponent } from './admin-assign-modal/admin-assign-modal.component';
import { UserModel } from 'src/models/user';
import { ShowUsersModalComponent } from './show-users-modal/show-users-modal.component';
import { ImageAssignComponent } from './image-assign/image-assign.component';
import { NglAssignComponent } from './ngl-assign/ngl-assign.component';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.scss']
})
export class AdminPageComponent implements OnInit{

  public assigns:AssignModel[]= [];
  public users:UserModel[] = [];

  constructor(
    private dialogRef:MatDialog,
    private assignService:AssignService,
    private authService:VeriService
  ){}

  ngOnInit(): void {
    this.assignService.getAssigns().subscribe(data => {
      this.assigns = data;
    });
  }

  newAssign(){
    this.dialogRef.open(NewAssignComponent ,{
      width:'850px',
      height:'600px'
    })
  }

  newImageAssign(){
    this.dialogRef.open(ImageAssignComponent ,{
      width:'850px',
      height:'600px'
    })
  }

  newNglAssign(){
    this.dialogRef.open(NglAssignComponent ,{
      width:'850px',
      height:'600px'
    })
  }

  odevModal(title:string){
    this.dialogRef.open(AdminAssignModalComponent ,{
      data:{assigns:this.assigns.map(assign => assign).filter(assign => assign.title == title)},
      width:'800px',
      height:'500px'
    })
  }

  deleteAssign(title:string){
    const deleteAssign:AssignModel | undefined = this.assigns.find(assign => assign.title == title);
    if (!deleteAssign) {
        console.log("Atama bulunamadı!");
        return;
    }
    
    this.assignService.deleteAssign(deleteAssign).subscribe(
      (response) => {
        this.assigns = this.assigns.filter(assign => assign.title != title);
        alert("Atama silindi!");
      },
      (error) => console.log(error)
    );
  }

  logout(){
    this.authService.logout();
  }

  showUsers(){
    this.authService.getAllUsers().subscribe(data => {
      this.users = data;
      this.dialogRef.open(ShowUsersModalComponent ,{
        width:'900px',
        height:'600px'
      })
    });
  }
}
