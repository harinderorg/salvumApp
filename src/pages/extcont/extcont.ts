import { Component } from '@angular/core';
import { IonicPage,ToastController, NavController, NavParams, AlertController, LoadingController, Events} from 'ionic-angular';

import {Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/Rx';

@IonicPage()
@Component({
  selector: 'page-extcont', 
  templateUrl: 'extcont.html', 
})
export class ExtcontPage {
  data: Array<{}>;
 finaldata : {};
 extnal : {};
 isBrowser:any;
 invititionMail : Array<any> = [];
 API_ENDPOINT_URL : any = localStorage.getItem('API_ENDPOINT_URL');
  getContact='getContacts';
  addExternalContacts = 'addContacts';
  sendEmailInvition = 'sendInvition';
  userId = localStorage.getItem('userinfo');
  constructor(public navCtrl: NavController, public navParams: NavParams, public http:Http, public toastCtrl: ToastController, public alertCtrl: AlertController,public loadingCtrl: LoadingController, public events: Events) {
      this.http = http;
      this.isBrowser = localStorage.getItem('isBrowser');
  }

  ionViewDidLoad() {
    const loading = this.loadingCtrl.create({});
    loading.present();
    var userId = localStorage.getItem('userinfo');
    let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.get(this.API_ENDPOINT_URL+this.getContact + "/" + userId, options)
            .map(res => res.json())
            .subscribe(data => {
              loading.dismissAll()
            this.data = data.data;

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

  sendmail(mails){
    if(this.invititionMail.length > 0){
      for(let data of this.invititionMail) {
        if(data == mails.externalContacts){
          var index = this.invititionMail.findIndex(x => x == mails.externalContacts);
          this.invititionMail.splice(index, 1);
          console.log(this.invititionMail);
          return false;
        }
      }
    this.invititionMail.push(mails.externalContacts);
    }else{
      this.invititionMail.push(mails.externalContacts)
    }
  }

   Invitation(){
			if(this.invititionMail.length == 0){
				let toast = this.toastCtrl.create({
			        message: 'Please select atleast one checkbox',
			        duration: 3000,
              cssClass: 'danger',
              position: 'top'
			      });
			      toast.present();
				
			}else{
			      let headers = new Headers({ 'Content-Type': 'application/json' });
			      let options = new RequestOptions({ headers: headers });
			      return this.http.post(this.API_ENDPOINT_URL+this.sendEmailInvition, {'email': this.invititionMail, 'userId': this.userId}, options)
			          .map(res => res.json())
			          .subscribe(data => {
			           if(data.error != null){
                  let toast = this.toastCtrl.create({
                    message: data.error,
                    duration: 3000,
                    position: 'top'
                  });
                  toast.present(); 
                  this.invititionMail = [];
                  this.ionViewDidLoad();
                }else{
                  let toast = this.toastCtrl.create({
                    message: 'Invitation mail has been sent.',
                    duration: 3000,
                    cssClass: 'success',
                    position: 'top'
                  });
                  toast.present(); 
                  this.invititionMail = [];
                  this.ionViewDidLoad();
                }			         
              },
              err => {
                  this.showTechnicalError('1');
              });
			}
  }

  Import(){
   this.navCtrl.push('InvitePage');

  }


Add(){
 let prompt = this.alertCtrl.create({
      title: 'Add External Contact',
      inputs: [
        {
          name: 'email',
          placeholder: 'Email',

           type: 'text'
        }
      ],

      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Add Contact',
          handler: data => {


            var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
            // var str = data.email;
            if (reg.test(data.email) == false) 
            {
               let toast = this.toastCtrl.create({
                          message: 'Please Enter Valid Email',
                          duration: 3000,
                          cssClass: 'danger',
                          position: 'top'
                        });
                        toast.present(); 
                        return false;
            }else if (data.email.includes(",") == true) 
            {
               let toast = this.toastCtrl.create({
                          message: 'Please Enter Valid Email',
                          duration: 3000,
                          cssClass: 'danger',
                          position: 'top'
                        });
                        toast.present(); 
                        return false;
            }else{
              const loading = this.loadingCtrl.create({});
              loading.present();
            this.invititionMail = data.email;
            this.extnal = {'userId':localStorage.getItem('userinfo'),
             'extrnalContacts':this.invititionMail
            }
              let body = JSON.stringify(this.extnal);
                let headers = new Headers({ 'Content-Type': 'application/json' });
               let options = new RequestOptions({ headers: headers });
                return this.http.post(this.API_ENDPOINT_URL+this.addExternalContacts, body, options)
                    .map(res => res.json())
                    .subscribe(data => {
                    loading.dismissAll();
                      this.ionViewDidLoad();
                     this.invititionMail = [];
                      if(data.status == 0){
                        let toast = this.toastCtrl.create({
                          message: 'External contact already exist.',
                          duration: 3000,
                          cssClass: 'danger',
                          position: 'top'
                        });
                        toast.present(); 
                      }else if(data.status == 1){
                        let toast = this.toastCtrl.create({
                          message: 'Can\'t invite yourself.',
                          duration: 3000,
                          cssClass: 'danger',
                          position: 'top'
                        });
                        toast.present(); 
                      }else{
                        let toast = this.toastCtrl.create({
                          message: 'External contact saved successfully.',
                          duration: 3000,
                          cssClass: 'success',
                          position: 'top'
                        });
                        toast.present(); 
                      }
                    },
                    err => {
                        loading.dismissAll();
                        this.showTechnicalError('1');
                    });
            }    
          }
        }
      ]
    })
    prompt.present(); 
  };

  root(){
    this.navCtrl.setRoot('DashboardPage');
  };

  contacts(){
    this.navCtrl.setRoot('ContactsPage');
  };

  deleteContact(item, index){

    let alert = this.alertCtrl.create({
        title: 'Delete External Contact',
        message: 'Do you want to delete this external contact?',
        buttons: [{
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
              console.log('Cancel clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            const loading = this.loadingCtrl.create({});
            let headers = new Headers({ 'Content-Type': 'application/json' });
            let options = new RequestOptions({ headers: headers });
            this.http.put(this.API_ENDPOINT_URL+this.addExternalContacts, {'_id': item._id }, options).map(res => res.json()).subscribe(data => {
              loading.dismissAll();
              let toast = this.toastCtrl.create({
                message: 'External contact deleted successfully.',
                duration: 3000,
                cssClass: 'success',
                position: 'top'
              });
              toast.present(); 
              this.data.splice(index,1);
            },
            err => {
                loading.dismissAll();
                this.showTechnicalError('1');
            });
          }
        }]
      });
    alert.present();
  };
}