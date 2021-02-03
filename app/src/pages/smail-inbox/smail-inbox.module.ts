import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SmailInboxPage } from './smail-inbox';
import { OrderModule } from 'ngx-order-pipe';
import { DragulaModule } from 'ng2-dragula'; 
import { CKEditorModule } from 'ng2-ckeditor';
import { SharedModule } from '../../components/shared/shared.module';

@NgModule({
  declarations: [
    SmailInboxPage,
  ],
  imports: [
    IonicPageModule.forChild(SmailInboxPage),
    OrderModule,
    DragulaModule,
    CKEditorModule,
    SharedModule,
  ],
})
export class SmailInboxPageModule {}
