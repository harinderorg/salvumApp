import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ActionItemsPage } from './action-items';

@NgModule({
  declarations: [
    ActionItemsPage,
  ],
  imports: [
    IonicPageModule.forChild(ActionItemsPage),
  ],
})
export class ActionItemsPageModule {}
