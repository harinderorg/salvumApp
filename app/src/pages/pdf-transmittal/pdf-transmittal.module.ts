import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PdfTransmittalPage } from './pdf-transmittal';

@NgModule({
  declarations: [
    PdfTransmittalPage,
  ],
  imports: [
    IonicPageModule.forChild(PdfTransmittalPage),
  ],
})
export class PdfTransmittalPageModule {}
