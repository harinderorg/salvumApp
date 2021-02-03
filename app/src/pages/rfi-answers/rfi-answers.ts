import { Component } from '@angular/core';
import { IonicPage, NavController, ViewController, ModalController , NavParams, AlertController,ToastController,LoadingController} from 'ionic-angular';
import { CompanyProvider } from '../../providers/company/company';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';

@IonicPage()
@Component({
  selector: 'page-rfi-answers',
  templateUrl: 'rfi-answers.html',
  providers: [CompanyProvider]
})
export class RfiAnswersPage {
rfi : any;
rfiId : any;
question_files : any;
baseUrl : any = localStorage.getItem('baseUrl');
APIURL : any = localStorage.getItem('APIURL');
isBrowser : any = localStorage.getItem('isBrowser');
  constructor(private transfer: FileTransfer, private file: File,public navCtrl: NavController,public viewCtrl: ViewController,public modalCtrl: ModalController,public navParams: NavParams, public companyProvider: CompanyProvider, public alertCtrl: AlertController, public toastCtrl: ToastController, public loadingCtrl: LoadingController) {
  	this.rfiId = navParams.get('rfiId');
  	this.getRfiDetails();
  }

  getRfiDetails(){
  	const loading = this.loadingCtrl.create({});
    loading.present();
  	this.companyProvider.getRFIDetails(this.rfiId).subscribe((rfi_details)=>{
      this.rfi = rfi_details;
  		this.question_files = rfi_details.question_files == null ? [] : rfi_details.question_files;
  		loading.dismissAll();
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

  downloadFile(){
    let toast = this.toastCtrl.create({
        message: 'Start downloading....',
        duration: 3000,
        position:'top',
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
  goToBids(){
    this.navCtrl.push('bidjobs', {
      type: '0'
    });
  };
  backPage(){
    this.viewCtrl.dismiss();
  }

}
