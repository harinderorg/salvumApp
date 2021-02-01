import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyRfisPage } from './my-rfis';
import { SharedModule } from '../../components/shared/shared.module';

@NgModule({
  declarations: [
    MyRfisPage,
  ],
  imports: [
    IonicPageModule.forChild(MyRfisPage),
    SharedModule,
  ],
})
export class MyRfisPageModule {}
