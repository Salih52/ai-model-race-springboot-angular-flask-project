import { Component, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AssignModel } from 'src/models/assignModel';
import { FileModel } from 'src/models/file';
import { AssignService } from 'src/services/assign.service';
import { VeriService } from 'src/services/auth.service';
import { FileService } from 'src/services/file.service';
import { ResultsPageComponent } from './results-page/results-page.component';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-assign-page',
  templateUrl: './assign-page.component.html',
  styleUrls: ['./assign-page.component.scss'],
})
export class AssignPageComponent implements OnInit {
  constructor(
    private assignSerive: AssignService,
    private fileService: FileService,
    private veriService: VeriService,
    private router: Router,
    private dialogRef: MatDialog,
    private sanitizer: DomSanitizer
  ) {}
  private route = inject(ActivatedRoute);
  assigns?: AssignModel;
  fileInfos?: FileModel[] | undefined;
  isLogin: boolean = false;

  ngOnInit(): void {
    const assignName = String(this.route.snapshot.paramMap.get('assignName'));
    this.veriService.isLogin$.subscribe((isLogin) => {
      this.isLogin = isLogin;
    });

    this.assignSerive.getAssigns().subscribe((assigns) => {
      this.assigns = assigns.find((assign) => assign.title === assignName);
      if (this.assigns?.title) {
        this.isLogin
          ? this.router.navigate([`/userPage/${this.assigns.title}`])
          : null;
        console.log(this.assigns.title);
        this.fileService.getFilesAdmin(this.assigns.title).subscribe(
          (files) => {
            this.fileInfos = files.length > 0 ? files : undefined;
            console.log(this.fileInfos);
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
  openModal() {}

  getSafeUrl(url: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(url);
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

  showResults() {
    if (this.assigns) {
      this.dialogRef.open(ResultsPageComponent, {
        width: '1000px',
        height: '500px',
        data: { assigns: this.assigns.title },
      });
    }
  }
}
