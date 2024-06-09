import { Component, Inject, Input, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AssignModel } from 'src/models/assignModel';
import { FileModel } from 'src/models/file';
import { AssignService } from 'src/services/assign.service';
import { FileService } from 'src/services/file.service';
import { AssignModalComponent } from './assign-modal/assign-modal.component';
import { NewAssignComponent } from '../new-assign/new-assign.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-admin-assign-modal',
  templateUrl: './admin-assign-modal.component.html',
  styleUrls: ['./admin-assign-modal.component.scss']
})
export class AdminAssignModalComponent {
  public assign?: AssignModel;
  assignName:string;

  constructor(
  private fileService:FileService,
  private assignService:AssignService,
  private dialogRef:MatDialog,
  private ngbMmodal:NgbModal,
  private router:Router
  ){}

  private route = inject(ActivatedRoute)
  fileInfos?:FileModel[] | undefined;

  ngOnInit(): void {

    const assignName = String(this.route.snapshot.paramMap.get('assignName'));
    this.assignService.getAssigns().subscribe(data => {
      
      this.assign = data.find(assign => assign.title == assignName);
      if(this.assign?.title){
        this.fileService.getFilesAdmin(this.assign?.title).subscribe( 
          files => {
            this.fileInfos = files.length > 0 ? files : undefined;
          },
          error => {
            console.error('Dosya alınırken bir hata oluştu:',error);
            // Hata durumunda fileInfos dizisini boşaltabilirsiniz veya başka bir işlem yapabilirsiniz.
            this.fileInfos = undefined;
            // veya
            // this.fileInfos = [];
          }
        );
      }
    });
    
  }
  openModal(){
    this.dialogRef.open(AssignModalComponent ,{
      width:'1000px',
      height:'500px',
      data:{assigns:this.assign?.title}
    })
  }


  updateAssign(){
    this.dialogRef.open(NewAssignComponent ,{
      width:'850px',
      height:'600px',
      data:this.assign
    })
  }

  confirmEnd(){
    if(confirm("Yarışmayı Bitirmek istediğinize emin misiniz?")){
      if(this.assign?.title)
      this.assignService.endAssign(this.assign?.title).subscribe(data => {
        alert("Yarışma bitirildi.")
        window.location.reload();
      });
    }
  }

  confirmDelete(){
    if(confirm("Yarışmayı Silmek istediğinize emin misiniz?")){
      if(this.assign)
      this.assignService.deleteAssign(this.assign).subscribe(data => {
        alert("Yarışma silindi.")
        this.router.navigate(['/admin']);
        console.log(data);
      });
    }
  }
}
