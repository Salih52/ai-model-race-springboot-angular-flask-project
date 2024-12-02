import { Component, Inject } from '@angular/core';
import { tick } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-pre-process',
  templateUrl: './pre-process.component.html',
  styleUrls: ['./pre-process.component.scss']
})
export class PreProcessComponent {

  constructor(
    public dialogRef: MatDialogRef<PreProcessComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSaveClick(): void {
    this.dialogRef.close(this.data.code);
  }
}
