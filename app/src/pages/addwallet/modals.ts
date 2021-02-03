import {Component} from '@angular/core';
import {IonicPage, ModalController,ViewController, NavParams,NavController,LoadingController, ToastController} from 'ionic-angular';
import { Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/Rx';
import * as CryptoJS from 'crypto-js';

@IonicPage()
@Component({
    selector: 'page-modals',
    templateUrl: 'modals.html',
})
export class ModalsPage {

    cardName: string;
    cardHolderName: string;
    cardNumber: string;
    cvv: string;
    expiryDate: string;
    cardType: string;
    level: string;
    API_ENDPOINT_URL : any = localStorage.getItem('API_ENDPOINT_URL');
    data: Object = {};
    extnal: {}
    propertiesURL = 'addwallet';
    userId: any;
    all_levels: any = [];
    allowed_levels: any = [];
    constructor(public modalCtrl: ModalController, public viewCtrl: ViewController, public navParams: NavParams, public http: Http, public toastCtrl: ToastController, public navCtrl: NavController, public loadingCtrl: LoadingController) {
        this.http = http;
        this.userId = localStorage.getItem('userinfo');
        this.all_levels = JSON.parse(localStorage.getItem('alllevel'));

        if (this.all_levels && this.all_levels.length > 0) {
            this.all_levels.forEach((value) => {

                this.allowed_levels = [];
                var decrypted = CryptoJS.AES.decrypt(value, this.userId);
                var i;
                if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level1') {
                    this.allowed_levels = [];
                    for (i = 1; i <= 1; i++) {
                        this.allowed_levels.push(i);
                    }
                } else if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level2') {
                    this.allowed_levels = [];
                    for (i = 1; i <= 2; i++) {
                        this.allowed_levels.push(i);
                    }
                } else if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level3') {
                    this.allowed_levels = [];
                    for (i = 1; i <= 3; i++) {
                        this.allowed_levels.push(i);
                    }
                } else if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level4') {
                    this.allowed_levels = [];
                    for (i = 1; i <= 4; i++) {
                        this.allowed_levels.push(i);
                    }
                } else if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level0') {
                    this.allowed_levels = [];
                }
            });
        }
    }

    ionViewDidLoad() {
    }
    presentModal(myEvent1) {
        let modal = this.modalCtrl.create(ModalsPage);
        modal.present({
            ev: myEvent1
        });


    }
    dismiss() {
        this.viewCtrl.dismiss();
    }

    login() {

        if (this.cardHolderName == undefined || this.cardHolderName == '') {
            let toast = this.toastCtrl.create({
                message: 'Please enter card holdername.',
                duration: 3000,
                cssClass: 'danger',
                position: 'top'
            });
            toast.present();

        } else if (this.cardNumber == undefined || this.cardNumber == '') {
            let toast = this.toastCtrl.create({
                message: 'Please enter card number.',
                duration: 3000,
                cssClass: 'danger',
                position: 'top'
            });
            toast.present();

        } else if (this.cvv == undefined || this.cvv == '') {
            let toast = this.toastCtrl.create({
                message: 'Please enter cvv number.',
                duration: 3000,
                cssClass: 'danger',
                position: 'top'
            });
            toast.present();

        } else if (this.expiryDate == undefined || this.expiryDate == '') {
            let toast = this.toastCtrl.create({
                message: 'Please select expiry date.',
                duration: 3000,
                cssClass: 'danger',
                position: 'top'
            });
            toast.present();

        } else if (this.cardType == undefined || this.cardType == '') {
            let toast = this.toastCtrl.create({
                message: 'Please select card type.',
                duration: 3000,
                cssClass: 'danger',
                position: 'top'
            });
            toast.present();

        } else if (this.level == undefined || this.level == '') {
            let toast = this.toastCtrl.create({
                message: 'Please select level.',
                duration: 3000,
                cssClass: 'danger',
                position: 'top'
            });
            toast.present();

        } else {
            this.data = {
                cardName: this.cardName,
                cardHolderName: this.cardHolderName,
                cardNumber: this.cardNumber,
                cvv: this.cvv,
                expiryDate: this.expiryDate,
                cardType: this.cardType,
                level: this.level

            }
            const loading = this.loadingCtrl.create({});
            loading.present();

            this.extnal = {
                'userId': localStorage.getItem('userinfo'),
                'walletData': this.data
            }
            console.log(this.data);
            let body = JSON.stringify(this.extnal);
            let headers = new Headers({
                'Content-Type': 'application/json'
            });
            let options = new RequestOptions({
                headers: headers
            });
            return this.http.post(this.API_ENDPOINT_URL+this.propertiesURL, body, options)
                .map(res => res.json())
                .subscribe(data => {
                    loading.dismissAll()
                    console.log(data);
                    let walletData = data

                    let toast = this.toastCtrl.create({
                        message: 'Wallet has been added successfully.',
                        duration: 3000,
                        cssClass: 'success',
                        position: 'top'
                    });
                    toast.present();
                    this.navCtrl.push('WalletinnerPage', walletData);
                },
                  err => {
                      loading.dismissAll();
                      this.showTechnicalError('1');
                  });
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
}