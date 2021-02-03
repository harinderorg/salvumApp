import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DownloadsPage } from './downloads';
import { TradeBreadcrumbsPageModule } from '../trade-breadcrumbs/trade-breadcrumbs.module';
import { OrderModule } from 'ngx-order-pipe';
import { Ng2DropdownModule } from 'ng2-material-dropdown';
@NgModule({
  declarations: [
    DownloadsPage,
  ],
  imports: [
    IonicPageModule.forChild(DownloadsPage),
    TradeBreadcrumbsPageModule,
    Ng2DropdownModule,
    OrderModule,
  ],
})
export class DownloadsPageModule {}
