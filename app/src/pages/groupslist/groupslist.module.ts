import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GroupslistPage } from './groupslist';

@NgModule({
  declarations: [
    GroupslistPage,
  ],
  imports: [
    IonicPageModule.forChild(GroupslistPage),
  ],
})
export class GroupslistPageModule {}
