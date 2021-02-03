import { Component } from '@angular/core';
import { IonicPage, NavController, ViewController, NavParams, ModalController, AlertController,ToastController,LoadingController } from 'ionic-angular';
import { CompanyProvider } from '../../providers/company/company';

@IonicPage()
@Component({
  selector: 'page-my-transmittals',
  templateUrl: 'my-transmittals.html',
  providers: [CompanyProvider]
})
export class MyTransmittalsPage {
my_transmittals:any;
inviteId:any;
isVisible:any = '0';
jobId:any;
userId:any = localStorage.getItem('userinfo');
bid_job_name:any = localStorage.getItem('bid_job_name');
  constructor(public modalCtrl: ModalController, public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams, public companyProvider: CompanyProvider, public alertCtrl: AlertController, public toastCtrl: ToastController,public loadingCtrl: LoadingController) {
  	this.inviteId = navParams.get('InviteId');
  	this.jobId = navParams.get('jobId');
  	if(this.userId == undefined || this.userId == '' || this.userId == null){
  		localStorage.setItem('redirect_after','my_transmittals');
  		localStorage.setItem('redirect_id',this.inviteId);
  		let toast = this.toastCtrl.create({
          message: 'Please login to access this page.',
          duration: 3000,
          position: 'top',
          cssClass: 'info'
         });
         toast.present();
  		this.navCtrl.setRoot('LoginPage');
  	}
  	else{
  		this.isVisible = '1';
  		localStorage.removeItem('redirect_after');
  		localStorage.removeItem('redirect_id');
  		this.getMyTransmittals();
  	}
  }

  getMyTransmittals()
  {
  	const loading = this.loadingCtrl.create({});
    loading.present(); 
  	this.companyProvider.getMyTransmittals(this.inviteId,'','','','').subscribe((transmittals)=>{
  		loading.dismissAll()
	  	this.my_transmittals = transmittals;  
	      if(this.my_transmittals.length > 0)
	      {
	      	var returnArr = [];
	      	this.my_transmittals.forEach(function(data){
	      		var obj = {
					transmittal_number: data.transmittal_number,
					subject: data.subject,
					sender_id: data.sender_id,
					rec_id: data.rec_id,
					comments: data.comments,
					submittals: (data.submittals == null || data.submittals == '') ? [] : JSON.parse(data.submittals), 
					date_sent: data.date_sent,
					isSent: data.isSent,
					_id: data._id,
					jobId: data.jobId,
					tradeId: data.tradeId,
					trade_name: data.trade_name,
					trade_task: data.trade_task,
					user_name: data.user_name,
					trade_icon: data.trade_icon
	      		};
	      		returnArr.push(obj);
	      	});
	      	this.my_transmittals = returnArr;
	      }
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

  submittalClicked(type,tradeId,item)
	{
		if(type == 'contract')
		{
			this.navCtrl.push('ViewcontractPage',{
				jobId : this.jobId,
				tradeId : tradeId,
				bidId : item,
				page_type : '1'
			})
		}
		if(type == 'files')
		{	
			var filePath = item;
			let modal = this.modalCtrl.create('ViewfilePage', {file_path : filePath});
    		modal.present();
		}
		if(type == 'rfi')
		{	
			let modal = this.modalCtrl.create('ViewrfiPage', {RfiId : item, page_type : '1', role : 'contractor'});
    		modal.present();
		}
	}

  downloadTransmittal(transmittalId){
  	let modal = this.modalCtrl.create('PdfTransmittalPage', {transmittalId : transmittalId});
    	modal.present();
  }

  root(){
    this.navCtrl.setRoot('DashboardPage');
  };
  goToBids(){
    this.navCtrl.push('bidjobs', {
      type: '0'
    });
  };
  backPage()
  {
    this.viewCtrl.dismiss();
  }

}
