import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddjobPage } from './addjob';
import { TagInputModule } from 'ngx-chips';
@NgModule({
  declarations: [
    AddjobPage,
  ],
  imports: [
    IonicPageModule.forChild(AddjobPage),
    TagInputModule,
  ],
})
export class AddjobPageModule {}
