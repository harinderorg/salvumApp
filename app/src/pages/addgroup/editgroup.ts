import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController,Events } from 'ionic-angular';
import {Http} from '@angular/http';
import 'rxjs/Rx';
import * as CryptoJS from 'crypto-js';
import { ContactserviceProvider } from '../../providers/contactservice/contactservice';


@IonicPage()
@Component({
  selector: 'page-editgroup',
  templateUrl: 'editgroup.html',
  providers: [ContactserviceProvider]
})
export class EditgroupPage {
userId : string;
data: any;
Newdata: any;
one: any;
selectedFirst:any = 0;
selectedSecond:any = 0;
selectedthird:any = 0;
selectedForth:any = 0;
selectedFirst1:any = 0;
selectedSecond1:any = 0;
selectedthird1:any = 0;
selectedForth1:any = 0;
mselected:Boolean = true;
mselected1: Boolean = true;
mselected3: Boolean = true;
mselected2: Boolean = true;
groupMembers = [];
count: number;
name : string;
level : string;
saveData : {};
groupArray = [];
level0 : string;
level1 : string;
level2 : string;
level3 : string;
alllevel:any;
isBrowser:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public http:Http, public loadingCtrl: LoadingController, public toastCtrl: ToastController, public contactserviceProvider: ContactserviceProvider, public events: Events) {
   this.http = http;

   events.subscribe('openLevel:changed', data => {  
      this.unlock();
    });

  }

  ionViewWillUnload() {
      this.events.unsubscribe('openLevel:changed');
    }

 
  ionViewDidLoad() {

  	 this.isBrowser = localStorage.getItem('isBrowser');
      this.alllevel = JSON.parse(localStorage.getItem('alllevel'));
      var userId  = localStorage.getItem('userinfo');
      if(this.alllevel){
        this.alllevel.forEach((value) => {
            console.log(value);
            var decrypted = CryptoJS.AES.decrypt(value, userId);
            console.log(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0]);
          if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level1'){
          
            this.level0 = 'false';
           this.selectedFirst = 1;
           this.selectedFirst1 = 1;
          }else if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level2'){
            
             this.level1 = 'false';
             this.selectedSecond = 2;
             this.selectedSecond1 = 2;
          }else if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level3'){
             this.level2 = 'false';
            this.selectedthird = 3;
            this.selectedthird1 = 3;
          }else if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level4'){
             this.level3 = 'false';
             this.selectedForth = 4;
             this.selectedForth1 = 4;
          }
        });
      } 

     const loading = this.loadingCtrl.create({});
        loading.present();
        this.userId = localStorage.getItem('userinfo');
  
        return this.contactserviceProvider.contactsList(this.userId).subscribe(data => {
                  loading.dismissAll();
                  console.log(data);
                  var newArr = [];
                  this.Newdata = data;
                  console.log(data)
                  var count = 0;
                  if(data.length >0){
                    this.Newdata.forEach(eachObj => {
                      if(this.level0 == 'false'){
                  
                        if(eachObj.reciverSetLevel != 0 && eachObj.senderSetLevel != 0){
                          newArr.push(eachObj);
                          count = count + 1;
                        }
                      }else if (this.level1 == 'false'){
                        if(eachObj.reciverSetLevel != 0 &&  eachObj.senderSetLevel != 0){
                          newArr.push(eachObj);
                          count = count + 1;
                        }
                      }else if(this.level2 == 'false'){
                        if(eachObj.reciverSetLevel != 0  && eachObj.senderSetLevel != 0){
                          newArr.push(eachObj);
                          count = count + 1;
                        }
                      }else if(this.level3 == 'false'){
                        if(eachObj.reciverSetLevel != 0 && eachObj.senderSetLevel != 0){
                          newArr.push(eachObj);
                          count = count + 1;
                        }
                      }
                    })
                    this.data = newArr;
                  }
                  
              },
            err => {
                loading.dismissAll();
                this.showTechnicalError();
            });
  };

  
  contactChange(item, index){
    console.log(item)
  	 this.groupMembers.push(item);
     this.groupArray.push(item._id);
  	 this.data.splice(index, 1);
  	 
  };

  memberChange(item, index){
  	
  	  this.data.push(item);
  	  this.groupArray.splice(index, 1);
  	  this.groupMembers.splice(index, 1);
  };


  updateCbValue(value, e:any){
    this.count = 0;
    console.log(value)
    if(e.checked == true){
      this.count = 1;
       if(value == '1'){
        this.selectedFirst = 1;
        return;
      }else if(value == '2'){
        this.selectedSecond = 2;
        return;
      }
      else if(value == '3'){
        this.selectedthird = 3;
        return;
      }else{
        this.selectedForth = 4;
        return;
      }
    }else{
      if(this.count == 0){
        if(value == '1'){
          this.selectedFirst = 0;
          return;
        }else if(value == '2'){
          this.selectedSecond = 0;
          return;
        }
        else if(value == '3'){
          this.selectedthird = 0;
          return;
        }else{
          this.selectedForth = 0;
          return;
        }
      } 
    }
  }

  updateCb1Value(value, e:any){

    console.log(value)
    if(e.checked == true){
       if(value == '1'){
        this.selectedFirst1 = 1;
        return;
      }else if(value == '2'){
        this.selectedSecond1 = 2;
        return;
      }
      else if(value == '3'){
        this.selectedthird1 = 3;
        return;
      }else{
        this.selectedForth1 = 4;
        return;
      }
    }else{
      if(value == '1'){
        this.selectedFirst1 = 0;
        return;
      }else if(value == '2'){
        this.selectedSecond1 = 0;
        return;
      }
      else if(value == '3'){
        this.selectedthird1 = 0;
        return;
      }else{
        this.selectedForth1 = 0;
        return;
      }
    }
  }

  saveGroup(){
  	if(this.selectedFirst == 1){
      if(this.name == undefined || this.name == ''){
        let toast = this.toastCtrl.create({
          message: 'Please add group name',
          duration: 3000,
          position : 'top',
          cssClass: 'danger'
        });
        toast.present();
      }else if(this.level == undefined || this.level == ''){
        let toast = this.toastCtrl.create({
          message: 'Please select level',
          duration: 3000,
          position : 'top',
          cssClass: 'danger'
        });
        toast.present();
      }else if(this.groupMembers.length == 0){
        let toast = this.toastCtrl.create({
             message: 'Please select atleast one contact',
             duration: 3000,
             position : 'top',
             cssClass: 'danger'
        });
      toast.present();
      }else{
        this.saveData = {
          name : this.name,
          userLevel :  this.level,
          groupdata : this.groupArray,
          userId : localStorage.getItem('userinfo')
        }
        const loading = this.loadingCtrl.create({});
        loading.present();
        return this.contactserviceProvider.addGroup(this.saveData).subscribe(data => {
          let groupData = data;
          loading.dismissAll();
          if(data.status == 0){
            let toast = this.toastCtrl.create({
              message : 'Group name already exist.',
              duration: 3000,
              position : 'top',
              cssClass: 'danger'
            });
            toast.present();
          }else{
            let toast = this.toastCtrl.create({
              message : 'Group added successfully.',
              duration: 3000,
              position : 'top',
              cssClass: 'success'
            });
            toast.present();
            this.navCtrl.push('ManagegroupPage',groupData);
          }
          
        },
          err => {
              loading.dismissAll();
              this.showTechnicalError('1');
          });
      }
    }else{
      let toast = this.toastCtrl.create({
        message : 'Please open level first.',
        duration: 3000,
        position : 'top',
        cssClass: 'danger'
      });
      toast.present();
    }
	  	
  };

  root(){
    this.navCtrl.setRoot('DashboardPage');
  };

  contact(){
    this.navCtrl.setRoot('ContactsPage');
  };

  unlock(){
    this.selectedFirst = 0;
    this.selectedFirst1 = 0;
    this.selectedthird = 0;
    this.selectedthird1 = 0;
    this.selectedSecond = 0;
    this.selectedSecond1 = 0;
    this.selectedForth = 0;
    this.selectedForth1 = 0;
    this.level0 = 'true';
    this.level1 = 'true';
    this.level2 = 'true';
    this.level3 = 'true';
     this.alllevel = JSON.parse(localStorage.getItem('alllevel'));
      var userId  = localStorage.getItem('userinfo');
      if(this.alllevel){
        this.alllevel.forEach((value) => {
            var decrypted = CryptoJS.AES.decrypt(value, userId);
          if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level1'){
          
            this.level0 = 'false';
           this.selectedFirst = 1;
           this.selectedFirst1 = 1;
          }else if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level2'){
            
             this.level1 = 'false';
             this.selectedSecond = 2;
             this.selectedSecond1 = 2;
          }else if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level3'){
             this.level2 = 'false';
            this.selectedthird = 3;
            this.selectedthird1 = 3;
          }else if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level4'){
             this.level3 = 'false';
             this.selectedForth = 4;
             this.selectedForth1 = 4;
          }
        });
      }
  }

  showTechnicalError(type = null){
    var msg = (type == '1') ? 'try later.' : 'reload the page.'
    let toast = this.toastCtrl.create({
        message: 'Technical error, Please '+msg,
        duration: 3000,
        position: 'top',
        cssClass: 'info'
      });
      toast.present();
  }
}