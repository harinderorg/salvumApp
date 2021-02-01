import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AssignCompanyPage } from './assign-company';

@NgModule({
  declarations: [
    AssignCompanyPage,
  ],
  imports: [
    IonicPageModule.forChild(AssignCompanyPage),
  ],
})
export class AssignCompanyPageModule {}
