import { Component, EventEmitter, Output } from '@angular/core';
import { IonicPage, Platform, ToastController, NavController, NavParams, LoadingController, Events } from 'ionic-angular';
import {Http} from '@angular/http'; 
import 'rxjs/Rx';
import { LoginserviceProvider } from '../../providers/loginservice/loginservice';
import * as CryptoJS from 'crypto-js';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { MemberserviceProvider } from '../../providers/memberservice/memberservice';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { FCM } from '@ionic-native/fcm';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [LoginserviceProvider, CookieService, MemberserviceProvider, InAppBrowser]
})
export class LoginPage {
@Output()
setProfile:EventEmitter<string> = new EventEmitter();
sendData:any;
email:string;
password: string;
baseUrl: any;
APIURL: any;
fcm_token: any = '';
remember:any = false;
options = {};
isBrowser = localStorage.getItem('isBrowser');
data: Object = {};
  constructor(public navCtrl: NavController, public navParams: NavParams,public http:Http,public toastCtrl: ToastController,public loadingCtrl: LoadingController,public LoginserviceProvider: LoginserviceProvider,public platform: Platform, public cookieService: CookieService, public events: Events, public memberserviceProvider: MemberserviceProvider, public theInAppBrowser: InAppBrowser, private fcm: FCM) {
    if(this.platform.is('core')){
      localStorage.setItem('isBrowser',  'true');
    }else{
     localStorage.setItem('isBrowser',  'false');
    }
    if(localStorage.getItem('is_register_success') == '1'){
      let toast = this.toastCtrl.create({
          message: 'You have successfully registered with salvum.Please check your email to confirm your account.',
          duration: 5000,
          position : 'top',
          cssClass: 'success'
        });
        toast.present(); 
      localStorage.removeItem('is_register_success');
    }
    this.isBrowser = localStorage.getItem('isBrowser');
    this.APIURL = localStorage.getItem('APIURL');
    this.baseUrl = localStorage.getItem('baseUrl');
    this.http = http;
    this.platform = platform;
    if(localStorage.getItem('userinfo') != undefined && localStorage.getItem('userinfo') != null && localStorage.getItem('userinfo') != ''){
      this.navCtrl.setRoot('DashboardPage',{
        id : '0'
      });
      return;
    }else{
      if(this.isBrowser == 'false'){
        this.fcm.getToken().then(token => {
          this.fcm_token = token;
        });
      }
      // if(localStorage.getItem('isUserId') == 'true'){
      //   const loading = this.loadingCtrl.create({});
      //   loading.present();
      //   this.sendData = {
      //     memberId : localStorage.getItem('memberId'),
      //     memberstatus : '2'
      //   }

      //   this.memberserviceProvider.acceptInvitation(this.sendData).subscribe((dashboard_data)=>{
      //     loading.dismissAll();
      //     let toast = this.toastCtrl.create({
      //         message: 'Invitation Accpted.',
      //         duration: 3000
      //      });
      //     toast.present();
      //   });
      // }
    }
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

  ionViewDidLoad() {
    if(this.navParams.get('email') != undefined){
      this.email = this.navParams.get('email');
    }
    else{
      this.email = this.cookieService.get('su');
    }
    this.password = this.cookieService.get('sp');
    this.remember = this.cookieService.get('sr');
    // const loading = this.loadingCtrl.create({});
    // loading.present();
    // loading.dismissAll();
  };

  login(){
    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    if(this.email == '' || this.email == undefined){
           let toast = this.toastCtrl.create({
            message: 'Please enter your email',
            duration: 3000,
            position : 'top',
            cssClass: 'danger'
           });
           toast.present();    
    }else if(reg.test(this.email) == false){
      let toast = this.toastCtrl.create({
          message: 'You have entered an invalid email address!',
          duration: 3000,
          position : 'top',
          cssClass: 'danger'
      });
      toast.present();
      return false;
    }else if(this.password == '' || this.password == undefined){
           let toast = this.toastCtrl.create({
            message: 'Please enter your password',
            duration: 3000,
            position : 'top',
            cssClass: 'danger'
           });
           toast.present();
    }else{ 
      if(this.remember == true){
        this.cookieService.put('su',this.email);
        this.cookieService.put('sp',this.password);
      }
      else {
        this.cookieService.put('su','');
        this.cookieService.put('sp','');
      }
        this.cookieService.put('sr', this.remember);
        const loading = this.loadingCtrl.create({});
        loading.present();
        this.LoginserviceProvider.login(this.email,this.password,this.fcm_token).subscribe((data)=>{
          if(data.status == 1){
              if(data.data.status == 1){
                var redirect = localStorage.getItem('redirect_after');
                var redirect_id = localStorage.getItem('redirect_id');
                localStorage.clear();
                localStorage.setItem('APIURL',this.APIURL);
                if(this.platform.is('core')){
                  localStorage.setItem('isBrowser',  'true');
                }else{
                 localStorage.setItem('isBrowser',  'false');
                }
                var levels = [];
                var string,encrypted;
                localStorage.setItem('levelOpened', '0');
                localStorage.setItem('userinfo',  data.data._id);
                localStorage.setItem('userName',  data.data.name);
                localStorage.setItem('userImage', data.data.image); 
                localStorage.setItem('userCompany', data.data.company); 
                this.events.publish('username:changed', data);
                string = 'level0#' + data.data._id;
                var password = data.data._id;
                encrypted = CryptoJS.AES.encrypt(string, password);
                levels.push(encrypted.toString());
                //localStorage.setItem('alllevel', JSON.stringify(levels));
                string = 'level1#' + data.data._id;
                encrypted = CryptoJS.AES.encrypt(string, password);
                levels.push(encrypted.toString());
                localStorage.setItem('alllevel', JSON.stringify(levels));

                let toast = this.toastCtrl.create({
                  message: 'Login Successfully',
                  duration: 3000,
                  position : 'top',
                  cssClass: 'success'
                });
                toast.present();
                if(redirect == 'my_transmittals'){
                  this.navCtrl.setRoot('bidding-page', {
                    bidJobId: redirect_id,
                    status: 9,
                  });
                }
                else if(redirect == 'file_sharing'){
                  this.navCtrl.setRoot('FilemanagerPage',{
                    notis_redirect : '1'
                  });
                }
                else if(redirect == 'sites'){
                  this.navCtrl.setRoot('SitesPage');
                }
                else if(redirect == 'recipts'){
                  this.navCtrl.setRoot('SiteReciptsPage',{
                    siteId : redirect_id
                  });
                }
                else if(redirect == 'biddetails'){
                  localStorage.setItem('unc_email','1');
                  this.navCtrl.setRoot('bidding-page',{
                    bidJobId: redirect_id,
                    status: '0',
                  });
                }
                else if(redirect == 'bidjobs'){
                  this.navCtrl.setRoot('bidjobs',{
                    type : redirect_id
                  });
                }
                else{
                  this.navCtrl.setRoot('DashboardPage',{
                    id : '0'
                  });
                }               

              }else if(data.data.status == 0){
                 let toast = this.toastCtrl.create({
                    message: 'Your account is deactivated by admin',
                    duration: 3000,
                    position : 'top',
                    cssClass: 'info'
                  });
                  toast.present();

              }else if(data.data.status == 2){
                 let toast = this.toastCtrl.create({
                    message: 'Please check your email to confirm your account',
                    duration: 3000,
                    position : 'top',
                    cssClass: 'info'
                  });
                  toast.present();

              }else if(data.data.status == 3){
                 let toast = this.toastCtrl.create({
                    message: 'Account Removed',
                    duration: 3000,
                    position : 'top',
                    cssClass: 'danger'
                  });
                  toast.present();

              }else{
                  let toast = this.toastCtrl.create({
                    message: 'Account removed',
                    duration: 3000,
                    position : 'top',
                    cssClass: 'danger'
                  });
                  toast.present();
              }
            }else{
               let toast = this.toastCtrl.create({
                message: 'Invalid credentials.',
                duration: 3000,
                position : 'top',
                cssClass: 'danger'
              });
              toast.present();
            }
          loading.dismissAll()
        },
        err => {
            loading.dismissAll();
            this.showTechnicalError('1');
        });
    }
  };

  openAppBrowser(url : string){
    let target = "_blank";
    this.theInAppBrowser.create(this.baseUrl+url, target, this.options);
  };
} 