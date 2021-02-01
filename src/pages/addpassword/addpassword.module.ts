import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddpasswordPage } from './addpassword';
import { SharedModule } from '../../components/shared/shared.module';

@NgModule({
  declarations: [
    AddpasswordPage,
  ],
  imports: [
    IonicPageModule.forChild(AddpasswordPage),
    SharedModule,
  ],
})
export class AddpasswordPageModule {}
