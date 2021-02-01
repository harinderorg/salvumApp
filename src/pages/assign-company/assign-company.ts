import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController, LoadingController } from 'ionic-angular';
import { CompanyProvider } from '../../providers/company/company';

@IonicPage()
@Component({
  selector: 'page-assign-company',
  templateUrl: 'assign-company.html',
  providers: [CompanyProvider]
})
export class AssignCompanyPage {
emailId:any;
companies:any;
selected_comps:any=[];
selected_alerts:any=[];
userId:any = localStorage.getItem('userinfo');
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public toastCtrl: ToastController,public companyProvider: CompanyProvider,public loadingCtrl: LoadingController) {
  	this.emailId = navParams.get('id');
  	this.selected_alerts = navParams.get('alertIds');
  	this.selected_comps = navParams.get('companyIds');
  	this.getUserComps();
  }

  ionViewDidLoad() {
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  getUserComps(){
  	const loading = this.loadingCtrl.create({});
	loading.present();
  	this.companyProvider.userCompaniesList(this.userId).subscribe((companies)=>{
        this.companies=companies;
        loading.dismissAll();
    },
    err => {
        loading.dismissAll();
        this.showTechnicalError('1');
    });
  }

  insertContactToArray(event,companyId,type){
  	if(type == 0){
  		if(event.checked == true){
			this.selected_comps.push(companyId);
		}
		else{
			this.removeArray(this.selected_comps, companyId);
			this.removeArray(this.selected_alerts, companyId);
		}
  	}
  	else{
  		if(event.checked == true){
			this.selected_alerts.push(companyId);
		}
		else{
			this.removeArray(this.selected_alerts, companyId);
		}
  	}
  }

	removeArray(arr,what) {
		var a = arguments, L = a.length, ax;
		while (L > 1 && arr.length) {
		    what = a[--L];
		    while ((ax= arr.indexOf(what)) !== -1) {
		        arr.splice(ax, 1);
		    }
		}
		return arr;
	}

	save(){
		if(this.selected_comps.length > 0){
			const loading = this.loadingCtrl.create({});
	        loading.present();
	        this.companyProvider.updateJobNotisEmail({'_id' : this.emailId, alertIds: this.selected_alerts, companyIds: this.selected_comps}).subscribe((updated)=>{
	          if(updated.status == 1)
	          {
	              loading.dismissAll()
	              let toast = this.toastCtrl.create({
	                  message: 'Email preference updated.',
	                  duration: 3000,
	                  position: 'top',
	                  cssClass: 'success'
	                 });
	                 toast.present(); 
	                this.dismiss();
	          }
	          else
	          {
	              loading.dismissAll()
	                let toast = this.toastCtrl.create({
	                    message: 'Error, plz try later.',
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
		}
		else{
			let toast = this.toastCtrl.create({
	            message: 'Please select atleast one company to add.',
	            duration: 3000,
	            position: 'top',
	            cssClass: 'danger'
            });
            toast.present(); 
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
