import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditpassPage } from './editpass';
import { SharedModule } from '../../components/shared/shared.module';

@NgModule({
  declarations: [
    EditpassPage,
  ],
  imports: [
    IonicPageModule.forChild(EditpassPage),
    SharedModule,
  ],
})
export class EditpassPageModule {}
