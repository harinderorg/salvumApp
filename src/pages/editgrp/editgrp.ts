import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, Events } from 'ionic-angular';
import {Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/Rx';
import { GroupserviceProvider } from '../../providers/groupservice/groupservice';
import * as CryptoJS from 'crypto-js';

@IonicPage()
@Component({ 
  selector: 'page-editgrp',
  templateUrl: 'editgrp.html',
  providers:[GroupserviceProvider]
})
export class EditgrpPage {
data: any;
items: any;
groupArray = [];
newdata: any;
selectedFirst:any = 0;
selectedSecond:any = 0;
selectedthird:any = 0; 
selectedForth:any = 0;
selectedFirst1 = 0;
selectedSecond1 = 0;
selectedthird1 = 0;
selectedForth1 = 0;
userId : string;
level0 : any;
level1 : any;
level2 : any;
level3 : any;
level1Contacts = 0;
level2Contacts = 0;
level3Contacts = 0;
level4Contacts = 0;
count:number;
API_ENDPOINT_URL : any = localStorage.getItem('API_ENDPOINT_URL');
editGroupData = 'editGroupData';
getContactList = 'getContactList';
selectedGroup:any;
alllevel:any;
selected:Boolean = true;
selected1: Boolean = true;
selected3: Boolean = true;
selected2: Boolean = true;
mselected:Boolean = true;
mselected1: Boolean = true;
mselected3: Boolean = true;
mselected2: Boolean = true;
addedContacts:any = [];
isBrowser:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public http:Http, public loadingCtrl: LoadingController, public toastCtrl: ToastController, public groupserviceProvider:GroupserviceProvider, public events:Events) {
  	  this.http = http;
      if(this.navParams.get('data') != undefined){
        localStorage.setItem('groupInfo', JSON.stringify(this.navParams.get('data')));
      }
      
      this.selectedGroup = JSON.parse(localStorage.getItem('groupInfo'));

      events.subscribe('openLevel:changed', data => {  
        this.locksClicked();
      });
  };

  ionViewWillUnload() {
      this.events.unsubscribe('openLevel:changed');
    }
 
  ionViewDidLoad() {
    this.isBrowser = localStorage.getItem('isBrowser');

      this.alllevel = JSON.parse(localStorage.getItem('alllevel'));
      var userId  = localStorage.getItem('userinfo');
      if(this.alllevel){
        this.alllevel.forEach((value) => {
            //console.log(value);
            var decrypted = CryptoJS.AES.decrypt(value, userId);
            //console.log(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0]);
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
      this.userId = localStorage.getItem('userinfo');
    	const loading = this.loadingCtrl.create({});
      loading.present();
    
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });
        return this.http.get(this.API_ENDPOINT_URL+this.editGroupData +'/' + this.selectedGroup._id + '/' + this.userId, options)
            .map(res => res.json())
            .subscribe(data => {
              loading.dismissAll();
            //this.data = data;
            this.newdata = data;
            if(this.newdata.length > 0){
              this.newdata[0].name.forEach(eachObj => {
                this.groupArray.push(eachObj._id);
                //console.log(this.groupArray);
              })
            }
            

        return this.http.get(this.API_ENDPOINT_URL+this.getContactList +'/'+ this.userId, options)
             .map(res => res.json())
             .subscribe(data => {
                  //console.log(data);
                 loading.dismissAll();
                  var finalArray = [];
                  var values = [];
                  var value;
                  var cunt = 0;
                  // Remove Duplicate Value
                  for(var i = 0; i < data.length; i++) {
                      value = data[i];
                      //console.log(value);
                      if(value.reciverSetLevel != 0 && value.senderSetLevel != 0){
                     if(values.length > 0){
                        if(values[cunt]._id.indexOf(value._id) === -1) {
                        finalArray.push(data[i]);
                        values.push(value);
                        //console.log(finalArray);
                        //console.log(values);
                        cunt = cunt + 1;
                        }
                      }else{
                        values.push(value);
                        finalArray.push(data[i]);
                      }
                    }
                  }
                  if(this.newdata.length > 0){
                    this.newdata[0].name.forEach(eachObj => {
                      //console.log(eachObj._id);
                      var count = 0;
                      data.forEach(newObj => {
                       // console.log(newObj);
                        if(data[count].email == eachObj.email && data[count].senderSetLevel != 0 && data[count].reciverSetLevel != 0){
                          if(data[count].senderId == this.userId && data[count].senderSetLevel != 0 && data[count].reciverSetLevel != 0){
                            if(data[count].senderSetLevel == '1'){
                              this.level1Contacts = this.level1Contacts + 1;
                            }else if(data[count].senderSetLevel == '2'){
                              this.level2Contacts = this.level2Contacts + 1;
                            }else if(data[count].senderSetLevel == '3'){
                              this.level3Contacts = this.level3Contacts + 1;
                            }else if(data[count].senderSetLevel == '4'){
                              this.level4Contacts = this.level4Contacts + 1;
                            }
                          }else{
                            if(data[count].reciverSetLevel == '1' && data[count].senderSetLevel != 0 ){
                              this.level1Contacts = this.level1Contacts + 1;
                            }else if(data[count].reciverSetLevel == '2'){
                              this.level2Contacts = this.level2Contacts + 1;
                            }else if(data[count].reciverSetLevel == '3'){
                              this.level3Contacts = this.level3Contacts + 1;
                            }else if(data[count].reciverSetLevel == '4'){
                              this.level4Contacts = this.level4Contacts + 1;
                            }
                          }
                          
                          this.addedContacts.push(data[count]);
                          count = count + 1;
                        }else{
                          //console.log(count);
                          count = count + 1;
                        }
                        //this.sele
                      })
                      //console.log('group');
                      //console.log(this.addedContacts)
                    });
                  }
                  
                  this.items = finalArray;
                  if(this.newdata.length > 0){
                    this.newdata[0].name.forEach(eachObj => {
                       //console.log(eachObj._id);
                        var count = 0;
                       this.items.forEach(newObj => {
                        //console.log(newObj);
                          if(this.items[count].email == eachObj.email){
                            //this.addedContacts.push(this.items[count]);
                             this.items.splice(count, 1);
                             //console.log(this.items);
                          }else{
                            //console.log(count);
                           count = count + 1;
                          }
                          //this.sele
                      })
                    });
                  }
              },
              err => {
                  loading.dismissAll();
                  this.showTechnicalError();
              });
           },
          err => {
              loading.dismissAll();
              this.showTechnicalError();
          });
  };

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

  locksClicked(){
    this.selectedthird = 0; this.selectedFirst = 0; this.selectedSecond = 0; this.selectedForth = 0;
    this.selectedthird1 = 0; this.selectedFirst1 = 0; this.selectedSecond1 = 0; this.selectedForth1 = 0;
    this.level1 = true; this.level2 = true; this.level3 = true; this.level0 = true;
    this.alllevel = JSON.parse(localStorage.getItem('alllevel'));
      var userId  = localStorage.getItem('userinfo');
      if(this.alllevel){
        this.alllevel.forEach((value) => {
            //console.log(value);
            var decrypted = CryptoJS.AES.decrypt(value, userId);
            //console.log(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0]);
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

  updateCbValue(value, e:any){

    console.log(value)
    if(e.checked == true){
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
      if(value == '1'){
        this.selectedFirst = 10;
        return;
      }else if(value == '2'){
        this.selectedSecond = 10;
        return;
      }
      else if(value == '3'){
        this.selectedthird = 10;
        return;
      }else{
        this.selectedForth = 10;
        return;
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
        this.selectedFirst1 = 10;
        return;
      }else if(value == '2'){
        this.selectedSecond1 = 10;
        return;
      }
      else if(value == '3'){
        this.selectedthird1 = 10;
        return;
      }else{
        this.selectedForth1 = 10;
        return;
      }
    }
  }
  updateCbValue2(value, e:any){
    this.count = 0;
    console.log(value)
    if(e.checked == true){
      this.count = 1;
      if(value == '2'){
        this.selectedSecond = 2;
        return;
      }
    }else{
      if(this.count == 0){
        if(value == '2'){
          this.selectedSecond = 0;
          return;
        }
      } 
    }
  }



  contactChange(item, index){
    this.groupArray.push(item._id);
    this.addedContacts.push(item);
	  this.items.splice(index, 1);
    if(item.senderId == this.userId){
      if(item.senderSetLevel == 1){
        this.level1Contacts = this.level1Contacts + 1;
      }else if(item.senderSetLevel == 2){
        this.level2Contacts = this.level2Contacts + 1;
      }else if(item.senderSetLevel == 3){
        this.level3Contacts = this.level3Contacts + 1;
      }else if(item.senderSetLevel == 4){
        this.level4Contacts = this.level4Contacts + 1;
      }
    }else{
      if(item.reciverSetLevel == 1){
        this.level1Contacts = this.level1Contacts + 1;
      }else if(item.reciverSetLevel == 2){
        this.level2Contacts = this.level2Contacts + 1;
      }else if(item.reciverSetLevel == 3){
        this.level3Contacts = this.level3Contacts + 1;
      }else if(item.reciverSetLevel == 4){
        this.level4Contacts = this.level4Contacts + 1;
      }
    }
    
  };

  memberChange(item, index){
    this.items.push(item);
    this.groupArray.splice(index, 1);
  	this.addedContacts.splice(index, 1);
    if(item.senderId == this.userId){
      if(item.senderSetLevel == 1){
        this.level1Contacts = this.level1Contacts + 1;
      }else if(item.senderSetLevel == 2){
        this.level2Contacts = this.level2Contacts + 1;
      }else if(item.senderSetLevel == 3){
        this.level3Contacts = this.level3Contacts + 1;
      }else if(item.senderSetLevel == 4){
        this.level4Contacts = this.level4Contacts + 1;
      }
    }else{
      if(item.reciverSetLevel == 1){
        this.level1Contacts = this.level1Contacts + 1;
      }else if(item.reciverSetLevel == 2){
        this.level2Contacts = this.level2Contacts + 1;
      }else if(item.reciverSetLevel == 3){
        this.level3Contacts = this.level3Contacts + 1;
      }else if(item.reciverSetLevel == 4){
        this.level4Contacts = this.level4Contacts + 1;
      }
    }
  };


  updateGroupDate(group){
    if(this.selectedFirst == 1){
       if(group[0].groupName == ''){
          let toast = this.toastCtrl.create({
            message: 'Please add group name.',
            duration: 3000,
            cssClass: 'danger',
            position: 'top'
          });
          toast.present();
       }else if(this.groupArray.length == 0){
          let toast = this.toastCtrl.create({
              message: 'Please add atleast one member.',
              duration: 3000,
              cssClass: 'danger',
              position: 'top'
          });
          toast.present();
       }else if(this.groupArray.length == 0){
          let toast = this.toastCtrl.create({
              message: 'Please add atleast one member.',
              duration: 3000,
              cssClass: 'danger',
              position: 'top'
          });
          toast.present();
       }else{
          const loading = this.loadingCtrl.create({});
          loading.present();
          var groupObject ={
            'name': group[0].groupName,
            'groupdata':this.groupArray,
            'level':group[0].level,
            '_id':group[0]._id,
            'userId': this.userId
          };
          this.groupserviceProvider.updateGroup(groupObject).subscribe((data)=>{
            loading.dismissAll();
              let groupData = data;
              if(data.status == 0){
                let toast = this.toastCtrl.create({
                  message: 'Group name already exist',
                  duration: 3000,
                  cssClass: 'danger',
                  position: 'top'
                });
                toast.present();
              }else{
                let toast = this.toastCtrl.create({
                  message: 'Group updated successfully',
                  duration: 3000,
                  cssClass: 'success',
                  position: 'top'
                });
                this.navCtrl.push('ManagegroupPage',groupData);
                toast.present();
              }
          },
          err => {
              loading.dismissAll();
              this.showTechnicalError('1');
          });
              
       }
    }else{
      let toast = this.toastCtrl.create({
        message: 'Please open level first.',
        duration: 3000,
        cssClass: 'danger',
        position: 'top'
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

  toGroup(){
    this.navCtrl.setRoot('ManagegroupPage');
  }
}