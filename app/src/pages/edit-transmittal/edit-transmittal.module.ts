import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditTransmittalPage } from './edit-transmittal';
import { SignaturePadModule } from 'angular2-signaturepad';

@NgModule({
  declarations: [
    EditTransmittalPage,            
  ], 
  imports: [
    IonicPageModule.forChild(EditTransmittalPage),
    SignaturePadModule,
  ],
})
export class EditTransmittalPageModule {}
