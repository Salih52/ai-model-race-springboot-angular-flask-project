import { Component, OnInit } from '@angular/core';
import { AssignModel } from 'src/models/assignModel';
import { AssignService } from 'src/services/assign.service';

@Component({
  selector: 'app-all-assigns-page',
  templateUrl: './all-assigns-page.component.html',
  styleUrls: ['./all-assigns-page.component.scss']
})
export class AllAssignsPageComponent implements OnInit{
  constructor(
    private assignService: AssignService,
  ) { }

  assigns: AssignModel[] = [];
  ngOnInit(): void {
    this.assignService.getAssigns().subscribe((assigns) => {
      this.assigns = assigns;
    });
  }

}
