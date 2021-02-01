import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SmailFileUploadPage } from './smail-file-upload';
import { SharedModule } from '../../components/shared/shared.module';

@NgModule({
  declarations: [
    SmailFileUploadPage,
  ],
  imports: [
    IonicPageModule.forChild(SmailFileUploadPage),
    SharedModule,
  ],
})
export class SmailFileUploadPageModule {}
