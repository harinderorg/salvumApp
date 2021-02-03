import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TradeBreadcrumbsPage } from './trade-breadcrumbs';

@NgModule({
  declarations: [
    TradeBreadcrumbsPage,
  ],
  imports: [
    IonicPageModule.forChild(TradeBreadcrumbsPage),
  ],
  exports: [
    TradeBreadcrumbsPage,
  ],
})
export class TradeBreadcrumbsPageModule {}
