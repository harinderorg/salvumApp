import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddwebsitePage } from './addwebsite';
import { SharedModule } from '../../components/shared/shared.module';
@NgModule({
  declarations: [
    AddwebsitePage,
  ],
  imports: [
    IonicPageModule.forChild(AddwebsitePage),
    SharedModule,
  ],
})
export class AddwebsitePageModule {}
