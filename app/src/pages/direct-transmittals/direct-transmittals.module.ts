import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DirectTransmittalsPage } from './direct-transmittals';
import { ExpandableListModule } from 'angular2-expandable-list';
import { Ng2DropdownModule } from 'ng2-material-dropdown';
import { OrderModule } from 'ngx-order-pipe';

@NgModule({
  declarations: [
    DirectTransmittalsPage,
  ],
  imports: [
    IonicPageModule.forChild(DirectTransmittalsPage),
    ExpandableListModule,
    Ng2DropdownModule,
    OrderModule,
  ],
})
export class DirectTransmittalsPageModule {}
