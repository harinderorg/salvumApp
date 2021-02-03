import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController } from 'ionic-angular';
import * as copy from 'copy-to-clipboard';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';

@IonicPage()
@Component({
  selector: 'page-rfi-email-answers',
  templateUrl: 'rfi-email-answers.html',
})
export class RfiEmailAnswersPage {
isBrowser : any = localStorage.getItem('isBrowser');
baseUrl : any = localStorage.getItem('baseUrl');
APIURL : any = localStorage.getItem('APIURL');
rfi : any;
page_type : any;
active_job_breadcrumb = localStorage.getItem('active_job_breadcrumb');
  constructor(private transfer: FileTransfer, private file: File,public navCtrl: NavController, public navParams: NavParams, public viewCtrl : ViewController, public toastCtrl : ToastController) {
  	this.page_type = navParams.get('page_type');
  	this.rfi = navParams.get('rfiEmail');
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

  copyAnswer(answer)
  {
    copy(answer);
    copy(answer);
    let toast = this.toastCtrl.create({
      message: 'Copy to clipboard.',
      duration: 3000,
      position: 'top',
      cssClass: 'success'
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

  root(){
    this.navCtrl.setRoot('DashboardPage');
  };
  
  goToJobs(){
    this.navCtrl.push('ManagejobPage',{
    is_direct : '0'
    });
  };

  backToTradeDash(){
    this.navCtrl.push('TradeDashboardPage',{
      back : '1'
    });
  }

  backPage(){
  	this.viewCtrl.dismiss();
  }


}
