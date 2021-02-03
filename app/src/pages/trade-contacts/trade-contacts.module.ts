import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TradeContactsPage } from './trade-contacts';
import { TradeBreadcrumbsPageModule } from '../trade-breadcrumbs/trade-breadcrumbs.module';
import { Ng2DropdownModule } from 'ng2-material-dropdown';
import { OrderModule } from 'ngx-order-pipe';
@NgModule({
  declarations: [
    TradeContactsPage,
  ],
  imports: [
    IonicPageModule.forChild(TradeContactsPage),
    TradeBreadcrumbsPageModule,
    Ng2DropdownModule,
    OrderModule,
  ],
})
export class TradeContactsPageModule {}
