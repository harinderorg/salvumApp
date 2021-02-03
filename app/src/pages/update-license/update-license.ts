import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams , ViewController,ToastController,LoadingController } from 'ionic-angular';
import { CompanyProvider } from '../../providers/company/company';

@IonicPage()
@Component({
  selector: 'page-update-license',
  templateUrl: 'update-license.html',
  providers: [CompanyProvider]
})
export class UpdateLicensePage {
userId:any;
license_key:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public loadingCtrl: LoadingController, public toastCtrl: ToastController, public companyProvider: CompanyProvider) {
  	this.userId = localStorage.getItem('userinfo');
    if(navParams.get('autoFilled') != undefined && navParams.get('autoFilled') != null)
    {
      this.license_key = navParams.get('autoFilled');
    }
  }

	dismiss(status = null){
	 this.viewCtrl.dismiss(status);
	}

  clearVal(){
    this.license_key = '';
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

	addKey(license_key){
		if(license_key == undefined || license_key == ''){
          let toast = this.toastCtrl.create({
            message: 'Please enter license key.',
            duration: 3000,
            position : 'top',
            cssClass: 'danger'
           });
           toast.present(); 
           return false;
        }
        else{
        	const loading = this.loadingCtrl.create({});
      		loading.present();
        	this.companyProvider.addLicenseKey(license_key,this.userId).subscribe((formdata)=>{
        		loading.dismissAll();
        		if(formdata.status == '1'){
              localStorage.setItem('job_alert_popup_on_job','1');
        			this.dismiss('1');
        		}
        		else if(formdata.status == '2'){
        			let toast = this.toastCtrl.create({
			            message: 'Error, Invalid license key.',
			            duration: 3000,
			            position : 'top',
			            cssClass: 'danger'
			           });
			           toast.present(); 
        		}
        		else if(formdata.status == '3'){
        			let toast = this.toastCtrl.create({
			            message: 'License key has expired,Please try another one.',
			            duration: 3000,
			            position : 'top',
			            cssClass: 'danger'
			           });
			           toast.present(); 
        		}
        		else if(formdata.status == '4'){
              let toast = this.toastCtrl.create({
                  message: 'License key is already in use,Please try another one.',
                  duration: 3000,
                  position : 'top',
                  cssClass: 'danger'
                 });
                 toast.present(); 
            }
            else if(formdata.status == '5'){
              let toast = this.toastCtrl.create({
                  message: 'You have already activated this license key.',
                  duration: 3000,
                  position : 'top',
                  cssClass: 'danger'
                 });
                 toast.present(); 
            }
            else if(formdata.status == '9'){
        			let toast = this.toastCtrl.create({
			            message: 'You have already one active license key.',
			            duration: 3000,
			            position : 'top',
			            cssClass: 'danger'
			           });
			           toast.present(); 
        		}
        		else {
        			let toast = this.toastCtrl.create({
			            message: 'Error, please try later.',
			            duration: 3000,
			            position : 'top',
			            cssClass: 'danger'
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
