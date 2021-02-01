import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RfiMailsPage } from './rfi-mails';
import { TradeBreadcrumbsPageModule } from '../trade-breadcrumbs/trade-breadcrumbs.module';
import { SharedModule } from '../../components/shared/shared.module';
import { Ng2DropdownModule } from 'ng2-material-dropdown';
import { OrderModule } from 'ngx-order-pipe';
@NgModule({
  declarations: [
    RfiMailsPage,
  ],
  imports: [
    IonicPageModule.forChild(RfiMailsPage),
    TradeBreadcrumbsPageModule,
    SharedModule,
    Ng2DropdownModule,
    OrderModule,
  ],
})
export class RfiMailsPageModule {}
