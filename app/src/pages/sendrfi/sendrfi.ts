import { Component } from '@angular/core';
import { IonicPage, NavController, ModalController , NavParams, AlertController,ToastController,LoadingController, ViewController} from 'ionic-angular';
import { CompanyProvider } from '../../providers/company/company';

@IonicPage()
@Component({
  selector: 'page-sendrfi',
  templateUrl: 'sendrfi.html',
  providers: [CompanyProvider]
})
export class SendrfiPage {
RfiId:any;
question:any;
dateTime:any;
userId:any;
jobId:any;
files:any;
tradeId:any;
inviteId:any;
isBrowser = localStorage.getItem('isBrowser');
APIURL = localStorage.getItem('APIURL');
baseUrl = localStorage.getItem('baseUrl');
active_job_breadcrumb = localStorage.getItem('active_job_breadcrumb');
  constructor(public navCtrl: NavController,public modalCtrl: ModalController,public navParams: NavParams, public companyProvider: CompanyProvider, public alertCtrl: AlertController, public toastCtrl: ToastController,public loadingCtrl: LoadingController,public viewCtrl: ViewController) {
  	this.RfiId = navParams.get('RfiId');
    this.question = navParams.get('question');
    this.userId = navParams.get('userId');
    this.jobId = navParams.get('jobId');
    this.tradeId = navParams.get('tradeId');
  	this.inviteId = navParams.get('inviteId');
    this.dateTime = new Date().getTime();
  }

replyRFI(question,answer)
{
  if(question == '' || question == undefined)
  {
    let toast = this.toastCtrl.create({
      message: 'Question is required.',
      duration: 3000,
      position: 'top',
      cssClass: 'danger'
     });
     toast.present(); 
     return false;
  }
  if(answer == '' || answer == undefined)
  {
    let toast = this.toastCtrl.create({
      message: 'Please enter your answer.',
      duration: 3000,
      position: 'top',
      cssClass: 'danger'
     });
     toast.present(); 
     return false;
  }
  const loading = this.loadingCtrl.create({});
	loading.present();
	var all_files = [];
	var bid_files = null;
	if(this.files != undefined)
	{
	if(this.files.length > 0)
	{
	  this.files.forEach(function(file){
	    all_files.push(file.name);
	  });
    // bid_files = JSON.stringify(all_files);
	  bid_files = all_files;
	}
	}
	this.companyProvider.replyRFI({id : this.RfiId,question : question,answer : answer,answer_files : bid_files,userId : this.userId,jobId : this.jobId,tradeId : this.tradeId,inviteId : this.inviteId,APIURL : this.APIURL,baseUrl : this.baseUrl}).subscribe((formdata)=>{
	    if(formdata.status == 1) 
	    {
	        loading.dismissAll()
	        let toast = this.toastCtrl.create({
	            message: 'RFI has been replied successfully.',
	            duration: 3000,
	            position: 'top',
              cssClass: 'success'
	           });
	           toast.present(); 
	           this.viewCtrl.dismiss();
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

  filemanagerFiles()
  {
    let modal = this.modalCtrl.create('FilemanagerfilesPage',{
      reply_rfi : '1'
    });
     modal.onDidDismiss(data => {
      if(data != undefined && data != '')
          {       
           var filesArray = [];
           var dateTime = this.dateTime;
           data.forEach(function(single_file){
              var fileobj = {
                file_name : single_file.name,
                name : dateTime+'____'+single_file.name,
                folder_path : localStorage.getItem('filemanager_file_path'),
                random : dateTime
              }
              filesArray.push(fileobj);
            });

           if(this.files != undefined)
           {
              this.files = this.files.concat(filesArray);
           }
           else
           {
              this.files = filesArray;
           }
           this.companyProvider.addBidFiles(filesArray).subscribe((filesdata)=>{
             console.log('done'); 
           },
            err => {
                this.showTechnicalError('1');
            });
          }
     });
     modal.present();
  }

  uploadFiles()
  {
    let modal = this.modalCtrl.create('UploadfilePage', {dateTime : this.dateTime, bid_upload : '1'});
     modal.onDidDismiss(data => {
     	if(data != undefined || data != '')
     	{
     		if(data.length > 0)
	          {     
	           var filesArray = [];
	           var dateTime = this.dateTime;
	           data.forEach(function(single_file){
	            if(single_file.isUploaded == true)
	            {
	              var fileobj = {
	                  file_name : single_file._file.name,
	                  name : dateTime+'____'+single_file._file.name,
	                  random : dateTime
	                }
	                filesArray.push(fileobj);
	            }
	            });

	           if(this.files != undefined)
	           {
	              this.files = this.files.concat(filesArray);
	           }
	           else
	           {
	              this.files = filesArray;
	           }
	          }
     	}
     	});
     modal.present();
  }

  removeFile(index)
  {
    this.files.splice(index,1);
  }

  dismiss()
  {
    this.viewCtrl.dismiss();
  }

  root(){
      this.navCtrl.setRoot('DashboardPage');
    };
    
  goToJobs(){
      this.navCtrl.push('ManagejobPage',{
      is_direct : '0'
      });
    };

  backToTradeDash()
      {
        this.navCtrl.push('TradeDashboardPage',{
          back : '1'
        });
      }

}
