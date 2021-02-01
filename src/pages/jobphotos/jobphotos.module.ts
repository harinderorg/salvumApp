import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { JobphotosPage } from './jobphotos';
import { TradeBreadcrumbsPageModule } from '../trade-breadcrumbs/trade-breadcrumbs.module';
import { Ng2DropdownModule } from 'ng2-material-dropdown';
import { OrderModule } from 'ngx-order-pipe';
@NgModule({
  declarations: [
    JobphotosPage,
  ],
  imports: [
    IonicPageModule.forChild(JobphotosPage), 
    TradeBreadcrumbsPageModule,
    Ng2DropdownModule,
    OrderModule,
  ],
})
export class JobphotosPageModule {}
 