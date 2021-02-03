import { Component } from '@angular/core';
import { ToastController, IonicPage, NavController, NavParams, AlertController, ViewController } from 'ionic-angular';
import {Http} from '@angular/http';
import 'rxjs/Rx';
import { ContactserviceProvider } from '../../providers/contactservice/contactservice';

@IonicPage()
@Component({
  selector: 'page-walletdetail',
  templateUrl: 'walletdetail.html',
  providers: [ContactserviceProvider]
})
export class WalletdetailPage {
addr: {};
new: Array<{}>;
 items: Array<{}>;
toggoleShowHide : {};
isBrowser:any; 
  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController,public http:Http ,public toastCtrl: ToastController,public deleteCtrl: ViewController, public contactserviceProvider: ContactserviceProvider) {
  this.http = http;
  this.isBrowser = localStorage.getItem('isBrowser');
  }



  ionViewDidLoad() {
    let other = [];
    this.items = [];
    this.toggoleShowHide = true;
      if(this.navParams.data != {}){
        localStorage.setItem('walletDetail', JSON.stringify(this.navParams.data));
      }
      this.addr  = JSON.parse(localStorage.getItem('walletDetail'));
      other.push(this.addr);
      this.new = other;
  }

  itemClicked(value){
    this.toggoleShowHide = !value;
    return true
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


    showConfirm(item ,index) {
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
            let webdel = data;
             let toast = this.toastCtrl.create({
                message: 'Wallet has been deleted successfully.',
                duration: 3000
              });
              toast.present(); 
               this.navCtrl.push('WalletinnerPage',webdel); 
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

  root(){
    this.navCtrl.setRoot('DashboardPage');
  };

  wallet(){
    this.navCtrl.setRoot('WalletsPage');
  };

  wallets(){
    this.navCtrl.setRoot('WalletinnerPage');
  };
}