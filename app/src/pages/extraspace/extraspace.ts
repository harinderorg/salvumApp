import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import {Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/Rx';

@IonicPage()
@Component({
  selector: 'page-extraspace',
  templateUrl: 'extraspace.html',
})
export class ExtraspacePage {
API_ENDPOINT_URL : any = localStorage.getItem('API_ENDPOINT_URL');
extraSpace = 'SpacePackages';
extraSpaceArr: Array<{}>;
page_type: any;
isBrowser = localStorage.getItem('isBrowser');
  constructor(public navCtrl: NavController, public navParams: NavParams,public http:Http, public loadingCtrl: LoadingController, public toastCtrl: ToastController) {
  this.http = http;
  this.page_type = navParams.get('page_type');
  }

  ionViewDidLoad() { 
        const loading = this.loadingCtrl.create({});
        loading.present();
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.get(this.API_ENDPOINT_URL+this.extraSpace , options)
            .map(res => res.json())
            .subscribe(data => {
               loading.dismissAll()
             this.extraSpaceArr = data;
          
             // for (var i = 0; i < this.extraSpaceArr.length; i++) {

             // newdata.push(this.extraSpaceArr[i]);
             // if(newdata[i].offer.includes("$")){
             //    var offerNumber = newdata[i].offer.substring(1)
             //    var final =  Number(newdata[i].price) - Number(offerNumber);
        
             //    this.extraSpaceArr[i].final = final;
             // }else if(newdata[i].offer.includes("%")){
             //  // console.log(newdata[i].offer.slice(0,-1))
             //  var offerTotal = newdata[i].offer.slice(0,-1);
             //  var final = Number(newdata[i].price) - Number((offerTotal/100)*newdata[i].price);
            
             //  this.extraSpaceArr[i].final = final;
             // }else{
             //   this.extraSpaceArr[i].final = '';
             // }


             // }
            },
            err => {
                loading.dismissAll();
                this.showTechnicalError();
            });
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

  GoToPayMentPage(extra){
    if(this.page_type == '1')
    {
      localStorage.setItem('preState', 'extra_space');
    }
    else
    {
      localStorage.setItem('preState', 'extra');
    }
    this.navCtrl.push('PaymentPage', extra);
  }

  root(){
    this.navCtrl.setRoot('DashboardPage');
  };

  package(){
    this.navCtrl.setRoot('PricingPage');
  };
}