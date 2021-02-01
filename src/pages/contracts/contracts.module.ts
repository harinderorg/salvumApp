import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContractsPage } from './contracts';
import { TradeBreadcrumbsPageModule } from '../trade-breadcrumbs/trade-breadcrumbs.module';
import { Ng2DropdownModule } from 'ng2-material-dropdown';
import { OrderModule } from 'ngx-order-pipe';
@NgModule({
  declarations: [
    ContractsPage,
  ],
  imports: [
    IonicPageModule.forChild(ContractsPage),
    TradeBreadcrumbsPageModule,
    Ng2DropdownModule,
    OrderModule,
  ],
})
export class ContractsPageModule {}
