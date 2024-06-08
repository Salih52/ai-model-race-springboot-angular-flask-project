import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { AssignModel } from 'src/models/assignModel';
import { AssignService } from 'src/services/assign.service';
import { VeriService } from 'src/services/auth.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent implements OnInit, AfterViewInit {
  assigns: AssignModel[] = [];
  activeAssigns: AssignModel[] = [];
  exampleAssigns: AssignModel[] = [];

  constructor(private assignService: AssignService, private router: Router) {}

  ngOnInit(): void {
    this.assignService.getAssigns().subscribe((data: any[]) => {
      this.assigns = data;
      this.activeAssigns = this.assigns.filter((assign) => assign.status === 'active');
    });
  }

  @ViewChild('scrollableRow', { static: false }) scrollableRow: ElementRef;

  ngAfterViewInit() {
    // Ensuring scrollableRow is available after view initialization
    if (!this.scrollableRow) {
      console.error('scrollableRow ViewChild not found');
    }
  }

  scrollLeft() {
    if (this.scrollableRow && this.scrollableRow.nativeElement) {
      this.scrollableRow.nativeElement.scrollBy({
        left: -300,
        behavior: 'smooth',
      });
    }
  }

  scrollRight() {
    if (this.scrollableRow && this.scrollableRow.nativeElement) {
      this.scrollableRow.nativeElement.scrollBy({
        left: 300,
        behavior: 'smooth',
      });
    }
  }

  isDropdownOpen: boolean = false;

  openDropdown() {
    this.isDropdownOpen = true;
  }

  closeDropdown() {
    this.isDropdownOpen = false;
  }
}
