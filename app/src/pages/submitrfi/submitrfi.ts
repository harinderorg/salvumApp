import { Component } from '@angular/core';
import { IonicPage, NavController, ModalController , NavParams, AlertController,ToastController,LoadingController, ViewController} from 'ionic-angular';
import { CompanyProvider } from '../../providers/company/company';
import { Socket } from 'ng-socket-io';
// import { Observable } from 'rxjs/Observable';

@IonicPage()
@Component({
  selector: 'page-submitrfi',
  templateUrl: 'submitrfi.html',
  providers: [CompanyProvider]
})
export class SubmitrfiPage {
jobId:string;
tradeId:string;
userId:string;
InviteId:string;
isAwarded:any;
bid_status:string;
files:any;
dateTime:any;
isBrowser = localStorage.getItem('isBrowser');
APIURL = localStorage.getItem('APIURL');
bid_job_name = localStorage.getItem('bid_job_name');
baseUrl = localStorage.getItem('baseUrl');
  constructor(public navCtrl: NavController,public modalCtrl: ModalController,public navParams: NavParams, public companyProvider: CompanyProvider, public alertCtrl: AlertController, public toastCtrl: ToastController,public loadingCtrl: LoadingController,public viewCtrl: ViewController,private socket: Socket) {
    // private socket: Socket

  	  this.jobId = navParams.get('jobId');
      this.tradeId = navParams.get('tradeId');
      this.bid_status = navParams.get('bid_status');
      this.InviteId = navParams.get('InviteId');
      this.isAwarded = navParams.get('isAwarded');
      this.userId = localStorage.getItem('userinfo');
      localStorage.setItem('filterTradeId','1');
      this.dateTime = new Date().getTime();

  }

submitRFI(question,name,email,company,phone)
{
  if(question !== undefined && question != '')
  {
    if(this.userId == null || this.userId == undefined || this.userId == '')
    {
      if(name == '' || name == undefined)
      {
        let toast = this.toastCtrl.create({
          message: 'Please enter your name.',
          duration: 3000,
          position: 'top',
          cssClass: 'danger'
         });
         toast.present(); 
         return false;
      }
      if(email == '' || email == undefined)
      {
        let toast = this.toastCtrl.create({
          message: 'Please enter your email.',
          duration: 3000,
          position: 'top',
          cssClass: 'danger'
         });
         toast.present(); 
         return false;
      }
      if(company == '' || company == undefined)
      {
        let toast = this.toastCtrl.create({
          message: 'Please enter company name.',
          duration: 3000,
          position: 'top',
          cssClass: 'danger'
         });
         toast.present(); 
         return false;
      }
      if(phone == '' || phone == undefined)
      {
        let toast = this.toastCtrl.create({
          message: 'Please enter phone number.',
          duration: 3000,
          position: 'top',
          cssClass: 'danger'
         });
         toast.present(); 
         return false;
      }
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
          bid_files = all_files;
          // bid_files = JSON.stringify(all_files);
        }
      }
      this.companyProvider.submitRFIs({jobId : this.jobId,tradeId : this.tradeId,userId: this.userId,question : question,files : bid_files,InviteId : this.InviteId,name : name,email : email,company : company,phone : phone,isAwarded : this.isAwarded, APIURL : this.APIURL, baseUrl : this.baseUrl}).subscribe((formdata)=>{
	        if(formdata.status == 1) 
	        {
	            loading.dismissAll()
	            let toast = this.toastCtrl.create({
	                message: 'RFI has been submitted successfully.',
	                duration: 3000,
	                position: 'top',
                  cssClass: 'success'
	               });
	               toast.present();  
                 this.socket.emit('new_notification', formdata.notify);
                 var award_state = this.isAwarded == '1' ? 'awarded' : 'pre_awarded';
                 localStorage.setItem('award_state',award_state);
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
  else
  {
    let toast = this.toastCtrl.create({
      message: 'Please enter your question.',
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

filemanagerFiles()
  {
    let modal = this.modalCtrl.create('FilemanagerfilesPage');
     modal.onDidDismiss(data => {
      if(data != undefined && data != '')
          {       
           var filesArray = [];
           var dateTime = this.dateTime;
           data.forEach(function(single_file){
              var fileobj = {
                file_name : single_file.name,
                name : dateTime+'____'+single_file.name.replace(" ","_"),
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
              this.showTechnicalError();
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
	                  name : dateTime+'____'+single_file._file.name.replace(" ","_"),
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
  backBtn()
  {
    this.navCtrl.pop();
  }

  root(){
    this.navCtrl.setRoot('DashboardPage');
  };
  goToBids(){
    this.navCtrl.push('bidjobs', {
      type: '0'
    });
  };
  goToBidDetails()
  {
    this.navCtrl.push('bidding-page', {
      bidJobId: this.InviteId,
      status: this.bid_status,
      });
  }


}
