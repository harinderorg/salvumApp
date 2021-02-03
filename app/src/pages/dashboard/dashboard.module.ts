import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DashboardPage } from './dashboard';
import { SharedModule } from '../../components/shared/shared.module';
// import { NgGanttEditorModule } from 'ng-gantt'
@NgModule({
  declarations: [
    DashboardPage,
  ],
  imports: [
    IonicPageModule.forChild(DashboardPage),
    SharedModule,
    // NgGanttEditorModule,
  ],
}) 
export class DashboardPageModule {}
