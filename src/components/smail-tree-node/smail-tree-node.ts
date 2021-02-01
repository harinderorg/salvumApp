import { Component, Input } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
//import {FilemanagerPage} from '../../pages/filemanager/filemanager';
// import { ShareserviceProvider } from '../../providers/shareservice/shareservice';
/*
  Generated class for the TreeNode component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'smail-tree-node',
  templateUrl: 'smail-tree-node.html',
  // providers:[ShareserviceProvider]
})
export class SmailTreeNodeComponent {
  @Input('nodes') nodes; //nodes structure to draw
  // @Output('related_files') related_files; //nodes structure to draw
  shownGroup:any;
  openedLevel: any=[];
 
  constructor(public platform: Platform, public nav: NavController, public navParams: NavParams) {

    // console.log("tree-"+shareserviceProvider.mySharedVariable);
        if(localStorage.getItem('level3') == 'false'){
          this.openedLevel.push({'level': 1, 'name': 'level1'});
          this.openedLevel.push({'level': 2, 'name': 'level2'});
          this.openedLevel.push({'level': 3, 'name': 'level3'});
          this.openedLevel.push({'level': 4, 'name': 'level4'});
        }else if(localStorage.getItem('level2') == 'false'){
          this.openedLevel.push({'level': 1, 'name': 'level1'});
          this.openedLevel.push({'level': 2, 'name': 'level2'});
          this.openedLevel.push({'level': 3, 'name': 'level3'});
        }else if(localStorage.getItem('level1') == 'false'){
          this.openedLevel.push({'level': 1, 'name': 'level1'});
          this.openedLevel.push({'level': 2, 'name': 'level2'});
        }else if(localStorage.getItem('level0') == 'false'){
          this.openedLevel.push({'level': 1, 'name': 'level1'});
        }

        console.log(this.openedLevel)
  }
  //NODE CLICK FUNCTION: If the node is a child (it has the component property) 
  clickNode(node) {
    if(!(node.component)){
      //NODE IS A FOLDER --> expand childs
      this.showChild(node);
      
    }else{
       //NODE IS A FILE --> open Page Component in data model, passing the node such as parameter.
      this.shownGroup = null;
      this.nav.push(node.component, {node: node});      
    }
  }
  //FUNCTION TO CHANGE THE NODE WHICH IS ACTUALLY EXPANDED.
  showChild(node){
    if (this.isSelected(node)) {
      //The node is actually expanded --> contract node and don't show childs
      this.shownGroup = null;
    } else {
      //The node is actually contacted --> expand node and show childs
      this.shownGroup = node;
      localStorage.setItem('current_smail_path', node.path);
      console.log(node.path)
      //FilemanagerPage.get_related_files(node.path);   
      // this.related_files = node.path;
      // console.log('====');
      // console.log(node.path);
      // this.shareserviceProvider.saveNodes(node.path).map((data)=>{
      //   console.log('saved');
      // });
      // this.related_files = node.children;
      // this.nav.push(FilemanagerPage, { 
      //     related_files : this.related_files
      // });
    }
  }
  //FUNCTION TO KNOW IF A FOLDER NODE HAVE TO BE EXPANDED OR CONTRATED
  isSelected(node){
      return this.shownGroup === node;
  }


 
}
