import { Component } from '@angular/core';
import { ToastController, IonicPage, NavController, ModalController, AlertController, LoadingController, Events } from 'ionic-angular';
import {Http} from '@angular/http';
import 'rxjs/Rx';
import { Pipe } from '@angular/core';
import { ContactserviceProvider } from '../../providers/contactservice/contactservice';
import * as CryptoJS from 'crypto-js';

@Pipe({
   name: 'keyobject'
})

@IonicPage()
@Component({
  selector: 'page-walletinner',
  templateUrl: 'walletinner.html',
  providers: [ContactserviceProvider]
})
export class WalletinnerPage  {
  items: Array<{}>;
  isBrowser:any;
  walletsDetls : Array<{}>;
  allowed_levels:any = [];
  all_levels:any = [];
  userId:any;
  constructor(public navCtrl: NavController, public modalCtrl: ModalController, public alertCtrl: AlertController , public http:Http ,public toastCtrl: ToastController, public loadingCtrl: LoadingController, public contactserviceProvider: ContactserviceProvider, public events: Events) {
    this.http = http;
    this.isBrowser = localStorage.getItem('isBrowser');
    this.unlock();
    events.subscribe('openLevel:changed', data => {  
      this.unlock();
    });
  }

  ionViewWillUnload() {
      this.events.unsubscribe('openLevel:changed');
    }

  unlock(){
    this.userId =  localStorage.getItem('userinfo');
    this.all_levels = JSON.parse(localStorage.getItem('alllevel'));

    if(this.all_levels && this.all_levels.length > 0){
      this.all_levels.forEach((value) => {

        this.allowed_levels = [];
        var decrypted = CryptoJS.AES.decrypt(value, this.userId);
        var i;
        if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level1'){
          this.allowed_levels = [];
          for(i = 1; i <= 1; i++){
            this.allowed_levels.push('level'+i );
          }   
        }else if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level2'){
          this.allowed_levels = [];
          for(i = 1; i <= 2; i++){
            this.allowed_levels.push('level' + i);
          }
        }else if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level3'){
          this.allowed_levels = [];
          for(i = 1; i <= 3; i++){
            this.allowed_levels.push('level' + i);
          }
        }else if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level4'){
          this.allowed_levels = [];
          for(i = 1; i <= 4; i++){
            this.allowed_levels.push('level' + i );
          }
        }else if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level0'){
          this.allowed_levels = [];
        }
      });
      this.ngOnInit();
    }else{
      this.allowed_levels = [];
      this.ngOnInit();
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
 
  ngOnInit(){
    this.walletsDetls = [];
    const loading = this.loadingCtrl.create({});
    loading.present();
    return this.contactserviceProvider.walletsDetail(localStorage.getItem('userinfo'))
    .subscribe(data => {
      loading.dismissAll()
      var items = [];
      //console.log(data);
      for (var i = data.length - 1; i >= 0; --i) { 
        if (this.allowed_levels.indexOf('level' + data[i].level) != -1) {
          items.push(data[i]);
        }  
      }
      this.items = items;
    },
    err => {
        loading.dismissAll();
        this.showTechnicalError();
    });
  };

  presentModal(myEvent1) {
    let modal = this.modalCtrl.create('ModalsPage');
    modal.present({
      ev: myEvent1
    });
  }
   showConfirm(item , index) {
    let confirm = this.alertCtrl.create({ 
      message: 'Are you sure you want to delete this ?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
          let body = item;
          return this.contactserviceProvider.deleteWallet(body)
            .subscribe(data => {
            this.items.splice(index ,1);
             let toast = this.toastCtrl.create({
                message: 'Wallet has been deleted successfully.',
                duration: 3000
              });
              toast.present();
            },
            err => {
                this.showTechnicalError('1');
            });
          }
        }
      ]
    });
    confirm.present();
  }
  openWalletdetailPage(data){
    console.log(data);
    this.walletsDetls = data;
	  this.navCtrl.push('WalletdetailPage' ,this.walletsDetls);
    
  };

  root(){
    this.navCtrl.setRoot('DashboardPage');
  };

  wallet(){
    this.navCtrl.setRoot('WalletsPage');
  };
}