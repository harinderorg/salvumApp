import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SiteReciptsPage } from './site-recipts';

@NgModule({
  declarations: [
    SiteReciptsPage,
  ],
  imports: [
    IonicPageModule.forChild(SiteReciptsPage),
  ],
})
export class SiteReciptsPageModule {}
