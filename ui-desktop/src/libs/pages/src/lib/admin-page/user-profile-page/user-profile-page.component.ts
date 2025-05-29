import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { toInteger } from '@ng-bootstrap/ng-bootstrap/util/util';
import { AssignModel } from 'src/models/assignModel';
import { FileModel } from 'src/models/file';
import { ScoreModel } from 'src/models/scoreModel';
import { UserModel } from 'src/models/user';
import { AssignService } from 'src/services/assign.service';
import { VeriService } from 'src/services/auth.service';
import { FileService } from 'src/services/file.service';

@Component({
  selector: 'app-user-profile-page',
  templateUrl: './user-profile-page.component.html',
  styleUrls: ['./user-profile-page.component.scss'],
})
export class UserProfilePageComponent implements OnInit {
  constructor(
    private authService: VeriService,
    private assignService: AssignService,
    private fileService: FileService
  ) {}
  private route = inject(ActivatedRoute);
  user: UserModel;
  public assigns: AssignModel[] = [];
  userText: string = '';
  AssignCount: number;
  Places: number[] = [];
  selectedCompetition: AssignModel | undefined;
  selectedCompetitionResults: ScoreModel;
  selectedCompetitionTitle: string = '';
  selectedCompetitionType: string = '';
  totalUser: number = 0;
  filterText: string = '';
  fileInfos?: FileModel[] | undefined;

  ngOnInit(): void {
    const userNo = String(this.route.snapshot.paramMap.get('userNo'));
    this.authService.getUserByNo(userNo).subscribe((data) => {
      this.user = data;
    });
    this.assignService.getAssignsBySchoolNo(userNo).subscribe((data) => {
      this.assigns = data;
      this.AssignCount = data.length;
      this.assigns.forEach((assign) => {
        switch (assign.competitionType) {
          case 'classification':
            this.assignService
              .getClassificationScoreList(assign.title)
              .subscribe((data) => {
                this.Places.push(
                  data.findIndex((x) => x.studentNo == this.user.schoolNo) + 1);
                
              });
            break;
          case 'regression':
            this.assignService
              .getRegressionScoreList(assign.title)
              .subscribe((data) => {
                this.Places.push(
                  data.findIndex((x) => x.studentNo == this.user.schoolNo) + 1);
              });
            break;
          case 'deepLearning':
            this.assignService
              .getDeepLearningScoreList(assign.title)
              .subscribe((data) => {
                this.Places.push(
                  data.findIndex((x) => x.studentNo == this.user.schoolNo) + 1);
              });
            break;
    
            case 'nlpClassification':
            this.assignService
              .getDeepLearningScoreList(assign.title)
              .subscribe((data) => {
                this.Places.push(
                  data.findIndex((x) => x.studentNo == this.user.schoolNo) + 1);
              });
            break;
        }
      }
      
      );
    });
    setTimeout(() => {
      this.analizYetenekVeCaba(this.AssignCount, this.Places)
    }, 100); 
  }
  viewResults(assignName: string, assignType: string): void {
    switch (assignType) {
      case 'classification':
        this.assignService
          .getClassificationScoreList(assignName)
          .subscribe((data) => {
            this.totalUser = data.length;
            this.selectedCompetitionResults =
              data.find((x) => x.studentNo == this.user.schoolNo) ||
              ({} as ScoreModel);
            this.selectedCompetitionResults.place =
              data.findIndex((x) => x.studentNo == this.user.schoolNo) + 1 + '';
            this.selectedCompetitionTitle = assignName;
            this.selectedCompetitionType = assignType;
          });
        if (this.user?.schoolNo && assignName) {
          this.fileService
            .getFilesUser(this.user.schoolNo, assignName)
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
        break;
      case 'regression':
        this.assignService
          .getRegressionScoreList(assignName)
          .subscribe((data) => {
            this.totalUser = data.length;
            this.selectedCompetitionResults =
              data.find((x) => x.studentNo == this.user.schoolNo) ||
              ({} as ScoreModel);
            this.selectedCompetitionResults.place =
              data.findIndex((x) => x.studentNo == this.user.schoolNo) + 1 + '';
            this.selectedCompetitionTitle = assignName;
            this.selectedCompetitionType = assignType;
          });
          if (this.user?.schoolNo && assignName) {
            this.fileService
              .getFilesUser(this.user.schoolNo, assignName)
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
        break;
      case 'deepLearning':
        this.assignService
          .getDeepLearningScoreList(assignName)
          .subscribe((data) => {
            this.totalUser = data.length;
            this.selectedCompetitionResults =
              data.find((x) => x.studentNo == this.user.schoolNo) ||
              ({} as ScoreModel);
            this.selectedCompetitionResults.place =
              data.findIndex((x) => x.studentNo == this.user.schoolNo) + 1 + '';
            this.selectedCompetitionTitle = assignName;
            this.selectedCompetitionType = assignType;
          });
          if (this.user?.schoolNo && assignName) {
            this.fileService
              .getFilesUser(this.user.schoolNo, assignName)
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
        break;

        case 'nlpClassification':
        this.assignService
          .getDeepLearningScoreList(assignName)
          .subscribe((data) => {
            this.totalUser = data.length;
            this.selectedCompetitionResults =
              data.find((x) => x.studentNo == this.user.schoolNo) ||
              ({} as ScoreModel);
            this.selectedCompetitionResults.place =
              data.findIndex((x) => x.studentNo == this.user.schoolNo) + 1 + '';
            this.selectedCompetitionTitle = assignName;
            this.selectedCompetitionType = assignType;
          });
          if (this.user?.schoolNo && assignName) {
            this.fileService
              .getFilesUser(this.user.schoolNo, assignName)
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
        break;
    }
  }

  getModelFile(fileName: string) {
    if (this.selectedCompetitionTitle) {
      this.fileService
        .downloadModelFile(
          fileName,
          this.selectedCompetitionTitle,
          this.user.schoolNo
        )
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

  analizYetenekVeCaba(yarismaSayisi: number, dereceler: number[]){
    const basariSayisi = (dereceler.filter(d => d <= 3)).length;
    const ortalamaDerece = dereceler.length > 0
        ? dereceler.reduce((a, b) => a + b, 0) / dereceler.length
        : null;

    console.log(dereceler.length); 
    // Çalışkanlık değerlendirmesi
    let caliskanlik: string;
    if (yarismaSayisi >= 5) {
        caliskanlik = "Oldukça çalışkan bir birey";
    } else if (yarismaSayisi >= 3) {
        caliskanlik = "Çalışkan bir birey";
    } else {
        caliskanlik = "Henüz yolun başında olan bir birey";
    }

    // Yetenek değerlendirmesi
    let yetenek: string;
    if (yarismaSayisi == 0){
        yetenek = "Yetenek değerlendirmesi yapılamadı, yarışmaya katılmadı.";
        this.userText = yetenek;
        return;
    }
    else if (basariSayisi >= dereceler.length * 0.7) {
        yetenek = "yüksek derecede yetenekli";
    } else if (basariSayisi >= dereceler.length * 0.4) {
        yetenek = "ortalama seviyede yetenekli";
    } else {
        yetenek = "gelişmeye açık bir potansiyele sahip";
    }

    let metin = `Kullanıcı ${yarismaSayisi} yarışmaya katılmış. `;
    metin += `Bunlardan ${basariSayisi} tanesinde dereceye girmiş. `;

    if (ortalamaDerece !== null) {
        metin += `Ortalama derece: ${ortalamaDerece.toFixed(2)}. `;
    }

    metin += `${caliskanlik} olduğu gözlemleniyor ve ${yetenek} bir birey olarak değerlendirilebilir.`;

    this.userText = metin;
  }
}
