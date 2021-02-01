import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditprofilePage } from './editprofile';
import { SharedModule } from '../../components/shared/shared.module';

@NgModule({
  declarations: [
    EditprofilePage,
  ],
  imports: [
    IonicPageModule.forChild(EditprofilePage),
    SharedModule,
  ],
})
export class EditprofilePageModule {}
