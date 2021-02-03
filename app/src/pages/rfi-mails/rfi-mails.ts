import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController,ToastController,LoadingController } from 'ionic-angular';
import { CompanyProvider } from '../../providers/company/company';

@IonicPage()
@Component({
  selector: 'page-rfi-mails',
  templateUrl: 'rfi-mails.html',
  providers: [CompanyProvider]
})
export class RfiMailsPage {
page_type:any;
sorted_mail_ids:any;
sorted_mails:any;
all_mails:any;
jobId:any;
timestamp:any;
isBrowser : any = localStorage.getItem('isBrowser');
APIURL = localStorage.getItem('APIURL');
active_job_breadcrumb = localStorage.getItem('active_job_breadcrumb');
trades:any = [];
trade_ids:any = [];
tradeTypes:any = [];
tradesType_names:any = [];
filter_trades:any = [];
filter_trade_names:any = [];
filter_list:any = [];
nav_filter:any = 'default';
order_default:any = 'trade_name';
order_default_p:any = false;
order_advanced:any = 'trade_task';
order_advanced_p:any = false;
sort_icon:Boolean = true;
  constructor(public navCtrl: NavController, public navParams: NavParams, public companyProvider: CompanyProvider, public alertCtrl: AlertController, public toastCtrl: ToastController,public loadingCtrl: LoadingController, public modalCtrl: ModalController) {
  	this.page_type = navParams.get('emails');
    if(this.page_type == undefined){
      this.page_type = localStorage.getItem('job_email_page_type');
    }
    localStorage.setItem('job_email_page_type',this.page_type);
  	this.jobId = navParams.get('jobId');
    var current_date = new Date();
    this.timestamp = current_date.getTime();
  	if(this.jobId == undefined)
    {
      var localJobId = localStorage.getItem('currentJobId');
      if(localJobId != '' && localJobId != undefined && localJobId != null){
        this.jobId = localJobId;
      }
      else{
        this.navCtrl.push('ManagejobPage',{
          is_direct : '0'
        });
      }
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

  ionViewDidEnter(){
  	this.getEmails();
  }

  scroll(direction){
    var cond;
    if(direction == 'right'){
      cond = { scrollLeft: "+=200px" };
    }
    else{
      cond = { scrollLeft: "-=200px" };
    }
    $('.drop-scroll').animate(cond, "slow");
  }

  ionViewDidLoad(){
    this.caclHeight();
    if(JSON.parse(localStorage.getItem('saved_filter_list')) != null && JSON.parse(localStorage.getItem('saved_filter_list')) != undefined){
      this.filter_list = JSON.parse(localStorage.getItem('saved_filter_list'));
      this.filter_trades = JSON.parse(localStorage.getItem('saved_filter_trades'));
      this.filter_trade_names = JSON.parse(localStorage.getItem('saved_filter_trade_names'));
    }
  }

  saveFilters(filter_list,filter_trades,filter_trade_names){
    localStorage.setItem('saved_filter_list',JSON.stringify(filter_list));
    localStorage.setItem('saved_filter_trades',JSON.stringify(filter_trades));
    localStorage.setItem('saved_filter_trade_names',JSON.stringify(filter_trade_names));
  }

  caclHeight(){
    var fixed_div = document.getElementById("calc_height_em"+this.timestamp);
      if(fixed_div != null){
        var fixed_div_height = fixed_div.offsetHeight;
        document.getElementById('fixed_height_em'+this.timestamp).style.marginTop = fixed_div_height+'px';
      }
  }

  getEmails(){
    this.trades = [];
    this.trade_ids = [];
    this.tradeTypes = [];
    this.tradesType_names = [];
    var self = this,index;
  	const loading = this.loadingCtrl.create({});
    loading.present(); 
  	this.companyProvider.getEmailRFIs(this.jobId,this.page_type).subscribe((result)=>{
  		loading.dismissAll();
  		this.all_mails = result;
  		this.sorted_mails = result;
      if(this.all_mails != ''){
        this.all_mails.forEach(function(data){
          if(self.trade_ids.indexOf(data.tradeId) >= 0 && data.tradeId != '2'){
            index = self.trade_ids.indexOf(data.tradeId);
            self.trades[index]['total'] = self.trades[index]['total'] + 1;
          }
          else{
            if(data.tradeIds.length == 1){
              self.trades.push({
                tradeId : data.tradeId,
                trade_name : data.trade_name,
                trade_icon : data.trade_icon,
                trade_task : data.trade_task,
                total : 1
              });
              self.trade_ids.push(data.tradeId);
            }
            else{
              data.trades.forEach(function(rmail){
                if(self.trade_ids.indexOf(rmail.tradeId) >= 0){
                  index = self.trade_ids.indexOf(rmail.tradeId);
                  self.trades[index]['total'] = self.trades[index]['total'] + 1;
                }
                else{
                  self.trades.push({
                    tradeId : rmail.tradeId,
                    trade_name : rmail.trade_name,
                    trade_icon : rmail.trade_icon,
                    trade_task : rmail.trade_task,
                    total : 1
                  });
                  self.trade_ids.push(rmail.tradeId);
                }
                
              })
            }
          }

          if(self.tradesType_names.indexOf(data.trade_name) >= 0 && data.tradeId != '2'){
            index = self.tradesType_names.indexOf(data.trade_name);
            self.tradeTypes[index]['total'] = self.tradeTypes[index]['total'] + 1;
          }
          else{
            if(data.tradeIds.length == 1){
              self.tradeTypes.push({
                tradeId : 0,
                trade_name : data.trade_name,
                trade_icon : data.trade_icon,
                trade_task : 'All '+data.trade_name,
                total : 1
              });
              self.tradesType_names.push(data.trade_name);
            }
            else{
              data.trades.forEach(function(rmail){
                if(self.tradesType_names.indexOf(rmail.trade_name) >= 0){
                  index = self.tradesType_names.indexOf(rmail.trade_name);
                  self.tradeTypes[index]['total'] = self.tradeTypes[index]['total'] + 1;
                }
                else{
                  self.tradeTypes.push({
                    tradeId : 0,
                    trade_name : rmail.trade_name,
                    trade_icon : rmail.trade_icon,
                    trade_task : 'All '+rmail.trade_name,
                    total : 1
                  });
                  self.tradesType_names.push(rmail.trade_name);
                }
                
              })
            }
          }
        });
      }
      this.filterTrades();
  	},
    err => {
        loading.dismissAll();
        this.showTechnicalError();
    });
  }

    addFilter(trade){
    if(trade.tradeId == 0){
      if(this.filter_trade_names.indexOf(trade.trade_name) == -1){
        this.filter_trade_names.push(trade.trade_name);
        this.filter_list.push(trade);
      }
      else{
        this.filter_trade_names.splice(this.filter_trade_names.indexOf(trade.trade_name),1);
        this.removeArray(this.filter_list,trade);
      }
    }
    else{
      if(this.filter_trades.indexOf(trade.tradeId) == -1){
        this.filter_trades.push(trade.tradeId);
        this.filter_list.push(trade);
      }
      else{
        this.filter_trades.splice(this.filter_trades.indexOf(trade.tradeId),1);
        this.removeArray(this.filter_list,trade);
      }
    }
    this.filterTrades();
    if(this.filter_trades.length == 0 && this.filter_trade_names.length == 0){
      this.sorted_mails = this.all_mails;
    }
    this.saveFilters(this.filter_list,this.filter_trades,this.filter_trade_names);
  }

  removeArray(arr,what) {
     var a = arguments, L = a.length, ax;
      while (L > 1 && arr.length) {
          what = a[--L];
          while ((ax= arr.indexOf(what)) !== -1) {
              arr.splice(ax, 1);
          }
      }
      return arr;
  }

  filterTrades(){
    if(this.filter_trades.length > 0 || this.filter_trade_names.length > 0){
      var self = this;
      this.sorted_mails = [];
      this.sorted_mail_ids = [];
    this.all_mails.forEach(function(data){
      if(data.tradeId != '2'){
        if(self.filter_trades.indexOf(data.tradeId) >= 0)
        {
          if(self.sorted_mail_ids.indexOf(data._id) == -1){
            self.sorted_mails.push(data);
            self.sorted_mail_ids.push(data._id);
          }
        }
        else{
          if(self.filter_trade_names.indexOf(data.trade_name) >= 0){
            if(self.sorted_mail_ids.indexOf(data._id) == -1){
              self.sorted_mails.push(data);
              self.sorted_mail_ids.push(data._id);
            }
          }
        }
      }
      else{
        data.trades.forEach(function(r_mail){
          if(self.filter_trades.indexOf(r_mail.tradeId) >= 0)
          {
            if(self.sorted_mail_ids.indexOf(data._id) == -1){
              self.sorted_mails.push(data);
              self.sorted_mail_ids.push(data._id);
            }
          }
          else{
            if(self.filter_trade_names.indexOf(r_mail.trade_name) >= 0){
              if(self.sorted_mail_ids.indexOf(data._id) == -1){
                self.sorted_mails.push(data);
                self.sorted_mail_ids.push(data._id);
              }
            }
          }
        })
      }
    });
    } 
  }

  cancelFilter(trade,index){
    if(trade.tradeId == 0){
      this.filter_trade_names.splice(this.filter_trade_names.indexOf(trade.trade_name),1);
    }
    else{
      this.filter_trades.splice(this.filter_trades.indexOf(trade.tradeId),1);
    }
    this.filter_list.splice(index,1);
    this.filterTrades();
    if(this.filter_trades.length == 0 && this.filter_trade_names.length == 0){
      this.sorted_mails = this.all_mails;
    }
    this.saveFilters(this.filter_list,this.filter_trades,this.filter_trade_names);
  }

  onDropdownShow(){
    $(".shadow").show();
  }

  closeDropDown(){
    if($(".ng2-dropdown-menu").hasClass("ng2-dropdown-menu--open") == true){
      $(".ng2-dropdown-button").click();
    }
    $(".shadow").hide();
  }

  cancelAllFilters(type){
    if(type == 'd'){
      this.filter_trade_names = [];
      this.removeAllFilters(type);
    }
    else{
      this.filter_trades = [];
      this.removeAllFilters(type);
    }
    this.filterTrades();
    if(this.filter_trades.length == 0 && this.filter_trade_names.length == 0){
      this.sorted_mails = this.all_mails;
    }
    this.saveFilters(this.filter_list,this.filter_trades,this.filter_trade_names);
  }

  removeAllFilters(type){
    if(this.filter_list.length > 0){
      var count = 0,all_filters = [];
      this.filter_list.forEach(function(trade){
        if(type == 'd'){
          if(trade.tradeId != 0){
            all_filters.push(trade);
          }
        }
        if(type == 'a'){
          if(trade.tradeId == 0){
            all_filters.push(trade);
          }
        }
        count = count + 1;
      }); 
      this.filter_list = all_filters;
    }
  }

  sortTrades(type){
    if(type == 'a'){
      this.sort_icon = true;
      this.order_default = 'trade_name';
      this.order_advanced = 'trade_task';
      this.sortOrder();
    }
    if(type == 'n'){
      this.sort_icon = false;
      this.order_default = 'total';
      this.order_advanced = 'total';
      this.sortOrder();
    }
  }

  sortOrder(){
    if(this.order_default_p == false){
      this.order_default_p = true;
    }
    else{
      this.order_default_p = false;
    }
    if(this.order_advanced_p == false){
      this.order_advanced_p = true;
    }
    else{
      this.order_advanced_p = false;
    }
  }

 //  clickTrade(){
	// var filterTradeId = localStorage.getItem('filterTradeId');
	// var previousId = localStorage.getItem('previousId');
	// if(filterTradeId == '0')
	// {
	// 	this.all_mails = this.all_mail_results;
 //    localStorage.setItem('previousId',filterTradeId);
	// 	return false;
	// }
	// if(filterTradeId != previousId)
	// {
	// 	this.all_mails = [];
	// 	var all_mailsArr = [];
	// 	localStorage.setItem('previousId',filterTradeId);
	// 	this.all_mail_results.forEach(function(rfis){
	// 		if(rfis.tradeId.indexOf(filterTradeId) >= 0)
	// 		{
	// 			all_mailsArr.push(rfis);
	// 		}
	// 	}); 
	// 	this.all_mails = all_mailsArr;
	// }
 //  }

  viewRFIEmail(rfiEmail){
  	this.navCtrl.push('RfiEmailAnswersPage',{
  		rfiEmail : rfiEmail,
  		page_type : this.page_type
  	})
  }

  deleteRFIEmail(id){
  	let confirm = this.alertCtrl.create({
      title: 'Are you sure want to delete?',
      message: '',
      buttons: [
        {
          text: 'No',
          handler: () => {
            //console.log('Disagree clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            const loading = this.loadingCtrl.create({});
            loading.present();
            this.companyProvider.deleteRfiEmails({RfiEmailId : id}).subscribe((deleted)=>{
              if(deleted.status == 1){
                loading.dismissAll();
                let toast = this.toastCtrl.create({
                    message: 'Rfi Email Deleted.',
                    duration: 3000,
                    position: 'top',
                    cssClass: 'success'
                   });
                   toast.present(); 
                   this.getEmails();
              }
              else{
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
        }
      ]
    });
    confirm.present();
  }

 //  fetchEmails(){
	// var filterTradeId = localStorage.getItem('filterTradeId');
	// if(filterTradeId == '0')
	// {
	// 	this.getEmails();
	// }
	// else
	// {
	// 	const loading = this.loadingCtrl.create({});
	// 	loading.present(); 
	// 	this.companyProvider.getEmailRFIs(this.jobId,this.page_type).subscribe((result)=>{
 //  		loading.dismissAll();
	// 		this.all_mail_results = result;
	// 		this.all_mails = result;
	//   	if(this.all_mail_results.length > 0)
	//       {
	//       	var returnArr = [];
	//       	this.all_mail_results.forEach(function(data){
	//       		if(data.tradeId.indexOf(filterTradeId) >= 0)
	//       		{
	// 	      		returnArr.push(data);
	//       		}
	//       	});
	//       	this.all_mails = returnArr;
	//       }
	//   },
 //    err => {
 //        loading.dismissAll();
 //        this.showTechnicalError('1');
 //    });

	// }
 //  }

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

}
