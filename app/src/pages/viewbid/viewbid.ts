import { Component } from '@angular/core';
import { IonicPage, ViewController, NavController, NavParams, ModalController, AlertController,ToastController,LoadingController } from 'ionic-angular';
import { CompanyProvider } from '../../providers/company/company';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import * as $ from 'jquery';

@IonicPage()
@Component({
  selector: 'page-viewbid',
  templateUrl: 'viewbid.html',
  providers: [CompanyProvider]
})
export class ViewbidPage {
all_bids:any;
all_bid_ids:any = [];
sorted_bids:any;
jobId:any;
selected_bids:any;
APIURL:any;
filter:any;
isBrowser = localStorage.getItem('isBrowser');
baseUrl = localStorage.getItem('baseUrl');
userId = localStorage.getItem('userinfo');
user_name = localStorage.getItem('userName');
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
image_types:any;
  constructor(private transfer: FileTransfer, private file: File,public modalCtrl: ModalController, public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams, public companyProvider: CompanyProvider, public alertCtrl: AlertController, public toastCtrl: ToastController,public loadingCtrl: LoadingController) {
  	this.jobId = navParams.get('jobId');
  	this.selected_bids = [];
  	this.image_types = ['png','jpg','jpeg','gif'];
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
    this.APIURL = localStorage.getItem('APIURL');
  	
  }

  ionViewDidEnter(){
  	this.getBids();
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

  caclHeight(){
		var fixed_div = document.getElementById("calc_height_bids"+this.timestamp);
	    if(fixed_div != null){
	      var fixed_div_height = fixed_div.offsetHeight;
	      document.getElementById('fixed_height_bids'+this.timestamp).style.marginTop = fixed_div_height+'px';
	    }
  }

    addFilter(trade,filter){
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
  	this.filterTrades(filter);
  	this.saveFilters(this.filter_list,this.filter_trades,this.filter_trade_names);
  }

  filterTrades(filter = 'all'){

  	if(filter == 'all'){
  		filter = "['0','1','2','3','4']";
  	}
	var self = this;
  	this.sorted_bids = [];
	this.all_bids.forEach(function(data){
		if(self.filter_trades.length > 0 || self.filter_trade_names.length > 0){
			if(self.filter_trades.indexOf(data.tradeId) >= 0 && filter.indexOf(data.isAwarded) >= 0)
			{
				self.sorted_bids.push(data);
			}
			else{
				if(self.filter_trade_names.indexOf(data.trade_name) >= 0 && filter.indexOf(data.isAwarded) >= 0){
					self.sorted_bids.push(data);
				}
			}
		}
		else{
			if(filter.indexOf(data.isAwarded) >= 0)
			{
				self.sorted_bids.push(data);
			}
		}
	});
  }

  cancelFilter(trade,index,filter){
  	if(trade.tradeId == 0){
  		this.filter_trade_names.splice(this.filter_trade_names.indexOf(trade.trade_name),1);
  	}
  	else{
  		this.filter_trades.splice(this.filter_trades.indexOf(trade.tradeId),1);
  	}
  	this.filter_list.splice(index,1);
	this.filterTrades(filter);
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

  cancelAllFilters(type,filter){
    if(type == 'd'){
      this.filter_trade_names = [];
      this.removeAllFilters(type);
    }
    else{
      this.filter_trades = [];
      this.removeAllFilters(type);
    }
    this.filterTrades(filter);
    // if(this.filter_trades.length == 0 && this.filter_trade_names.length == 0){
    //   this.sorted_bids = this.all_bids;
    // }
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

  getBids(filter = 'all'){
  	this.trades = [];
	this.trade_ids = [];
	this.tradeTypes = [];
	this.tradesType_names = [];
	this.all_bid_ids = [];
  	var self = this,index;
  	const loading = this.loadingCtrl.create({});
    loading.present(); 
  	this.companyProvider.getMyBids(this.jobId).subscribe((bids)=>{
  		loading.dismissAll()
	  	this.all_bids = bids;
	  	if(this.all_bids.length > 0)
	      {
	      	var obj,obj1;
	      	var returnArr = [];
	      	this.all_bids.forEach(function(data){
	      		var all_cats = [],all_subm_cats = [];
	      		var all_cats_values = [];
	      		if(data.bid_breakdown != undefined){
		      		if(data.bid_breakdown.submitted_categories_vals.length > 0){
		      			data.bid_breakdown.submitted_categories_vals.forEach(function(cats){
		      				all_subm_cats.push(cats.cat);
		      				if(cats.success == true){
		      					all_cats.push(cats.cat);
		      					all_cats_values[cats.cat] = cats;
		      				}
		      			})
		      		}
	      		}
	      		var indicator = true;
	      		if(data.bid_breakdown != undefined){

	      			if(data.required_uploads.length > 0){
	      				data.required_uploads.forEach(function(req_upload){
	      					if(all_cats.indexOf(req_upload) == -1 && req_upload != 'Bid breakdown'){
	      						indicator = false;
	      					}
	      				});
	      			}

	      			if(data.required_uploads.indexOf('Bid breakdown') >= 0 && indicator == true && ((data.bid_breakdown.success == false) || (data.bid_breakdown.bid_breakdown_type == '0' && data.bid_breakdown.bid_breakdown_files.length == 0) || (data.bid_breakdown.bid_breakdown_type == '1' && (data.bid_breakdown.bid_breakdown_manual == '' || data.bid_breakdown.bid_breakdown_manual == null || data.bid_breakdown.bid_breakdown_manual == undefined)))){
	      				indicator = false;
	      			}
	      			if(data.bid_breakdown.submitted_categories_vals.length > 0 && indicator == true){
	      				var counter = 0;
	      				data.bid_breakdown.submitted_categories_vals.forEach(function(cat_val){
	      					if(cat_val.success == false && data.required_uploads.indexOf(cat_val.cat) >= 0){
	      						indicator = false;
	      					}
	      					counter = counter + 1;
	      					if(counter == data.bid_breakdown.submitted_categories_vals.length){
	      							do_action();
	      					}
	      				});
	      			}
	      			else{
	      				do_action();
	      			}
	      		}
	      		else{
	      			do_action();
	      		}

	      		function do_action(){
	      			obj1 = {
		      			bid_comments : data.bid_comments,
		      			bid_date : data.bid_date,
		      			files : (data.files == null || data.files == '') ? [] : JSON.parse(data.files), 
		      			bid_status : data.bid_status,
		      			posted_by : data.posted_by,
		      			posted_email : data.posted_email,
		      			bid : data._id,
		      			Iid : data.bidId,
		      			userId : data.userId,
		      			reply_comment : data.reply_comment,
		      			isAwarded : data.isAwarded,
		      			bid_breakdown : (data.bid_breakdown != undefined) ? data.bid_breakdown : {},
		      			all_cats : all_cats,
		      			all_subm_cats : all_subm_cats,
		      			all_cats_values : all_cats_values,
		      			indicator : indicator,
		      			notes : data.notes
		      		};
		      		obj = {
		      			trade_name : data.trade_name,
		      			trade_icon : data.trade_icon,
		      			trade_task : data.trade_task,
		      			tradeId : data.tradeId,
		      			jobId : data.jobId,
		      			Iid : data.bidId,
		      			isAwarded : data.isAwarded,
		      			uploader_categories : data.uploader_categories,
		      			required_uploads : data.required_uploads,
		      			all_bids : [obj1]
		      		};
		      		if(self.all_bid_ids.indexOf(data.tradeId) >= 0){
		      			var index = self.all_bid_ids.indexOf(data.tradeId);
		      			returnArr[index]['all_bids'].push(obj1);
		      		}
		      		else{
		      			self.all_bid_ids.push(data.tradeId);
		      			returnArr.push(obj);
		      		}
	      		}	      		
	      	});
	      	this.all_bids = returnArr;
	      }
	  	this.sorted_bids = this.all_bids;
	  	console.log(this.sorted_bids)
	  	if(this.all_bids != ''){
	  		this.all_bids.forEach(function(data){
	  			if(self.trade_ids.indexOf(data.tradeId) >= 0){
	  				index = self.trade_ids.indexOf(data.tradeId);
	  				self.trades[index]['total'] = self.trades[index]['total'] + 1;
	  			}
	  			else{
	  				self.trades.push({
	  					tradeId : data.tradeId,
	  					trade_name : data.trade_name,
	  					trade_icon : data.trade_icon,
	  					trade_task : data.trade_task,
	  					total : 1
	  				});
	  				self.trade_ids.push(data.tradeId);
	  			}

	  			if(self.tradesType_names.indexOf(data.trade_name) >= 0){
	  				index = self.tradesType_names.indexOf(data.trade_name);
	  				self.tradeTypes[index]['total'] = self.tradeTypes[index]['total'] + 1;
	  			}
	  			else{
	  				self.tradeTypes.push({
	  					tradeId : 0,
	  					trade_name : data.trade_name,
	  					trade_icon : data.trade_icon,
	  					trade_task : 'All '+data.trade_name,
	  					total : 1
	  				});
	  				self.tradesType_names.push(data.trade_name);
	  			}
	  		});
	  	}
	  	this.filterTrades(filter);
	  },
	    err => {
	        loading.dismissAll();
	        this.showTechnicalError();
	    });
  }

  goToTrade(jobId,tradeId){
  	this.navCtrl.push('EdittradePage', {
  		tradeId : tradeId, 
  		job_id : jobId, 
  		isEdit : '1',
  		from_bids : '1'
  	})
  }

  addNote(index,ind,notes,bid){
  	let modal = this.modalCtrl.create('NotesPage',{note: notes,bidId:bid});
	     modal.onDidDismiss(data => {
	      if(data != undefined && data != '' && data != null)
          {  
          	const loading = this.loadingCtrl.create({});
		    loading.present(); 
		  	this.companyProvider.addBidNotes(data).subscribe((bids)=>{
		  		loading.dismissAll();
		  		this.sorted_bids[index]['all_bids'][ind]['notes'] = data.note;
	      		let toast = this.toastCtrl.create({
		            message: 'Notes added successfully.',
		            duration: 3000,
		            position: 'top',
		            cssClass: 'success'
		           });
				toast.present(); 
			},
		    err => {
		    	loading.dismissAll();
		        this.showTechnicalError('1');
		    });
          }
      });
      modal.present();
  }

  notifyBidder(bidId,jobId,userId,email,name,bid_comments,bid_breakdown,required_uploads,all_cats){
  	var self = this;
    var leftOverCats = [];
  	if(required_uploads.length > 0){
		required_uploads.forEach(function(req_upload){
			if(all_cats.indexOf(req_upload) == -1 && req_upload != 'Bid breakdown'){
				if(leftOverCats.indexOf(req_upload) == -1){
					leftOverCats.push(req_upload);
				}
			}
		});
	}
	if(required_uploads.indexOf('Bid breakdown') >= 0  && ((bid_breakdown['success'] == false) || (bid_breakdown['bid_breakdown_type'] == '0' && bid_breakdown['bid_breakdown_files'].length == 0) || (bid_breakdown['bid_breakdown_type'] == '1' && (bid_breakdown['bid_breakdown_manual'] == '' || bid_breakdown['bid_breakdown_manual'] == null || bid_breakdown['bid_breakdown_manual'] == undefined)))){
		if(bid_breakdown['success'] != true){
			if(leftOverCats.indexOf('Bid breakdown') == -1){
				leftOverCats.push('Bid breakdown');
			}
		}
	}
	if(bid_breakdown['submitted_categories_vals'].length > 0){
		var counter = 0;
		bid_breakdown['submitted_categories_vals'].forEach(function(cat_val){
			if(cat_val.success == false && required_uploads.indexOf(cat_val.cat) >= 0){
				if(leftOverCats.indexOf(cat_val.cat) == -1){
					leftOverCats.push(cat_val.cat);
				}
			}
			counter = counter + 1;
			if(counter == bid_breakdown['submitted_categories_vals'].length){
				self.finalNotifyBidder(bidId,jobId,userId,email,name,bid_comments,leftOverCats);
			}
		});
	}
	else{
		self.finalNotifyBidder(bidId,jobId,userId,email,name,bid_comments,leftOverCats);
	}
  }

  downloadFiles(file,tradeId,main_file,index,ind,f_ind,direct_href){
	let modal = this.modalCtrl.create('ExportBidPage', {
		page_type : '1',
		direct_link : '1',
		direct_href : direct_href
	});
	modal.onDidDismiss(data => {
      if(data != undefined && data != '' && data != null){  
      	this.finalDownload(data,file,tradeId,main_file,index,ind,f_ind);
      }
  	});
    modal.present();
  }

  finalDownload(destination,old_path,tradeId,file,index,ind,f_ind){
	var msg,path;
	var file_type = (this.image_types.indexOf(old_path.split('.').pop(-1)) >= 0) ? '0' : '1';
	if(destination == 'local'){
		msg = 'File is downloading on your local device.';
		//download on local
		if(this.isBrowser == 'false'){
			this.downloadAndroid(this.APIURL +'/salvum/directory/bids_data/'+file,file);
		}
		else{
			// var unique_id = 'down_'+index+ind+f_ind;
			// console.log(unique_id)
			// $('#'+unique_id).trigger("click");
			this.downloadFile(file,tradeId);
		}
	}
	else if(destination == 'job'){
		path = 'directory/jobs_data/';
		msg = 'File has been saved to '+(file_type == '0' ? 'images' : 'docs')+' section of the job dashboard.';
	}
	else{
		path = 'directory/'+this.userId+'/files/level1/';
		msg = 'File has been saved to level1 of your file manager.';
	}
	if(destination != 'local'){	
		this.companyProvider.saveBidPdf({file_type: file_type, only_copy : '1', old_path : old_path, path : path, type : destination,jobId : this.jobId, tradeId : tradeId}).subscribe((result)=>{
			let toast = this.toastCtrl.create({
			    message: msg,
			    duration: 3000,
			    position:'top',
			    cssClass: 'success'
		   	});
		  	toast.present();
		},
	    err => {
	        let toast = this.toastCtrl.create({
			    message: 'Technical error,Plz try after some time.',
			    duration: 3000,
			    position:'top',
			    cssClass: 'danger'
		   	});
		  	toast.present();
	    });
	}
  }

  finalNotifyBidder(bidId,jobId,userId,email,name,bid_comments,leftOverCats){
  	const loading = this.loadingCtrl.create({});
    loading.present(); 
  	this.companyProvider.postData('notifyBidder',{bidId: bidId, jobId:jobId, userId: userId,email:email,name:name,bid_comments:bid_comments, from_user: this.user_name,leftOverCats:leftOverCats}).subscribe((result)=>{
  		loading.dismissAll();
  		if(result.status == 1){
	  		let toast = this.toastCtrl.create({
	            message: 'Notification sent successfully.',
	            duration: 3000,
	            position: 'top',
	            cssClass: 'success'
	           });
			toast.present(); 
		}
		else{
			let toast = this.toastCtrl.create({
	            message: 'Error, Please try later.',
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

  updateBidBreakdown(bidId,bid_breakdown){
  	this.companyProvider.postData('updateBidBreakdown',{bidId: bidId, bid_breakdown: JSON.stringify(bid_breakdown)}).subscribe((result)=>{
  		//updated
	});
  }

  breakdownChecked(event,index,ind,bidId,catname){
  	if(event.checked == true){
  		this.sorted_bids[index]['all_bids'][ind]['bid_breakdown']['success'] = true;
  		this.sorted_bids[index]['all_bids'][ind]['bid_breakdown']['isAdmin'] = true;
  	}
  	else{
  		this.sorted_bids[index]['all_bids'][ind]['bid_breakdown']['success'] = false;
  		this.sorted_bids[index]['all_bids'][ind]['bid_breakdown']['isAdmin'] = true;
  	}
  	this.changeIndicator(index,ind);
  }

  catChecked(event,index,ind,bidId,catname){
  	var cat_ind;
  	if(event.checked == true){
  		if(this.sorted_bids[index]['all_bids'][ind]['all_cats'].indexOf(catname) >= 0){	
  			this.sorted_bids[index]['all_bids'][ind]['all_cats_values'][catname]['success'] = true;
  			this.sorted_bids[index]['all_bids'][ind]['all_cats_values'][catname]['isAdmin'] = true;
  		}
  		else{
  			this.sorted_bids[index]['all_bids'][ind]['all_cats'].push(catname);
  			this.sorted_bids[index]['all_bids'][ind]['all_cats_values'][catname] = {success : true, isAdmin : true};
  		}

  		if(this.sorted_bids[index]['all_bids'][ind]['all_subm_cats'].indexOf(catname) >= 0){
  			cat_ind = this.sorted_bids[index]['all_bids'][ind]['all_subm_cats'].indexOf(catname);
  			this.sorted_bids[index]['all_bids'][ind]['bid_breakdown']['submitted_categories_vals'][cat_ind]['success'] = true;
  			this.sorted_bids[index]['all_bids'][ind]['bid_breakdown']['submitted_categories_vals'][cat_ind]['isAdmin'] = true;
  		}
  		else{
  			this.sorted_bids[index]['all_bids'][ind]['all_subm_cats'].push(catname);
  			this.sorted_bids[index]['all_bids'][ind]['bid_breakdown']['submitted_categories_vals'].push({success : true, isAdmin : true, cat: catname});
  		}
  	}
  	else{
  		cat_ind = this.sorted_bids[index]['all_bids'][ind]['all_cats'].indexOf(catname);
  		if(this.sorted_bids[index]['required_uploads'].indexOf(catname) >= 0){
	  		this.sorted_bids[index]['all_bids'][ind]['all_cats_values'][catname]['success'] = false;
			this.sorted_bids[index]['all_bids'][ind]['all_cats_values'][catname]['isAdmin'] = true;
		}
		else{
			this.sorted_bids[index]['all_bids'][ind]['all_cats_values'][catname]['isAdmin'] = true;
		}

		if(this.sorted_bids[index]['all_bids'][ind]['all_subm_cats'].indexOf(catname) >= 0){
  			cat_ind = this.sorted_bids[index]['all_bids'][ind]['all_subm_cats'].indexOf(catname);
  			this.sorted_bids[index]['all_bids'][ind]['bid_breakdown']['submitted_categories_vals'][cat_ind]['success'] = false;
			this.sorted_bids[index]['all_bids'][ind]['bid_breakdown']['submitted_categories_vals'][cat_ind]['isAdmin'] = true;
  		}
  	}

  	this.changeIndicator(index,ind);
  	this.updateBidBreakdown(bidId,this.sorted_bids[index]['all_bids'][ind]['bid_breakdown']);
  }

  changeIndicator(index,ind){
  	var self = this;
  	var indicator = true;
  	if(this.sorted_bids[index]['required_uploads'].length > 0){
		this.sorted_bids[index]['required_uploads'].forEach(function(req_upload){
			if(self.sorted_bids[index]['all_bids'][ind]['all_cats'].indexOf(req_upload) == -1 && req_upload != 'Bid breakdown'){
				indicator = false;
			}
		});
	}
	if(this.sorted_bids[index]['required_uploads'].indexOf('Bid breakdown') >= 0 && indicator == true && ((this.sorted_bids[index]['all_bids'][ind]['bid_breakdown']['success'] == false) || (this.sorted_bids[index]['all_bids'][ind]['bid_breakdown']['bid_breakdown_type'] == '0' && this.sorted_bids[index]['all_bids'][ind]['bid_breakdown']['bid_breakdown_files'].length == 0) || (this.sorted_bids[index]['all_bids'][ind]['bid_breakdown']['bid_breakdown_type'] == '1' && (this.sorted_bids[index]['all_bids'][ind]['bid_breakdown']['bid_breakdown_manual'] == '' || this.sorted_bids[index]['all_bids'][ind]['bid_breakdown']['bid_breakdown_manual'] == null || this.sorted_bids[index]['all_bids'][ind]['bid_breakdown']['bid_breakdown_manual'] == undefined)))){
		if(this.sorted_bids[index]['all_bids'][ind]['bid_breakdown']['success'] != true){
			indicator = false;
		}
	}
	if(this.sorted_bids[index]['all_bids'][ind]['bid_breakdown']['submitted_categories_vals'].length > 0 && indicator == true){
		var counter = 0;
		this.sorted_bids[index]['all_bids'][ind]['bid_breakdown']['submitted_categories_vals'].forEach(function(cat_val){
			if(cat_val.success == false && self.sorted_bids[index]['required_uploads'].indexOf(cat_val.cat) >= 0){
				indicator = false;
			}
			counter = counter + 1;
			if(counter == self.sorted_bids[index]['all_bids'][ind]['bid_breakdown']['submitted_categories_vals'].length){
					self.sorted_bids[index]['all_bids'][ind]['indicator'] = indicator;
			}
		});
	}
	else{
		this.sorted_bids[index]['all_bids'][ind]['indicator'] = indicator;
	}
	//console.log(this.sorted_bids[index])
  }


 //  filterBids(filter)
 //  {
 //  	console.log(filter)
 //  	var self = this;
 //  	this.sorted_bids = [];
	// this.all_bids.forEach(function(data){
	// 	if(self.filter_trades.indexOf(data.tradeId) >= 0 && filter.indexOf(data.isAwarded) >= 0)
	// 	{
	// 		self.sorted_bids.push(data);
	// 	}
	// 	else{
	// 		if(self.filter_trade_names.indexOf(data.trade_name) >= 0 && filter.indexOf(data.isAwarded) >= 0){
	// 			self.sorted_bids.push(data);
	// 		}
	// 	}
	// });
 //  }

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

  downloadFile(file_name,tradeId)
	{
		var data = {
			jobId : this.jobId,
			tradeId : tradeId,
			name : file_name
		};
		this.companyProvider.addDownloads(data).subscribe((add_download)=>{
			let toast = this.toastCtrl.create({
	            message: 'File saved to your downloads.',
	            duration: 3000,
	            position: 'top',
	            cssClass: 'success'
	           });
			toast.present(); 
		},
	    err => {
	        this.showTechnicalError('1');
	    });
	}

  clickTrade()
	{
		var filterTradeId = localStorage.getItem('filterTradeId');
		var previousId = localStorage.getItem('previousId');
		if(filterTradeId == '0')
		{
			this.sorted_bids = this.all_bids;
			localStorage.setItem('previousId',filterTradeId);
			return false;
		}
		if(filterTradeId != previousId)
		{
			this.sorted_bids = [];
			var sortedArray = [];
			localStorage.setItem('previousId',filterTradeId);
			this.all_bids.forEach(function(bid){
				if(bid.tradeId == filterTradeId)
				{
					sortedArray.push(bid);
				}
			}); 
			this.sorted_bids = sortedArray;
		}
	}

	addManualBids()
	{
		let modal = this.modalCtrl.create('AddbidPage',{jobId: this.jobId});
	     modal.onDidDismiss(data => {
	      if(data != undefined && data != '')
          {  
          	if(data == '1')
          	{
          		let toast = this.toastCtrl.create({
		            message: 'Bid has been added successfully.',
		            duration: 3000,
		            position: 'top',
		            cssClass: 'success'
		           });
				toast.present(); 
				// this.fetchBids();
				this.getBids(this.filter);
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
          }
      });
          modal.present();
	}

	// fetchBids()
	// {
	// 	var filterTradeId = localStorage.getItem('filterTradeId');
	// 	if(filterTradeId == '0')
	// 	{
	// 		this.getBids();
	// 	}
	// 	else
	// 	{
	// 		const loading = this.loadingCtrl.create({});
 //    		loading.present(); 

 //    		this.companyProvider.getMyBids(this.jobId).subscribe((bids)=>{
	// 	  	this.all_bids = bids;
	// 	  	if(this.all_bids.length > 0)
	// 	      {
	// 	      	var returnArr = [];
	// 	      	this.all_bids.forEach(function(data){
	// 	      		var obj = {
	// 	      			bid_comments : data.bid_comments,
	// 	      			bid_date : data.bid_date,
	// 	      			files : (data.files == null || data.files == '') ? [] : JSON.parse(data.files), 
	// 	      			bid_status : data.bid_status,
	// 	      			trade_name : data.trade_name,
	// 	      			trade_icon : data.trade_icon,
	// 	      			tradeId : data.tradeId,
	// 	      			jobId : data.jobId,
	// 	      			posted_by : data.posted_by,
	// 	      			posted_email : data.posted_email,
	// 	      			bid : data._id,
	// 	      			Iid : data.bidId,
	// 	      			reply_comment : data.reply_comment,
	// 	      			isAwarded : data.isAwarded
	// 	      		};
	// 	      		returnArr.push(obj);
	// 	      	});
	// 	      	this.all_bids = returnArr;
	// 	      }

	// 	  	this.sorted_bids = [];
	// 		var sortedArray = [];
	// 		localStorage.setItem('previousId',filterTradeId);
	// 		this.all_bids.forEach(function(bid){
	// 			if(bid.tradeId == filterTradeId)
	// 			{
	// 				sortedArray.push(bid);
	// 			}
	// 		}); 
	// 		loading.dismissAll()
	// 		this.sorted_bids = sortedArray;
	// 	  },
	// 	    err => {
	// 	        loading.dismissAll();
	// 	        this.showTechnicalError();
	// 	    });
	// 	}
	// }

	insertToArray(event,bidId){
	if(event.target.checked == true)
	{
		this.selected_bids.push(bidId);
	}
	else
	{
		this.removeArray(this.selected_bids, bidId);
	}
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

	deleteBids()
	{
		if(this.selected_bids.length > 0)
		{
			let confirm = this.alertCtrl.create({
		      title: 'Are you sure?',
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
		            this.companyProvider.deleteBids({'bidIds' : this.selected_bids}).subscribe((deleted)=>{
		              if(deleted.status == 1)
		              {
	                    loading.dismissAll()
	                    let toast = this.toastCtrl.create({
	                        message: 'Bids deleted.',
	                        duration: 3000,
	                        position: 'top',
	                        cssClass: 'success'
	                       });
	                       toast.present(); 
	                       this.selected_bids = [];
	                       // this.fetchBids();
	                       this.getBids(this.filter);
		              }
		              else
		              {
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
		else
		{
			let toast = this.toastCtrl.create({
                message: 'Please select atleast one checkbox.',
                duration: 3000,
                position: 'top',
                cssClass: 'danger'
               });
               toast.present(); 
		}
		
	}

	awardJob(InvId,bidId,jobId,tradeId,toUser,to_name,to_email)
	{
		let confirm = this.alertCtrl.create({
	      title: 'Are you sure?',
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
	            this.companyProvider.awardJob(InvId,bidId,'1',jobId,tradeId,this.userId,toUser,to_email,to_name,this.user_name,this.baseUrl).subscribe((award)=>{
	              if(award.status == 1)
	              {
	                loading.dismissAll()
	                let toast = this.toastCtrl.create({
	                    message: 'Job has been awarded successfully.',
	                    duration: 3000,
	                    position: 'top',
	                    cssClass: 'success'
	                   });
	                   toast.present(); 
	                   // this.fetchBids();
	                   this.getBids(this.filter);
	              }
	              else if(award.status == 2)
	              {
	                loading.dismissAll()
	                let toast = this.toastCtrl.create({
	                    message: 'You have alreday awarded job under this trade.',
	                    duration: 3000,
	                    position: 'top',
	                    cssClass: 'danger'
	                   });
	                   toast.present(); 
	              }
	              else
	              {
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

  signContract(Iid,Bid,tradeId)
  {
  	this.navCtrl.push('AddcontractPage', {
  		InvId : Iid, 
  		BidId : Bid,
  		jobId : this.jobId,
  		tradeId : tradeId
  	});
  }

  	downloadPdf(InvId,tradeId){
		let modal = this.modalCtrl.create('PdfPage', {
			jobId : this.jobId,
			tradeId : tradeId,
			bidId : InvId
		});
	    modal.present();
	}

  	exportPdf(bid,comment,files,breakdown,posted_by,posted_email,tradeId){
  		bid.posted_by = posted_by;
  		bid.posted_email = posted_email;
		let modal = this.modalCtrl.create('ExportBidPage', {
			jobId : this.jobId,
			tradeId : tradeId,
			bid : bid,
			comment : comment,
			files : files,
			bid_breakdown : breakdown,
		});
	    modal.present();
	}

  	cancelContract(InvId,BidId){
  	let confirm = this.alertCtrl.create({
      title: 'Are you sure?',
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
            this.companyProvider.cancelContract(InvId,BidId).subscribe((canceled)=>{
              if(canceled.status == 1)
              {
                loading.dismissAll()
                let toast = this.toastCtrl.create({
                    message: 'Contract has been canceled.',
                    duration: 3000,
                    position: 'top',
                    cssClass: 'success'
                   });
                   toast.present(); 
                   // this.fetchBids();
                   this.getBids(this.filter);
              }
              else
              {
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

  replyBid(userId,tradeId,bidId){ 
  	if(userId == undefined || userId == null || userId == ''){
  		$(".comment_box").hide();
  		$(".comment_"+bidId).show();
  	}
  	else{
  		this.navCtrl.push('ComposePage',{
  			userId : userId,
  			tradeId : tradeId,
  			jobId : this.jobId,
  			bid_reply : '1', 
  		})
  	}
  }

  sendReply(bidId,reply_comments,index,posted_email,name,Iid){
  	if(reply_comments != '' && reply_comments != null && reply_comments != undefined){
  		var baseUrl = localStorage.getItem('baseUrl');
  		this.sorted_bids[index].reply_comment = reply_comments;
  		this.companyProvider.replyComment(bidId,reply_comments,posted_email,name,Iid,baseUrl).subscribe((result)=>{
  			let toast = this.toastCtrl.create({
	            message: 'Replied successfully.',
	            duration: 3000,
	            position: 'top',
	            cssClass: 'success'
	           });
	           toast.present();
  		},
	    err => {
	        this.showTechnicalError('1');
	    });
  	}
  	else{
  		let toast = this.toastCtrl.create({
            message: 'Please enter reply.',
            duration: 3000,
            position: 'top',
            cssClass: 'danger'
           });
           toast.present(); 
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
