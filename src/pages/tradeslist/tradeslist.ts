import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController } from 'ionic-angular';
import { CompanyProvider} from '../../providers/company/company';

@IonicPage()
@Component({
  selector: 'page-tradeslist',
  templateUrl: 'tradeslist.html',
  providers: [CompanyProvider]
})
export class TradeslistPage {
trades:any;
jobId:any;
selected_trade:any;
  constructor(public navCtrl: NavController,public toastCtrl: ToastController, public navParams: NavParams, public viewCtrl: ViewController,public companyProvider: CompanyProvider) {
  	this.jobId = navParams.get('jobId');
  	this.selected_trade = navParams.get('selected_trade');
  	this.getTrades();
  }

  ionViewDidLoad() {
  }

  getTrades(){
  	this.companyProvider.allTrades(this.jobId).subscribe((data)=>{
        this.trades = data;
    },
    err => {
        this.showTechnicalError();
    });
  }

  submit(selected_trade){
  	this.viewCtrl.dismiss(selected_trade);
  }

  close(){
  	this.viewCtrl.dismiss();
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
