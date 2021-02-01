import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddAdendumPage } from './addadendum';
import { SharedModule } from '../../components/shared/shared.module';

@NgModule({
  declarations: [
    AddAdendumPage, 
  ],
  imports: [
    IonicPageModule.forChild(AddAdendumPage),
    SharedModule,
  ],
})
export class AddAdendumPageModule {}