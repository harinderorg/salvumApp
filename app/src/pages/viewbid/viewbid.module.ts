import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViewbidPage } from './viewbid';
import { TradeBreadcrumbsPageModule } from '../trade-breadcrumbs/trade-breadcrumbs.module';
import { Ng2DropdownModule } from 'ng2-material-dropdown';
import { OrderModule } from 'ngx-order-pipe';
import { ExpandableListModule } from 'angular2-expandable-list';
@NgModule({
  declarations: [
    ViewbidPage,
  ],
  imports: [
    IonicPageModule.forChild(ViewbidPage),
    TradeBreadcrumbsPageModule,
    Ng2DropdownModule,
    OrderModule,
    ExpandableListModule,
  ],
})
export class ViewbidPageModule {}
