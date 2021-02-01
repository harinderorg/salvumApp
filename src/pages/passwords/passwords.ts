import { Component } from '@angular/core';
import { IonicPage, ToastController, PopoverController, ModalController, AlertController, NavController, LoadingController, Events } from 'ionic-angular';
import {Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/Rx';
import * as CryptoJS from 'crypto-js';

@IonicPage()
@Component({
  selector: 'page-passwords',
  templateUrl: 'passwords.html',
})
export class PasswordsPage {
  passWordData: any = [];
  passwordDetls : any = [];
  isBrowser:any;
  editpasswordDetls : Array<{}>;
  API_ENDPOINT_URL : any = localStorage.getItem('API_ENDPOINT_URL');
  passURL = 'wallPasswordDetail';
  deletepassUrl = 'deletepassword';
  userId: any;
  all_levels:any = [];
  allowed_levels:any = [];
  constructor(public navCtrl: NavController,public popoverCtrl: PopoverController, public modalCtrl: ModalController,  public alertCtrl: AlertController,public http:Http ,public toastCtrl: ToastController,  public loadingCtrl: LoadingController, public events: Events) {
    this.http = http;
    this.isBrowser = localStorage.getItem('isBrowser');
    this.unlock();
    events.subscribe('openLevel:changed', data => {  
      this.unlock();
    });
  };

  ionViewWillUnload() {
      this.events.unsubscribe('openLevel:changed');
    }

  // ionViewDidLoad() {
    // console.log('ionViewDidLoad PasswordsPage');
  // }
  presentModal2(myEvent1) {
    let modal = this.modalCtrl.create('AddpasswordPage');
    modal.onDidDismiss(callback =>{
      this.ngOnInit();
    });
    modal.present({
      ev: myEvent1
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

  showConfirm(data ,index) {
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
           let body = JSON.stringify(data);
          let headers = new Headers({ 'Content-Type': 'application/json' });
          let options = new RequestOptions({ headers: headers });
          return this.http.post(this.API_ENDPOINT_URL+this.deletepassUrl, body, options)
            .map(res => res.json())
            .subscribe(data => {
            this.passWordData.splice(index ,1);
             let toast = this.toastCtrl.create({
                message: 'Password was deleted successfully',
                duration: 3000
              });
              toast.present();
              ; 
            },
            err => {
                this.showTechnicalError('1');
            });
          }
        }
      ]
    });
    confirm.present();
  };

  ngOnInit(){
    //this.passWordData = [];
    this.passwordDetls = [];
    this.editpasswordDetls = [];
    const loading = this.loadingCtrl.create({});
    loading.present();
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.get(this.API_ENDPOINT_URL+this.passURL+'/'+localStorage.getItem('userinfo'), options).map(res => res.json())
      .subscribe(data => {
      loading.dismissAll();
      this.passWordData = [];
      //console.log(data);
      for (var i = data.length - 1; i >= 0; --i) { 
        if (this.allowed_levels.indexOf('level' + data[i].passwordlevel) != -1) {
          this.passWordData.push(data[i]);
        }  
      }
      //this.passWordData = data;
    },
    err => {
        loading.dismissAll();
        this.showTechnicalError();
    });
  };

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

  openPassworddetailPage(data){
    this.passwordDetls = data
    this.navCtrl.push('PassworddetailPage' ,this.passwordDetls);
  };


  edit(data){
    //this.editpasswordDetls = data
    //this.navCtrl.push(EditpassPage ,this.editpasswordDetls);
	  localStorage.setItem('passworddetail', JSON.stringify(data));
  	let modal = this.modalCtrl.create('EditpassPage');
    modal.onDidDismiss(callback =>{
        if(callback != 'empty'){
          this.ngOnInit();
        }
    });
    modal.present({ 
      ev: data
    });
	
  };

  root(){
    this.navCtrl.setRoot('DashboardPage');
  };

  wallet(){
    this.navCtrl.setRoot('WalletsPage');
  };
}