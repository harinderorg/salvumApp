import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BidjobsPage } from './bidjobs';
import { SharedModule } from '../../components/shared/shared.module';

@NgModule({
  declarations: [
    BidjobsPage,
  ],
  imports: [
    IonicPageModule.forChild(BidjobsPage),
    SharedModule,
  ],
})
export class BidjobsPageModule {}
