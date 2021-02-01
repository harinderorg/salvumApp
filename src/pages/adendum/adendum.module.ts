import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdendumPage } from './adendum';
import { TradeBreadcrumbsPageModule } from '../trade-breadcrumbs/trade-breadcrumbs.module';
import { Ng2DropdownModule } from 'ng2-material-dropdown';
import { OrderModule } from 'ngx-order-pipe';
@NgModule({
  declarations: [
    AdendumPage,
  ],
  imports: [
    IonicPageModule.forChild(AdendumPage),
    TradeBreadcrumbsPageModule,
    Ng2DropdownModule,
    OrderModule,
  ],
})
export class AdendumPageModule {}
