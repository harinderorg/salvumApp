import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EmployeedetailPage } from './employeedetail';

@NgModule({
  declarations: [
    EmployeedetailPage,
  ],
  imports: [
    IonicPageModule.forChild(EmployeedetailPage),
  ],
})
export class EmployeedetailPageModule {}
