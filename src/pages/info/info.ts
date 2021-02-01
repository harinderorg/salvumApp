import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController } from 'ionic-angular';
import * as copy from 'copy-to-clipboard';
@IonicPage()
@Component({
  selector: 'page-info',
  templateUrl: 'info.html',
})
export class InfoPage {
rfi : any;
isBrowser : any = localStorage.getItem('isBrowser');
APIURL : any = localStorage.getItem('APIURL');
baseUrl : any = localStorage.getItem('baseUrl');
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public toastCtrl: ToastController) {
  	this.rfi = navParams.get('info');
  }

  dismiss(){
	  this.viewCtrl.dismiss();
	}
  copyAnswer(answer){
    copy(answer);
    copy(answer);
    let toast = this.toastCtrl.create({
      message: 'Copy to clipboard.',
      duration: 3000,
      position: 'top',
      cssClass: 'success'
     });
     toast.present();
  }

}
