import { Component } from '@angular/core';
import { ToastController, IonicPage, NavController, ModalController, NavParams, AlertController, LoadingController,Events} from 'ionic-angular';
import {Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/Rx';
import * as CryptoJS from 'crypto-js';
import { ContactserviceProvider } from '../../providers/contactservice/contactservice';
@IonicPage()
@Component({
  selector: 'page-sites',
  templateUrl: 'sites.html',
  providers: [ContactserviceProvider]
})
export class SitesPage {
  websiteData: Array<{}>;
  websiteDetails : Array<{}>;
  isBrowser:any;
  social:any = [];
  marketing:any = [];
  others:any = [];
  userId:any = localStorage.getItem('userinfo');
  all_levels:any;
  allowed_levels:any = [];
  APIURL = localStorage.getItem('APIURL'); 
  isVisible : Boolean = false;
  API_ENDPOINT_URL : any = localStorage.getItem('API_ENDPOINT_URL');

  constructor(public navCtrl: NavController, public navParams: NavParams,  public modalCtrl: ModalController,public http:Http ,public toastCtrl: ToastController, public alertCtrl: AlertController,  public loadingCtrl: LoadingController, public contactserviceProvider: ContactserviceProvider, public events: Events) {
    this.http = http;
    this.isBrowser = localStorage.getItem('isBrowser');
    if(this.userId != undefined && this.userId != '' && this.userId != null){
      this.isVisible = true;
      this.unlock();
    }
    else{
      localStorage.setItem('redirect_after','sites');
      let toast = this.toastCtrl.create({
          message: 'Please login to access this page.',
          duration: 3000,
          position: 'top',
          cssClass: 'info'
         });
         toast.present();
      this.navCtrl.setRoot('LoginPage');
    }
    events.subscribe('openLevel:changed', data => {  
      this.unlock();
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

  unlock(){
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
      this.ionViewDidEnter();
    }else{
      this.allowed_levels = [];
      this.ionViewDidEnter();
    }
  };

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
          let headers = new Headers({ 'Content-Type': 'application/json' });
          let options = new RequestOptions({ headers: headers});

          return this.http.delete(this.APIURL + "/websiteList/" +item._id, options)
            .map(res => res.json())
            .subscribe(data => {
            this.websiteData.splice(index ,1);
             let toast = this.toastCtrl.create({
                message: 'Site has been deleted.',
                duration: 3000
              });
              toast.present();
              this.ionViewDidEnter();
            },
            err => {
                this.showTechnicalError();
            });
          }
        }
      ]
    });
    confirm.present();
  };

  ionViewDidEnter() {
    this.websiteData = [];
    this.websiteDetails = [];
    const loading = this.loadingCtrl.create({});
    loading.present();
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.get(this.APIURL + '/websiteList/'+ localStorage.getItem('userinfo'), options).map(res => res.json()).subscribe(data => {
      loading.dismissAll()
      this.social = [];
      this.marketing = [];
      this.others = [];
      for (var i = data.length - 1; i >= 0; --i) {   
        if (data[i].selectCategory == 'Social'){
          if (this.allowed_levels.indexOf('level' + data[i].weblevel) != -1) {
            this.social.push(data[i]);
          }
        }else if(data[i].selectCategory == 'Marketing'){
          if (this.allowed_levels.indexOf('level' + data[i].weblevel) != -1) {
            this.marketing.push(data[i]);
          }
        }else{
          if (this.allowed_levels.indexOf('level' + data[i].weblevel) != -1) {
            this.others.push(data[i]);
          }
        }      
      }
      //this.websiteData = data;
    },
    err => {
        loading.dismissAll();
        this.showTechnicalError();
    });
  };

  presentModal3(myEvent3) {
    let modal = this.modalCtrl.create('AddwebsitePage');
    modal.onDidDismiss(callback =>{ 
      console.log(callback)
      if(callback != 'empty'){
        this.ionViewDidEnter();
      }
    });
    modal.present({ 
      ev: myEvent3
    });
  };

  openWebsitePage(data){
	  this.navCtrl.push('SitesdetailPage',data);
  };

  recipts(siteId){ 
    this.navCtrl.push('SiteReciptsPage',{
      siteId : siteId
    })
  }

  edit(data){
	  localStorage.setItem('siteDetail', JSON.stringify(data));
	   let modal = this.modalCtrl.create('EditsitePage');
    modal.onDidDismiss(callback =>{
      this.ionViewDidEnter();
    });
    modal.present({ 
      ev: data
    });
    //this.navCtrl.push(EditsitePage ,data);
  };

  root(){
    this.navCtrl.setRoot('DashboardPage');
  };

  wallet(){
    this.navCtrl.setRoot('WalletsPage');
  };
}
