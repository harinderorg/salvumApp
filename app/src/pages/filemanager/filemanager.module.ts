import { NgModule, Directive } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FilemanagerPage } from './filemanager';
import { TreeModule } from 'angular-tree-component';
import { DragulaModule } from 'ng2-dragula';
import { DndModule } from 'ng2-dnd';
import { Ng2DragDropModule } from 'ng2-drag-drop';
@NgModule({
  declarations: [
    FilemanagerPage,
  ],
  imports: [
    IonicPageModule.forChild(FilemanagerPage),
    TreeModule,
    DragulaModule,
    DndModule.forRoot(),
    Ng2DragDropModule.forRoot()
  ],
})
@Directive({ selector: '[ng2FileDrop, ng2FileSelect]'})
export class FilemanagerPageModule {

}
