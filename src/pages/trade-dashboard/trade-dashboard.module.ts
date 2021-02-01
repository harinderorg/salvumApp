import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TradeDashboardPage } from './trade-dashboard';

@NgModule({
  declarations: [
    TradeDashboardPage
  ],
  imports: [
    IonicPageModule.forChild(TradeDashboardPage),
  ],
})
export class TradeDashboardPageModule {}
