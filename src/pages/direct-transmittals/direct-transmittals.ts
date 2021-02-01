import { Component } from '@angular/core';
import { IonicPage, NavController, ViewController, NavParams, ModalController, AlertController,ToastController,LoadingController } from 'ionic-angular';
import { CompanyProvider } from '../../providers/company/company';

@IonicPage({
	name: 'direct-transmittals',
    segment: 'direct-transmittals/:email' 
}) 

@Component({
  selector: 'page-direct-transmittals',
  templateUrl: 'direct-transmittals.html',
  providers: [CompanyProvider]
})
export class DirectTransmittalsPage {
all_transmittals:any = [];                                                
sorted_transmittals:any = [];                                            
all_sorted_transmittals:any = [];                                              
searchTerm:any;                                                            
jobId:any;                                                                  
userName:any;
timestamp:any;
isRefresh:any = '1';
isBrowser = localStorage.getItem('isBrowser');
baseUrl = localStorage.getItem('baseUrl');
active_job_breadcrumb = localStorage.getItem('active_job_breadcrumb');
trades:any = [];
trade_ids:any = [];
tradeTypes:any = [];
tradesType_names:any = [];
filter_trades:any = [];
filter_trade_names:any = [];
filter_list:any = [];
nav_filter:any = 'default';
order_default:any = 'trade_name';
order_default_p:any = false;
order_advanced:any = 'trade_task';
order_advanced_p:any = false;
order_trans:any = 'date_sent';
order_trans_p:any = true;
sort_icon:Boolean = true;
errors:any=['',null,undefined];
userId:any;
u_email:any = 0;
inviteId:any;
alltrades:any = [];
tradeId:any;
bid_job_name:any = localStorage.getItem('bid_job_name');
  constructor(public modalCtrl: ModalController, public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams, public companyProvider: CompanyProvider, public alertCtrl: AlertController, public toastCtrl: ToastController,public loadingCtrl: LoadingController ) {

  	this.u_email = navParams.data.email;
  	this.jobId = navParams.get('jobId');
  	this.userName = localStorage.getItem('userName');
  	var current_date = new Date();
    this.timestamp = current_date.getTime();
    this.inviteId = navParams.get('InviteId');
    this.tradeId = navParams.get('tradeId');
    this.userId = localStorage.getItem('userinfo');

    if(this.inviteId == undefined){
      this.inviteId = localStorage.getItem('dir_inv_id');
      this.jobId = localStorage.getItem('dir_job_id');
      this.tradeId = localStorage.getItem('dir_tradeId');
    }
    else{
      localStorage.setItem('dir_inv_id',this.inviteId);
      localStorage.setItem('dir_job_id',this.jobId);
      localStorage.setItem('dir_tradeId',this.tradeId);
    }

  }

  ionViewDidEnter(){
  	this.userId = localStorage.getItem('userinfo');
  	console.log(this.userId)
  	console.log(this.inviteId)
  	if(this.isRefresh == '1'){
  		this.getTransmittals();
  	}
  }

  scroll(direction){
  	var cond;
  	if(direction == 'right'){
  		cond = { scrollLeft: "+=200px" };
  	}
  	else{
  		cond = { scrollLeft: "-=200px" };
  	}
  	$('.drop-scroll').animate(cond, "slow");
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

  sortby(sort_by){
  	console.log(sort_by) 
  	if(sort_by == '1'){
  		this.order_trans = 'date_created';
  		this.order_trans_p = false;
  	}
  	if(sort_by == '2'){
  		this.order_trans = 'date_updated';
  		this.order_trans_p = false;
  	}
  }

  getItems(val) {
  	this.sorted_transmittals = this.all_sorted_transmittals;
	// let val = ev.target.value;
	if (val && val.trim() != '') {
	  this.sorted_transmittals = this.sorted_transmittals.filter((item) => {
	     return (item.comments.toLowerCase().indexOf(val.toLowerCase()) > -1 || item.subject.toLowerCase().indexOf(val.toLowerCase()) > -1 || item.date_updated.toLowerCase().indexOf(val.toLowerCase()) > -1 || item.date_sent.toLowerCase().indexOf(val.toLowerCase()) > -1);
	   });
	  }
	}

  getTransmittals(){
  	this.trades = [];
    this.trade_ids = []; 
    this.tradeTypes = [];
    this.tradesType_names = [];
    this.all_transmittals = [];
    this.sorted_transmittals = [];
    this.all_sorted_transmittals = [];
    var self = this;
  	const loading = this.loadingCtrl.create({});
    loading.present(); 
  	this.companyProvider.getMyTransmittals(this.inviteId,this.userId,this.jobId,this.u_email,this.tradeId).subscribe((transmittals)=>{
  		loading.dismissAll()  
	     if(transmittals != ''){
	        transmittals.forEach(function(data){
	        	data = {
					transmittal_number: data.transmittal_number,
					subject: data.subject,
					sender_id: data.sender_id,
					user_name: data.user_name,
					rec_id: data.rec_id,
					comments: data.comments,
					submittals: data.submittals, 
					date_sent: self.errors.indexOf(data.date_sent) == -1 ? self.formatDate(data.date_sent) : '',
					date_updated: self.errors.indexOf(data.date_updated) == -1 ? self.formatDate(data.date_updated) : '',
					date_created: self.errors.indexOf(data.date_created) == -1 ? self.formatDate(data.date_created) : '',
					isSent: data.isSent,
					_id: data._id,
					jobId: data.jobId,
					tradeId: data.tradeId,
					sender_indicator: data.sender_indicator,
					rec_indicator: data.rec_indicator,
					trade_name: data.trade_name,
					trade_task: data.trade_task,
					trade_icon: data.trade_icon
	      		};
	      		self.all_transmittals.push(data);
	      		self.sorted_transmittals.push(data);
	      		self.all_sorted_transmittals.push(data);
	      		console.log(self.all_transmittals)
	        });
	      }
	  	
	  },
	    err => {
	        loading.dismissAll();
	        this.showTechnicalError();
	    });
  }

  formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
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

  sortOrder(){
  	if(this.order_default_p == false){
		this.order_default_p = true;
	}
	else{
		this.order_default_p = false;
	}
	if(this.order_advanced_p == false){
		this.order_advanced_p = true;
	}
	else{
		this.order_advanced_p = false;
	}
  }
 
  addTransmittal()
  {
  	this.isRefresh = '1';
  	this.navCtrl.push('AddDirTransmittalPage',{
  		inviteId : this.inviteId,
  		jobId : this.jobId
  	});
  }

  editTransmittal(tid)
  {
  	console.log('tid',tid)
  	this.isRefresh = '1';
  	this.navCtrl.push('EditDirTransmittalPage',{
  		tid : tid,
  		inviteId : this.inviteId,
  		jobId : this.jobId,
  		email : this.u_email
  	});
  }

	seeAcItems(act_items){
	    let modal = this.modalCtrl.create('ActionItemsPage', {action_items : act_items});
	    modal.present();
	}

	sendTransmittal(tid,submittals,sender_id,rec_id)
	{
		this.isRefresh = '1';
		if(this.errors.indexOf(rec_id) >= 0)
		{
			let toast = this.toastCtrl.create({
	          message: 'Please add receiver in transmittal.',
	          duration: 3000,
	          position: 'top',
	          cssClass: 'danger'
	         });
	         toast.present();
		}
		else if(submittals.length == '0')
		{
			let toast = this.toastCtrl.create({
	          message: 'Please add atleast one submittal to send.',
	          duration: 3000,
	          position: 'top',
	          cssClass: 'danger'
	         });
	         toast.present();
		}
		else
		{
			let confirm = this.alertCtrl.create({
	        title: 'Confirm',
	        message: 'Are you sure you want to send?',
	        buttons: [ 
	          {
	            text: 'No',
	            handler: () => {
	              //console.log('Disagree clicked');
	            }
	          },
	          {
	            text: 'Yes', 
	            handler: () => {
	  				const loading = this.loadingCtrl.create({});
					loading.present(); 
					this.companyProvider.sendTransmittal(tid,sender_id,rec_id,this.userName,this.baseUrl).subscribe((is_sent)=>{
						loading.dismissAll();
						if(is_sent.status == '1')
						{
							this.getTransmittals();
							let toast = this.toastCtrl.create({
					          message: 'Transmittal Sent Successfully.',
					          duration: 3000,
					          position: 'top',
					          cssClass: 'success'
					         });
					         toast.present();
						}
						else
						{
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
	          }
	        ]
	      });
	      confirm.present();
		}
	}

	downloadTransmittal(transmittalId){
	  	let modal = this.modalCtrl.create('PdfTransmittalPage', {transmittalId : transmittalId});
	    	modal.present();
	  }

	submittalClicked(type,tradeId,item,sub){
		this.isRefresh = '0';
		if(type == 'contract'){
			this.navCtrl.push('ViewcontractPage',{
				jobId : this.jobId,
				tradeId : tradeId,
				bidId : item,
				page_type : '1'
			})
		}
		if(type == 'files'){	
			var filePath = item;
			let modal = this.modalCtrl.create('ViewfilePage', {file_path : filePath, file_name : sub.item, created_at : sub.date_created, file_by : sub.by});
    		modal.present();
		}
		if(type == 'rfi'){	
			let modal = this.modalCtrl.create('ViewrfiPage', {RfiId : item, page_type : '1'});
    		modal.present();
		}
	}

  root(){
    this.navCtrl.setRoot('DashboardPage');
  };

  transmittalDetails(tid){
		this.isRefresh = '0';
		this.navCtrl.push('DirTransmittalDetailsPage',{
			tid : tid,
			inviteId : this.inviteId,
	  		jobId : this.jobId,
	  		email : this.u_email
		})
	}

  goToBids(){
    this.navCtrl.push('bidjobs', {
      type: '0'
    });
  };
  backPage()
  {
    this.viewCtrl.dismiss();
  }

  deleteSub(subId,t_index,s_index){
		//console.log(subId);
		//console.log(t_index,s_index); 
		let confirm = this.alertCtrl.create({
	        title: 'Confirm',
	        message: 'Are you sure you want to delete this submittal?',
	        buttons: [ 
	          {
	            text: 'No',
	            handler: () => {
	              //console.log('Disagree clicked');
	            }
	          },
	          {
	            text: 'Yes', 
	            handler: () => {
	  				const loading = this.loadingCtrl.create({});
					loading.present(); 
					this.companyProvider.postData('deleteSubmittal',{subId : subId}).subscribe((is_sent)=>{
						loading.dismissAll();
						if(is_sent.status == '1')
						{
							this.sorted_transmittals[t_index]['submittals'].splice(s_index,1);
							let toast = this.toastCtrl.create({
					          message: 'Submittal deleted successfully.',
					          duration: 3000,
					          position: 'top',
					          cssClass: 'success'
					         });
					         toast.present();
						}
						else
						{
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
	          }
	        ]
	      });
	      confirm.present();
	}

}
