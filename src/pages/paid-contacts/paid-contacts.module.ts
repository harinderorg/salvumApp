import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PaidContactsPage } from './paid-contacts';

@NgModule({
  declarations: [
    PaidContactsPage,
  ],
  imports: [
    IonicPageModule.forChild(PaidContactsPage),
  ],
})
export class PaidContactsPageModule {}
