import { Component } from '@angular/core';
import { IonicPage, NavController, ViewController, NavParams  , ModalController, AlertController,ToastController,LoadingController } from 'ionic-angular';
import { CompanyProvider } from '../../providers/company/company';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';

@IonicPage({
	name: 'bidding-page',
  	segment: 'bidding/:bidJobId/:status',
})
@Component({
  selector: 'page-biddetail',
  templateUrl: 'biddetail.html',
  providers: [CompanyProvider]
})            
export class BiddetailPage {
userId:any;
bidJobId:any;
bidjobdetail:any;
posted_by :any;
posted_email :any;
posted_image :any;
pm_name :any;
tradeId :any;
pm_contact :any;
bid_status :any;
bid_original_status :any;
jobId :any;
job_number :any;
job_name :any;
trade_name :any;
site_address :any;
trade_task :any;
download_attachments :any;
job_description :any;
all_events :any;
applied_bids :any;
invite_email :any;
invite_name :any;
isAwarded :any;
all_attachments :any;
APIURL :any;
isVisible : any = '0';
all_codeTypes :any;
isBrowser:any;
current_date:any;
downloaded_href : any = '#';
baseUrl : any = localStorage.getItem('baseUrl');
isBidExpired:Boolean=false;
errors:any=['',null,undefined];
constructor(private transfer: FileTransfer, private file: File,public navCtrl: NavController, public viewCtrl: ViewController, public navParams: NavParams, public companyProvider: CompanyProvider, public alertCtrl: AlertController, public toastCtrl: ToastController,public loadingCtrl: LoadingController,public modalCtrl: ModalController) {
	this.isBrowser = localStorage.getItem('isBrowser');
	this.bidJobId = navParams.get('bidJobId');
	this.bid_status = navParams.get('status');
	this.userId = localStorage.getItem('userinfo');
	this.APIURL = localStorage.getItem('APIURL');
	var currentdate = new Date(); 
	this.current_date = currentdate.getFullYear() + "-"
                + (currentdate.getMonth()+1 < 10 ? "0"+(currentdate.getMonth()+1) : currentdate.getMonth()+1)  + "-" 
                + (currentdate.getDate() < 10 ? "0"+currentdate.getDate() : currentdate.getDate()) + " "  
                + (currentdate.getHours() < 10 ? "0"+currentdate.getHours() : currentdate.getHours()) + ":"  
                + (currentdate.getMinutes() < 10 ? "0"+currentdate.getMinutes() : currentdate.getMinutes());
	if(this.bid_status == 'associate_accept' || this.bid_status == 'associate_reject')
	{
		var status = this.bid_status == 'associate_accept' ? '1' : '2';
		const loading = this.loadingCtrl.create({});
		loading.present();
		this.companyProvider.changeStatusEmployee(this.bidJobId,status).subscribe((updated)=>{
			let toast = this.toastCtrl.create({
	            message: 'Status updated successfully.',
	            duration: 3000,
	            position: 'top',
	            cssClass: 'success'
	           });
	       	toast.present(); 
	       	loading.dismissAll();
	       	this.navCtrl.setRoot('LoginPage');
		},
	    err => {
	        loading.dismissAll();
	        this.showTechnicalError('1');
	    });
	}
	else if(this.bid_status == '11'){
		var isLogged = localStorage.getItem('userinfo');
		if(isLogged != undefined && isLogged != null && isLogged != ''){
			this.navCtrl.push('FilemanagerPage',{
	          notis_redirect : '1'
	        });
		}
		else{
			localStorage.setItem('redirect_after','file_sharing');
	  		localStorage.setItem('redirect_id',null);
	  		let toast = this.toastCtrl.create({
	          message: 'Please login to access this page.',
	          duration: 3000,
	          position: 'top',
	          cssClass: 'info'
	         });
	         toast.present();
	  		this.navCtrl.setRoot('LoginPage',{
	  			email : this.bidJobId
	  		});
		}
	}
	else
	{
		if((this.bid_status == '1' || this.bid_status == '2' || this.bid_status == '3') && (this.userId == '' || this.userId == null || this.userId == undefined)){
			let alert = this.alertCtrl.create({
		      title: '',
		      message: 'Are you existing member of salvum?',
		      buttons: [
		        {
		          text: 'No',
		          role: 'cancel',
		          handler: () => {
		            console.log('Cancel clicked');
		          }
		        },
		        {
		          text: 'Yes',
		          handler: () => {
		            localStorage.setItem('redirect_after','biddetails');
      				localStorage.setItem('redirect_id',this.bidJobId);
      				let toast = this.toastCtrl.create({
			          message: 'Please login with your account.',
			          duration: 3000,
			          position: 'top',
			          cssClass: 'info'
			         });
			        toast.present();
			        this.navCtrl.setRoot('LoginPage');
		          }
		        }
		      ]
		    });
		    alert.present();
		}
		
		this.all_codeTypes = {
	      'C' : 'Contract',
	      'S' : 'Specification',
	      'D' : 'Drawing',
	      'O' : 'Other'
	    };
	    const loading = this.loadingCtrl.create({});
		loading.present();
		this.companyProvider.bidJobsDetail(this.bidJobId).subscribe((bidjobdetails)=>{
			if(bidjobdetails == '')
			{
				let toast = this.toastCtrl.create({
		            message: 'Invalid post.',
		            duration: 3000,
		            position: 'top',
		            cssClass: 'danger'
		           });
	           	toast.present(); 
				loading.dismissAll();
			  	this.navCtrl.setRoot('LoginPage');
			}
		  	else
		  	{
		  	  this.bidjobdetail = bidjobdetails[0];
			  this.posted_by = this.bidjobdetail.posted_by;
			  this.posted_email = this.bidjobdetail.posted_email;
			  this.posted_image = this.bidjobdetail.posted_image;
			  this.jobId = this.bidjobdetail.jobId;
			  this.tradeId = this.bidjobdetail.tradeId;
			  this.pm_name = this.bidjobdetail.pm_name;
			  this.pm_contact = this.bidjobdetail.pm_contact;
			  this.job_number = this.bidjobdetail.job_number;
			  this.job_name = this.bidjobdetail.job_name;
			  this.trade_name = this.bidjobdetail.trade_name;
			  this.site_address = this.bidjobdetail.site_address;
			  this.trade_task = this.bidjobdetail.trade_task;
			  this.job_description = this.bidjobdetail.job_description;
			  this.invite_email = this.bidjobdetail.invite_email;
			  this.invite_name = this.bidjobdetail.invite_name;
			  this.isAwarded = this.bidjobdetail.isAwarded;
			  this.bid_original_status = this.bidjobdetail.bid_status;
			  localStorage.setItem('bid_job_name',this.job_name);
			  if(navParams.get('from_page') == '1'){
			  	this.myRFIs();
			  }
			  if(navParams.get('go_transmittal') == '1' || this.bid_status == '9'){
			  	this.myTransmittals();
			  }
			  if(localStorage.getItem('unc_email') == '1' || ((this.userId != '' && this.userId != null && this.userId != undefined) && (this.bidjobdetail.isMember == '0'))){
				let alert = this.alertCtrl.create({
			      title: '',
			      message: 'Do you want to add the unaccounted e-mail into your account and have this job’s alerts sent to it?',
			      buttons: [
			        {
			          text: 'No',
			          role: 'cancel',
			          handler: () => {
			            localStorage.removeItem('unc_email');
			          }
			        },
			        {
			          text: 'Yes',
			          handler: () => {
			          	localStorage.removeItem('unc_email');
			            localStorage.setItem('job_alert_popup','1');
	            		this.navCtrl.push('ProfilePage',{
	            			bidJobId : this.bidJobId,
	            			unconnected : '1',
	            			invite_email : this.invite_email
	            		});
			          }
			        }
			      ]
			    });
			    alert.present();
			}
			  var self = this;
			  this.companyProvider.getCalendarEvents(this.tradeId,'trades').subscribe((all_events)=>{
		      	this.all_events = all_events;
		      	if(this.all_events != ''){
		      		this.all_events.forEach(function(eve){
		      			if(eve.event_tagline == 'Bid Deadline'){
		      				var bid_dead_date = eve.start_date+' '+eve.event_time;
		      				if(self.current_date > bid_dead_date){
		      					self.isBidExpired = true;
		      				}
		      				
		      			}
		      		});
		      	}
		      	console.log(self.isBidExpired)
			  },
			  err => {
			     this.showTechnicalError();
			  });

			  this.companyProvider.getTradeFiles(this.tradeId).subscribe((all_attachments)=>{
		      	this.all_attachments = all_attachments;
		      	var attachments = [];
		      	if(this.all_attachments != '')
		      	{		
		      		this.all_attachments.forEach(function(data){
		      			var obj = {
		      				source : 'directory/jobs_data/'+data.file_name,
		      				target : data.file_name.indexOf('_--_') >= 0 ? data.file_name.split('_--_').pop(-1) : data.file_name.split('____').pop(-1)
		      			}
		      			attachments.push(obj);
		      		})
		      	}
		      	this.download_attachments = attachments;
			  	},
			    err => {
			        loading.dismissAll();
			        this.showTechnicalError();
			    });

			  this.companyProvider.getAppliedBids(this.tradeId,this.bidJobId).subscribe((applied_bids)=>{
			      this.applied_bids = applied_bids;
			      if(this.applied_bids.length > 0)
			      {
			      	var returnArr = [];
			      	this.applied_bids.forEach(function(data){
			      		var obj = {
			      			bid_comments : data.bid_comments,
			      			bid_date : data.bid_date,
			      			files : data.files == null ? [] : JSON.parse(data.files), 
			      			bid_status : data.bid_status,
			      			bidId : data.bidId,
			      			reply_comment : data.reply_comment,
			      			isAccepted : data.isAccepted,
			      		};
			      		returnArr.push(obj);
			      	});
			      	this.applied_bids = returnArr;
			      }
			      loading.dismissAll();
			      this.isVisible = '1';
			  	},
			    err => {
			        loading.dismissAll();
			        this.showTechnicalError();
			    });
		  	}
		},
	    err => {
	        loading.dismissAll();
	        this.showTechnicalError();
	    });
	}

}

myRFIs() 
{
	localStorage.setItem('award_state','pre_awarded');
	this.navCtrl.push('MyRfisPage', {
		jobId:this.jobId,
		tradeId:this.tradeId,
		InviteId:this.bidJobId,
		isAwarded:this.isAwarded
	});
}
openSubmitbidPage(bid_status)
{
	if(bid_status !== undefined && bid_status != '')
	{
		this.navCtrl.push('SubmitbidPage', {
			jobId:this.jobId,
			tradeId:this.tradeId,
			bid_status:bid_status,
			bidJobId:this.bidJobId,
			invite_email:this.invite_email
		});
	}
	else
	{
		let toast = this.toastCtrl.create({
            message: 'Please select status.',
            duration: 3000,
             position:'top',
             cssClass: 'danger'
           });
           toast.present(); 
	}
}

downloadFile()
{
	let toast = this.toastCtrl.create({
        message: 'Start downloading....',
        duration: 3000,
        position:'top',
        cssClass: 'info'
       });
	toast.present(); 
}

downloadAndroid(url,name) {
  let toast = this.toastCtrl.create({
    message: 'Start downloading....',
    duration: 3000,
    position:'top',
    cssClass: 'success'
   });
  toast.present();
  const fileTransfer: FileTransferObject = this.transfer.create();
  fileTransfer.download(url, this.file.externalRootDirectory + name.split('____').pop()).then((entry) => {
    let toast = this.toastCtrl.create({
        message: 'File downloaded.',
        duration: 3000,
        position:'top',
        cssClass: 'success'
       });
	toast.present(); 
  }, (error) => {
    let toast = this.toastCtrl.create({
        message: 'Error',
        duration: 3000,
        position:'top',
        cssClass: 'danger'
       });
	toast.present(); 
  });
}

viewContract()
{
	this.navCtrl.push('ViewcontractPage',{
		jobId : this.jobId,
		tradeId : this.tradeId,
		bidId : this.bidJobId
	})
}
myTransmittals()
{
	this.navCtrl.push('direct-transmittals',{
		jobId : this.jobId,
		InviteId : this.bidJobId,
		tradeId : this.tradeId
	});
}
downloadPdf()
{
	let modal = this.modalCtrl.create('PdfPage', {
		jobId : this.jobId,
		tradeId : this.tradeId,
		bidId : this.bidJobId
	});
    modal.present();
}
root(){
	this.navCtrl.setRoot('DashboardPage');
};
goToBids()
{
	this.navCtrl.push('bidjobs', {
		type: '0'
	});
}
downloadAll()
{
	if(this.download_attachments != '')
	{
		const loading = this.loadingCtrl.create({});
		loading.present();
		this.companyProvider.downloadBidAttachments(this.download_attachments).subscribe((downloaded)=>{
			if(downloaded.status == '1')
			{
				loading.dismissAll();

				this.downloaded_href = this.APIURL+'/salvum/'+downloaded.data.path;
				console.log(this.downloaded_href)
		        let toast = this.toastCtrl.create({
		            message: 'Start downloading...',
		            position: 'top',
		            duration: 3000,
		            cssClass: 'success'
		           });
		        toast.present(); 
		        setTimeout(function(){ document.getElementById('download_zip_attachments').click(); }, 1000);
			}
			else
			{
				loading.dismissAll();
				let toast = this.toastCtrl.create({
			        message: 'Error, plz try later.',
			        duration: 3000,
			        position:'top',
			        cssClass: 'danger'
			       });
				toast.present();
			}
		},
	    err => {
	        loading.dismissAll();
	        this.showTechnicalError();
	    });
	}
	else
	{
		let toast = this.toastCtrl.create({
	        message: 'No attachments found.',
	        duration: 3000,
	        position:'top',
	        cssClass: 'danger'
	       });
		toast.present();
	}
}

changeStatusBid(id,status){
	const loading = this.loadingCtrl.create({});
    loading.present();
    this.companyProvider.updateBidStatus(id,status).subscribe((updated)=>{
      if(updated.status == 1)
      {
            loading.dismissAll()
            let toast = this.toastCtrl.create({
                message: 'Status updated.',
                duration: 3000,
                position : 'top',
                cssClass: 'success'
               });
               toast.present(); 
      }
      else
      {
          loading.dismissAll()
            let toast = this.toastCtrl.create({
                message: 'Error, plz try later.',
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
