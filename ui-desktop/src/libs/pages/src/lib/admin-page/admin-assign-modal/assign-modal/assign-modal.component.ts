import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { AssignModel } from 'src/models/assignModel';
import { ScoreModel } from 'src/models/scoreModel';
import { AssignService } from 'src/services/assign.service';
import { FileService } from 'src/services/file.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-assign-modal',
  templateUrl: './assign-modal.component.html',
  styleUrls: ['./assign-modal.component.scss']
})
export class AssignModalComponent  implements OnInit{

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private assignSerice:AssignService,
  ) { }

  scoreList: ScoreModel[] = [];

  ngOnInit(): void {
    this.assignSerice.getScoreList(this.data.assigns).subscribe(
      data => this.scoreList = data,
      error => console.error('Hata:',error)
    );
  }

  exportExcel(){
    const ws = XLSX.utils.json_to_sheet(this.scoreList);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb,ws, 'Placeholder');

    XLSX.writeFile(wb, 'UserList.xlsx')
  }
  
}
