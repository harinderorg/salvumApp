import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddDirTransmittalPage } from './add-dir-transmittal';
import { SignaturePadModule } from 'angular2-signaturepad';
@NgModule({
  declarations: [
    AddDirTransmittalPage,
  ],
  imports: [
    IonicPageModule.forChild(AddDirTransmittalPage),
    SignaturePadModule,
  ],
})
export class AddDirTransmittalPageModule {}
