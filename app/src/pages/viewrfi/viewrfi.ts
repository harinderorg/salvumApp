import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ViewController, ToastController } from 'ionic-angular';
import { CompanyProvider } from '../../providers/company/company';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';

@IonicPage()
@Component({
  selector: 'page-viewrfi',
  templateUrl: 'viewrfi.html',
  providers: [CompanyProvider]
})
export class ViewrfiPage {
rfi:any;
APIURL:any;
role:any;
baseUrl = localStorage.getItem('baseUrl');
isBrowser = localStorage.getItem('isBrowser');
  constructor(private transfer: FileTransfer, public toastCtrl : ToastController, private file: File,public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public loadingCtrl: LoadingController, public companyProvider: CompanyProvider) {
    this.role = navParams.get('role');
  	if(navParams.get('page_type') == '1')
  	{
  		var RfiId = navParams.get('RfiId');
  		const loading = this.loadingCtrl.create({});
	    loading.present(); 
	  	this.companyProvider.getRFIDetails(RfiId).subscribe((data)=>{
	  		var rfis = {
          question: data.question,
					question_engg: data.question_engg,
					answer: data.answer,
					// answer_files: (data.answer_files == null || data.answer_files == '') ? [] : JSON.parse(data.answer_files),
     //      question_files:(data.question_files == null || data.question_files == '') ? [] : JSON.parse(data.question_files),
          answer_files: data.answer_files,
					question_files:data.question_files,
					question_date: data.question_date,
					answer_date: data.answer_date,
					_id: data._id 
	      		};
	      	this.rfi = rfis;
  			loading.dismissAll();
  		},
      err => {
          loading.dismissAll();
          this.showTechnicalError();
      });
  		
  	}
  	else
  	{
  		this.rfi = navParams.get('rfi');
  	}
  	this.APIURL = localStorage.getItem('APIURL');
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

dismiss(){
  this.viewCtrl.dismiss();
}

}
