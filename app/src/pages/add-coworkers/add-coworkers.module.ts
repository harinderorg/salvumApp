import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddCoworkersPage } from './add-coworkers';

@NgModule({
  declarations: [
    AddCoworkersPage,
  ],
  imports: [
    IonicPageModule.forChild(AddCoworkersPage),
  ],
})
export class AddCoworkersPageModule {}
