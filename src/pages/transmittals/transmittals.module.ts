import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TransmittalsPage } from './transmittals';
import { TradeBreadcrumbsPageModule } from '../trade-breadcrumbs/trade-breadcrumbs.module';
import { ExpandableListModule } from 'angular2-expandable-list';
import { Ng2DropdownModule } from 'ng2-material-dropdown';
import { OrderModule } from 'ngx-order-pipe';

@NgModule({
  declarations: [
    TransmittalsPage,
  ],
  imports: [
    IonicPageModule.forChild(TransmittalsPage),
    TradeBreadcrumbsPageModule,
    ExpandableListModule,
    Ng2DropdownModule,
    OrderModule,
  ],
})
export class TransmittalsPageModule {}
