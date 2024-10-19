import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { Form, NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FileModel } from 'src/models/file';
import { AssignService } from 'src/services/assign.service';
import { FileService } from 'src/services/file.service';
import { VeriService } from 'src/services/auth.service';
import { AssignModel } from 'src/models/assignModel';

@Component({
  selector: 'app-new-assign',
  templateUrl: './new-assign.component.html',
  styleUrls: ['./new-assign.component.scss']
})
export class NewAssignComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: AssignModel,
    private fileService:FileService,
    private assignService:AssignService,
    private dialog:MatDialog,
    private router:Router,
  ){}

  ngOnInit(): void {
      // this.fileInfos = this.fileService.getFiles("123");
  }
  
  selectedFiles?: FileList;
  selectedTestFile?: FileList;
  printFiles:File[] = [];
  printTestFiles:File[] = [];
  currentFile?: File;
  progress = 0;
  message = '';
  titleee: string;

  fileInfos?: Observable<any>;

  selectFile(event: any): void {
    this.printFiles = Array.from(event.target.files);
    this.selectedFiles = event.target.files;
  }

  selectTestFile(event: any): void {
    this.printTestFiles = Array.from(event.target.files);
    this.selectedTestFile = event.target.files;
  }

  upload(): void {
    this.progress = 0;
    if (this.selectedTestFile) {
        this.fileService.upload(this.selectedTestFile,this.titleee , this.selectedFiles).subscribe({
          next: (event: any) => {
            console.log('dosya yükleme');
            if (event.type === HttpEventType.UploadProgress) {
              this.progress = Math.round(100 * event.loaded / event.total);
            } else if (event instanceof HttpResponse) {
              this.message = event.body.message;
              // this.fileInfos = this.fileService.getFiles("123");
            }
          },
          error: (err: any) => {
            console.log(err);
            this.progress = 0;

            if (err.error && err.error.message) {
              this.message = err.error.message;
            } else {
              this.message = 'Could not upload the file!';
            }

            this.currentFile = undefined;
          }
        });

      this.selectedFiles = undefined;
    }
  }

  // delete(){
  //   this.fileService.deleteFiles().subscribe({
  //     next: (event: any) => {
  //       this.message = event.body.message;
  //       this.fileInfos = this.fileService.getFiles("123");
  //     },
  //     error: (err: any) => {
  //       console.log(err);
  //       this.message = 'Could not delete the files!';
  //     }
  //   });
  // }

  onSubmit(form:NgForm){
    this.progress = 0;
    if (this.selectedTestFile) {
        this.fileService.upload(this.selectedTestFile,this.titleee , this.selectedFiles).subscribe({
          next: (event: any) => {
            console.log('dosya yükleme');
            if (event.type === HttpEventType.UploadProgress) {
              this.progress = Math.round(100 * event.loaded / event.total);
            } else if (event instanceof HttpResponse) {
              this.message = event.body.message;
              // this.fileInfos = this.fileService.getFiles("123");
            }
          },
          error: (err: any) => {
            console.log(err);
            this.progress = 0;

            if (err.error && err.error.message) {
              this.message = err.error.message;
            } else {
              this.message = 'Could not upload the file!';
            }

            this.currentFile = undefined;
            return;
          }
        });

      this.selectedFiles = undefined;
    }


    this.assignService.newAssign(form.value).subscribe({
      next: (event: any) => {
        alert("Assign created successfully");
        this.dialog.closeAll();
        window.location.reload();
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  update(updateForm:NgForm){
    this.assignService.updateAssign(this.data.title,updateForm.value).subscribe({
      next: (event: any) => {
        this.upload();
        alert("Assign updated successfully");
        this.dialog.closeAll();
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }
}
