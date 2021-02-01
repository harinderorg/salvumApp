import { Component } from '@angular/core';
import { IonicPage, NavController, ViewController, NavParams  , ModalController, AlertController,ToastController,LoadingController } from 'ionic-angular';
import { CompanyProvider } from '../../providers/company/company';
import * as $ from 'jquery';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';

@IonicPage({
	name: 'engg-rfi-page',
  	segment: 'EnggRFIs/bidding/:RfiEmailId',
})
@Component({
  selector: 'page-engg-rfi',
  templateUrl: 'engg-rfi.html',
  providers: [CompanyProvider]
})
export class EnggRfiPage {
userId:any;
RfiEmailId:any;
bidjobdetail:any;
posted_by :any;
posted_email :any;
posted_image :any;
pm_name :any;
tradeId :any;
pm_contact :any;
bid_status :any;
jobId :any;
job_number :any;
job_name :any;
trade_name :any;
site_address :any;
trade_task :any;
download_attachments :any;
job_description :any;
description :any;
all_events :any;
applied_bids :any;
invite_email :any;
all_attachments :any;
APIURL :any;
all_codeTypes :any;
isBrowser:any;
fromId:any;
pdf_link:any;
is_all_answered:any;
all_rfis:any;
dateTime:any;
isValid : any = '0';
downloaded_href : any = '#';
baseUrl : any = localStorage.getItem('baseUrl');
constructor(private transfer: FileTransfer, private file: File,public navCtrl: NavController, public viewCtrl: ViewController, public navParams: NavParams, public companyProvider: CompanyProvider, public alertCtrl: AlertController, public toastCtrl: ToastController,public loadingCtrl: LoadingController,public modalCtrl: ModalController) {
	this.isBrowser = localStorage.getItem('isBrowser');
	this.RfiEmailId = navParams.get('RfiEmailId');
	this.userId = localStorage.getItem('userinfo');
	this.APIURL = localStorage.getItem('APIURL');
	this.dateTime = new Date().getTime();

	this.all_codeTypes = {
      'C' : 'Contract',
      'S' : 'Specification',
      'D' : 'Drawing',
      'O' : 'Other'
    };

    this.getRFIDetails();
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

getRFIDetails(){
	const loading = this.loadingCtrl.create({});
	loading.present();
	this.companyProvider.getRFIEmailDetail(this.RfiEmailId).subscribe((RFIdetails)=>{
		if(RFIdetails == '')
		{
			this.isValid = '2';
			let toast = this.toastCtrl.create({
	            message: 'Invalid post.',
	            duration: 3000,
	            position: 'top',
	            cssClass: 'danger'
	           });
           	toast.present(); 
			loading.dismissAll();
		}
	  	else
	  	{
	  	  this.isValid = '1';
	  	  this.bidjobdetail = RFIdetails[0];
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
		  this.invite_email = this.bidjobdetail.email;
		  this.pdf_link = this.bidjobdetail.pdf_link;
		  this.description = this.bidjobdetail.description;
		  this.all_rfis = this.bidjobdetail.all_rfis;
		  this.fromId = this.bidjobdetail.fromId;
		  this.is_all_answered = this.bidjobdetail.is_all_answered;

		  this.companyProvider.getTradeFiles(this.tradeId).subscribe((all_attachments)=>{
	      	this.all_attachments = all_attachments;
	      	var attachments = [];
	      	if(this.all_attachments != '')
	      	{		
	      		this.all_attachments.forEach(function(data){
	      			var obj = {
	      				source : 'directory/jobs_data/'+data.file_name,
	      				target : data.file_name.split('____').pop(-1)
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
		  loading.dismissAll();
	  	}
	},
    err => {
        loading.dismissAll();
        this.showTechnicalError();
    });
}

AnswerIt(index){
  $(".ansbtn"+index).hide();
  $(".ans"+index).show();
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

removeAttach(index,indx){
  	this.all_rfis[index].engg_answer_files.splice(indx,1);
  }

  addAttchs(rfiId,index){
  	var self = this;
    let modal = this.modalCtrl.create('UploadfilePage', {dateTime : this.dateTime, bid_upload : '1'});
     modal.onDidDismiss(data => {
     	if(data != undefined && data != '')
     	{
     		if(data.length > 0)
	          {     
	           var dateTime = self.dateTime;
	           data.forEach(function(single_file){
	            if(single_file.isUploaded == true)
	            {
	                var file = dateTime+'____'+single_file._file.name;
	                file = file.replace(" ", "_");
	                if(Array.isArray(self.all_rfis[index].engg_answer_files)){
					  	self.all_rfis[index].engg_answer_files.push(file);
					}
					else{
						var arr = [];
						arr.push(file)
						self.all_rfis[index].engg_answer_files = arr;
					}
	            }
	           });
	          }
     	}
     	});
     modal.present();
  }

replyRFIEngg(){
	var self = this;
	var count = 0;
	this.all_rfis.forEach(function(rfi){
		if(rfi.engg_answer != '' && rfi.engg_answer != undefined && rfi.engg_answer != null){
			count = count + 1;
			if(count == self.all_rfis.length){
				self.submitReply();
			}
		}
		else{
			count = count + 1;
			if(count == self.all_rfis.length){
				let toast = self.toastCtrl.create({
			        message: 'Please answer atleast one RFI',
			        duration: 3000,
			        position:'top',
			        cssClass: 'danger'
			       });
				toast.present(); 	
  			}
		}
	})
}

submitReply(){
	const loading = this.loadingCtrl.create({});
	loading.present();
	this.companyProvider.submitEnggReply({rfis : this.all_rfis, RfiEmailId : this.RfiEmailId, fromId : this.fromId}).subscribe((result)=>{
		loading.dismissAll();
		if(result.status == '1'){
			let toast = this.toastCtrl.create({
		        message: 'RFI Answers has been submitted successfully.',
		        duration: 3000,
		        position:'top',
		        cssClass: 'success'
		       });
			toast.present(); 
			this.getRFIDetails();
		}
		else{
			let toast = this.toastCtrl.create({
		        message: 'Error while submitting your answers. plz try later.',
		        duration: 3000,
		        position:'top',
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
	        this.showTechnicalError('1');
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

}
