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
import { PreProcessComponent } from './pre-process/pre-process.component';

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
  preProcessCode: string = '';

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

  getFile(fileName: string) {
    if (this.assigns?.title) {
      this.fileService.downloadFile(fileName, this.assigns?.title).subscribe(
        (response) => {
          const contentType = fileName.split('.').pop();
          let filename = fileName;

          const blob = new Blob([response], { type: contentType });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        },
        (error) => {
          console.error('Dosya indirilirken bir hata oluştu:', error);
          // Hata durumunda kullanıcıya bir hata mesajı gösterebilirsiniz.
        }
      );
    }
  }

  getModelFile(fileName: string) {
    if (this.assigns?.title) {
      this.fileService
        .downloadModelFile(fileName, this.assigns.title, this.studentNo)
        .subscribe(
          (response) => {
            const contentType = fileName.split('.').pop();
            let filename = fileName;

            const blob = new Blob([response], { type: contentType });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
          },
          (error) => {
            console.error('Dosya indirilirken bir hata oluştu:', error);
            // Hata durumunda kullanıcıya bir hata mesajı gösterebilirsiniz.
          }
        );
    }
  }

  getPreProcessCode(): void {
    const dialogRef = this.dialogRef.open(PreProcessComponent, {
      width: '1000px',
      height: '700px',
      data: { code: this.preProcessCode }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.preProcessCode = result;
        alert('Ön işlem kodu başarıyla kaydedildi');
      }
    });
  }


  selectFile(event: any): void {
    this.printFiles = Array.from(event.target.files);
    this.selectedFiles = event.target.files;
  }

  upload(): void {
    if (this.selectedFiles) {
      if (this.selectedFiles && this.studentNo && this.assigns?.title) {
        this.fileService
          .uploadUser(this.selectedFiles, this.studentNo, this.assigns?.title , this.preProcessCode)
          .subscribe({
            next: (event: any) => {
              if (event.type === HttpEventType.UploadProgress) {
                window.location.reload();
              } else if (event instanceof HttpResponse) {
                this.message = event.body.message;
              }
            },
            error: (err: any) => {
              console.log(err);
              alert("Modelin Yüklenirken Bir Hata Oluştu")
              window.location.reload();
              this.currentFile = undefined;
            },
            complete: () => {
              alert("Modelin Başarıyla Yüklendi")
            }
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
