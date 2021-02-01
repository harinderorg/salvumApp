import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, NavParams, Platform,ToastController, Events } from 'ionic-angular';
import {Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/Rx';
import * as CryptoJS from 'crypto-js';
import { ContactserviceProvider } from '../../providers/contactservice/contactservice';

@IonicPage()
@Component({
  selector: 'page-changepassword',
  templateUrl: 'changepassword.html',
  providers: [ContactserviceProvider]
})
export class ChangepasswordPage {
  levelFirst : string;
  levelSecond : string;
  levelThird: string;
  levelFourth : string;
  alllevel:any;
  password: string = "level1";
  isAndroid: boolean = false;
  isLevel : string
  data : object = {};
  isOn:boolean = false;
  isBrowser:any;
  leveldataUrl ='allleveldata';
  API_ENDPOINT_URL : any = localStorage.getItem('API_ENDPOINT_URL');
  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController, public navParams: NavParams, platform: Platform, public http:Http,public toastCtrl: ToastController, public contactserviceProvider: ContactserviceProvider, public events: Events) {
	  this.isAndroid = platform.is('android');
    this.http = http;
    this.isLevel = localStorage.getItem('selectedLevelValue');

    events.subscribe('openLevel:changed', data => {  
      this.locksClicked();
    });
  }

  ionViewWillUnload() {
      this.events.unsubscribe('openLevel:changed');
    }

  ionViewDidLoad() {
    this.alllevel = JSON.parse(localStorage.getItem('alllevel'));
    var userId  = localStorage.getItem('userinfo');
    var openedLevelInStorage = 0;
    if(this.alllevel){
      this.alllevel.forEach((value) => {
          var decrypted = CryptoJS.AES.decrypt(value, userId);
          console.log(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0]);
        if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level1'){
          this.levelFirst = 'false';
          openedLevelInStorage = 1;
        }else if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level2'){
          this.levelSecond = 'false';
          openedLevelInStorage = 2;
        }else if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level3'){
          this.levelThird = 'false';
          openedLevelInStorage = 3;
        }else if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level4'){
          this.levelFourth = 'false';
          openedLevelInStorage = 4;
        }
      });
    }

    if(Number(this.isLevel) > openedLevelInStorage){
      this.isLevel = String(openedLevelInStorage);
    }

    this.isBrowser = localStorage.getItem('isBrowser');
    return this.contactserviceProvider.allLevelData(userId, this.isLevel)
    .subscribe(data => {
      console.log(data);
      this.data = data.data;
      //if(data.data.email || data.data.contact){
        this.isOn = data.data.isOn;
      //}
    },
    err => {
        this.showTechnicalError();
    });
  }
  
  locksClicked(){
    this.isOn  = false;
    this.levelFirst = 'true';
    this.levelSecond = 'true';
    this.levelThird = 'true';
    this.levelFourth = 'true';
    this.alllevel = JSON.parse(localStorage.getItem('alllevel'));
    var userId  = localStorage.getItem('userinfo');
    var openedLevelInStorage = 0;
    if(this.alllevel){
      this.alllevel.forEach((value) => {
          var decrypted = CryptoJS.AES.decrypt(value, userId);
          console.log(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0]);
        if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level1'){
          this.levelFirst = 'false';
          openedLevelInStorage = 1;
        }else if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level2'){
          this.levelSecond = 'false';
          openedLevelInStorage = 2;
        }else if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level3'){
          this.levelThird = 'false';
          openedLevelInStorage = 3;
        }else if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level4'){
          this.levelFourth = 'false';
          openedLevelInStorage = 4;
        }
      });
    }

    if(Number(this.isLevel) > openedLevelInStorage){
      this.isLevel = String(openedLevelInStorage);
    }
    
    localStorage.setItem('selectedLevelValue', this.isLevel);
    this.isBrowser = localStorage.getItem('isBrowser');
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.get(this.API_ENDPOINT_URL+this.leveldataUrl+ "/" + userId + "/" + '1', options)
    .map(res => res.json())
    .subscribe(data => {
      this.data = data.data
      if(data.data.email != '' || data.data.contact != ''){
        this.isOn = data.data.isOn;
      }
    },
    err => {
        this.showTechnicalError();
    });
  };

  changelevel(level){
    this.isOn = false;
    this.data = {};
    localStorage.setItem('selectedLevelValue', level);
    this.isLevel = level;
    var userId = localStorage.getItem('userinfo');
    return this.contactserviceProvider.allLevelData(userId, level)
    .subscribe(data => {
      this.data = data.data;
      //if(data.data.email != '' || data.data.contact != ''){
        this.isOn = data.data.isOn;
      //}
    },
    err => {
        this.showTechnicalError();
    });
  }

  updatePassword(update){
    update.isOn = this.isOn;
    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    var isValidEmail = reg.test(update.email);
    console.log(update)
    // console.log(update.newpassword);
    if(update.newpassword != '' && update.newpassword != undefined && ( typeof(update.newpassword) != undefined) ){
      if(!update.currentpassword){
        let toast = this.toastCtrl.create({
          message: 'Please enter your current password.',
          duration: 3000,
          position: 'top',
          cssClass: 'danger'
          });
          toast.present();
      }else if(!update.newpassword){
        let toast = this.toastCtrl.create({
          message: 'Please enter your new password.',
          duration: 3000,
          position: 'top',
          cssClass: 'danger'
          });
          toast.present();
      }else if(update.currentpassword != update.password && update.confirm != ''){

       let toast = this.toastCtrl.create({
          message: 'Your current password does\'t match.',
          duration: 3000,
          position: 'top',
          cssClass: 'danger'
          });
          toast.present();

      }else if (update.newpassword != update.confirm && update.confirm != '' || update.newpassword != update.confirm && update.newpassword != ''){

       let toast = this.toastCtrl.create({
          message: 'Password and confirm password does\'t match.',
          duration: 3000,
          position: 'top',
          cssClass: 'danger'
          });
          toast.present();

      }else if(update.isOn == true && (update.contact == '' || update.contact == null)&& update.level == 4){
        if(update.level == 3){
          let toast = this.toastCtrl.create({
            message: 'Please enter email address.',
            duration: 3000,
            position: 'top',
            cssClass: 'danger'
          });
          toast.present();
        }else{
          let toast = this.toastCtrl.create({
            message: 'Please enter contact number.',
            duration: 3000,
            position: 'top',
            cssClass: 'danger'
          });
          toast.present();
        }
      }else if( update.isOn == true && update.level == 3 &&  isValidEmail == false){
        if(update.level == 3){
          let toast = this.toastCtrl.create({
            message: 'Please enter email address.',
            duration: 3000,
            position: 'top',
            cssClass: 'danger'
          });
          toast.present();
        }else{
          let toast = this.toastCtrl.create({
            message: 'Please enter contact number.',
            duration: 3000,
            position: 'top',
            cssClass: 'danger'
          });
          toast.present();
        }

      }else{
        const loading = this.loadingCtrl.create({});
        loading.present();
       let body = update;
       return this.contactserviceProvider.updateWebUrl(body).subscribe(data => {
          let toast = this.toastCtrl.create({
            message: 'Password has been updated successfully.',
            duration: 3000,
            position: 'top',
            cssClass: 'success'
          });
          toast.present(); 
          loading.dismissAll();
          this.navCtrl.push('ProfilePage')
        },
        err => {
            loading.dismissAll();
            this.showTechnicalError('1');
        });
      }
    }else if(update.isOn == true && (update.contact == '' || update.contact == null || update.contact == undefined) && update.level == 4 || update.isOn == true && isValidEmail == false && update.level == 3){
      if(update.level == 3){
        let toast = this.toastCtrl.create({
          message: 'Please enter valid email address.',
          duration: 3000,
          position: 'top',
          cssClass: 'danger'
        });
        toast.present();
      }else{
        let toast = this.toastCtrl.create({
          message: 'Please enter contact number.',
          duration: 3000,
          position: 'top',
          cssClass: 'danger'
        });
        toast.present();
      }
    }else if(update.questions == '' || update.questions == undefined){
      let toast = this.toastCtrl.create({
          message: 'Please select your question.',
          duration: 3000,
          position: 'top',
          cssClass: 'danger'
        });
        toast.present();
    }else if(update.answer == '' || update.answer == undefined){
      let toast = this.toastCtrl.create({
          message: 'Please write your answer.',
          duration: 3000,
          position: 'top',
          cssClass: 'danger'
        });
        toast.present();
    }else{
      if(update.email == ''){
        update.email = 'null';
      }

      if(update.contact == ''){
        update.contact = 'null';
      }
      if(update.level == 4){
        update.email = 'email';
      }
      if(update.contact && update.contact.length < 10){
          let toast = this.toastCtrl.create({
              message: 'Please enter atleast 10 digits contact number.',
              duration: 3000,
              position: 'top',
              cssClass: 'danger'
            });
            toast.present();
            return false;
        }
      const loading = this.loadingCtrl.create({});  
      loading.present();
      update.newpassword = update.password;
       let body = update;
       return this.contactserviceProvider.updateWebUrl(body).subscribe(data => {
          let toast = this.toastCtrl.create({
            message: 'Security information has been updated successfully.',
            duration: 3000,
            position: 'top',
            cssClass: 'success'
          });
          toast.present(); 
          loading.dismissAll();
          this.navCtrl.push('ProfilePage')
        },
        err => {
            loading.dismissAll();
            this.showTechnicalError('1');
        });
    }
    
  };

  profile(){
    this.navCtrl.setRoot('ProfilePage');
  };

  root(){
    this.navCtrl.setRoot('DashboardPage');
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

}
