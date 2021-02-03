import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TransmittalDetailPage } from './transmittal-detail';

@NgModule({
  declarations: [
    TransmittalDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(TransmittalDetailPage),
  ],
})
export class TransmittalDetailPageModule {}
