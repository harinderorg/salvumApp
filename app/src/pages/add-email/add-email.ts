import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController, LoadingController } from 'ionic-angular';
import { CompanyProvider } from '../../providers/company/company';

@IonicPage()
@Component({
  selector: 'page-add-email',
  templateUrl: 'add-email.html',
  providers: [CompanyProvider]
})
export class AddEmailPage {
userId:any = localStorage.getItem('userinfo');
user_name:any = localStorage.getItem('userName');
isOtpSent: Boolean = false;
emailId: any = null;
my_email: any = null;
email:any;
bidJobId:any;
  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl: ViewController, public toastCtrl: ToastController,public companyProvider: CompanyProvider, public loadingCtrl: LoadingController) {
  	var verify = navParams.get('verify');
  	var invite_email = navParams.get('invite_email');
  	if(verify == '1'){
  		this.my_email = navParams.get('email');
  		this.emailId = navParams.get('id');
  		var data = {
  			_id : this.emailId,
  			email : this.my_email,
	    	name : this.user_name
  		}
  		this.isOtpSent = true;
  		const loading = this.loadingCtrl.create({});
		loading.present();
  		this.companyProvider.updateEmailOtp(data).subscribe((result)=>{
    		loading.dismissAll();
			if(result.status == 1){
				let toast = this.toastCtrl.create({
		          message: 'OTP sent on your email address.Check your OTP and enter here.',
		          duration: 4000,
		          position : 'top',
		          cssClass: 'success'
		        });
		        toast.present();
			}
			else{
				let toast = this.toastCtrl.create({
		          message: 'Error,Plz try later.',
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
  	if(invite_email != null && invite_email != undefined){
  		this.email = invite_email;
  		this.bidJobId = navParams.get('bidJobId');
  	}
  }

  ionViewDidLoad() {
    
  }

  dismiss() {
    this.viewCtrl.dismiss(this.isOtpSent);
  }

  addEmail(email){
  	if(email == undefined || email == null || email == ''){
  		let toast = this.toastCtrl.create({
	        message: 'Please enter an email address',
	        duration: 3000,
	        position: 'top',
	        cssClass: 'danger'
      	});
      	toast.present();
  	}
  	else{
  		var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
  		if(reg.test(email) == false){
	      let toast = this.toastCtrl.create({
	          message: 'please enter valid email address',
	          duration: 3000,
	          position : 'top',
	          cssClass: 'danger'
	       });
	       toast.present();
	    }
	    else{
	    	const loading = this.loadingCtrl.create({});
		    loading.present();
	    	var data = {
	    		email : email,
	    		name : this.user_name,
	    		userId : this.userId
	    	}
	    	this.companyProvider.addEmail(data).subscribe((result)=>{
	    		loading.dismissAll();
				if(result.status == 1){
					this.isOtpSent = true;
					this.emailId = result.data._id;
					this.my_email = email;
					let toast = this.toastCtrl.create({
			          message: 'OTP sent on your email address.Check your OTP and enter here.',
			          duration: 4000,
			          position : 'top',
			          cssClass: 'success'
			        });
			        toast.present();
				}
				else if(result.status == 2){
					let toast = this.toastCtrl.create({
			          message: 'Email already exists in our system.',
			          duration: 3000,
			          position : 'top',
			          cssClass: 'danger'
			        });
			        toast.present();
				}
				else{
					let toast = this.toastCtrl.create({
			          message: 'Error,Plz try later.',
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

  verifyOTP(otp){
  	if(otp == undefined || otp == null || otp == ''){
  		let toast = this.toastCtrl.create({
	        message: 'Please enter OTP',
	        duration: 3000,
	        position: 'top',
	        cssClass: 'danger'
      	});
      	toast.present();
  	}
  	else{
  		const loading = this.loadingCtrl.create({});
	    loading.present();
	    var data;
	    if(this.navParams.get('invite_email') == this.my_email){
	    	data = {
	    		otp : otp,
	    		email : this.my_email,
	    		_id : this.emailId,
	    		bidJobId : this.bidJobId,
	    		userId : this.userId
	    	}
	    }
	    else{
	    	data = {
	    		otp : otp,
	    		email : this.my_email,
	    		_id : this.emailId
	    	}
	    }
  		this.companyProvider.checkEmailOTP(data).subscribe((result)=>{
    		loading.dismissAll();
			if(result.status == 1){
				let toast = this.toastCtrl.create({
		          message: 'Email address added & verified successfully.',
		          duration: 3000,
		          position : 'top',
		          cssClass: 'success'
		        });
		        toast.present();
		        this.dismiss();
			}
			else if(result.status == 2){
				let toast = this.toastCtrl.create({
		          message: 'Invalid OTP.',
		          duration: 3000,
		          position : 'top',
		          cssClass: 'danger'
		        });
		        toast.present();
			}
			else{
				let toast = this.toastCtrl.create({
		          message: 'Error,Plz try later.',
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
