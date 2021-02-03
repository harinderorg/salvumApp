import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { JobcalendarPage } from './jobcalendar';
import { NgCalendarModule  } from 'ionic2-calendar';

@NgModule({
  declarations: [
    JobcalendarPage,
  ],
  imports: [
    IonicPageModule.forChild(JobcalendarPage),
    NgCalendarModule,
  ],
})
export class JobcalendarPageModule {}
