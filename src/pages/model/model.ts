import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,ViewController, ToastController, LoadingController} from 'ionic-angular';
import {Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/Rx';

@IonicPage()
@Component({
  selector: 'page-model',
  templateUrl: 'model.html',
})
export class ModelPage {
 tags = '';
 allValidTags : any = [];
 sendArray = [];
 isEmailValid: Boolean = true;
 isEmailAlreadyExist = false;
 API_ENDPOINT_URL : any = localStorage.getItem('API_ENDPOINT_URL');
 specContInvition = 'sendInvition';
  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl: ViewController,public toastCtrl: ToastController,public http:Http, public loadingCtrl : LoadingController) {
     this.http = http;
  };

  dismiss() {
    this.viewCtrl.dismiss();
  };

  onInput(){
    this.isEmailValid = true;
  }

  validateEmail(email){ 
    if(this.tags != ''){
      var tagArray = [];
      var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
      if (reg.test(email) == false){
        tagArray.push(email);
        this.isEmailValid = false;
        this.isEmailAlreadyExist = false;
      }else{
        this.isEmailValid = true;
        if(this.sendArray.indexOf(email) == -1) {
          this.sendArray.push(email);
          this.tags = '';
          this.isEmailAlreadyExist = false;
        }else{
          this.isEmailAlreadyExist = true;
        }
      }
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

  submit(email){
    if(this.tags != ''){
      if(this.verifyTag(email)){
        this.isEmailValid = true;
        if(this.sendArray.indexOf(email) == -1) {
          this.sendArray.push(email);
          this.tags = '';
          this.isEmailAlreadyExist = false;
          if(this.sendArray.length == 0){
            let toast = this.toastCtrl.create({
              message: 'Please enter atleast one tag.',
              duration: 3000
            });
            toast.present();
          }else{
            this.sendInvitation();
          }
        }else{
          this.isEmailAlreadyExist = true;
        }
      }
    }else{
      if(this.sendArray.length == 0){
        let toast = this.toastCtrl.create({
          message: 'Please enter atleast one tag.',
          duration: 3000
        });
        toast.present();
      }else{
        this.sendInvitation();
      }
    }
  }

  sendInvitation(){
    const loading = this.loadingCtrl.create({});
    loading.present();
    let body = JSON.stringify({'email': this.sendArray, 'userId': localStorage.getItem('userinfo') });
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(this.API_ENDPOINT_URL+this.specContInvition, body, options)
        .map(res => res.json())
        .subscribe(data => { 
        loading.dismissAll();
        this.tags = '';
        this.sendArray = [];
          if(data.status == 0){
            if(data.error == 'You can\'t invite by yourself.' || data.error == 'already connected with user.' || data.error == 'You can\'t invite by yourself.already connected with user.'){
              let toast = this.toastCtrl.create({
                message: data.error,
                duration: 10000,
                position: 'top',
                cssClass: 'danger'
              });
              toast.present(); 
            }else{
              let toast = this.toastCtrl.create({
                message: data.error,
                duration: 10000,
                position: 'top',
                cssClass: 'success'
              });
              toast.present();
              this.viewCtrl.dismiss();
            }
            
          }else{
            var msg = '';
            for(var i=0; i < this.sendArray.length; i++){
              if(msg == ''){
                msg = this.sendArray[i];
              }else{
                msg = msg + ',' + this.sendArray[i]
              }
            }
            let toast = this.toastCtrl.create({
              message: 'Invitation Send on this' + ' '+ msg,
              duration: 10000,
              position: 'top',
              cssClass: 'success'
            });
            toast.present(); 
            this.viewCtrl.dismiss();
            this.navCtrl.push('InvitePage');
        }  
     },
      err => {
          loading.dismissAll();
          this.showTechnicalError('1');
      });
      
  }

  verifyTag(tag){
    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
      if (reg.test(tag) == false){ 
        return false;
      }else{
        return true;
      }  
  }  

  removeEmailAddress(index){
    this.sendArray.splice(index, 1);
  }
}