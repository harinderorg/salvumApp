import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddtradePage } from './addtrade';
import { SharedModule } from '../../components/shared/shared.module';
import { NgCalendarModule  } from 'ionic2-calendar';
@NgModule({
  declarations: [
    AddtradePage,
  ],
  imports: [
    IonicPageModule.forChild(AddtradePage),
    NgCalendarModule,
    SharedModule,
  ],
})
export class AddtradePageModule {}
