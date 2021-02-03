import { Component } from '@angular/core';
import { IonicPage, NavController, ViewController, ModalController , NavParams, AlertController,ToastController,LoadingController} from 'ionic-angular';
import { CompanyProvider } from '../../providers/company/company';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';

@IonicPage()
@Component({
  selector: 'page-my-rfis',
  templateUrl: 'my-rfis.html',
  providers: [CompanyProvider]
})
export class MyRfisPage {
jobId:any;
tradeId:any;
bid_status:any;
InviteId:any;
isAwarded:any;
userId:any;
myRFIs:any;
APIURL:any;
my_tab: string = "pre_awarded";
all_pre_RFIs:any;
pre_RFIs:any;
all_post_RFIs:any;
post_RFIs:any;
job_name:any;
baseUrl = localStorage.getItem('baseUrl');
isBrowser = localStorage.getItem('isBrowser');
  constructor(private transfer: FileTransfer, private file: File,public navCtrl: NavController,public viewCtrl: ViewController,public modalCtrl: ModalController,public navParams: NavParams, public companyProvider: CompanyProvider, public alertCtrl: AlertController, public toastCtrl: ToastController,public loadingCtrl: LoadingController) {
  	  this.jobId = navParams.get('jobId');
      this.tradeId = navParams.get('tradeId');
      this.bid_status = navParams.get('bid_status');
      this.InviteId = navParams.get('InviteId');
      this.isAwarded = navParams.get('isAwarded');
      this.userId = localStorage.getItem('userinfo');
      this.APIURL = localStorage.getItem('APIURL');
      this.job_name = localStorage.getItem('bid_job_name');
  }

  ionViewDidEnter(){
    if(localStorage.getItem('award_state') != undefined)
    {
      this.my_tab = localStorage.getItem('award_state');
    }
  	this.getMyRFIs();
  }

  getMyRFIs(){
  	const loading = this.loadingCtrl.create({});
    loading.present();
  	this.companyProvider.getMyPreRFIs(this.tradeId,this.userId,this.InviteId).subscribe((all_pre_RFIs)=>{
      this.all_pre_RFIs = all_pre_RFIs;
      this.pre_RFIs = all_pre_RFIs;
  	},
    err => {
        this.showTechnicalError();
    });

  	this.companyProvider.getMyPostRFIs(this.tradeId,this.userId,this.InviteId).subscribe((all_post_RFIs)=>{
      this.all_post_RFIs = all_post_RFIs;
      this.post_RFIs = all_post_RFIs;
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

  rfiAnswers(rfiId){
    this.navCtrl.push('RfiAnswersPage',{
      rfiId : rfiId
    })
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

  addRFIs(){
  	this.navCtrl.push('SubmitrfiPage',{
  	jobId:this.jobId,
		tradeId:this.tradeId,
		InviteId:this.InviteId,
		isAwarded:this.isAwarded
  	});
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

  getItems_pre(ev: any) {
      this.pre_RFIs=this.all_pre_RFIs;
      let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.pre_RFIs = this.pre_RFIs.filter((item) => {
        return (item.question.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }

  }

  getItems_post(ev: any) {
      this.post_RFIs=this.all_post_RFIs;
      let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.post_RFIs = this.post_RFIs.filter((item) => {
        return (item.question.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }

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
