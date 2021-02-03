import { NgModule } from '@angular/core';
import { FileSelectDirective, FileDropDirective } from 'ng2-file-upload/ng2-file-upload';
import {TimeAgoPipe} from 'time-ago-pipe';
@NgModule({
  imports: [
  ],
  declarations: [
  	FileSelectDirective, FileDropDirective,TimeAgoPipe,
  ],
  exports: [
    FileSelectDirective, FileDropDirective,TimeAgoPipe,
  ]
})

export class SharedModule { }