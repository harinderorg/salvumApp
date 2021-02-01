import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RfisPage } from './rfis';
import { TradeBreadcrumbsPageModule } from '../trade-breadcrumbs/trade-breadcrumbs.module';
import { Ng2DropdownModule } from 'ng2-material-dropdown';
import { OrderModule } from 'ngx-order-pipe';
@NgModule({
  declarations: [
    RfisPage,
  ],
  imports: [
    IonicPageModule.forChild(RfisPage),
    TradeBreadcrumbsPageModule,
    Ng2DropdownModule,
    OrderModule,
  ],
})
export class RfisPageModule {}
