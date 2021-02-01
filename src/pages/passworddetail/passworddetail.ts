import { Component } from '@angular/core';
import { IonicPage, ToastController, NavController, NavParams, ModalController ,  AlertController } from 'ionic-angular';
import {Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/Rx';

@IonicPage()
@Component({
  selector: 'page-passworddetail',
  templateUrl: 'passworddetail.html',
})
export class PassworddetailPage {
address: {};
newarr: Array<{}>;
toggoleShowHide : {};
isBrowser:any; 
API_ENDPOINT_URL : any = localStorage.getItem('API_ENDPOINT_URL');
deletepassUrl = 'deletepassword';

  constructor(public navCtrl: NavController,  public modalCtrl: ModalController,public navParams: NavParams,public alertCtrl: AlertController , public http:Http ,public toastCtrl: ToastController) {
    this.isBrowser = localStorage.getItem('isBrowser');
  };

  ionViewDidLoad() {
   let other = [];
   this.toggoleShowHide = true;
    if (this.navParams.data._id) {
      localStorage.setItem('pwdDetail', JSON.stringify(this.navParams.data));
    }
    this.address =  JSON.parse(localStorage.getItem('pwdDetail'));
    //this.address  = this.navParams.data;
    other.push(this.address);
    this.newarr = other;
  };

  itemClicked(value){
    this.toggoleShowHide = !value;
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

   presentModal2(myEvent1) {
    let modal = this.modalCtrl.create('AddpasswordPage');
    modal.onDidDismiss(callback =>{
      ///this.ngOnInit();
    });
    modal.present({ 
      ev: myEvent1
    });
  };
  
    edit(data){

	   let modal = this.modalCtrl.create('EditpassPage');
    modal.onDidDismiss(callback =>{
    //  this.ngOnInit();'
    });
    modal.present({ 
      ev: data
    });
    //this.navCtrl.push(EditsitePage ,data);
  };
  showConfirm(item) {
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
          let body = JSON.stringify(item);
          let headers = new Headers({ 'Content-Type': 'application/json' });
          let options = new RequestOptions({ headers: headers });
          return this.http.post(this.API_ENDPOINT_URL+this.deletepassUrl, body, options)
            .map(res => res.json())
            .subscribe(data => {
            let passData = data
             let toast = this.toastCtrl.create({
                message: 'Password was deleted successfully',
                duration: 3000
              });
              toast.present();
              this.navCtrl.push('PasswordsPage',passData)
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

  password(){
    this.navCtrl.push('PasswordsPage');
  };

  wallets(){
    this.navCtrl.push('WalletsPage');
  };

}