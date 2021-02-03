import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UploadfilePage } from './uploadfile';
import { SharedModule } from '../../components/shared/shared.module';
@NgModule({
  declarations: [
    UploadfilePage,
  ],
  imports: [
    IonicPageModule.forChild(UploadfilePage),
    SharedModule,
  ],
})
export class UploadfilePageModule {}
