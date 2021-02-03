import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyTransmittalsPage } from './my-transmittals';
import { ExpandableListModule } from 'angular2-expandable-list';
@NgModule({
  declarations: [
    MyTransmittalsPage,
  ],
  imports: [
    IonicPageModule.forChild(MyTransmittalsPage),
    ExpandableListModule,
  ],
})
export class MyTransmittalsPageModule {}
