import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform,ToastController, LoadingController, Events, ModalController, AlertController} from 'ionic-angular';
import {Http} from '@angular/http';
import 'rxjs/Rx';
import * as CryptoJS from 'crypto-js';
import { ContactserviceProvider } from '../../providers/contactservice/contactservice';
import { InAppBrowser } from '@ionic-native/in-app-browser';


@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html', 
  providers: [ContactserviceProvider]
})
export class ProfilePage { 
  password: string = "level1";
  isAndroid: boolean = false;
  showHelpText: boolean = false;
  data : object = {};
  API_ENDPOINT_URL : any = localStorage.getItem('API_ENDPOINT_URL');
  level0 : string;
  level1 : string;
  level2 : string;
  level3 : string;
  level4 : string;
  current_email:any;
  alllevel:any;
  isBrowser: any;
  secondary_emails: any = [];
  options = {
    // location : 'yes',//Or 'no' 
    // hidden : 'no', //Or  'yes'
    // clearcache : 'yes',
    // clearsessioncache : 'yes',
    // zoom : 'yes',//Android only ,shows browser zoom controls 
    // hardwareback : 'yes',
    // mediaPlaybackRequiresUserAction : 'no',
    // shouldPauseOnSuspend : 'no', //Android only 
    // closebuttoncaption : 'Close', //iOS only
    // disallowoverscroll : 'no', //iOS only 
    // toolbar : 'yes', //iOS only 
    // enableViewportScale : 'no', //iOS only 
    // allowInlineMediaPlayback : 'no',//iOS only 
    // presentationstyle : 'pagesheet',//iOS only 
    // fullscreen : 'yes',//Windows only    
};
  
  constructor(public navCtrl: NavController, public navParams: NavParams, platform: Platform,public http:Http,public toastCtrl: ToastController, public loadingCtrl: LoadingController, public events: Events, public theInAppBrowser: InAppBrowser, public contactserviceProvider: ContactserviceProvider,public modalCtrl:ModalController,public alertCtrl: AlertController) {
	      this.isAndroid = platform.is('android');
        this.http = http;
        events.subscribe('openLevel:changed', data => {  
          this.unlock();
        });
        if(localStorage.getItem('job_alert_popup') == '1'){
          this.showHelpText = true;
          localStorage.removeItem('job_alert_popup');
        }
        if(localStorage.getItem('job_alert_popup_on_job') == '1'){
          this.showHelpText = true;
          localStorage.removeItem('job_alert_popup_on_job');
        }

  }

  ionViewWillUnload() {
    this.events.unsubscribe('openLevel:changed');
  }

  getAllEmails(){
    var userId  = localStorage.getItem('userinfo');
    this.contactserviceProvider.getUserEmails(userId).subscribe(data => {
      this.secondary_emails = data;
      if(this.navParams.get('unconnected') == '1'){
        var invite_email = this.navParams.get('invite_email');
        var bidJobId = this.navParams.get('bidJobId');
        this.addEmails(invite_email,bidJobId);
      }
    },
    err => {
        this.showTechnicalError();
    });
  }

  verifyEmail(id,email){
    let modal = this.modalCtrl.create('AddEmailPage',{verify : '1',email:email,id:id});
     modal.onDidDismiss(data => {
      if(data == true)
        {  
          this.getAllEmails();
        }
    });
    modal.present();
  }

  assignCompany(id,alertIds,companyIds){
    let modal = this.modalCtrl.create('AssignCompanyPage',{
        id:id,
        alertIds:alertIds,
        companyIds:companyIds
      });
    modal.present();
  }

  makePrimary(id,email){
    var userId  = localStorage.getItem('userinfo');
    let confirm = this.alertCtrl.create({
      title: 'Are you sure?',
      message: 'After make this email primary, you have to log into Salvum with this new primary e-mail and all generic notifications will now be sent to this e-mail.',
      buttons: [
        {
          text: 'No',
          handler: () => {
            //console.log('Disagree clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            const loading = this.loadingCtrl.create({});
            loading.present();
            this.contactserviceProvider.makeEmailPrimary({'_id': id, userId: userId, email: email}).subscribe((result)=>{
              if(result.status == 1)
              {
                  loading.dismissAll()
                  let toast = this.toastCtrl.create({
                      message: 'Email preference updated.',
                      duration: 3000,
                      position: 'top',
                      cssClass: 'success'
                     });
                     toast.present(); 
                     this.current_email = email;
                     this.getAllEmails();
              }
              else
              {
                  loading.dismissAll()
                    let toast = this.toastCtrl.create({
                        message: 'Error, plz try later.',
                        duration: 3000,
                        position: 'top',
                        cssClass: 'danger'
                       });
                       toast.present(); 
              }
            },
            err => {
                loading.dismissAll();
                this.showTechnicalError('1');
            });
          }
        }
      ]
    });
    confirm.present();
  }

  // updateJobNotisEmail(id,type){
  //   var msg = type == '1' ? 'stop getting job notifications on this email?' : 'get job notifications on this email?';
  //   var status = type == '1' ? '0' : '1';
  //   let confirm = this.alertCtrl.create({
  //     title: '',
  //     message: 'Are you sure you want to '+msg, 
  //     buttons: [
  //       {
  //         text: 'No',
  //         handler: () => {
  //           //console.log('Disagree clicked');
  //         }
  //       },
  //       {
  //         text: 'Yes',
  //         handler: () => {
  //           const loading = this.loadingCtrl.create({});
  //           loading.present();
  //           this.contactserviceProvider.updateJobNotisEmail({'_id' : id, status: status}).subscribe((updated)=>{
  //             if(updated.status == 1)
  //             {
  //                 loading.dismissAll()
  //                 let toast = this.toastCtrl.create({
  //                     message: 'Email preference updated.',
  //                     duration: 3000,
  //                     position: 'top',
  //                     cssClass: 'success'
  //                    });
  //                    toast.present(); 
  //                    this.getAllEmails();
  //             }
  //             else
  //             {
  //                 loading.dismissAll()
  //                   let toast = this.toastCtrl.create({
  //                       message: 'Error, plz try later.',
  //                       duration: 3000,
  //                       position: 'top',
  //                       cssClass: 'danger'
  //                      });
  //                      toast.present(); 
  //             }
  //           },
  //           err => {
  //               loading.dismissAll();
  //               this.showTechnicalError('1');
  //           });
  //         }
  //       }
  //     ]
  //   });
  //   confirm.onDidDismiss(data => {
  //       this.getAllEmails();
  //     });
  //   confirm.present();
  // }

  deleteEmails(id,isVerified){
    var msg = isVerified == '1' ? 'After removing this email, job updates will no longer be sent to this e-mail.' : '';
    var title_msg = isVerified == '1' ? '?' : ' you want to remove?';
    let confirm = this.alertCtrl.create({
      title: 'Are you sure'+title_msg,
      message: msg,
      buttons: [
        {
          text: 'No',
          handler: () => {
            //console.log('Disagree clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            const loading = this.loadingCtrl.create({});
            loading.present();
            this.contactserviceProvider.deleteEmails({'_id' : id}).subscribe((deleted)=>{
              if(deleted.status == 1)
              {
                  loading.dismissAll()
                  let toast = this.toastCtrl.create({
                      message: 'Email removed.',
                      duration: 3000,
                      position: 'top',
                      cssClass: 'success'
                     });
                     toast.present(); 
                     this.getAllEmails();
              }
              else
              {
                  loading.dismissAll()
                    let toast = this.toastCtrl.create({
                        message: 'Error, plz try later.',
                        duration: 3000,
                        position: 'top',
                        cssClass: 'danger'
                       });
                       toast.present(); 
              }
            },
            err => {
                loading.dismissAll();
                this.showTechnicalError('1');
            });
          }
        }
      ]
    });
    confirm.present();
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
 
  ionViewDidLoad() {
    this.getAllEmails();
    this.alllevel = JSON.parse(localStorage.getItem('alllevel'));
    var userId  = localStorage.getItem('userinfo');
    if(this.alllevel){
      this.alllevel.forEach((value) => {
          var decrypted = CryptoJS.AES.decrypt(value, userId);
        if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level1'){
        
          this.level1 = 'false';

        }else if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level2'){
          
           this.level2 = 'false';

        }else if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level3'){
           this.level3 = 'false';

        }else if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level4'){
           this.level4 = 'false';
          
        }
      });
    }

    this.isBrowser = localStorage.getItem('isBrowser');
    var userdata = {
      userId : localStorage.getItem('userinfo')
    }
    const loading = this.loadingCtrl.create({});
    loading.present();
    return this.contactserviceProvider.getUserInfo(userdata).subscribe(data => {
      loading.dismissAll();
      this.data = data
      this.current_email = data.email;
      // console.log(data)
      if(data != null){
        localStorage.setItem('userImage', data.image);
        localStorage.setItem('userName', data.name);
        this.events.publish('username:changed', data);
      } 
    },
    err => {
        loading.dismissAll();
        this.showTechnicalError();
    });
  }
openEditprofilePage(data)
{
	this.navCtrl.push('EditprofilePage' ,data);
}

openChangepasswordPage(){
  localStorage.setItem('selectedLevelValue', '1');
	this.navCtrl.push('ChangepasswordPage');
};

root(){
  this.navCtrl.setRoot('DashboardPage'); 
}


  getUrl(data){
    if(data.website.startsWith("http:")){
      data.website = data.website;
    }else{
      data.website = 'https://' + data.website;
    }
  }

  unlock(){
    this.level1 = 'true';
    this.level2 = 'true';
    this.level3 = 'true';
    this.level4 = 'true';
    this.alllevel = JSON.parse(localStorage.getItem('alllevel'));
    var userId  = localStorage.getItem('userinfo');
  
    this.alllevel.forEach((value) => {
        var decrypted = CryptoJS.AES.decrypt(value, userId);
      if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level1'){
      
        this.level1 = 'false';

      }else if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level2'){
        
         this.level2 = 'false';

      }else if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level3'){
         this.level3 = 'false';

      }else if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level4'){
         this.level4 = 'false';
        
      }
    });  
  };

  openAppBrowser(url : string){
    let target = "_blank";
    this.theInAppBrowser.create(url, target, this.options);
  };

  addEmails(invite_email = null,bidJobId = null){
    let modal = this.modalCtrl.create('AddEmailPage',{
      invite_email : invite_email,
      bidJobId : bidJobId
    });
       modal.onDidDismiss(data => {
        if(data == true)
          {  
            this.getAllEmails();
          }
      });
    modal.present();
  }
}
