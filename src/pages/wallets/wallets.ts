import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-wallets',
  templateUrl: 'wallets.html',
})
export class WalletsPage {
isBrowser: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public popoverCtrl: PopoverController) {
  }

  ionViewDidLoad() {
    this.isBrowser = localStorage.getItem('isBrowser');
  }
openWalletPage()
{
	this.navCtrl.push('WalletinnerPage');
}
openPasswordPage()
{
	this.navCtrl.push('PasswordsPage');
}

openSitePage(){
  this.navCtrl.push('SitesPage');
}


  root(){
    this.navCtrl.setRoot('DashboardPage');
  };
}
