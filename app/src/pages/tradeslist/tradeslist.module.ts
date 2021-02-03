import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TradeslistPage } from './tradeslist';

@NgModule({
  declarations: [
    TradeslistPage,
  ],
  imports: [
    IonicPageModule.forChild(TradeslistPage),
  ],
})
export class TradeslistPageModule {}
