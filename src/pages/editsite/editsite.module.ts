import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditsitePage } from './editsite';
import { SharedModule } from '../../components/shared/shared.module';

@NgModule({
  declarations: [
    EditsitePage,
  ],
  imports: [
    IonicPageModule.forChild(EditsitePage),
    SharedModule,
  ],
})
export class EditsitePageModule {}
