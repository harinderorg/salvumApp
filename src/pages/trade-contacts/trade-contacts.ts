import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController,ToastController,LoadingController, ViewController } from 'ionic-angular';
import { CompanyProvider } from '../../providers/company/company';

@IonicPage()
@Component({
  selector: 'page-trade-contacts',
  templateUrl: 'trade-contacts.html',
  providers: [CompanyProvider]
})
export class TradeContactsPage {
sorted_contacts : any;
all_contacts : any;
jobId : any;
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
order_contacts:any = 'date_created';
order_default_p:any = false;
order_advanced:any = 'trade_task';
order_advanced_p:any = false;
sort_icon:Boolean = true;
all_coworkers:any;
  constructor(public modalCtrl: ModalController, public navCtrl: NavController, public navParams: NavParams, public companyProvider: CompanyProvider, public alertCtrl: AlertController, public toastCtrl: ToastController,public loadingCtrl: LoadingController, public viewCtrl: ViewController ) {
  	  this.isBrowser = localStorage.getItem('isBrowser');
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
	    this.getContacts();
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
		var fixed_div = document.getElementById("calc_height_cont"+this.timestamp);
	    if(fixed_div != null){
	      var fixed_div_height = fixed_div.offsetHeight;
	      document.getElementById('fixed_height_cont'+this.timestamp).style.marginTop = fixed_div_height+'px';
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

  getContacts()
  {
  	this.trades = [];
	this.trade_ids = [];
	this.tradeTypes = [];
	this.tradesType_names = [];
  	var self = this,index;
  	const loading = this.loadingCtrl.create({});
    loading.present();
  	this.companyProvider.tradeContacts(this.jobId).subscribe((contacts)=>{
  		this.companyProvider.jobCoworkers(this.jobId).subscribe((coworkers)=>{
  		this.all_coworkers = coworkers;
  		// console.log(this.all_coworkers)
  		loading.dismissAll();
	  	this.all_contacts = contacts;
	  	if(this.all_coworkers.length > 0){
	  		this.all_contacts = contacts.concat(this.all_coworkers);
	  	}
	  	this.sorted_contacts = this.all_contacts;
	  	console.log(this.all_contacts)
	  	if(this.all_contacts != ''){
	  		this.all_contacts.forEach(function(data){
	  			if(data.trades.length > 0){
	  				data.trades.forEach(function(single){
	  					if(self.trade_ids.indexOf(single._id) >= 0){
			  				index = self.trade_ids.indexOf(single._id);
			  				self.trades[index]['total'] = self.trades[index]['total'] + 1;
			  			}
			  			else{
			  				self.trades.push({
			  					tradeId : single._id,
			  					trade_name : single.trade_name,
			  					trade_icon : single.trade_icon,
			  					trade_task : single.trade_task,
			  					total : 1
			  				});
			  				self.trade_ids.push(single._id);
			  			}

			  			if(self.tradesType_names.indexOf(single.trade_name) >= 0){
			  				index = self.tradesType_names.indexOf(single.trade_name);
			  				self.tradeTypes[index]['total'] = self.tradeTypes[index]['total'] + 1;
			  			}
			  			else{
			  				self.tradeTypes.push({
			  					tradeId : 0,
			  					trade_name : single.trade_name,
			  					trade_icon : single.trade_icon,
			  					trade_task : 'All '+single.trade_name,
			  					total : 1
			  				});
			  				self.tradesType_names.push(single.trade_name);
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
  		this.sorted_contacts = this.all_contacts;
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
	  	this.sorted_contacts = [];
		this.all_contacts.forEach(function(data){
			if(data.trades.length > 0){
				data.trades.forEach(function(single){
					if(self.filter_trades.indexOf(single._id) >= 0){
						if(self.sorted_contacts.indexOf(data) == -1){
							self.sorted_contacts.push(data);
						}
					}
					else{
						if(self.filter_trade_names.indexOf(single.trade_name) >= 0){
							if(self.sorted_contacts.indexOf(data) == -1){
								self.sorted_contacts.push(data);
							}
						}
					}
				});
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
  		this.sorted_contacts = this.all_contacts;
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
  		this.sorted_contacts = this.all_contacts;
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

  addCoworkers(){
  	var all_coworkers = [];
  	// if(this.all_coworkers.length > 0){
  	// 	this.all_coworkers.forEach(function(user){
  	// 		all_coworkers.push(user.inviteId);
  	// 	});
  	// }
	let modal = this.modalCtrl.create('AddCoworkersPage', { 
		jobId: this.jobId,
		already: all_coworkers
	});
	modal.onDidDismiss(data => {
		if(data == '1'){
			this.getContacts();
		}
	});
	modal.present();
  }

  addContactInvites(myEvent14) 
	{
	  var userId = localStorage.getItem('userinfo'); 
	  let modal = this.modalCtrl.create('ContactslistPage', {trade_check : '1', jobId: this.jobId, from_trade_contacts : '1',show_priv : '1'});
	  modal.onDidDismiss(data => {
	  	if(data != null)
	  	{
	  		if(data.length != undefined && data.length != 0)
	    	{
	    	 const loading = this.loadingCtrl.create({});
    		 loading.present();
		      var returnedArr = [];
		      var self = this;
		      var current_tradeId = localStorage.getItem('current_tradeId_s');
		      var all_trades = current_tradeId.split(','); 
		      data.forEach(function(contact){
		      	// all_trades.forEach(function(trade_id){
			        var new_obj = {
			            isMember : '1',
			            userId : userId,
			            inviteId : contact.userId, 
			            invite_email : contact.email,
			            status : '0',
					    invite_name: '',
				        invite_company: '',
				        invite_phone: '',
				        invite_title: '',
				        tradeId: all_trades,
				        jobId: self.jobId,
				        privilege: contact.privilege
			        }
			        returnedArr.push(new_obj);
		        // }); 
		      });
		      console.log(returnedArr)
		      this.companyProvider.addInviteBidders_contacts(returnedArr).subscribe((contacts)=>{
		      		if(contacts.status == '0')
		      		{
		      			loading.dismissAll() 
		      			let toast = this.toastCtrl.create({
			              message: 'Contacts already added.',
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
			              message: 'Contacts added.',
			              duration: 3000,
			              position: 'top',
        				  cssClass: 'success'
			             });
			             toast.present();
			             localStorage.removeItem('current_tradeId_s'); 
					  	  this.getContacts();
		      		}
			  },
			    err => {
			        this.showTechnicalError('1');
			    });
		    }
	  	}
	  });
	  modal.present({
	    ev: myEvent14
	  });
	}

	addContactManually()
	{
		let modal = this.modalCtrl.create('AddcontactPage',{jobId: this.jobId, isEdit : 0, isMultiple: '1'});
		  modal.onDidDismiss(data => {
		    if(data != undefined && data != '')
		    {
		    	if(data == '1')
	      		{
			      	let toast = this.toastCtrl.create({
		              message: 'Contact added.',
		              duration: 3000,
		              position: 'top',
        			  cssClass: 'success'
		             });
		             toast.present(); 
				  	this.getContacts();
	      		}
	      		else
	      		{
			      	let toast = this.toastCtrl.create({
		              message: 'Error while adding, plz try later.',
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

	deleteContact(contactId,isCoworker,jobId,userId,unique_id=null){
		let confirm = this.alertCtrl.create({
	      title: 'Are you sure you want to delete?',
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
	            if(isCoworker == '1'){
					
					this.companyProvider.deleteCoworkers(jobId,userId,unique_id).subscribe((deleted)=>{
		              if(deleted.status == 1){
	                    loading.dismissAll()
	                    let toast = this.toastCtrl.create({
	                        message: 'Coworker deleted.',
	                        duration: 3000,
	                        position: 'top',
	                        cssClass: 'success'
	                       });
	                       toast.present(); 
	                       this.getContacts();
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
				else{
					this.companyProvider.deleteBidders(contactId).subscribe((deleted)=>{
		              if(deleted.status == 1){
	                    loading.dismissAll()
	                    let toast = this.toastCtrl.create({
	                        message: 'Contact deleted.',
	                        duration: 3000,
	                        position: 'top',
	                        cssClass: 'success'
	                       });
	                       toast.present(); 
	                       this.getContacts();
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
	        }
	      ]
	    });
	    confirm.present();
	}

	editContact(contact){
		let modal = this.modalCtrl.create('AddcontactPage',{data: contact, isEdit : 1, jobId: this.jobId, isMultiple: '1'});
		  modal.onDidDismiss(data => {
		    if(data != undefined && data != '')
		    {
		    	if(data == '1')
	      		{
			      	let toast = this.toastCtrl.create({
		              message: 'Contact updated.',
		              duration: 3000,
		              position: 'top',
        			  cssClass: 'success'
		             });
		             toast.present(); 
				  	this.getContacts();
	      		}
	      		else
	      		{
			      	let toast = this.toastCtrl.create({
		              message: 'Error while adding, plz try later.',
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

	sendSmail(contact){
		if(contact.isMember == '1'){
			// var contacts = [];
			// contacts.push({
			// 	email : contact.invite_email, 
			// 	value : contact.invite_email, 
			// 	display : contact.invite_name, 
			// 	name : contact.invite_name, 
			// 	force : false, 
			// 	userId : contact.inviteId
			// });
			// console.log(contacts)
			// this.navCtrl.push('ComposePage', {data: {'selectedContacts': contacts, 'selectedGroups': []}});
			this.navCtrl.push('ComposePage',{
	  			userId : contact.inviteId,
	  			tradeId : contact.tradeId,
	  			jobId : this.jobId,
	  			bid_reply : '1', 
	  		});
		}
		else{
			let toast = this.toastCtrl.create({
		        message: 'This contact is not a salvum member.',
		        duration: 3000,
		        position: 'top',
		        cssClass: 'danger'
		      });
		    toast.present();
		}
	}

 // clickTrade()
 // {
 // 	var filterTradeId = localStorage.getItem('filterTradeId');
 // 	var previousId = localStorage.getItem('previousId');
 // 	if(filterTradeId == '0')
 // 	{
 // 		this.sorted_contacts = this.all_contacts;
 // 		localStorage.setItem('previousId',filterTradeId);
 // 		return false;
 // 	}
 // 	if(filterTradeId != previousId)
 // 	{
 // 		this.sorted_contacts = [];
 // 		var sortedArray = [];
 // 		localStorage.setItem('previousId',filterTradeId);
 // 		this.all_contacts.forEach(function(contact){
 // 			if(contact.tradeId == filterTradeId)
 // 			{
 // 				sortedArray.push(contact);
 // 			}
 // 		});
 // 		this.sorted_contacts = sortedArray;
 // 	}
 // }
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
