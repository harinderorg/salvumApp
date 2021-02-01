import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ManagejobPage } from './managejob';
import { OrderModule } from 'ngx-order-pipe';

@NgModule({
  declarations: [
    ManagejobPage,
  ],
  imports: [
    IonicPageModule.forChild(ManagejobPage),
    OrderModule,
  ],
})
export class ManagejobPageModule {}
