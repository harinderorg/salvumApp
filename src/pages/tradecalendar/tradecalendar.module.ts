import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TradecalendarPage } from './tradecalendar'; 
import { NgCalendarModule  } from 'ionic2-calendar';
 
@NgModule({
  declarations: [
    TradecalendarPage,
  ],
  imports: [
    IonicPageModule.forChild(TradecalendarPage),
    NgCalendarModule,
  ],
})
export class TradecalendarPageModule {}
 