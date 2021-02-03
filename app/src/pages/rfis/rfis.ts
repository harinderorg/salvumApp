import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController,ToastController,LoadingController, ViewController} from 'ionic-angular';
import { CompanyProvider } from '../../providers/company/company';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { PdfmakeService } from 'ng-pdf-make/pdfmake/pdfmake.service';
import { Cell, Row, Table } from 'ng-pdf-make/objects/table';
import * as pdfMake from 'pdfmake/build/pdfmake.js';
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
@IonicPage()
@Component({
  selector: 'page-rfis',
  templateUrl: 'rfis.html',
  providers: [CompanyProvider]
})
export class RfisPage { 
all_rfis:any;
pre_sorted_rfis:any;
all_pre_sorted_rfis:any;
all_post_sorted_rfis:any;
post_sorted_rfis:any;
filtered_pre_rfis:any;
filtered_post_rfis:any;
jobId:any;
searchTerm_pre:any;
searchTerm_post:any;
from_smail:any;
APIURL:any;
timestamp:any;
selected_rfis:any = [];
selected_rfis_download:any = [];
selected_rfiIds:any = [];
my_tab: string = "pre_awarded";
order_post: string = 'orders';
order: string = 'orders';
reverse_post: boolean = false;
reverse: boolean = false;
isBrowser = localStorage.getItem('isBrowser');
baseUrl = localStorage.getItem('baseUrl');
userId = localStorage.getItem('userinfo');
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
  constructor(private transfer: FileTransfer, private file: File,private pdfmake: PdfmakeService, public modalCtrl: ModalController, public navCtrl: NavController, public navParams: NavParams, public companyProvider: CompanyProvider, public alertCtrl: AlertController, public toastCtrl: ToastController,public loadingCtrl: LoadingController, public viewCtrl: ViewController) {
	  	this.jobId = navParams.get('jobId');
	  	this.from_smail = navParams.get('from_smail');
	  	this.APIURL = localStorage.getItem('APIURL');
	  	this.timestamp = new Date().getTime();
	  	this.image_types = ['png','jpg','jpeg','gif'];

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
		this.getRFIs();
		this.selected_rfis = [];
		this.selected_rfiIds = [];
	}

	getRFIs(){
		this.trades = [];
		this.trade_ids = [];
		this.tradeTypes = [];
		this.tradesType_names = [];
	  	var self = this,index;
		const loading = this.loadingCtrl.create({});
		loading.present(); 
			this.companyProvider.getRFIs(this.jobId).subscribe((rfis)=>{
				loading.dismissAll()
		  	this.all_rfis = rfis;
		  	if(this.all_rfis.length > 0)
		      {
				var all_records = this.all_rfis.length + 1000;
		      	var pre_returnArr = [];
		      	var post_returnArr = [];
		      	var all_returnArr = [];
		      	this.all_rfis.forEach(function(data){
					all_records = all_records - 1;
		      		var obj = {
						trade_name:  data.trade_name,
						trade_icon:  data.trade_icon,
						name: data.name,
						email: data.email,
						image: data.image,
						company: data.company,
						tradeId: data.tradeId,
						inviteId: data.inviteId,
						question: data.question,
						question_reply: data.question_reply,
						question_engg: data.question_engg,
						answer: data.answer,
						answer_files: data.answer_files,
						question_files:data.question_files,
						isAnswered: data.isAnswered,
						isAsked: data.isAsked,
						engg_answer: data.engg_answer,
						engg_answer_files: data.engg_answer_files,
						// answer_files: (data.answer_files == null || data.answer_files == '') ? [] : JSON.parse(data.answer_files),
						// question_files:(data.question_files == null || data.question_files == '') ? [] : JSON.parse(data.question_files),
						isAwarded:data.isAwarded,
						question_date: data.question_date,
						answer_date: data.answer_date,
						orders: data.orders,
						userId: data.userId,
						jobId: data.jobId,
						_id: data._id,
						number: all_records 
		      		};
		      		all_returnArr.push(obj);
		      		if(data.isAwarded == '1')
		      		{
		      			post_returnArr.push(obj);
		      		}
		      		else
		      		{
		      			pre_returnArr.push(obj);
		      		}
		      		//filters
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
		      	this.all_rfis = all_returnArr;
		      }
		  	this.all_pre_sorted_rfis = pre_returnArr; 
		  	this.pre_sorted_rfis = pre_returnArr; 
		  	this.all_post_sorted_rfis = post_returnArr; 
		  	this.post_sorted_rfis = post_returnArr; 
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
  		this.pre_sorted_rfis = this.all_pre_sorted_rfis;
  		this.post_sorted_rfis = this.all_post_sorted_rfis;
  		this.getItems(this.searchTerm_pre,'0');
  		this.getItems(this.searchTerm_post,'1');
  	}
  	this.saveFilters(this.filter_list,this.filter_trades,this.filter_trade_names);
  }

  filterTrades(){
  	if(this.filter_trades.length > 0 || this.filter_trade_names.length > 0){
  		var self = this;
	  	this.pre_sorted_rfis = [];
	  	this.post_sorted_rfis = [];
		this.all_pre_sorted_rfis.forEach(function(data){
			if(self.filter_trades.indexOf(data.tradeId) >= 0)
			{
				self.pre_sorted_rfis.push(data);
			}
			else{
				if(self.filter_trade_names.indexOf(data.trade_name) >= 0){
					self.pre_sorted_rfis.push(data);
				}
			}
		});
		this.all_post_sorted_rfis.forEach(function(data){
			if(self.filter_trades.indexOf(data.tradeId) >= 0)
			{
				self.post_sorted_rfis.push(data);
			}
			else{
				if(self.filter_trade_names.indexOf(data.trade_name) >= 0){
					self.post_sorted_rfis.push(data);
				}
			}
		});
		this.filtered_pre_rfis = this.pre_sorted_rfis;
		this.filtered_post_rfis = this.post_sorted_rfis;
  	} 
  	this.getItems(this.searchTerm_pre,'0');
  	this.getItems(this.searchTerm_post,'1');
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
  		this.pre_sorted_rfis = this.all_pre_sorted_rfis;
  		this.post_sorted_rfis = this.all_post_sorted_rfis;
  		this.getItems(this.searchTerm_pre,'0');
  		this.getItems(this.searchTerm_post,'1');
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
		this.pre_sorted_rfis = this.all_pre_sorted_rfis;
		this.post_sorted_rfis = this.all_post_sorted_rfis;
		this.getItems(this.searchTerm_pre,'0');
		this.getItems(this.searchTerm_post,'1');
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

	deleteRFI(RfiId){
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
		        this.companyProvider.deleteRFIs(RfiId).subscribe((deleted)=>{
		          if(deleted.status == 1)
		          {
		                loading.dismissAll()
		                let toast = this.toastCtrl.create({
		                    message: 'RFI deleted.',
		                    duration: 3000,
		                    cssClass: 'success',
		                    position: 'top'
		                   });
		                   toast.present(); 
		                   this.getRFIs();
		          }
		          else
		          {
		              loading.dismissAll()
		                let toast = this.toastCtrl.create({
		                    message: 'Error, plz try later.',
		                    duration: 3000,
		                    cssClass: 'danger',
		                    position: 'top'
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

	addManualRFIs(){
		this.navCtrl.push('AddrfiPage',{
			jobId: this.jobId
		})
		// let modal = this.modalCtrl.create('AddrfiPage',{jobId: this.jobId});
	 //     modal.onDidDismiss(data => {
	 //      if(data != undefined && data != '')
  //         {  
  //         	if(data == '1'){
  //         		let toast = this.toastCtrl.create({
		//             message: 'RFI has been added successfully.',
		//             duration: 3000,
		//             position: 'top',
		//             cssClass: 'success'
		//            });
		// 		toast.present(); 
		// 		this.fetchRFIs();
  //         	}
  //         	else{
  //         		let toast = this.toastCtrl.create({
		//             message: 'Error, plz try later.',
		//             duration: 3000,
		//             position: 'top',
		//             cssClass: 'danger'
		//            });
		// 		toast.present(); 
  //         	}
  //         }
  //     	});
  //       modal.present();
	}

	sendRFI(question,RfiId,userId,jobId,tradeId,inviteId){
		this.navCtrl.push('SendrfiPage',{
			question : question,
			RfiId : RfiId,
			userId : userId,
			jobId : jobId,
			tradeId : tradeId,
			inviteId : inviteId
		})
	}

	viewRFI(rfi){
		let modal = this.modalCtrl.create('ViewrfiPage',{
			rfi : rfi
		});
		modal.present();
	}

	viewAns(rfi){
		let modal = this.modalCtrl.create('InfoPage',{
			info : rfi
		});
		modal.present();
	}

	reorderItems(indexes,isAwarded){ 
		var sortedArr = [];
		if(isAwarded == '1')
		{
			let element = this.post_sorted_rfis[indexes.from];
		       this.post_sorted_rfis.splice(indexes.from, 1);
		       this.post_sorted_rfis.splice(indexes.to, 0, element);
		       sortedArr = this.post_sorted_rfis;
		       this.callReOrder(sortedArr);
		}
		else
		{
			let element = this.pre_sorted_rfis[indexes.from];
		       this.pre_sorted_rfis.splice(indexes.from, 1);
		       this.pre_sorted_rfis.splice(indexes.to, 0, element);
		       sortedArr = this.pre_sorted_rfis;
		       this.callReOrder(sortedArr);
		}
	}

	callReOrder(sortedArr){
		const loading = this.loadingCtrl.create({});
		loading.present();
			this.companyProvider.reorderRFIs(sortedArr).subscribe((rfis)=>{
		   	loading.dismissAll();
		   	this.getRFIs();
		  	let toast = this.toastCtrl.create({
		        message: 'RFIs reordered successfully.',
		        duration: 3000,
		        position:'top',
		        cssClass: 'success'
		       });
			toast.present(); 
		  },
		    err => {
		        loading.dismissAll();
		        this.showTechnicalError('1');
		    });
	}

 //    fetchRFIs(){
	// 	var filterTradeId = localStorage.getItem('filterTradeId');
	// 	if(filterTradeId == '0'){
	// 		this.getRFIs();
	// 	}
	// 	else{
	// 		const loading = this.loadingCtrl.create({});
 //    		loading.present(); 
	// 		this.companyProvider.getRFIs(this.jobId).subscribe((rfis)=>{
	//   		loading.dismissAll()
	// 	  	this.all_rfis = rfis;
	// 	  	if(this.all_rfis.length > 0)
	// 	      {
	// 	      	var pre_returnArr = [];
	// 	      	var post_returnArr = [];
	// 	      	var all_returnArr = [];
	// 	      	this.all_rfis.forEach(function(data){
	// 	      		if(data.tradeId = filterTradeId)
	// 	      		{
	// 	      			var obj = {
	// 						trade_name:  data.trade_name,
	// 						trade_icon:  data.trade_icon,
	// 						name: data.name,
	// 						email: data.email,
	// 						image: data.image,
	// 						company: data.company,
	// 						tradeId: data.tradeId,
	// 						inviteId: data.inviteId,
	// 						question: data.question,
	// 						question_reply: data.question_reply,
	// 						question_engg: data.question_engg,
	// 						answer: data.answer,
	// 						isAnswered: data.isAnswered,
	// 						isAsked: data.isAsked,
	// 						engg_answer: data.engg_answer,
	// 						engg_answer_files: data.engg_answer_files,
	// 						// answer_files: (data.answer_files == null || data.answer_files == '') ? [] : JSON.parse(data.answer_files),
	// 						answer_files: data.answer_files,
	// 						question_files:data.question_files,
	// 						// question_files:(data.question_files == null || data.question_files == '') ? [] : JSON.parse(data.question_files),
	// 						isAwarded:data.isAwarded,
	// 						question_date: data.question_date,
	// 						answer_date: data.answer_date,
	// 						orders: data.orders,
	// 						userId: data.userId,
	// 						jobId: data.jobId,
	// 						_id: data._id
	// 		      		};
	// 		      		all_returnArr.push(obj);
	// 		      		if(data.isAwarded == '1')
	// 		      		{
	// 		      			post_returnArr.push(obj);
	// 		      		}
	// 		      		else
	// 		      		{
	// 		      			pre_returnArr.push(obj);
	// 		      		}
	// 	      		}
	// 	      	});
	// 	      	this.all_rfis = all_returnArr;
	// 	      }
	// 	  	this.all_pre_sorted_rfis = pre_returnArr; 
	// 	  	this.pre_sorted_rfis = pre_returnArr; 
	// 	  	this.all_post_sorted_rfis = post_returnArr; 
	// 	  	this.post_sorted_rfis = post_returnArr; 
	// 	  },
	// 	    err => {
	// 	        loading.dismissAll();
	// 	        this.showTechnicalError();
	// 	    });
	// 	}
	// }

	showOriginalQues(index,type){
		if(type == 'pre'){
			this.pre_sorted_rfis[index].show_modified_ques = true;
		}
		if(type == 'post'){
			this.post_sorted_rfis[index].show_modified_ques = true;
		}
	}

	hideOriginalQues(index,type){
		if(type == 'pre'){
			this.pre_sorted_rfis[index].show_modified_ques = false;
		}
		if(type == 'post'){
			this.post_sorted_rfis[index].show_modified_ques = false;
		}
	}

	getItems(val,isAwarded) {
		if(isAwarded == '1')
		{
			if(this.filter_trades.length > 0 || this.filter_trade_names.length > 0){
				this.post_sorted_rfis=this.filtered_post_rfis;
			}
			else{
				this.post_sorted_rfis=this.all_post_sorted_rfis;
			}
			
			// let val = ev.target.value;
			if (val && val.trim() != '') {
			  this.post_sorted_rfis = this.post_sorted_rfis.filter((item) => {
			     return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1 || item.company.toLowerCase().indexOf(val.toLowerCase()) > -1 || item.question.toLowerCase().indexOf(val.toLowerCase()) > -1);
			   });
			  }
		}
		else
		{ 
			if(this.filter_trades.length > 0 || this.filter_trade_names.length > 0){
				this.pre_sorted_rfis=this.filtered_pre_rfis;
			}
			else{
				this.pre_sorted_rfis=this.all_pre_sorted_rfis;
			}
			// let val = ev.target.value;
			if (val && val.trim() != '') {
			  this.pre_sorted_rfis = this.pre_sorted_rfis.filter((item) => {
			     return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1 || item.company.toLowerCase().indexOf(val.toLowerCase()) > -1 || item.question.toLowerCase().indexOf(val.toLowerCase()) > -1);
			   });
			  }
		}
	}

	preDateFilter(filterValue){
		if(filterValue == '0')
		{
			this.order = 'orders';
			this.reverse = false;
		}
		else
		{
			this.order = 'question_date';
			this.reverse = filterValue == 'asc' ? false : true;
		}
	}

	postDateFilter(filterValue){
		if(filterValue == '0')
		{
			this.order_post = 'orders';
			this.reverse_post = false;
		}
		else
		{
			this.order_post = 'question_date';
			this.reverse_post = filterValue == 'asc' ? false : true;
		}
	}

 //  	clickTrade(){
	// 	var filterTradeId = localStorage.getItem('filterTradeId');
	// 	var previousId = localStorage.getItem('previousId');
	// 	if(filterTradeId == '0')
	// 	{
	// 		this.pre_sorted_rfis = this.all_pre_sorted_rfis;
	// 		this.post_sorted_rfis = this.all_post_sorted_rfis;
	// 		localStorage.setItem('previousId',filterTradeId);
	// 		return false;
	// 	}
	// 	if(filterTradeId != previousId)
	// 	{
	// 		this.pre_sorted_rfis = [];
	// 		this.post_sorted_rfis = [];
	// 		var pre_sortedArray = [];
	// 		var post_sortedArray = [];
	// 		localStorage.setItem('previousId',filterTradeId);
	// 		this.all_rfis.forEach(function(rfis){
	// 			if(rfis.tradeId == filterTradeId)
	// 			{
	// 				if(rfis.isAwarded == '1')
	// 				{
	// 					post_sortedArray.push(rfis);
	// 				}
	// 				else
	// 				{
	// 					pre_sortedArray.push(rfis);
	// 				}
	// 			}
	// 		}); 
	// 		this.pre_sorted_rfis = pre_sortedArray;
	// 		this.post_sorted_rfis = post_sortedArray;
	// 	}
	// }

	askEngg(){
		if(this.selected_rfiIds.length > 0){
			this.navCtrl.push('AskEnggPage',{
				rfiIds : this.selected_rfiIds,
				rfis : this.selected_rfis,
				jobId : this.jobId
			});
		}
		else{
			let toast = this.toastCtrl.create({
		        message: 'Please select atleast one RFI to ask Engg.',
		        duration: 3000,
		        position:'top',
		        cssClass: 'danger'
		       });
			toast.present(); 
		}
	}

	tabChanged(){
		this.selected_rfis = [];
  		this.selected_rfiIds = [];
  		// this.searchTerm = '';
	}

	caclHeight(){
		var fixed_div = document.getElementById("calc_height_rfi"+this.timestamp);
	    if(fixed_div != null){
	      var fixed_div_height = fixed_div.offsetHeight;
	      document.getElementById('fixed_height_rfi'+this.timestamp).style.marginTop = fixed_div_height+'px';
	    }
	}

	printFinal(printContent){
        const WindowPrt = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
        WindowPrt.document.write(printContent);
        WindowPrt.document.close();
        WindowPrt.focus();
        setTimeout(function() {
            WindowPrt.print();
            WindowPrt.close();
        }, 250);
    }

	printRFIs(){
		if(this.selected_rfis_download.length > 0){
			var printContent = '<img class="logo-desktop" height="50px" text-center src="'+this.baseUrl+'/assets/images/logo-black.png">';
	        var count = 0;
	        var self = this;
	        this.selected_rfis_download.forEach(function(print){
	            printContent += '<p>Question '+print.orders+': '+print.question+'</p><p>Date: '+print.question_date+'</p><p>Answer: '+(print.answer.length > 0 ? print.answer[0] : "")+'</p><p>Date: '+(print.answer_date.length > 0 ? print.answer_date[0] : "")+'</p><hr>';
	            count = count + 1;
	            if(count == self.selected_rfis_download.length){
	            	self.selected_rfis_download = [];
	            	self.getRFIs();
	                self.printFinal(printContent);
	            }
	        });
		}
		else{
			let toast = this.toastCtrl.create({
		        message: 'Please select atleast one RFI to print.',
		        duration: 3000,
		        position:'top',
		        cssClass: 'danger'
		       });
			toast.present();
		}
	}

	downloadFiles(file,tradeId,main_file,index,f_ind,random,direct_href){
		let modal = this.modalCtrl.create('ExportBidPage', {
			page_type : '1',
			direct_link : '1',
			direct_href : direct_href
		});
		modal.onDidDismiss(data => {
	      if(data != undefined && data != '' && data != null){  
	      	this.finalSingleDownload(data,file,tradeId,main_file,index,f_ind,random);
	      }
	  	});
	    modal.present();
	}

	finalSingleDownload(destination,old_path,tradeId,file,index,f_ind,random){
		var msg,path;
		var file_type = (this.image_types.indexOf(old_path.split('.').pop(-1)) >= 0) ? '0' : '1';
		if(destination == 'local'){
			msg = 'File is downloading on your local device.';
			//download on local
			if(this.isBrowser == 'false'){
				this.downloadAndroid(this.APIURL +'/salvum/directory/bids_data/'+file,file);
			}
			else{
				// var unique_id = 'down_rfi_'+index+f_ind+random;
				// console.log(unique_id)
				// $('#'+unique_id).trigger("click");
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
		else{
			let toast = this.toastCtrl.create({
			    message: msg,
			    duration: 3000,
			    position:'top',
			    cssClass: 'success'
		   	});
		  	toast.present();
		}
	}

	downloadRFIs(){
		if(this.selected_rfis_download.length > 0){
			let modal = this.modalCtrl.create('ExportBidPage', {
				page_type : '1'
			});
			modal.onDidDismiss(data => {
		      if(data != undefined && data != '' && data != null){  
		      	this.finalDownload(data);
	          }
	      	});
		    modal.present();
		}
		else{
			let toast = this.toastCtrl.create({
		        message: 'Please select atleast one RFI to download.',
		        duration: 3000,
		        position:'top',
		        cssClass: 'danger'
		       });
			toast.present(); 
		}
	}

	finalDownload(destination){
		if(this.selected_rfis_download.length > 0){
			const loading = this.loadingCtrl.create({});
			loading.present();
			var self = this;
			// start pdf
			this.pdfmake.docDefinition.content = [];
			this.pdfmake.configureStyles({ header: { fontSize: 18, bold: true } });
			var counter = 0;
			this.selected_rfis_download.forEach(function(rfi){
				counter = counter + 1; 				
				// Add a text with style
				self.pdfmake.addText('RFI '+rfi.orders, 'header');
				// Create Headers cells
				const header1 = new Cell('Question');
				const header2 = new Cell(rfi.question);
				const headerRows = new Row([header1, header2]);
				// Create headers row	
				if(Array.isArray(rfi.question_files)){
					const row1 = new Row([new Cell('Attachments'), new Cell('Please click on below link to download zip:')]);
					const widths = [150, 350, 200, '*']; 
					// Create table object
					const table = new Table(headerRows, [row1], widths);
					self.pdfmake.addTable(table);
				}
				else{
					const row1 = new Row([new Cell('Attachments'), new Cell('No attachments.')]);
					const widths = [150, 350, 200, '*']; 
					// Create table object
					const table = new Table(headerRows, [row1], widths);
					self.pdfmake.addTable(table);
				}		
				
				if(Array.isArray(rfi.question_files)){
					if(rfi.question_files.length > 0){
						var rfi_attachments = [];
						rfi.question_files.forEach(function(file){
							var obj = {
				      				source : 'directory/bids_data/'+file,
				      				target : file.split('____').pop(-1)
				      			}
							rfi_attachments.push(obj);
						});
						var random = Math.floor(Math.random() * 1000000);
						var zip_href = self.APIURL+'/salvum/directory/temp_data/attachment'+random+'.zip';
						self.pdfmake.docDefinition.content.push({text: "Download attachments", link:zip_href, decoration:"underline", fontSize:13, margin: [0, 5] });
						self.companyProvider.makeZipAttachments(rfi_attachments,random).subscribe((downloaded)=>{
							// zip done
						});
					}
				}
				if(counter == self.selected_rfis_download.length){
					// download it
					setTimeout(function(){ 
						loading.dismissAll();
						self.selected_rfis_download = [];
						self.getRFIs();
						var msg,path;
						if(destination == 'local'){
							msg = 'Rfis are downloading on your local device.';
							self.pdfmake.download("RFIs");
						}
						else if(destination == 'job'){
							path = 'directory/jobs_data/';
							msg = 'RFIs has been saved to docs section of the job dashboard.';
						}
						else{
							path = 'directory/'+self.userId+'/files/level1/';
							msg = 'RFIs has been saved to level1 of your file manager.';
						}
						if(destination != 'local'){
							var file_name = 'RFIs';
							pdfMake.createPdf(self.pdfmake.docDefinition).getDataUrl(function(dataUrl){
								self.companyProvider.saveBidPdf({file : dataUrl, file_name : file_name, path : path, type : destination,jobId : self.jobId, tradeId : ''}).subscribe((result)=>{
									//expored successfully
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
							});
						}
						let toast = self.toastCtrl.create({
						    message: msg,
						    duration: 3000,
						    position:'top',
						    cssClass: 'success'
					   	});
					  	toast.present();
					 }, 2000);
				}	
			});
		}
		else{
			let toast = this.toastCtrl.create({
		        message: 'Please select atleast one RFI to download.',
		        duration: 3000,
		        position:'top',
		        cssClass: 'danger'
		       });
			toast.present(); 
		}
	}

	insertToArray(event,RfiId,Rfi){
	    if(event.target.checked == true)
	    {
	      this.selected_rfiIds.push(RfiId);
	      this.selected_rfis.push(Rfi);
	    }
	    else
	    {
	      this.removeArray(this.selected_rfiIds, RfiId);
	      this.removeArray(this.selected_rfis, Rfi);
	    }   
	  }

	  insertToArray_download(event,RfiId,Rfi){
	    if(event.target.checked == true)
	    {
	      this.selected_rfis_download.push(Rfi);
	    }
	    else
	    {
	      this.removeArray(this.selected_rfis_download, Rfi);
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

	  backToSmail(){
	    this.navCtrl.push('SmailInboxPage',{
	      from_job : '1',
	      jobId : this.jobId
	    });
	  }

}
