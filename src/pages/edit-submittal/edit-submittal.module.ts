import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditSubmittalPage } from './edit-submittal';
import { SignaturePadModule } from 'angular2-signaturepad';

@NgModule({
  declarations: [
    EditSubmittalPage,
  ],
  imports: [
    IonicPageModule.forChild(EditSubmittalPage),
    SignaturePadModule,
  ],
})
export class EditSubmittalPageModule {}
