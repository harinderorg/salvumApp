import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController,LoadingController, ModalController } from 'ionic-angular';
import { CompanyProvider } from '../../providers/company/company';
import { PdfmakeService } from 'ng-pdf-make/pdfmake/pdfmake.service';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Cell, Row, Table } from 'ng-pdf-make/objects/table';
import * as pdfMake from 'pdfmake/build/pdfmake.js';
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@IonicPage()
@Component({
  selector: 'page-ask-engg',
  templateUrl: 'ask-engg.html',
  providers: [CompanyProvider]
})
export class AskEnggPage {
userId : any = localStorage.getItem('userinfo');
jobId : any;
rfiIds : any;
updated_rfis : any;
rfis : any;
send_type : any;
allEmails : any;
APIURL : any;
email_address : any;
all_users : any;
emails : any;
dateTime : any;
baseUrl = localStorage.getItem('baseUrl');
isBrowser = localStorage.getItem('isBrowser');
step1 : Boolean = true;
step2 : Boolean = false;
step3 : Boolean = false;
dropdown : Boolean = false;
active_job_breadcrumb = localStorage.getItem('active_job_breadcrumb');
  constructor(private transfer: FileTransfer, private file: File,public navCtrl: NavController, public navParams: NavParams, public viewCtrl : ViewController, public toastCtrl: ToastController,public loadingCtrl: LoadingController, public companyProvider: CompanyProvider, private pdfmake: PdfmakeService,public modalCtrl: ModalController) {
  	this.APIURL = localStorage.getItem('APIURL');
  	this.jobId = navParams.get('jobId');
  	this.rfiIds = navParams.get('rfiIds');
  	this.rfis = navParams.get('rfis');
  	this.dateTime = new Date().getTime();
  	this.getAllUsers();
  }

  getAllUsers(){
  	this.companyProvider.getAllUsers().subscribe((users)=>{
  		this.all_users = users;
  		this.emails = users;
  		var allEmails = [];
  		users.forEach(function(user){
  			allEmails.push(user.email);
  		});
  		this.allEmails = allEmails;
  	},
    err => {
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

  selectEmail(email_address){
  	this.email_address = email_address;
  	this.dropdown = false;
  }

  filterEmails(ev: any){
  	this.emails=this.all_users;
	  let val = ev.target.value;
	    if (val && val.trim() != '') {
	      this.dropdown = true;
	      this.emails = this.emails.filter((item) => {
	        return (item.email.toLowerCase().indexOf(val.toLowerCase()) > -1);
	      })
	    }
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

  saveNextFirst(){
  	var self = this;
  	var updated_rfis = [];
  	var count = 0;
  	this.rfis.forEach(function(rfi){
  		if(rfi.question == undefined || rfi.question == '' || rfi.question == null){
  			var number = count + 1;
  			let toast = self.toastCtrl.create({
	          message: 'RFI '+number+' should not be blank.',
	          duration: 3000,
	          position: 'top',
	          cssClass: 'danger'
	         });
	         toast.present(); 
  		}
  		else{
  			updated_rfis.push({
  				question_engg : rfi.question,
  				_id : rfi._id
  			});
  			count = count + 1;
  			if(count == self.rfis.length){
  				self.step1 = false;
			  	self.step2 = true;
			  	self.step3 = false;
			  	self.updated_rfis = updated_rfis;	
  			}
  		}
  	});
  }

  saveNextSecond(send_type){
  	if(send_type == undefined || send_type == '' || send_type == null){
  		let toast = this.toastCtrl.create({
          message: 'Please select how to send RFI.',
          duration: 3000,
          position: 'top',
          cssClass: 'danger'
         });
         toast.present(); 
  	}
  	else{
  		this.send_type = send_type;
  		this.step1 = false;
	  	this.step2 = false;
	  	this.step3 = true;
  	}
  }

  backStepSecond(){
  	this.step1 = true;
  	this.step2 = false;
  	this.step3 = false;
  }

  backStepThird(){
  	this.step1 = false;
  	this.step2 = true;
  	this.step3 = false;
  }

  removeAttach(index,indx){
  	this.rfis[index].question_files.splice(indx,1);
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
	                if(Array.isArray(self.rfis[index].question_files)){
					  	self.rfis[index].question_files.push(file);
					}
					else{
						var arr = [];
						arr.push(file)
						self.rfis[index].question_files = arr;
					}
	            }
	           });
	          }
     	}
     	});
     modal.present();
  }

  downloadFile(){
  	let toast = this.toastCtrl.create({
        message: 'Start downloading....',
        duration: 3000,
        position:'top',
        cssClass: 'success'
       });
	toast.present(); 
  }

  askEngg(email_address,description){
	  	var regExp = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
	  	if(email_address == '' || email_address == undefined){
	  		let toast = this.toastCtrl.create({
	            message: 'Please enter email address.',
	            duration: 3000,
	            cssClass: 'danger',
	            position: 'top'
	           });
	           toast.present();
	           return false;
	  	}
	  	if(regExp.test(email_address) == false){
	  		let toast = this.toastCtrl.create({
	            message: 'Please enter valid email address.',
	            duration: 3000,
	            cssClass: 'danger',
	            position: 'top'
	           });
	           toast.present();
	           return false;
	  	}
	  	if(this.send_type == 'smail'){
		  	if(this.allEmails.indexOf(email_address) == -1){
		  		let toast = this.toastCtrl.create({
		            message: 'Please select valid email address from dropdown.',
		            duration: 3000,
		            cssClass: 'danger',
		            position: 'top'
		           });
		           toast.present();
		           return false;
		  	}
	  	}
	  	const loading = this.loadingCtrl.create({});
		loading.present();
	  	var self = this;
		// start pdf
		this.pdfmake.docDefinition.content = [];
		this.pdfmake.configureStyles({ header: { fontSize: 18, bold: true } });
		var counter = 0;
		var all_trades = [];
		this.rfis.forEach(function(rfi){
			if(all_trades.indexOf(rfi.tradeId) == -1){
				all_trades.push(rfi.tradeId);
			}
			counter = counter + 1; 				
			// Add a text with style
			self.pdfmake.addText('RFI'+counter, 'header');
			// Create Headers cells
			const header1 = new Cell('Question');
			const header2 = new Cell(rfi.question);
			const headerRows = new Row([header1, header2]);
			// Create headers row	
			if(Array.isArray(rfi.question_files)){
				const row1 = new Row([new Cell('Attachments'), new Cell('Please click on below link to download zip:')]);
				const widths = [150, 350, 200, '*']; 
				// Create table object
				const table = new Table(headerRows, [row1], widths);
				self.pdfmake.addTable(table);
			}
			else{
				const row1 = new Row([new Cell('Attachments'), new Cell('No attachments.')]);
				const widths = [150, 350, 200, '*']; 
				// Create table object
				const table = new Table(headerRows, [row1], widths);
				self.pdfmake.addTable(table);
			}		
			
			if(Array.isArray(rfi.question_files)){
				if(rfi.question_files.length > 0){
					var rfi_attachments = [];
					rfi.question_files.forEach(function(file){
						var obj = {
			      				source : 'directory/bids_data/'+file,
			      				target : file.split('____').pop(-1)
			      			}
						rfi_attachments.push(obj);
					});
					var random = Math.floor(Math.random() * 1000000);
					var zip_href = self.APIURL+'/salvum/directory/temp_data/attachment'+random+'.zip';
					self.pdfmake.docDefinition.content.push({text: "Download attachments", link:zip_href, decoration:"underline", fontSize:13, margin: [0, 5] });
					self.companyProvider.makeZipAttachments(rfi_attachments,random).subscribe((downloaded)=>{
						// zip done
					},
				    err => {
				        this.showTechnicalError();
				    });
				}
			}
			if(counter == self.rfis.length){
				//save updated rfis in db
				self.companyProvider.updateRFIsEngg(self.updated_rfis).subscribe((result)=>{
				// download it
				setTimeout(function(){ 
					if(description != undefined && description != ''){
						self.pdfmake.docDefinition.content.push({text:description, fontSize:13, margin: [0, 5] });
					}
					pdfMake.createPdf(self.pdfmake.docDefinition).getDataUrl(function(dataUrl){
					var rfiData = {
						RfiIds : self.rfiIds,
						email : email_address,
						description : description,
						userId : self.userId,
						jobId : self.jobId,
						file : dataUrl,
						baseUrl : self.baseUrl,
						tradeId : all_trades,
						send_type : self.send_type
					};
				  	const loading = self.loadingCtrl.create({});
				    loading.present(); 
				  	self.companyProvider.addRfiEmail(rfiData).subscribe((result)=>{
				  		loading.dismissAll();
				  		if(result.status == 1){
				  			let toast = self.toastCtrl.create({
					            message: 'RFI requested successfully.',
					            duration: 3000,
					            cssClass: 'success',
					            position: 'top'
					           });
					           toast.present();
					           self.viewCtrl.dismiss();
				  		}
				  		else{
				  			let toast = self.toastCtrl.create({
					            message: 'Error, plz try later.',
					            duration: 3000,
					            cssClass: 'danger',
					            position: 'top'
					           });
					           toast.present();
				  		}
				  	},
				    err => {
				        loading.dismissAll();
				        this.showTechnicalError('1');
				    });
				  });
				 }, 3000);
				},
			    err => {
			        this.showTechnicalError('1');
			    });
			}	
		});
  }

  onEmailSelect(event){
  	console.log(event)
  }

  root(){
	this.navCtrl.setRoot('DashboardPage');
  };
  
  goToJobs(){
	    this.navCtrl.push('ManagejobPage',{
	    is_direct : '0'
	    });
  };

  backToPage(){
    this.viewCtrl.dismiss();
  }

  backToTradeDash(){
	    this.navCtrl.push('TradeDashboardPage',{
	      back : '1'
	    });
  }

}
