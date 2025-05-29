import { NgModule } from '@angular/core';
import { MainPageComponent } from './main-page/main-page.component';
import { YuklemeComponent } from './yukleme/yukleme.component';
import { AdminPageComponent } from './admin-page/admin-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from './header/header.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { RegisterPageComponent } from './register-page/register-page.component';
import { RouterModule } from '@angular/router';
import { UserPageComponent } from './user-page/user-page.component';
import { CommonModule } from '@angular/common';
import { NewAssignComponent } from './admin-page/new-assign/new-assign.component';
import { AssignModalComponent } from './admin-page/admin-assign-modal/assign-modal/assign-modal.component';
import { UserAssignModalComponent } from './user-page/user-assign-modal/user-assign-modal.component';
import { AdminAssignModalComponent } from './admin-page/admin-assign-modal/admin-assign-modal.component';
import { AllAssignsPageComponent } from './all-assigns-page/all-assigns-page.component';
import { AssignPageComponent } from './all-assigns-page/assign-page/assign-page.component';
import { ResultsPageComponent } from './all-assigns-page/assign-page/results-page/results-page.component';
import { ShowUsersModalComponent } from './admin-page/show-users-modal/show-users-modal.component';
import { PreProcessComponent } from './user-page/user-assign-modal/pre-process/pre-process.component';
import { ImageAssignComponent } from './admin-page/image-assign/image-assign.component';
import { UserProfilePageComponent } from './admin-page/user-profile-page/user-profile-page.component';
import { UserFilterPipe } from 'src/app/user-filter.pipe';
import { AssignFilterPipe } from 'src/app/assign-filter.pipe';
import { NglAssignComponent } from './admin-page/ngl-assign/ngl-assign.component';




@NgModule({
  declarations: [
    MainPageComponent,
    YuklemeComponent,
    AdminPageComponent,
    HeaderComponent,
    LoginPageComponent,
    RegisterPageComponent,
    UserPageComponent,
    NewAssignComponent,
    AssignModalComponent,
    UserAssignModalComponent,
    AdminAssignModalComponent,
    AllAssignsPageComponent,
    AssignPageComponent,
    ResultsPageComponent,
    ShowUsersModalComponent,
    PreProcessComponent,
    ImageAssignComponent,
    UserProfilePageComponent,
    UserFilterPipe,
    AssignFilterPipe,
    NglAssignComponent
  ],
  imports: [
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  exports: [
    MainPageComponent,
    YuklemeComponent,
    AdminPageComponent
  ],
})
export class PagesModule { }
