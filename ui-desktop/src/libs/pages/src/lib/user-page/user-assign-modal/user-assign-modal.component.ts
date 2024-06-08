import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, Inject, Input, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { CookieService } from 'ngx-cookie-service';
import { AssignModel } from 'src/models/assignModel';
import { AuthResponse } from 'src/models/authResponse';
import { FileModel } from 'src/models/file';
import { AssignService } from 'src/services/assign.service';
import { VeriService } from 'src/services/auth.service';
import { FileService } from 'src/services/file.service';
import { ResultsPageComponent } from '../../all-assigns-page/assign-page/results-page/results-page.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-user-assign-modal',
  templateUrl: './user-assign-modal.component.html',
  styleUrls: ['./user-assign-modal.component.scss'],
})
export class UserAssignModalComponent implements OnInit {
  selectedFiles?: FileList;
  printFiles: File[] = [];
  currentFile?: File;
  progress = 0;
  message = '';
  studentNo: string;
  fileInfos?: FileModel[] | undefined;
  adminFileInfos?: FileModel[] | undefined;
  student: AuthResponse | null;

  private route = inject(ActivatedRoute);
  assigns?: AssignModel;

  constructor(
    private fileService: FileService,
    private authService: VeriService,
    private assignService: AssignService,
    private dialogRef:MatDialog
  ) {}
  ngOnInit(): void {
    const assignName = String(this.route.snapshot.paramMap.get('assignName'));

    this.assignService.getAssigns().subscribe((data) => {
      this.assigns = data.find((assign) => assign.title == assignName);
      console.log(this.assigns);
      this.authService.user.subscribe((user) => {
        this.student = user;
        this.studentNo = this.student?.schoolNo ? this.student.schoolNo : '';
        if (this.student?.schoolNo && this.assigns?.title) {
            this.fileService
            .getFilesUser(this.student.schoolNo, this.assigns.title)
            .subscribe(
              (files) => {
                this.fileInfos = files.length > 0 ? files : undefined;
              },
              (error) => {
                console.error('Dosya alınırken bir hata oluştu:');
                // Hata durumunda fileInfos dizisini boşaltabilirsiniz veya başka bir işlem yapabilirsiniz.
                this.fileInfos = undefined;
                // veya
                // this.fileInfos = [];
              }
            );
        }
      });
        if (this.assigns?.title) {
          this.fileService.getFilesAdmin(this.assigns.title).subscribe(
            (files) => {
              this.adminFileInfos = files.length > 0 ? files : undefined;
            },
            (error) => {
              console.error('Dosya alınırken bir hata oluştu:', error);
              // Hata durumunda fileInfos dizisini boşaltabilirsiniz veya başka bir işlem yapabilirsiniz.
              this.fileInfos = undefined;
              // veya
              // this.fileInfos = [];
            }
          );
        }
    });
  }

  selectFile(event: any): void {
    this.printFiles = Array.from(event.target.files);
    this.selectedFiles = event.target.files;
  }

  upload(): void {
    this.progress = 0;
    console.log("no:"+this.studentNo)
    if (this.selectedFiles) {
      if (this.selectedFiles && this.studentNo && this.assigns?.title) {
        this.fileService
          .uploadUser(this.selectedFiles, this.studentNo, this.assigns?.title)
          .subscribe({
            next: (event: any) => {
              if (event.type === HttpEventType.UploadProgress) {
                this.progress = Math.round((100 * event.loaded) / event.total);
                window.location.reload();
                alert("Modelin Başarıyla Yüklendi")
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
            },
          });
      }

      this.selectedFiles = undefined;
    }
  }

  showResults(){
    if(this.assigns){
      this.dialogRef.open(ResultsPageComponent ,{
      width:'1000px',
      height:'500px',
      data:{assigns:this.assigns.title}
    })
    }
  }
}
