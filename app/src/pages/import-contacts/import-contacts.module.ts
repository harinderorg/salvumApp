import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ImportContactsPage } from './import-contacts';

@NgModule({
  declarations: [
    ImportContactsPage,
  ],
  imports: [
    IonicPageModule.forChild(ImportContactsPage),
  ],
})
export class ImportContactsPageModule {}
