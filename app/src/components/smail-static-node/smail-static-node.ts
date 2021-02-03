import { Component, Input } from '@angular/core';
import { App, NavController, NavParams, ModalController, LoadingController, ToastController} from 'ionic-angular';
import { CompanyProvider } from '../../providers/company/company';

import { SmailserviceProvider } from '../../providers/smailservice/smailservice';
import { ContactserviceProvider } from '../../providers/contactservice/contactservice';
import { DatePipe } from '@angular/common';
// import { ShareserviceProvider } from '../../providers/shareservice/shareservice';
/*
  Generated class for the TreeNode component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'smail-static-node',
  templateUrl: 'smail-static-node.html',
  providers:[CompanyProvider, ContactserviceProvider, SmailserviceProvider]
})
export class SmailStaticNodeComponent {
  @Input('nodes') nodes; //nodes structure to draw
  // @Output('related_files') related_files; //nodes structure to draw
  shownGroup:any;
  openedLevel: any=[];
  file_path:any;
  userId: any;
  prevId: any = null;
  constructor(public nav: NavController, public ContactserviceProvider: ContactserviceProvider, public companyProvider: CompanyProvider,  public navParams: NavParams, public modalCtrl: ModalController, public loadingCtrl: LoadingController, public smailserviceProvider: SmailserviceProvider, public App:App, public datepipe: DatePipe, public toastCtrl: ToastController) {

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
      localStorage.setItem('current_folder', node);
      console.log(node);
      //SmailPage.getFolderName(this.nav, this.ContactserviceProvider, this.companyProvider, this.navParams,  this.modalCtrl, this.loadingCtrl, this.smailserviceProvider, this.App, this.menu, this.datepipe, this.alertCtrl, this.toastCtrl);
    }
  }
  //FUNCTION TO KNOW IF A FOLDER NODE HAVE TO BE EXPANDED OR CONTRATED
  isSelected(node){
      return this.shownGroup === node;
  }


 
    
    // var folder_name = this.file_path.split("/").pop(-1);

    // var new_path = this.file_path.split('/').slice(0, -1).join('/')+'/'+folder_name;
    //   const loading = this.loadingCtrl.create({});
    //     loading.present();
    //       this.companyProvider.renameDirectoryFolder(this.file_path,new_path).subscribe((formdata)=>{
    //         if(formdata.status == 1)
    //           {
    //              loading.dismissAll();
    //           }
    //           else if(formdata.status == 2)
    //           {
    //               loading.dismissAll()
    //                 let toast = this.toastCtrl.create({
    //                     message: 'Folder name already exists.',
    //                     duration: 3000
    //                    });
    //                    toast.present(); 
    //           }
    //           else
    //           {
    //               loading.dismissAll()
    //                 let toast = this.toastCtrl.create({
    //                     message: 'Error, plz try later.',
    //                     duration: 3000
    //                    });
    //                    toast.present(); 
    //           }
    //       });




 
}
