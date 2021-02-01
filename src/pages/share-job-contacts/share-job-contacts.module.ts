import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShareJobContactsPage } from './share-job-contacts';

@NgModule({
  declarations: [
    ShareJobContactsPage,
  ],
  imports: [
    IonicPageModule.forChild(ShareJobContactsPage),
  ],
})
export class ShareJobContactsPageModule {}
