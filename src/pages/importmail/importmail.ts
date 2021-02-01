import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import {Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/Rx';


declare var $:any;
@IonicPage()
@Component({
  selector: 'page-importmail',
  templateUrl: 'importmail.html',
})
export class ImportmailPage implements OnInit {
data : any = [];
checkAll : any;
invititionMail : Array<any> = [];
extnal : {};
selectedAll : any;
is_yes:any = '1';
col : object = {}
isallselct :string
type : string = this.navParams.get('type');
API_ENDPOINT_URL : any = localStorage.getItem('API_ENDPOINT_URL');
userId : any = localStorage.getItem('userinfo');
 sendEmailInvition = 'sendInvition';
 saveExternalContacts = 'saveExtCont';

  constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController,public http:Http, public loadingCtrl : LoadingController) {
   this.http = http;
  }

  ngOnInit(){
    var all_contacts;
    var contacts;
    if(this.navParams.get('type') == 'yahoo'){
      if(this.navParams.get('yahoo_contacts') != null || this.navParams.get('yahoo_contacts') != undefined){
        all_contacts = this.navParams.get('yahoo_contacts');
        if(all_contacts.length > 0){
          contacts = [];
          all_contacts.forEach(function(data){
            contacts.push(data);
          });
          this.data = contacts;
          this.is_yes = contacts.length == 0 ? '0' : '1';
        }
        else{
          this.data = [];
          this.is_yes = '0';
        }
      }
      else{
        this.data = [];
        this.is_yes = '0';
      }
    }
    else if(this.navParams.get('type') == 'gmail'){
      if(this.navParams.get('gmail_contacts') != null || this.navParams.get('gmail_contacts') != undefined){
        all_contacts = this.navParams.get('gmail_contacts');
        if(all_contacts.length > 0){
          contacts = [];
          all_contacts.forEach(function(data){
            contacts.push(data[0]);
          });
          this.data = contacts;
          this.is_yes = contacts.length == 0 ? '0' : '1';
        }
        else{
          this.data = [];
          this.is_yes = '0';
        }
      }
      else{
        this.data = [];
        this.is_yes = '0';
      }
    }
    else if(this.navParams.get('type') == 'hotmail'){
      if(this.navParams.get('hotmail_contacts') != null || this.navParams.get('hotmail_contacts') != undefined){
        all_contacts = this.navParams.get('hotmail_contacts');
          this.data = all_contacts;
          this.is_yes = all_contacts.length == 0 ? '0' : '1';
        }
        else{
          this.data = [];
          this.is_yes = '0';
        }
      }
      else{
        this.data = [];
        this.is_yes = '0';
      }
    }

  selectAll(value, data){
    if(value !== true) {
    for (var i = 0; i < this.data.length; i++) {
       for(var j = 0 ; j < this.data[i].gd$email.length; j ++){
           this.invititionMail.push(this.data[i].gd$email[j].address)
       }
     }
        $('.my_checkbox').each(function() {
            this.checked = true;
        });
    }
    else {
      this.invititionMail = [];
        console.log(this.invititionMail);
      $('.my_checkbox').each(function() {
            this.checked = false;
        });
    }
  }
  ionViewDidLoad() {
   this.isallselct = 'false';
    this.data = this.navParams.data;
    for (var i = 0; i < this.data.length; i++) {
      this.data[i].selected = false
     for(var j = 0 ; j < this.data[i].gd$email.length; j ++){
         // this.data[i].gd$email[j].selected = false
     }
   }
  }



  sendmail(mails){
    var index;
    if(this.type == 'yahoo'){
      if(this.invititionMail.length > 0){
        for(let data of this.invititionMail) {
        if(data == mails){
          index = this.invititionMail.findIndex(x => x == mails);
          this.invititionMail.splice(index, 1);
          return false;
        }
      }
      this.invititionMail.push(mails);
      }else{
       this.invititionMail.push(mails)
      }
    }
    else{
      if(this.invititionMail.length > 0){
        for(let data of this.invititionMail) {
        if(data == mails.address){
          index = this.invititionMail.findIndex(x => x == mails.address);
          this.invititionMail.splice(index, 1);
          return false;
        }
      }
      this.invititionMail.push(mails.address);
      }else{
       this.invititionMail.push(mails.address)
      }
    }
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

  dismiss(){
    this.navCtrl.pop();
  }

  Import(){
  if(this.invititionMail.length == 0){
        let toast = this.toastCtrl.create({
              message: 'Please select atleast one checkbox',
              duration: 3000,
              cssClass: 'danger',
              position: 'top'
            });
            toast.present();
        
      }else{
          const loading = this.loadingCtrl.create({});
          loading.present();
          let headers = new Headers({ 'Content-Type': 'application/json' });
          let options = new RequestOptions({ headers: headers });
          return this.http.post(this.API_ENDPOINT_URL+this.sendEmailInvition, {'email': this.invititionMail, 'userId': this.userId}, options)
              .map(res => res.json())
              .subscribe(data => {
                loading.dismissAll();
               if(data.error != null){
                let toast = this.toastCtrl.create({
                  message: data.error,
                  duration: 3000,
                  position: 'top'
                });
                toast.present(); 
                this.dismiss();
                // this.ionViewDidLoad();
              }else{
                let toast = this.toastCtrl.create({
                  message: 'Invitation mails has been sent.',
                  duration: 3000,
                  cssClass: 'success',
                  position: 'top'
                });
                toast.present();
                this.dismiss(); 
                // this.ionViewDidLoad();
              }              
            },
            err => {
                loading.dismissAll();
                this.showTechnicalError('1');
            });
      }
  }

  saveExternal(){
   if(this.invititionMail.length == 0){
        let toast = this.toastCtrl.create({
              message: 'Please select atleast one checkbox',
              duration: 3000,
              cssClass: 'danger',
              position: 'top'
            });
            toast.present();
          
        }else{
          const loading = this.loadingCtrl.create({});
          loading.present();
          this.extnal = this.invititionMail
          this.extnal = {'userId':localStorage.getItem('userinfo'),
           'extrnalContacts':this.invititionMail
          }
          let body = JSON.stringify(this.extnal);
            let headers = new Headers({ 'Content-Type': 'application/json' });
           let options = new RequestOptions({ headers: headers });
            return this.http.post(this.API_ENDPOINT_URL+this.saveExternalContacts, body, options)
                .map(res => res.json())
                .subscribe(data => {
                  loading.dismissAll();
                  this.invititionMail = [];
                  $('.my_checkbox').each(function() {
                        this.checked = false;
                    });
                  let toast = this.toastCtrl.create({
                      message: 'External Contact saved Successfully',
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
  }

}