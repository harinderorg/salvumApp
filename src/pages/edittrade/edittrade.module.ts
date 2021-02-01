import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EdittradePage } from './edittrade';
import { SharedModule } from '../../components/shared/shared.module';
import { NgCalendarModule  } from 'ionic2-calendar';
@NgModule({
  declarations: [
    EdittradePage,
  ],
  imports: [
    IonicPageModule.forChild(EdittradePage),
    NgCalendarModule,
    SharedModule,
  ],
})
export class EdittradePageModule {}
