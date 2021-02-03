import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContactslistPage } from './contactslist';

@NgModule({
  declarations: [
    ContactslistPage,
  ],
  imports: [
    IonicPageModule.forChild(ContactslistPage),
  ],
})
export class ContactslistPageModule {}
