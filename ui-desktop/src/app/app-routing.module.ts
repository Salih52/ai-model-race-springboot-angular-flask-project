import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginPageComponent } from 'src/libs/pages/src/lib/login-page/login-page.component';
import { RouterModule, Routes, provideRouter, withComponentInputBinding } from '@angular/router';
import { RegisterPageComponent } from 'src/libs/pages/src/lib/register-page/register-page.component';
import { MainPageComponent } from 'src/libs/pages/src/lib/main-page/main-page.component';
import { AuthGuard } from 'src/Guards/auth.guard';
import { UserPageComponent } from 'src/libs/pages/src/lib/user-page/user-page.component';
import { AdminPageComponent } from 'src/libs/pages/src/lib/admin-page/admin-page.component';
import { AdminAssignModalComponent } from 'src/libs/pages/src/lib/admin-page/admin-assign-modal/admin-assign-modal.component';
import { UserAssignModalComponent } from 'src/libs/pages/src/lib/user-page/user-assign-modal/user-assign-modal.component';
import { AllAssignsPageComponent } from 'src/libs/pages/src/lib/all-assigns-page/all-assigns-page.component';
import { AssignPageComponent } from 'src/libs/pages/src/lib/all-assigns-page/assign-page/assign-page.component';

const routes: Routes = [
  { path: 'login', component: LoginPageComponent },
  { path:'register' , component:RegisterPageComponent},
  { path: 'userPage' , component:UserPageComponent, canActivate: [AuthGuard]},
  { 
    path: 'admin' , 
    component:AdminPageComponent,
    canActivate: [AuthGuard],
    // children:[
    //   {path: ':assignName',component:AdminAssignModalComponent}
    // ]
  },
  { path: 'mainPage', component: MainPageComponent},
  {path: 'userPage/:assignName', component:UserAssignModalComponent, canActivate: [AuthGuard]},
  {path: 'admin/:assignName', component:AdminAssignModalComponent , canActivate: [AuthGuard]},
  {path:'assigns' , component:AllAssignsPageComponent},
  {path:'assigns/:assignName' , component:AssignPageComponent},
  { path: '', redirectTo: '/mainPage', pathMatch: 'full' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
