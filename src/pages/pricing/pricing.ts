import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import {Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/Rx';
import { AddmorelicenseserviceProvider } from '../../providers/addmorelicenseservice/addmorelicenseservice';
import { CompanyProvider } from '../../providers/company/company';

@IonicPage()
@Component({
  selector: 'page-pricing',
  templateUrl: 'pricing.html',
  providers: [AddmorelicenseserviceProvider, CompanyProvider]
})
export class PricingPage {
API_ENDPOINT_URL : any = localStorage.getItem('API_ENDPOINT_URL');
upgradePackage = 'packages'; 
packageArr: Array<{}>;
lincesArr: Array<{}>;
index: number;
licenses: string;
license_amount: any = 0;
data: number;
newprice: number;
finalprice: number;
licen: any;
companies: any;
spliceData: any;
isBrowser:any;
package_interval: number;
subscription_amount: any;
check_value:any = '0';
companyId:any;
isVisible:Boolean = true;
companyArr:any = {};
company_name:any;
userId: any = localStorage.getItem('userinfo');
  constructor(public navCtrl: NavController, public navParams: NavParams,public http:Http, public loadingCtrl: LoadingController, public AddmorelicenseserviceProvider: AddmorelicenseserviceProvider, public companyProvider: CompanyProvider, public toastCtrl: ToastController) {
  	 this.http = http;
     var userId = localStorage.getItem('userinfo');
       this.companyProvider.getUserCurrentSubscription(userId).subscribe((subscription)=>{  
          this.subscription_amount = subscription.amount;
        },
        err => {
            this.showTechnicalError();
        });
      this.getUserCompanies();
  }

  ionViewDidLoad() {
  this.isBrowser = localStorage.getItem('isBrowser');
  	this.index = 0;
  	this.newprice = 0;
    this.package_interval = 30;
    const loading = this.loadingCtrl.create({});
    loading.present();
  	let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
        return this.http.get(this.API_ENDPOINT_URL+this.upgradePackage , options)
            .map(res => res.json())
            .subscribe(data => {
               loading.dismissAll()
               this.packageArr = data;
               var newprices = []
               for (var i = 0; i < this.packageArr.length; i++) {
        			  		newprices.push(this.packageArr[1]);
        			  		this.finalprice = newprices[0].price
        			  	
        			  }
                 this.AddmorelicenseserviceProvider.getAllLicenseList().subscribe((data)=>{
                       this.lincesArr = data;
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

  getUserCompanies(){
    this.companyProvider.userCompaniesList(this.userId).subscribe((companies)=>{
      this.companies=companies;
      if(companies == ''){
        this.check_value = '1';
        this.isVisible = false;
      }
    },
    err => {
        this.showTechnicalError();
    });
  }


  changePrice(index, interval){
    this.package_interval = interval;
  	var newprices = []
  	this.index = index;
  	for (var i = 0; i < this.packageArr.length; i++) {
  		newprices.push(this.packageArr[1]);
  		if(this.index == 0){
		  	 this.finalprice = Number(newprices[0].price) + this.newprice
		  	}else if(this.index == 1){
		  	 this.finalprice = Number(newprices[0].price1)+ this.newprice
		  	}else if(this.index == 2){
		  	 this.finalprice = Number(newprices[0].price2)+ this.newprice
		  	}else if(this.index == 3){
		  	 this.finalprice = Number(newprices[0].price3)+ this.newprice
		  	}else{

		  	}
    }
  }

  addPrice(itemprice){
   var newprices = []
   var price = itemprice.split('/')
   this.newprice = Number(price[1]);
    for (var i = 0; i < this.packageArr.length; i++) {
  		newprices.push(this.packageArr[1]);
  		if(this.index == 0){
		  	 this.finalprice = Number(newprices[0].price) + this.newprice 
		  	}else if(this.index == 1){
		  	 this.finalprice = Number(newprices[0].price1) + this.newprice 
		  	}else if(this.index == 2){
		  	 this.finalprice = Number(newprices[0].price2) +this.newprice
		  	}else if(this.index == 3){
		  	 this.finalprice = Number(newprices[0].price3) + this.newprice
		  	}else{
		  	}
    }
  };

  Purchase(data,is_recurring_billing){

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
      this.companyArr.company_name = this.company_name;
      this.companyArr.create_new = '1';
      this.companyArr.companyId = null;
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
      this.companyArr.companyId = this.companyId;
      this.companyArr.create_new = '0';
    }

    this.companyArr.isAlreadyCompany = this.isVisible;

    is_recurring_billing = is_recurring_billing == true ? '1' : '0';
    var price = []
    for (var i = 0; i < this.packageArr.length; i++) {
    		price.push(this.packageArr[1]);
    		if(this.index == 0){
  		  	 this.data = price[0].price
  		  	}else if(this.index == 1){
  		  	 this.data = price[0].price1
  		  	}else if(this.index == 2){
  		  	 this.data = price[0].price2
  		  	}else if(this.index == 3){
  		  	 this.data = price[0].price3
  		  	}else{

  		  	}
    }
    if(this.licenses){
       this.licen = this.licenses.split('/');
       this.spliceData = this.licen[0];
       this.license_amount = this.licen[1];
    }

    var totalPrice = {
      license:this.spliceData,
      license_amount:this.license_amount,
      totalprice:this.finalprice,
      interval:this.package_interval,
      packId :data._id,
      is_recurring_billing:is_recurring_billing,
      companyArr: this.companyArr
    };
    localStorage.setItem('preState', 'pricing')
   this.navCtrl.push('PaymentPage', totalPrice);
  };

  openExtraspacePage(){
	 this.navCtrl.push('ExtraspacePage');
  };

  root(){
    this.navCtrl.setRoot('DashboardPage');
  };
}