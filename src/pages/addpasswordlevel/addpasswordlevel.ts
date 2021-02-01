import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Platform ,ToastController, ViewController, LoadingController} from 'ionic-angular';
import {Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/Rx';

@IonicPage()
@Component({
  selector: 'page-addpasswordlevel',
  templateUrl: 'addpasswordlevel.html',
})
export class AddpasswordlevelPage {

password:string;
confirmpassword: string;
questions:string;
answer: string;
email:string = '';
contact: string = '';
selectedLevel: any;
isBrowser:any;
API_ENDPOINT_URL : any = localStorage.getItem('API_ENDPOINT_URL');
  isAndroid: boolean = false;
   data: Object = {};
  condition:any;
  toggoleShowHide:any = false;
  addLevelURL = 'addlevel'
  constructor(public navCtrl: NavController, public navParams: NavParams,platform: Platform,public toastCtrl: ToastController,public http:Http, public viewCtrl: ViewController,public loadingCtrl: LoadingController) {
  this.isBrowser = localStorage.getItem('isBrowser');
   this.isAndroid = platform.is('android');
   this.http = http;
    if(this.navParams.data != 1 && this.navParams.data != 2 && this.navParams.data != 3 && this.navParams.data != 4 ){
      this.navCtrl.push('DashboardPage');
    }
   this.selectedLevel = this.navParams.data;
  }
 
  ionViewDidLoad() {
    this.condition = localStorage.getItem('selectedLevel');
  }

  itemClicked(){
    this.toggoleShowHide = !this.toggoleShowHide;
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

  savePassword(){
   var userId = localStorage.getItem('userinfo');

    if(this.password == undefined || this.password == ''){
       let toast = this.toastCtrl.create({
                message: 'Please enter password.',
                duration: 3000,
                cssClass: 'danger',
                position: 'top'
               });
               toast.present();
      }else if(this.confirmpassword == undefined || this.confirmpassword == ''){
       let toast = this.toastCtrl.create({
                message: 'Please enter confirm password.',
                duration: 3000,
                cssClass: 'danger',
                position: 'top'
               });
               toast.present();

      }else if(this.questions == undefined || this.questions == ''){
       let toast = this.toastCtrl.create({
                message: 'Please select question.',
                duration: 3000,
                cssClass: 'danger',
                position: 'top'
               });
               toast.present();

      }else if(this.answer == undefined || this.answer == ''){
       let toast = this.toastCtrl.create({
                message: 'Please enter answer.',
                duration: 3000,
                cssClass: 'danger',
                position: 'top'
               });
               toast.present();

      }else if(this.password != this.confirmpassword){
    let toast = this.toastCtrl.create({
                message: 'Passwords does not match.',
                duration: 3000,
                cssClass: 'danger',
                position: 'top'
              });
              toast.present();

    }else if(this.toggoleShowHide == true && this.email == '' && this.condition == 3 || this.toggoleShowHide == true && this.contact == '' && this.condition == 4){
      if(this.condition == 3){
        let toast = this.toastCtrl.create({
              message: 'Please enter your email address.',
              duration: 3000,
              cssClass: 'danger',
              position: 'top'
            });
            toast.present();
      }else{
        let toast = this.toastCtrl.create({
              message: 'Please enter your contact number.',
              duration: 3000,
              cssClass: 'danger',
              position: 'top'
            });
            toast.present();
      }
    }else{
       this.data = {
             password: this.password,
             questions : this.questions,
             answer: this.answer,
             userId: userId,
             level : this.navParams.data,
             email: this.email,
             contact: this.contact,
             isOn: this.toggoleShowHide
           }
        const loading = this.loadingCtrl.create({}); 
        loading.present();
       let body = JSON.stringify(this.data);
          let headers = new Headers({ 'Content-Type': 'application/json' });
          let options = new RequestOptions({ headers: headers });
          return this.http.post(this.API_ENDPOINT_URL+this.addLevelURL, body, options)
              .map(res => res.json())
              .subscribe(data => {
             // console.log(data);
               loading.dismissAll();
               this.viewCtrl.dismiss();
              let toast = this.toastCtrl.create({
                  message: 'Password has been added successfully.',
                  duration: 3000,
                  cssClass: 'success',
                  position: 'top'
                });
                toast.present(); 
              },
              err => {
                  loading.dismissAll();
                  this.showTechnicalError('1');
              });
             
      }
    
  };

  root(){
    this.navCtrl.setRoot('DashboardPage');
  };
}
