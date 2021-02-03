import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { JobfilesPage } from './jobfiles';

@NgModule({
  declarations: [
    JobfilesPage,
  ],
  imports: [
    IonicPageModule.forChild(JobfilesPage),
  ],
})
export class JobfilesPageModule {}
