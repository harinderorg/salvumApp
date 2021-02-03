import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddtransmittalPage } from './addtransmittal';
import { SignaturePadModule } from 'angular2-signaturepad';
@NgModule({
  declarations: [
    AddtransmittalPage,
  ],
  imports: [
    IonicPageModule.forChild(AddtransmittalPage),
    SignaturePadModule,
  ],
})
export class AddtransmittalPageModule {}
