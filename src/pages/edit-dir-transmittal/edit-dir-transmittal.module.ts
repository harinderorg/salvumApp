import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditDirTransmittalPage } from './edit-dir-transmittal';
import { SignaturePadModule } from 'angular2-signaturepad';
@NgModule({
  declarations: [
    EditDirTransmittalPage,
  ],
  imports: [
    IonicPageModule.forChild(EditDirTransmittalPage),
    SignaturePadModule,
  ],
})
export class EditDirTransmittalPageModule {}
