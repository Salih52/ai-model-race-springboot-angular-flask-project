import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ScoreModel } from 'src/models/scoreModel';
import { AssignService } from 'src/services/assign.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-results-page',
  templateUrl: './results-page.component.html',
  styleUrls: ['./results-page.component.scss']
})
export class ResultsPageComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private assignSerice:AssignService
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
