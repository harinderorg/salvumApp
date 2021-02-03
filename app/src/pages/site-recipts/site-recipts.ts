import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ViewController, ToastController } from 'ionic-angular';
import { CompanyProvider } from '../../providers/company/company';

@IonicPage({
    segment: 'recipts/:siteId' 
}) 

@Component({
  selector: 'page-site-recipts',
  templateUrl: 'site-recipts.html',
  providers: [CompanyProvider]
})
export class SiteReciptsPage {
siteId:any;
recipts:any;
from_detail:any;
isVisible : Boolean = false;
userId:any = localStorage.getItem('userinfo');
  constructor(public navCtrl: NavController, public navParams: NavParams,public loadingCtrl: LoadingController, public companyProvider: CompanyProvider, public viewCtrl: ViewController, public toastCtrl: ToastController) {
  	this.siteId = navParams.get('siteId');
  	this.from_detail = navParams.get('from_detail');
    if(this.userId != undefined && this.userId != '' && this.userId != null){
      this.isVisible = true;
      this.getRecipts();
    }
    else{
      localStorage.setItem('redirect_after','recipts');
      localStorage.setItem('redirect_id',this.siteId);
      let toast = this.toastCtrl.create({
          message: 'Please login to access this page.',
          duration: 3000,
          position: 'top',
          cssClass: 'info'
         });
         toast.present();
      this.navCtrl.setRoot('LoginPage');
    }
  }

  getRecipts(){
  const loading = this.loadingCtrl.create({});
	loading.present();
  	this.companyProvider.get_recipts(this.siteId).subscribe((result)=>{
  		loading.dismissAll();
	    this.recipts = result;
	  },
    err => {
        loading.dismissAll();
        this.showTechnicalError();
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

  root(){
    this.navCtrl.setRoot('DashboardPage');
  };

  wallet(){
    this.navCtrl.push('WalletsPage');
  };

  sites(){
    this.navCtrl.push('SitesPage');
  };

  sitedetails(){
    this.viewCtrl.dismiss();
  };

}
