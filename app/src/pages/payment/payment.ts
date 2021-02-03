import { Component } from '@angular/core';
import { ToastController, IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/Rx';

@IonicPage()
@Component({
  selector: 'page-payment',
  templateUrl: 'payment.html',
})
export class PaymentPage {
 cardNumber : string; 
 cvv: string; 
 zip: string;
 expiryDate: string;
 paynow : {};
 adddata:{};
 package: string;
 license: string;
 interval: string;
 curr_year: number;
 future_year: number;
 is_recurring_billing: any;
 packId:string
 isBrowser = localStorage.getItem('isBrowser');
 API_ENDPOINT_URL : any = localStorage.getItem('API_ENDPOINT_URL');
  PayAuth = 'PayAuth';
  PayAuthRecurring = 'PayAuthRecurring';
  PayAuthRecurringSignup = 'PayAuthRecurringSignup';
  addPayment = 'addPayment';
  addLicense = 'addLicense';
  addUserSpacePackage = 'addUserSpacePackage';
  addExtraUserLicense= 'addExtraUserLicense';
  prePage = localStorage.getItem('preState');
  create_new:any;
  companyId:any;
  company_name:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,public toastCtrl: ToastController, public http:Http, public loadingCtrl: LoadingController) {
     this.http = http;
     this.curr_year = new Date().getFullYear();
     this.future_year = this.curr_year + 25;
  }

  ionViewDidLoad() {
      if(this.navParams.data.totalprice){
          this.package = this.navParams.data.totalprice;
          this.license = this.navParams.data.license;
          this.interval = this.navParams.data.interval;
          this.packId = this.navParams.data.packId;
          this.is_recurring_billing = this.navParams.data.is_recurring_billing;
      }else if(this.navParams.data.type == 'extra'){
        var pricesplit = this.navParams.data.newprice;
        var finalprice = pricesplit.split('/');
          this.package = finalprice[1];
          this.license = finalprice[0];
          this.interval = '30';
          this.packId = finalprice[2];
          this.create_new = this.navParams.data.create_new;
          this.companyId = this.navParams.data.companyId;
          this.company_name = this.navParams.data.company_name;

        // console.log(this.navParams.data);
      }else{
        // console.log(this.navParams.data);
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

  payment(){
   if(this.cardNumber == undefined || this.cardNumber == ''){
       let toast = this.toastCtrl.create({
                message: 'Please enter valid card number.',
                duration: 3000,
                position: 'top',
                cssClass: 'danger'
               });
               toast.present();

      }else if(this.cvv == undefined || this.cvv == ''){
       let toast = this.toastCtrl.create({
                message: 'Please enter valid cvv.',
                duration: 3000,
                position: 'top',
                cssClass: 'danger'
               });
               toast.present();

      }else if(this.zip == undefined || this.zip == ''){
       let toast = this.toastCtrl.create({
                message: 'Please enter valid zip.',
                duration: 3000,
                position: 'top',
                cssClass: 'danger'
               });
               toast.present();
      }else if(this.expiryDate == undefined){
       let toast = this.toastCtrl.create({
                message: 'Please select expiry date.',
                duration: 3000,
                position: 'top',
                cssClass: 'danger'
               });
               toast.present();

      }else if(this.cvv.length <  3 || this.cvv.length >  4){
       let toast = this.toastCtrl.create({
                message: 'Please add atleast 3 digit cvv.',
                duration: 3000,
                position: 'top',
                cssClass: 'danger'
               });
               toast.present();

      }else if(this.zip.length <  5 || this.zip.length >  6){
       let toast = this.toastCtrl.create({
                message: 'Please add atleast 5 digit zip.',
                duration: 3000,
                position: 'top',
                cssClass: 'danger'
               });
               toast.present();

      }else if(this.cardNumber.length <  12 || this.cardNumber.length >  16){
       let toast = this.toastCtrl.create({
                message: 'Please enter valid card number.',
                duration: 3000,
                position: 'top',
                cssClass: 'danger'
               });
               toast.present();

      }
      else{
        var date;
        if(this.navParams.data.totalprice){
        date = this.expiryDate.split('-');
        this.paynow = {
          card_number :  this.cardNumber,
          cvv : this.cvv,
          zip: this.zip,
          expiry_month: date[1],
          expiry_year:date[0],
          name:localStorage.getItem('userName'),
          package_price:this.package,
          license_count:this.license,
          package_interval:this.interval,
          userId:localStorage.getItem('userinfo'),
          package_id:this.packId,
          is_recurring_billing:this.is_recurring_billing,
          license_amount: this.navParams.data.license_amount,
          amount: this.navParams.data.license_amount,
          is_company: '1',
          companyArr: this.navParams.data.companyArr
        }

        const loading = this.loadingCtrl.create({});
        loading.present();
       let body = JSON.stringify(this.paynow);
          let headers = new Headers({ 'Content-Type': 'application/json' });
          let options = new RequestOptions({ headers: headers });
          var pay_api = this.is_recurring_billing == '1' ? this.PayAuthRecurringSignup : this.PayAuth; 
          return this.http.post(this.API_ENDPOINT_URL+pay_api, body, options)
            .map(res => res.json())
            .subscribe(data => {
              if(data.status == 0){
                loading.dismissAll()
                 let toast = this.toastCtrl.create({
                message: data.error.errorMessage,
                duration: 3000,
                position: 'top',
                cssClass: 'danger'
               });
               toast.present();

              }else{
                if(this.is_recurring_billing == '1'){
                  this.paynow['transactionId'] = data.data.SubscriptionId;
                }
                else{
                  this.paynow['transactionId'] = data.data.transactionId;
                }
                let body = JSON.stringify(this.paynow);
                  return this.http.post(this.API_ENDPOINT_URL+this.addPayment +'/' +localStorage.getItem('userinfo')+'/0', body, options).map(res => res.json()).subscribe(data => {
                      // console.log(data);
                      if(data.status == 1){
                        return this.http.post(this.API_ENDPOINT_URL+this.addLicense +'/' +localStorage.getItem('userinfo'), body, options).map(res => res.json()).subscribe(data => {
                           // console.log(data);
                           if(data.status == 1){
                            loading.dismissAll()
                            let toast = this.toastCtrl.create({
                              message: 'Your package has been upgraded successfully.',
                              duration: 3000,
                              position: 'top',
                              cssClass: 'success'
                             });
                             toast.present();
                             localStorage.setItem('job_alert_popup','1');
                            this.navCtrl.setRoot('DashboardPage');

                           }else{
                            loading.dismissAll()
                            let toast = this.toastCtrl.create({
                              message: 'Error while upgrading your Subscription. Plz try later.',
                              duration: 3000,
                              position: 'top',
                              cssClass: 'danger'
                             });
                             toast.present();
                           } 
                        },
                        err => {
                            loading.dismissAll();
                            this.showTechnicalError('1');
                        });
                      }else{
                        loading.dismissAll()
                          let toast = this.toastCtrl.create({
                            message: 'Error while adding payment details.Plz try later',
                            duration: 3000,
                            position: 'top',
                            cssClass: 'success'
                           });
                           toast.present();
                      }
                },
                err => {
                    loading.dismissAll();
                    this.showTechnicalError('1');
                });
              }
            },
            err => {
                loading.dismissAll();
                this.showTechnicalError('1');
            });
        }else if (this.navParams.data.type == 'extra'){
///////////////////////////////////////////////////////////////////////////////
              date = this.expiryDate.split('-');
              this.paynow = {
                card_number :  this.cardNumber,
                cvv : this.cvv,
                zip: this.zip,
                expiry_month: date[1],
                expiry_year:date[0],
                name:localStorage.getItem('userName'),
                package_price:this.package,
                license_count:this.license,
                package_interval:this.interval,
                userId:localStorage.getItem('userinfo'),
                package_id:this.packId
              }
            const loading = this.loadingCtrl.create({});
            loading.present();
           let body = JSON.stringify(this.paynow);
              let headers = new Headers({ 'Content-Type': 'application/json' });
              let options = new RequestOptions({ headers: headers });
              return this.http.post(this.API_ENDPOINT_URL+this.PayAuthRecurring, body, options)
                .map(res => res.json())
                .subscribe(data => {
                  if(data.status == 0){
                    loading.dismissAll()
                     let toast = this.toastCtrl.create({
                    message: data.error.description,
                    duration: 3000,
                    position: 'top',
                    cssClass: 'danger'
                   });
                   toast.present();
                  }
                  else if(data.status == 1){
                     this.paynow = {
                        card_number :  this.cardNumber,
                        cvv : this.cvv,
                        zip: this.zip,
                        expiry_month: date[1],
                        expiry_year:date[0],
                        name:localStorage.getItem('userName'),
                        amount:this.package,
                        license_count:this.license,
                        package_interval:this.interval,
                        userId:localStorage.getItem('userinfo'),
                        package_id:this.packId,
                        transactionId:data.data.SubscriptionId,
                        create_new: this.create_new,
                        companyId: this.companyId,
                        company_name: this.company_name        
                      }
                     let body = JSON.stringify(this.paynow);
                     let headers = new Headers({ 'Content-Type': 'application/json' });
                     let options = new RequestOptions({ headers: headers });
                    return this.http.post(this.API_ENDPOINT_URL+this.addExtraUserLicense +'/' +localStorage.getItem('userinfo'), body, options).map(res => res.json()).subscribe(data => {
                           var responsedata = data
                           if(data.status == 1){
                              loading.dismissAll()
                               let toast = this.toastCtrl.create({
                                  message: 'Licenses has been added succesfully',
                                  duration: 3000,
                                  position: 'top',
                                  cssClass: 'success'
                                 });
                                 toast.present();
                                 this.navCtrl.push('LicensePage', responsedata);

                              }
                         },
                          err => {
                              loading.dismissAll();
                              this.showTechnicalError('1');
                          });
                  }
                },
                err => {
                    loading.dismissAll();
                    this.showTechnicalError('1');
                });
///////////////////////////////////////////////////////////////////////////////
        }else{
            // console.log('extraspace');
        date = this.expiryDate.split('-');
        this.paynow = {
          card_number :this.cardNumber,
          cvv : this.cvv,
          zip: this.zip,
          expiry_month: date[1],
          expiry_year:date[0],
          name:localStorage.getItem('userName'),
          package_price:this.navParams.data.final_price == '' ? this.navParams.data.price : this.navParams.data.final_price,
          userId:localStorage.getItem('userinfo'),
          package_id:this.navParams.data._id
        }
       // console.log(this.paynow);
       const loading = this.loadingCtrl.create({});
        loading.present();
       let body = JSON.stringify(this.paynow);
          let headers = new Headers({ 'Content-Type': 'application/json' });
          let options = new RequestOptions({ headers: headers });
          return this.http.post(this.API_ENDPOINT_URL+this.PayAuth, body, options)
            .map(res => res.json())
            .subscribe(data => {
                loading.dismissAll()
              // console.log(data);
              if(data.status == 0){
                 let toast = this.toastCtrl.create({
                message: data.error.errorMessage,
                duration: 3000,
                position: 'top',
                cssClass: 'danger'
               });
               toast.present();
               

              }else if(data.status == 1){
                  this.adddata = {
                    amount:this.navParams.data.final_price == '' ? this.navParams.data.price : this.navParams.data.final_price,
                    userId:localStorage.getItem('userinfo'),
                    packId:this.navParams.data._id,
                    type:this.navParams.data.type,
                    data:this.navParams.data.data,
                    transactionId:data.data.transactionId
                  }

                // console.log(this.adddata);
                let body = JSON.stringify(this.adddata);
                let headers = new Headers({ 'Content-Type': 'application/json' });
                let options = new RequestOptions({ headers: headers });
                return this.http.post(this.API_ENDPOINT_URL+this.addUserSpacePackage, body, options)
                  .map(res => res.json())
                  .subscribe(data => {
                    // console.log(data);
                    if(data.status == 1){
                      loading.dismissAll()
                       let toast = this.toastCtrl.create({
                          message: 'Space package has been upgraded succesfully.',
                          duration: 3000,
                          position: 'top',
                          cssClass: 'success'
                         });
                         toast.present();
                         this.navCtrl.push('DashboardPage');

                    }
                  },
                  err => {
                      loading.dismissAll();
                      this.showTechnicalError('1');
                  });
              }
            },
            err => {
                loading.dismissAll();
                this.showTechnicalError('1');
            });
        }
      }
  }


  root(){
    this.navCtrl.setRoot('DashboardPage');
  };

  licenseTo(){
    this.navCtrl.setRoot('LicensePage');
  };

  addlicense(){
    this.navCtrl.setRoot('AddmorelicensePage');
  }

  upgradePayment(){
    this.navCtrl.setRoot('PricingPage');
  };

  extraSpace(){
    this.navCtrl.setRoot('ExtraspacePage');
  };

  
}