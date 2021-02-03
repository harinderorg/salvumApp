import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController,ToastController,LoadingController, MenuController, ViewController} from 'ionic-angular';
import { CompanyProvider } from '../../providers/company/company';
 
@IonicPage()  
@Component({  
  selector: 'page-addbid',   
  templateUrl: 'addbid.html',  
  providers: [CompanyProvider]        
})
export class AddbidPage {   
userId:any;
jobId:any;
filterTradeId:any;
alltrades:any;   

  constructor(public modalCtrl: ModalController, public navCtrl: NavController, public navParams: NavParams, public companyProvider: CompanyProvider, public alertCtrl: AlertController, public toastCtrl: ToastController,public loadingCtrl: LoadingController, public menuCtrl: MenuController,public viewCtrl: ViewController) {

  	this.userId = localStorage.getItem('userinfo');
	  this.jobId = navParams.get('jobId');
    this.filterTradeId = localStorage.getItem('filterTradeId');
    if(this.filterTradeId == null || this.filterTradeId == undefined || this.filterTradeId == ''){
      this.filterTradeId = '0';
    }
    this.companyProvider.allTrades(this.jobId).subscribe((alltrades)=>{
        this.alltrades = alltrades;
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

  addManualBid(first_name,last_name,email,company,comment,tradeId)
  {
    if(first_name == '' || first_name == undefined || last_name == '' || last_name == undefined || email == '' || email == undefined || company == '' || company == undefined || comment == '' || comment == undefined || tradeId == '' || tradeId == undefined )
    {
      let toast = this.toastCtrl.create({
          message: 'Please fill all required fields.',
          duration: 3000,
          position:'top',
          cssClass: 'danger'
         });
         toast.present(); 
    }
    else
    {
      if(this.filterTradeId == '0')
      {
        if(tradeId == undefined || tradeId == '')
        {
          let toast = this.toastCtrl.create({
            message: 'Please select trade.',
            duration: 3000,
            position:'top',
            cssClass: 'danger'
           });
           toast.present(); 
           return false;
        }
      }
      else
      {
        tradeId = localStorage.getItem('filterTradeId');
      }
      const loading = this.loadingCtrl.create({});
        loading.present();
      this.companyProvider.submitBids(this.jobId,tradeId,null,'2',comment,'','',first_name,last_name,company,email,'0','').subscribe((bids)=>{
        loading.dismissAll() 
            if(bids.status == '1')
            {
                this.viewCtrl.dismiss('1');
            }
            else 
            {
              	this.viewCtrl.dismiss('0');
            }
          },
          err => {
              loading.dismissAll();
              this.showTechnicalError('1');
          });
    }
  }

  dismiss()
  {
  	this.viewCtrl.dismiss();
  }


}
