import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { CompanyProvider } from '../../providers/company/company';
import * as $ from 'jquery';

@IonicPage()
@Component({
  selector: 'trade-breadcrumbs',
  templateUrl: 'trade-breadcrumbs.html',
  providers: [CompanyProvider]
})
export class TradeBreadcrumbsPage { 
alltrades :any;
timestamp :any;
  constructor(public navCtrl: NavController,public toastCtrl: ToastController, public navParams: NavParams, public companyProvider: CompanyProvider) {
    var current_date = new Date();
    this.timestamp = current_date.getTime();
    localStorage.setItem('filterTradeId','0');
  	localStorage.setItem('previousId','0');
    var jobId = localStorage.getItem('currentJobId');
  	this.companyProvider.allTrades(jobId).subscribe((alltrades)=>{
      this.alltrades = alltrades;
    },
    err => {
        this.showTechnicalError();
    });
  }

  clickedTrade(tradeId){ 
  	$(".hideall").hide();
  	$(".trade-btn").removeClass("bg-active");
  	$("#btn"+tradeId+this.timestamp).addClass("bg-active");
	  $("#show"+tradeId+this.timestamp).show();
  	localStorage.setItem('filterTradeId',tradeId);
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
