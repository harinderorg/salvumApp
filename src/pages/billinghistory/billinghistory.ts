import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import {Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/Rx';

@IonicPage()
@Component({
  selector: 'page-history',
  templateUrl: 'billinghistory.html',
})
export class HistoryPage {

  data: Array<{}>;
  license: Array<{}>;
  extraSpace: Array<{}>;
  dataLength:any;
  pack_data:any = [];
  isExtraspace:any;
  isBrowser:any;
  getUserMembership='getUserMembership';
  getUserLicensesData='getUserLicensesData';
  getSpacePackages='getSpacePackages';
  API_ENDPOINT_URL : any = localStorage.getItem('API_ENDPOINT_URL');
  constructor(public toastCtrl: ToastController, public navCtrl: NavController, public navParams: NavParams,public http:Http,public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
   this.isBrowser = localStorage.getItem('isBrowser');
    const loading = this.loadingCtrl.create({});
        loading.present();
      var userId = localStorage.getItem('userinfo');
    let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.get(this.API_ENDPOINT_URL+this.getUserMembership + "/" + userId, options)
            .map(res => res.json())
            .subscribe(data => {
                this.data = data;
                var packs_data = [];
                data.forEach(function(pack_data){
                  if(pack_data.amount > 0)
                  {
                    packs_data.push(pack_data);
                  }
                });
                this.pack_data = packs_data;

                return this.http.get(this.API_ENDPOINT_URL+this.getUserLicensesData + "/" + userId, options)
                .map(res => res.json())
                .subscribe(data => {
                  console.log(data)
                    var unique = [];
                    data.forEach(function(d) {

                        var found = false;
                        unique.forEach(function(u) {
                            if(u.transactionId == d.transactionId) {
                                found = true;
                            }
                        });
                        if(!found) {
                            unique.push(d);
                        }
                    });
                    this.license = unique;
                   return this.http.get(this.API_ENDPOINT_URL+this.getSpacePackages + "/" + userId, options)
                    .map(res => res.json())
                    .subscribe(data => {
                     loading.dismissAll();
                     this.isExtraspace = data;
                      for (var i = 0; i < data.length; i += 1) {
                        var todayDate = new Date(data[i].created_date).toISOString().slice(0,10);
                        data[i].created_date = todayDate
                        this.extraSpace = data;
                      }
                    })  
                })
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

  root(){
    this.navCtrl.setRoot('DashboardPage');
  };
}