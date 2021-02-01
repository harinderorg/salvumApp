import { Component } from '@angular/core';
import { IonicPage, NavController, ViewController, NavParams, ModalController, AlertController,ToastController,LoadingController } from 'ionic-angular';
import { CompanyProvider } from '../../providers/company/company';

@IonicPage()  
@Component({
  selector: 'page-transmittals',
  templateUrl: 'transmittals.html',
  providers: [CompanyProvider]
})  
export class TransmittalsPage {
all_transmittals:any = [];
sorted_transmittals:any = [];
all_sorted_transmittals:any = [];
searchTerm:any;
jobId:any;     
alltrades:any = [];
userName:any;       
timestamp:any;   
userId:any;        
isRefresh:any = '1';  
isBrowser = localStorage.getItem('isBrowser');
baseUrl = localStorage.getItem('baseUrl');
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
order_trans:any = '_id';
order_trans_p:any = true;
sort_icon:Boolean = true;
errors:any=['',null,undefined];
  constructor(public modalCtrl: ModalController, public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams, public companyProvider: CompanyProvider, public alertCtrl: AlertController, public toastCtrl: ToastController,public loadingCtrl: LoadingController ) {
  	this.jobId = navParams.get('jobId');
  	this.userName = localStorage.getItem('userName');
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

  ionViewDidEnter(){
  	this.userId = localStorage.getItem('userinfo');
  	if(this.isRefresh == '1'){
  		this.getTransmittals();
  		// this.getAllTrades();
  	}
  }

 //  getAllTrades(){
 //  	var self = this;
 //  	this.companyProvider.allTrades(this.jobId).subscribe((alltrades)=>{
	//   if(alltrades.length > 0){
	//   	alltrades.forEach(function(trade){
	//   		self.alltrades[trade._id] = {
	//   			trade_id : trade._id,
	//   			trade_icon : trade.trade_icon,
	//   			trade_name : trade.trade_name,
	//   			trade_task : trade.trade_task
	//   		}
	//   	});
	//   }
	// });
 //  }

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
    var fixed_div = document.getElementById("calc_height_trans"+this.timestamp);
      if(fixed_div != null){
        var fixed_div_height = fixed_div.offsetHeight;
        document.getElementById('fixed_height_trans'+this.timestamp).style.marginTop = fixed_div_height+'px';
      }
  }

  sortby(sort_by){
  	console.log(sort_by) 
  	if(sort_by == '1'){
  		this.order_trans = 'date_created';
  		this.order_trans_p = false;
  	}
  	if(sort_by == '2'){
  		this.order_trans = 'date_updated';
  		this.order_trans_p = false;
  	}
  }

  getItems(val) {
  	this.sorted_transmittals = this.all_sorted_transmittals;
	// let val = ev.target.value;
	if (val && val.trim() != '') {
	  this.sorted_transmittals = this.sorted_transmittals.filter((item) => {
	     return (item.comments.toLowerCase().indexOf(val.toLowerCase()) > -1 || item.subject.toLowerCase().indexOf(val.toLowerCase()) > -1 || item.date_updated.toLowerCase().indexOf(val.toLowerCase()) > -1 || item.date_sent.toLowerCase().indexOf(val.toLowerCase()) > -1);
	   });
	  }
	}

  getTransmittals(){
  	this.trades = [];
    this.trade_ids = [];
    this.tradeTypes = [];
    this.tradesType_names = [];
    this.all_transmittals = [];
    this.sorted_transmittals = [];
    this.all_sorted_transmittals = [];
    var self = this,index;
  	const loading = this.loadingCtrl.create({});
    loading.present(); 
  	this.companyProvider.getTransmittals(this.jobId,this.userId).subscribe((transmittals)=>{
  		loading.dismissAll()  
	     if(transmittals != ''){
	        transmittals.forEach(function(data){
	        	data = {
					transmittal_number: data.transmittal_number,
					subject: data.subject,
					sender_id: data.sender_id,
					rec_id: data.rec_id,
					comments: data.comments,
					submittals: data.submittals, 
					date_sent: self.errors.indexOf(data.date_sent) == -1 ? self.formatDate(data.date_sent) : '',
					date_updated: self.errors.indexOf(data.date_updated) == -1 ? self.formatDate(data.date_updated) : '',
					date_created: self.errors.indexOf(data.date_created) == -1 ? self.formatDate(data.date_created) : '',
					isSent: data.isSent,
					_id: data._id,
					jobId: data.jobId,
					rec_indicator: data.rec_indicator,
					sender_indicator: data.sender_indicator,
					tradeId: data.tradeId,
					user_name: data.user_name
	      		};
	      		self.all_transmittals.push(data);
	      		self.sorted_transmittals.push(data);
	      		self.all_sorted_transmittals.push(data);
	        	if(data.submittals.length > 0){
	        	 	data.submittals.forEach(function(trd){
		        	 	if(self.errors.indexOf(trd.tradeId) == -1 && trd.tradeId != 0){
		        	 		if(self.trade_ids.indexOf(trd.tradeId) >= 0){
				            index = self.trade_ids.indexOf(trd.tradeId);
				            self.trades[index]['total'] = self.trades[index]['total'] + 1;
				          }
				          else{
				            self.trades.push({
				              tradeId : trd.tradeId,
				              trade_name : trd.trade_name,
				              trade_icon : trd.trade_icon,
				              trade_task : trd.trade_task,
				              total : 1
				            });
				            self.trade_ids.push(trd.tradeId);
				          }

				          if(self.tradesType_names.indexOf(trd.trade_name) >= 0){
				            index = self.tradesType_names.indexOf(trd.trade_name);
				            self.tradeTypes[index]['total'] = self.tradeTypes[index]['total'] + 1;
				          }
				          else{
				            self.tradeTypes.push({
				              tradeId : 0,
				              trade_name : trd.trade_name,
				              trade_icon : trd.trade_icon,
				              trade_task : 'All '+trd.trade_name,
				              total : 1
				            });
				            self.tradesType_names.push(trd.trade_name);
				          }
				      	}
	        	 	});
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

  formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
  }

  seeAcItems(act_items){
    let modal = this.modalCtrl.create('ActionItemsPage', {action_items : act_items});
    modal.present();
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
  		this.sorted_transmittals = this.all_transmittals;
  		this.all_sorted_transmittals = this.all_transmittals;
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
      this.sorted_transmittals = [];
      this.all_sorted_transmittals = [];
	    this.all_transmittals.forEach(function(data){
	    	if(data.submittals.length > 0){
	    		data.submittals.forEach(function(trd){
	    		  if(self.filter_trades.indexOf(trd.tradeId) >= 0){
	    		  	if(!self.sorted_transmittals.includes(data)){
	    		  		self.sorted_transmittals.push(data);
	    		  	}
			      }
			      else{
			        if(self.filter_trade_names.indexOf(trd.trade_name) >= 0){
			          if(!self.sorted_transmittals.includes(data)){
	    		  		self.sorted_transmittals.push(data);
	    		  	  }
			        }
			      }
	    		})
	    	}
	    });
    this.all_sorted_transmittals = this.sorted_transmittals;
    } 
    console.log(this.sorted_transmittals)
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
      this.sorted_transmittals = this.all_transmittals;
      this.all_sorted_transmittals = this.all_transmittals;
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
      this.sorted_transmittals = this.all_transmittals;
      this.all_sorted_transmittals = this.all_transmittals;
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
 
  addTransmittal()
  {
  	this.isRefresh = '1';
  	this.navCtrl.push('AddtransmittalPage',{
  		jobId : this.jobId
  	});
  }

  editTransmittal(tid)
  {
  	this.isRefresh = '1';
  	this.navCtrl.push('EditTransmittalPage',{
  		jobId : this.jobId,
  		tid : tid
  	});
  }

 //  clickTrade()
	// {
	// 	var filterTradeId = localStorage.getItem('filterTradeId');
	// 	var previousId = localStorage.getItem('previousId');
	// 	if(filterTradeId == '0')
	// 	{
	// 		this.sorted_transmittals = this.all_transmittals;
	// 		localStorage.setItem('previousId',filterTradeId);
	// 		return false;
	// 	}
	// 	if(filterTradeId != previousId)
	// 	{
	// 		this.sorted_transmittals = [];
	// 		var sortedArray = [];
	// 		localStorage.setItem('previousId',filterTradeId);
	// 		this.all_transmittals.forEach(function(transmittal){
	// 			if(transmittal.tradeId == filterTradeId)
	// 			{
	// 				sortedArray.push(transmittal);
	// 			}
	// 		}); 
	// 		this.sorted_transmittals = sortedArray;
	// 	}
	// }

	// fetchTransmittals()
	// {
	// 	var filterTradeId = localStorage.getItem('filterTradeId');
	// 	if(filterTradeId == '0')
	// 	{
	// 		this.getTransmittals();
	// 	}
	// 	else
	// 	{
	// 		const loading = this.loadingCtrl.create({});
 //    		loading.present(); 
	// 		this.companyProvider.getTransmittals(this.jobId).subscribe((transmittals)=>{
	// 			this.all_transmittals = transmittals;
	// 			this.sorted_transmittals = [];
	// 		  	 if(this.all_transmittals.length > 0)
	// 		      {
	// 		      	var returnArr = [];
	// 		      	this.all_transmittals.forEach(function(data){
	// 		      		var obj = {
	// 						transmittal_number: data.transmittal_number,
	// 						subject: data.subject,
	// 						sender_id: data.sender_id,
	// 						rec_id: data.rec_id,
	// 						comments: data.comments,
	// 						submittals: (data.submittals == null || data.submittals == '') ? [] : JSON.parse(data.submittals), 
	// 						date_sent: data.date_sent,
	// 						isSent: data.isSent,
	// 						_id: data._id,
	// 						jobId: data.jobId,
	// 						tradeId: data.tradeId,
	// 						trade_name: data.trade_name,
	// 						trade_task: data.trade_task,
	// 						trade_icon: data.trade_icon
	// 		      		};
	// 		      		returnArr.push(obj);
	// 		      	});
	// 		      	this.all_transmittals = returnArr;
	// 				var sortedArray = [];
	// 				this.all_transmittals.forEach(function(transmittal){
	// 					if(transmittal.tradeId == filterTradeId)
	// 					{
	// 						sortedArray.push(transmittal);
	// 					}
	// 				}); 
	// 				this.sorted_transmittals = sortedArray;
	// 				loading.dismissAll();
	// 		      }
			  	
	// 		  },
	// 		    err => {
	// 		        loading.dismissAll();
	// 		        this.showTechnicalError();
	// 		    });
	// 	}
	// }

	transmittalDetails(tid)
	{
		this.isRefresh = '0';
		this.navCtrl.push('TransmittalDetailPage',{
			tid : tid
		})
	}

	copyTransmittal(tid){
		let confirm = this.alertCtrl.create({
	        title: 'Confirm',
	        message: 'Are you sure you want to copy this transmittal?',
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
					this.companyProvider.postData('copyTransmittal',{tid : tid}).subscribe((is_sent)=>{
						loading.dismissAll();
						if(is_sent.status == '1')
						{
							this.getTransmittals();
							let toast = this.toastCtrl.create({
					          message: 'Transmittal Copied Successfully.',
					          duration: 3000,
					          position: 'top',
					          cssClass: 'success'
					         });
					         toast.present();
						}
						else
						{
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

	deleteSub(subId,t_index,s_index){
		console.log(subId);
		console.log(t_index,s_index);
		let confirm = this.alertCtrl.create({
	        title: 'Confirm',
	        message: 'Are you sure you want to delete this submittal?',
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
					this.companyProvider.postData('deleteSubmittal',{subId : subId}).subscribe((is_sent)=>{
						loading.dismissAll();
						if(is_sent.status == '1')
						{
							this.sorted_transmittals[t_index]['submittals'].splice(s_index,1);
							let toast = this.toastCtrl.create({
					          message: 'Submittal deleted successfully.',
					          duration: 3000,
					          position: 'top',
					          cssClass: 'success'
					         });
					         toast.present();
						}
						else
						{
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

	sendTransmittal(tid,submittals,sender_id,rec_id)
	{
		this.isRefresh = '1';
		if(this.errors.indexOf(rec_id) >= 0)
		{
			let toast = this.toastCtrl.create({
	          message: 'Please add receiver in transmittal.',
	          duration: 3000,
	          position: 'top',
	          cssClass: 'danger'
	         });
	         toast.present();
		}
		else if(submittals.length == '0')
		{
			let toast = this.toastCtrl.create({
	          message: 'Please add atleast one submittal to send.',
	          duration: 3000,
	          position: 'top',
	          cssClass: 'danger'
	         });
	         toast.present();
		}
		else
		{
			let confirm = this.alertCtrl.create({
	        title: 'Confirm',
	        message: 'Are you sure you want to send?',
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
					this.companyProvider.sendTransmittal(tid,sender_id,rec_id,this.userName,this.baseUrl).subscribe((is_sent)=>{
						loading.dismissAll();
						if(is_sent.status == '1')
						{
							this.getTransmittals();
							let toast = this.toastCtrl.create({
					          message: 'Transmittal Sent Successfully.',
					          duration: 3000,
					          position: 'top',
					          cssClass: 'success'
					         });
					         toast.present();
						}
						else
						{
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
	}

	downloadTransmittal(transmittalId){
	  	let modal = this.modalCtrl.create('PdfTransmittalPage', {transmittalId : transmittalId});
	    	modal.present();
	  }

	submittalClicked(type,tradeId,item,sub){
		this.isRefresh = '0';
		if(type == 'contract'){
			this.navCtrl.push('ViewcontractPage',{
				jobId : this.jobId,
				tradeId : tradeId,
				bidId : item,
				page_type : '1'
			})
		}
		if(type != 'contract' && type != 'rfi' && type != 'request'){	
			var filePath = item;
			let modal = this.modalCtrl.create('ViewfilePage', {file_path : filePath, file_name : sub.item, created_at : sub.date_created, file_by : sub.by});
    		modal.present();
		}
		if(type == 'rfi'){	
			let modal = this.modalCtrl.create('ViewrfiPage', {RfiId : item, page_type : '1'});
    		modal.present();
		}
	}

  root(){
    this.navCtrl.setRoot('DashboardPage');
  };
  
  goToJobs(){
    this.navCtrl.push('ManagejobPage',{
    is_direct : '0'
    });
  };

  backToPage(){
    this.navCtrl.push('TradeDashboardPage',{
		jobId : this.jobId
	})
  }

}