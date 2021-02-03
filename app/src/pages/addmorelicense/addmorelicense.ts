import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import {Http} from '@angular/http';
import 'rxjs/Rx';
import { AddmorelicenseserviceProvider } from '../../providers/addmorelicenseservice/addmorelicenseservice';
import { CompanyProvider } from '../../providers/company/company';

@IonicPage()
@Component({
  selector: 'page-addmorelicense',
  templateUrl: 'addmorelicense.html',
  providers: [AddmorelicenseserviceProvider,CompanyProvider]
})
export class AddmorelicensePage {
lincesArr: Array<{}>;
exterLicense : {};
licenses:string;
newprice:any;
companies:any;
isBrowser:any;
companyId:any;
company_name:any;
check_value:any = '0';
userId:any = localStorage.getItem('userinfo');
  constructor(public navCtrl: NavController, public navParams: NavParams,public http:Http, public AddmorelicenseserviceProvider: AddmorelicenseserviceProvider, public loadingCtrl: LoadingController, public companyProvider: CompanyProvider, public toastCtrl: ToastController) {
  	this.http = http;
    this.isBrowser = localStorage.getItem('isBrowser');
  }

  ionViewDidLoad() {
  	const loading = this.loadingCtrl.create({}); 
    loading.present();
     this.AddmorelicenseserviceProvider.getAllLicenseList().subscribe((data)=>{
       this.lincesArr = data;
       this.companyProvider.userCompaniesList(this.userId).subscribe((companies)=>{
          this.companies=companies;
          loading.dismissAll()
        },
        err => {
            loading.dismissAll();
            this.showTechnicalError();
        });
	  },
    err => {
        loading.dismissAll();
        this.showTechnicalError();
    });
  }

	addPrice(itemprice){
     this.newprice = {
       newprice : itemprice,
       type: 'extra'
     }
	}

	goToPaymentPage(item){
    if(this.newprice == '' || this.newprice == undefined){
      let toast = this.toastCtrl.create({
          message: 'Please select license.',
          duration: 3000,
          position: 'top',
          cssClass: 'danger'
         });
         toast.present();
         return false;
    }
    if(this.check_value == '0'){
      if(this.companyId == '' || this.companyId == undefined){
        let toast = this.toastCtrl.create({
            message: 'Please select company.',
            duration: 3000,
            position: 'top',
            cssClass: 'danger'
           });
           toast.present();
          return false;
      }
    }
    else{
      this.newprice.company_name = this.company_name;
      this.newprice.create_new = '1';
      this.newprice.companyId = null;
    }
    if(this.check_value == '1'){
      if(this.company_name == '' || this.company_name == undefined){
        let toast = this.toastCtrl.create({
            message: 'Please enter company name.',
            duration: 3000,
            position: 'top',
            cssClass: 'danger'
           });
           toast.present();
          return false;
      }
    }
    else{
      this.newprice.companyId = this.companyId;
      this.newprice.create_new = '0';
    }
    localStorage.setItem('preState', 'license');
		this.navCtrl.push('PaymentPage', this.newprice);
	}

	root(){
  	this.navCtrl.setRoot('DashboardPage');
	};

	licenseTo(){
  	this.navCtrl.setRoot('LicensePage');
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
}
