import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import {Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/Rx';
import { ContactserviceProvider } from '../../providers/contactservice/contactservice';

@IonicPage()
@Component({
  selector: 'page-message',
  templateUrl: 'message.html',
  providers: [ContactserviceProvider]
})
export class MessagePage {
messageArr: any;
acceptInvitation = {};
isBrowser:any;
API_ENDPOINT_URL : any = localStorage.getItem('API_ENDPOINT_URL');
accptInvitation = 'accptinvitation';
  constructor(public navCtrl: NavController,public loadingCtrl: LoadingController, public navParams: NavParams,public http:Http, public toastCtrl: ToastController, public contactserviceProvider: ContactserviceProvider) {
    this.isBrowser = localStorage.getItem('isBrowser');
    const loading = this.loadingCtrl.create({});
    loading.present();
    this.contactserviceProvider.getAllNotifications(localStorage.getItem('userinfo'), 1).subscribe((all_files)=>{
      this.messageArr = all_files.data;
      loading.dismissAll();
    },
    err => {
        loading.dismissAll();
        this.showTechnicalError();
    });
  }

  ionViewDidLoad() {
    // //this.messageArr  = this.navParams.data;
    //   console.log(this.messageArr);
    //  var userId = localStorage.getItem('userinfo')
    //  let headers = new Headers({ 'Content-Type': 'application/json' });
    //       let options = new RequestOptions({ headers: headers });
    //       return this.http.get(this.messageData +'/' + userId, options).map(res => res.json()).subscribe(data => {
    //           console.log(data);
    //           this.messageArr = data;
    //           })


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

  accept(item){
   this.acceptInvitation = {
         memberId : item._id,
         memberstatus : '2',
      }
        let body = JSON.stringify(this.acceptInvitation);
         let headers = new Headers({ 'Content-Type': 'application/json' });
         let options = new RequestOptions({ headers: headers });
          return this.http.put(this.API_ENDPOINT_URL+this.accptInvitation, body, options)
              .map(res => res.json())
             .subscribe(data => {
             var newdata = data;
               let toast = this.toastCtrl.create({
                    message: 'Invitation Accpted',
                    duration: 3000
                 });
                toast.present();
                this.navCtrl.push('DashboardPage' ,newdata) 
              },
              err => {
                  this.showTechnicalError('1');
              });

  }

  decline(item){
      this.acceptInvitation = {
         memberId : item._id,
         memberstatus : '0'
      }
        let body = JSON.stringify(this.acceptInvitation);
         let headers = new Headers({ 'Content-Type': 'application/json' });
         let options = new RequestOptions({ headers: headers });
          return this.http.put(this.API_ENDPOINT_URL+this.accptInvitation, body, options)
              .map(res => res.json())
             .subscribe(data => {
             var newdata = data;
               let toast = this.toastCtrl.create({
                    message: 'Invitation Decline',
                    duration: 3000
                 });
                toast.present();
                this.navCtrl.push('DashboardPage' ,newdata) 
              },
              err => {
                  this.showTechnicalError('1');
              });

  }
  root(){
    this.navCtrl.setRoot('DashboardPage');
  };

}
