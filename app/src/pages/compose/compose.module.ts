import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ComposePage } from './compose';
import { OrderModule } from 'ngx-order-pipe';
import { CKEditorModule } from 'ng2-ckeditor';
import { TagInputModule } from 'ngx-chips';
@NgModule({
  declarations: [
    ComposePage,
  ],
  imports: [
    IonicPageModule.forChild(ComposePage),
    OrderModule,
    CKEditorModule,
    TagInputModule, 
  ],
})
export class ComposePageModule {}
