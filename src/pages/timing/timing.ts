import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController, LoadingController } from 'ionic-angular';
import { CompanyProvider } from '../../providers/company/company';

@IonicPage()
@Component({
  selector: 'page-timing',
  templateUrl: 'timing.html',
  providers: [CompanyProvider]
})
export class TimingPage {
timing : any;
all_days : any;
employeeId : any;
userId : any = localStorage.getItem('userinfo');
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public loadingCtrl: LoadingController, public toastCtrl: ToastController, public companyProvider: CompanyProvider) {
  	this.employeeId = navParams.get('employeeId');
  	this.timing = navParams.get('timing');
  	this.all_days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  }

  dismiss(status = null){
	this.viewCtrl.dismiss(status);
  }

  saveTiming(){
  	const loading = this.loadingCtrl.create({});
    loading.present();
  	this.companyProvider.saveEmployeeTiming({employeeId : this.employeeId, userId : this.userId, timing : this.timing}).subscribe((result)=>{
  		loading.dismissAll();
  		if(result.status == 1){
  			this.dismiss('1');
  		}
  		else if(result.status == 4){
        let toast = this.toastCtrl.create({
            message: 'Time is conflicting with another user who is using same license.',
            duration: 5000,
            position: 'top',
          cssClass: 'danger'
         });
         toast.present(); 
      }
      else{
  			let toast = this.toastCtrl.create({
            message: 'Error, plz try later.',
            duration: 5000,
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
