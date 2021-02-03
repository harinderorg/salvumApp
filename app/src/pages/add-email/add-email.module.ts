import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddEmailPage } from './add-email';

@NgModule({
  declarations: [
    AddEmailPage,
  ],
  imports: [
    IonicPageModule.forChild(AddEmailPage),
  ],
})
export class AddEmailPageModule {}
