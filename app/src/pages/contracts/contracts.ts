import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController,ToastController,LoadingController, ViewController } from 'ionic-angular';
import { CompanyProvider } from '../../providers/company/company';
import * as $ from 'jquery';
@IonicPage()
@Component({
  selector: 'page-contracts',
  templateUrl: 'contracts.html',
  providers: [CompanyProvider]
})
export class ContractsPage {
all_contracts:any;
sorted_contracts:any;
jobId:any;
isBrowser:any;
timestamp:any;
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
  constructor(public modalCtrl: ModalController, public navCtrl: NavController, public navParams: NavParams, public companyProvider: CompanyProvider, public alertCtrl: AlertController, public toastCtrl: ToastController,public loadingCtrl: LoadingController, public viewCtrl: ViewController )
  {
  	var current_date = new Date();
    this.timestamp = current_date.getTime();
  	this.isBrowser = localStorage.getItem('isBrowser');
  	this.jobId = navParams.get('jobId');
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

  ionViewDidEnter(){
  	this.trades = [];
	this.trade_ids = [];
	this.tradeTypes = [];
	this.tradesType_names = [];
  	this.getContracts();
  }

  ionViewDidLoad(){
  	this.caclHeight();
  	if(JSON.parse(localStorage.getItem('saved_filter_list')) != null && JSON.parse(localStorage.getItem('saved_filter_list')) != undefined){
  		this.filter_list = JSON.parse(localStorage.getItem('saved_filter_list'));
  		this.filter_trades = JSON.parse(localStorage.getItem('saved_filter_trades'));
  		this.filter_trade_names = JSON.parse(localStorage.getItem('saved_filter_trade_names'));
  	}
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

  // getAllTrades(){
  // 	this.companyProvider.allTrades(this.jobId).subscribe((alltrades)=>{
  //     this.alltrades = alltrades;
  //   },
  //   err => {
  //       this.showTechnicalError();
  //   });
  // }

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

  caclHeight(){
		var fixed_div = document.getElementById("calc_height_contr"+this.timestamp);
	    if(fixed_div != null){
	      var fixed_div_height = fixed_div.offsetHeight;
	      document.getElementById('fixed_height_contr'+this.timestamp).style.marginTop = fixed_div_height+'px';
	    }
	}

  getContracts()
  {
  	var self = this,index;
  	const loading = this.loadingCtrl.create({});
    loading.present(); 
  	this.companyProvider.getContracts(this.jobId).subscribe((contracts)=>{
  		loading.dismissAll()
	  	this.all_contracts = contracts;
	  	this.sorted_contracts = contracts;
	  	// console.log(this.all_contracts) 
	  	if(this.all_contracts != ''){
	  		this.all_contracts.forEach(function(contract){
	  			if(self.trade_ids.indexOf(contract.tradeId) >= 0){
	  				index = self.trade_ids.indexOf(contract.tradeId);
	  				self.trades[index]['total'] = self.trades[index]['total'] + 1;
	  			}
	  			else{
	  				self.trades.push({
	  					tradeId : contract.tradeId,
	  					trade_name : contract.trade_name,
	  					trade_icon : contract.trade_icon,
	  					trade_task : contract.trade_task,
	  					total : 1
	  				});
	  				self.trade_ids.push(contract.tradeId);
	  			}

	  			if(self.tradesType_names.indexOf(contract.trade_name) >= 0){
	  				index = self.tradesType_names.indexOf(contract.trade_name);
	  				self.tradeTypes[index]['total'] = self.tradeTypes[index]['total'] + 1;
	  			}
	  			else{
	  				self.tradeTypes.push({
	  					tradeId : 0,
	  					trade_name : contract.trade_name,
	  					trade_icon : contract.trade_icon,
	  					trade_task : 'All '+contract.trade_name,
	  					total : 1
	  				});
	  				self.tradesType_names.push(contract.trade_name);
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
  		this.sorted_contracts = this.all_contracts;
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

  saveFilters(filter_list,filter_trades,filter_trade_names){
  	localStorage.setItem('saved_filter_list',JSON.stringify(filter_list));
  	localStorage.setItem('saved_filter_trades',JSON.stringify(filter_trades));
  	localStorage.setItem('saved_filter_trade_names',JSON.stringify(filter_trade_names));
  }

  filterTrades(){
  	if(this.filter_trades.length > 0 || this.filter_trade_names.length > 0){
  		var self = this;
	  	this.sorted_contracts = [];
		this.all_contracts.forEach(function(data){
			if(self.filter_trades.indexOf(data.tradeId) >= 0)
			{
				self.sorted_contracts.push(data);
			}
			else{
				if(self.filter_trade_names.indexOf(data.trade_name) >= 0){
					self.sorted_contracts.push(data);
				}
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
  		this.sorted_contracts = this.all_contracts;
  	}
  	this.saveFilters(this.filter_list,this.filter_trades,this.filter_trade_names);
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
  		this.sorted_contracts = this.all_contracts;
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

 //  clickTrade()
	// {
	// 	var filterTradeId = localStorage.getItem('filterTradeId');
	// 	var previousId = localStorage.getItem('previousId');
	// 	if(filterTradeId == '0')
	// 	{
	// 		this.sorted_contracts = this.all_contracts;
	// 		localStorage.setItem('previousId',filterTradeId);
	// 		return false;
	// 	}
	// 	if(filterTradeId != previousId)
	// 	{
	// 		this.sorted_contracts = [];
	// 		var sortedArray = [];
	// 		localStorage.setItem('previousId',filterTradeId);
	// 		this.all_contracts.forEach(function(contract){
	// 			if(contract.tradeId == filterTradeId)
	// 			{
	// 				sortedArray.push(contract);
	// 			}
	// 		}); 
	// 		this.sorted_contracts = sortedArray;
	// 	}
	// }

	editContract(ContId,tradeId)
	{
		this.navCtrl.push('EditcontractPage',{
			jobId : this.jobId,
			ContId : ContId,
			tradeId : tradeId
		});
	}

	downloadPdf(tradeId,InvId)
	{
		let modal = this.modalCtrl.create('PdfPage', {
			jobId : this.jobId,
			tradeId : tradeId,
			bidId : InvId
		});
	    modal.present();
	}
  root(){
    this.navCtrl.setRoot('DashboardPage');
  };
  
  goToJobs(){
    this.navCtrl.push('ManagejobPage',{
    is_direct : '0'
    });
  };

  backToPage()
  {
    this.navCtrl.push('TradeDashboardPage',{
		jobId : this.jobId
	})
  }

}
