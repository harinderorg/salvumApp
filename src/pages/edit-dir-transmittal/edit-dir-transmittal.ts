import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams , ViewController, ModalController, AlertController,ToastController,LoadingController } from 'ionic-angular';
import { CompanyProvider } from '../../providers/company/company';
import { FileUploader } from 'ng2-file-upload';                              
import { SignaturePad } from 'angular2-signaturepad/signature-pad';

@IonicPage()
@Component({
  selector: 'page-edit-dir-transmittal',
  templateUrl: 'edit-dir-transmittal.html',
})
export class EditDirTransmittalPage {
@ViewChild(SignaturePad) signaturePad: SignaturePad;
selectOptions1 = {  
  cssClass: 'drop-select',    
};
public uploader: FileUploader;
uploaderOptions: any;                                                       
tabs: string = "basicdetail";                                               
filterTradeId : any;                                                           
sending_items : any=[];                                                
alltrades : any;                                                       
all_RFIs : any;                                                            
jobId : any;                                                             
userId : any;                                                                
issue_date:any;                                                            
sub_sign:any='';                                                              
current_date:any;                                                                                                
due_date:any;                                                              
quantity :any;                                                          
action_items:any = [];                                                      
all_senders : any = [];
all_submittals : any = [];
all_contracts : any;
other_type : any = '';
uploaded_sender_sign : any = '';
uploaded_rec_sign : any = '';
all_contracts_list : any;
contracts : any;
submittal_type : any = '';
item : any;                                                                
tid : any;  
subject : any;
isSent : any;
sender_id : any;
rec_id : any;
comments : any;
desc : any;
indexed_rfis:any;
indexed_conts:any;
isBrowser:any;
inviteId:any;
senders:any={};
state:any = 'new';
sub_comments:any = '';
sender_sign:any='';
tradeId:any = '';
all_action_items:any;
u_email:any;
sub_other_type : any;
show_duplicate : any = '0';
APIURL:any = localStorage.getItem('APIURL')
errors:any = ['',null,undefined];
send_from:any = localStorage.getItem('userName');
curr_comp_name:any = localStorage.getItem('curr_comp_name');
active_job_breadcrumb = localStorage.getItem('active_job_breadcrumb');
bid_job_name:any = localStorage.getItem('bid_job_name');
private signaturePadOptions: Object = { // passed through to szimek/signature_pad constructor
    'minWidth': 1,
    'canvasWidth': 500,
    'canvasHeight': 100,
    'backgroundColor': '#fff'
  };
  constructor(public navCtrl: NavController, public navParams: NavParams , public viewCtrl: ViewController, public companyProvider: CompanyProvider, public alertCtrl: AlertController, public toastCtrl: ToastController,public loadingCtrl: LoadingController,public modalCtrl: ModalController) {
    this.isBrowser = localStorage.getItem('isBrowser');
  	this.filterTradeId = localStorage.getItem('filterTradeId');
    if(this.filterTradeId == null || this.filterTradeId == undefined || this.filterTradeId == ''){
      this.filterTradeId = '0';
    }
  	this.userId = localStorage.getItem('userinfo');
  	this.jobId = navParams.get('jobId');
  	this.tid = navParams.get('tid');
  	this.u_email = navParams.get('email');

  	this.all_action_items = ['For approval','For your use','As requested','Approved as submitted','Approved as noted','Return for corrections','Resubmit copies for approval','submit [#] copies for distribution','return [#] corrected prints','for review and comment','revise and resubmit/work may not proceed','for bids due','prints returned after loan'];

  	var current_date = new Date();
    this.current_date = current_date.getFullYear()+"-"+("0"+(current_date.getMonth()+1)).slice(-2)+"-"+("0"+current_date.getDate()).slice(-2);
    this.issue_date = this.current_date;

  	console.log('tid',this.tid)
    if(navParams.get('type') == '1'){
      this.tabs = 'submittals_tab';
    }

    this.inviteId = navParams.get('InviteId');

  	if(this.tid == undefined){
      this.tid = localStorage.getItem('editt_trans_tid');
      this.inviteId = localStorage.getItem('dir_inv_id');
      this.jobId = localStorage.getItem('dir_job_id');
    }
    else{
      localStorage.setItem('editt_trans_tid',this.tid);
      localStorage.setItem('dir_inv_id',this.inviteId);
      localStorage.setItem('dir_job_id',this.jobId);
    }
      	const loading = this.loadingCtrl.create({});
	      loading.present(); 
        this.companyProvider.getTransmittalDetails(this.tid).subscribe((transmittal)=>{
          console.log('transmittal',transmittal);
          if(transmittal != null)
          {
          this.subject = transmittal[0].subject;
          this.sender_id = transmittal[0].sender_id;
          this.comments = transmittal[0].comments;
          this.desc = transmittal[0].description;
          this.rec_id = transmittal[0].rec_id;
          this.tradeId = transmittal[0].tradeId;
          this.other_type = transmittal[0].other_type;
          this.all_submittals = transmittal[0].submittals; 
          this.sending_items = transmittal[0].sending_items;
          this.uploaded_sender_sign = transmittal[0].sender_sign;
          this.uploaded_rec_sign = transmittal[0].rec_sign;
          this.senders = transmittal[0].senders;
          this.isSent = transmittal[0].isSent;
          loading.dismissAll();
	          this.companyProvider.allTrades(transmittal[0].jobId).subscribe((alltrades)=>{
		  		    this.alltrades = alltrades;
		  		  },
		        err => {
		            this.showTechnicalError();
		        });

		        this.companyProvider.getRFIs(transmittal[0].jobId).subscribe((RFIs)=>{
		          this.all_RFIs = RFIs;
		          if(RFIs != ''){
		            var rfis = [];
		            RFIs.forEach(function(rfi){
		              rfis[rfi._id]= rfi;
		            });
		            this.indexed_rfis = rfis;
		            console.log(rfis)
		          }
		          loading.dismissAll();
		        },
		        err => {
		            loading.dismissAll();
		            this.showTechnicalError();
		        });

		        this.companyProvider.getContracts(transmittal[0].jobId).subscribe((contracts)=>{
	              this.all_contracts_list = contracts;
	              if(this.all_contracts_list != ''){
	                this.contracts = [];
	                var contractss = [];
	                var self = this;
	                this.all_contracts_list.forEach(function(contract){
	                  contractss[contract._id]= contract;
	                  if(contract.tradeId == self.tradeId){
	                    self.contracts.push(contract);
	                  }
	                });
	                this.indexed_conts = contractss;
	                this.all_contracts = self.contracts;
	                this.rec_id = transmittal[0].rec_id;
	              }
	            },
	            err => {
	                loading.dismissAll();
	                this.showTechnicalError();
	            });
          } 
        },
        err => {
            loading.dismissAll();
            this.showTechnicalError();
        });

     //    this.companyProvider.postData('allSenders',{userId: this.userId}).subscribe((all_senders)=>{
		   //  	this.all_senders = [];
			  //   var all_sender_emails = [];
			  //   if(all_senders.length > 0){
			  //   	var self = this;
			  //   	all_senders.forEach(function(sender){
			  //   		if(all_sender_emails.indexOf(sender.invite_email) == -1){
			  //   			all_sender_emails.push(sender.invite_email);
			  //   			self.all_senders.push(sender);
			  //   		}
			  //   	});
			  //   	console.log(this.all_senders)
			  //   }
			  // },
	    //   err => {
	    //       this.showTechnicalError();
	    //   });

  }

  ngAfterViewInit() {
    this.signaturePad.set('minWidth', 1); 
    this.signaturePad.clear(); 
  }
 
  drawComplete() {
    this.sender_sign = this.signaturePad.toDataURL();
  }

  clearSign(){
    this.signaturePad.clear(); 
    this.sender_sign = '';
  }

  drawCompleteS() {
    this.sub_sign = this.signaturePad.toDataURL();
  }

  clearSignS(){
    this.signaturePad.clear(); 
    this.sub_sign = '';
  }

  tabschanged(){
    if(this.tabs == 'submittals_tab' && this.sender_sign != ''){
      this.show_duplicate = '1';
    }
  }

  changeSign(){
    this.uploaded_sender_sign = '';
  }
  changeSignR(){
    this.uploaded_rec_sign = '';
  }

  editSub(sub){ 
      this.navCtrl.push('EditSubmittalPage',{
       sub : sub,
       jobId : this.jobId,
       restricted_access : '1',
       inviteId : this.inviteId,
       transId : this.tid,
       u_email : this.u_email
      });
    };

  	addSubmittal(submittal_type,item)
  	{
  	if(submittal_type == '' || submittal_type == undefined)
  	{
  		let toast = this.toastCtrl.create({
          message: 'Please select submittal type.',
          duration: 3000,
          position: 'top',
          cssClass: 'danger'
         });
         toast.present();
         return false;
  	}
  	if(item == '' || item == undefined)
  	{
  		let toast = this.toastCtrl.create({
          message: 'Please select submittal item.',
          duration: 3000,
          position: 'top',
          cssClass: 'danger'
         });
         toast.present();
         return false;
  	}
  	if(submittal_type == 'rfi'){
      if(item.length > 0){
        var counter = 0;
        var self = this;
        item.forEach(function(single){
          var new_item = {
            type : submittal_type,
            item : single,
            submittal_number : Math.floor(Math.random() * 100000),
            issue_date : self.issue_date,
	        due_date : self.due_date,
	        quantity : self.quantity,
	        sub_by : self.send_from,
	        tradeId : self.tradeId,
	        state : self.state,
	        sign : self.sub_sign,
	        sub_comments : self.sub_comments,
	        action_items : self.action_items
          };
          self.all_submittals.splice(0,0,new_item);
          if(self.sending_items.indexOf('rfi') == -1){
            self.sending_items.push('rfi');
          }
          counter = counter + 1;
          if(counter == item.length){
            self.submittal_type = '';
		      self.issue_date = self.current_date;
		      self.due_date = '';
		      self.quantity = '';
		      self.tradeId = '';
		      self.state = 'new';
		      self.sub_comments = '';
		      self.sub_sign = '';
		      self.action_items = [];
            self.item = '';
            let toast = self.toastCtrl.create({
              message: 'Submittal added.',
              duration: 3000,
              position: 'top',
              cssClass: 'success'
             });
             toast.present();
          }
        })
      }
    }
    else{
      var new_item = {
        type : submittal_type,
        item : item,
        submittal_number : Math.floor(Math.random() * 100000),
        issue_date : this.issue_date,
        due_date : this.due_date,
        quantity : this.quantity,
        sub_by : this.send_from,
        tradeId : this.tradeId,
        state : this.state,
        sign : this.sub_sign,
        sub_comments : this.sub_comments,
        action_items : this.action_items
      };
      console.log(item)
      if(!this.all_submittals.includes(new_item))
      {
        this.all_submittals.splice(0,0,new_item);
        if(submittal_type == 'contract'){
          if(this.sending_items.indexOf('contract') == -1){
            this.sending_items.push('contract');
          }  
        }
        this.submittal_type = '';
		      this.issue_date = this.current_date;
		      this.due_date = '';
		      this.quantity = '';
		      this.tradeId = '';
		      this.state = 'new';
		      this.sub_comments = '';
		      this.sub_sign = '';
		      this.action_items = [];
        this.item = '';
        // this.uploader.queue = [];
        // this.uploader.progress = 0;
        let toast = this.toastCtrl.create({
            message: 'Submittal added.',
            duration: 3000,
            position: 'top',
            cssClass: 'success'
           });
           toast.present();
      }
      else
      {
        let toast = this.toastCtrl.create({
            message: 'Submittal already added.',
            duration: 3000,
            position: 'top',
            cssClass: 'danger'
           });
           toast.present();
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

  sendToSelected(){
    var self = this;
    if(this.all_contracts.length > 0){
      this.all_contracts.forEach(function(cont){
        if(cont.inviteId == self.rec_id){
          self.senders = cont;
        }
      });
    }
    console.log(this.senders)
  }

  editTransmittal(subject,rec_id,tradeId='0',comments,desc,sending_items)
  {
    sending_items = this.errors.indexOf(sending_items) == -1 ? sending_items : [];
    console.log(sending_items)
  	if(subject == '' || subject == undefined)
  	{
  		let toast = this.toastCtrl.create({
          message: 'Please enter valid subject.',
          duration: 3000,
          position: 'top',
          cssClass: 'danger'
         });
         toast.present(); 
         return false;
  	}
  	if(rec_id == '' || rec_id == undefined)
  	{
  		let toast = this.toastCtrl.create({
          message: 'Please select valid receiver.',
          duration: 3000,
          position: 'top',
          cssClass: 'danger'
         });
         toast.present(); 
         return false;
  	}
	// if(tradeId == '' || tradeId == undefined)
 //  	{
 //  		let toast = this.toastCtrl.create({
 //          message: 'Please select valid trade.',
 //          duration: 3000,
 //          position: 'top',
 //          cssClass: 'danger'
 //         });
 //         toast.present(); 
 //         return false;
 //  	}
  	if(desc == '' || desc == undefined)
    {
      let toast = this.toastCtrl.create({
          message: 'Please enter description.', 
          duration: 3000,
          position: 'top',
          cssClass: 'danger'
         });
         toast.present(); 
         return false;
    }
    if(comments == '' || comments == undefined)
  	{
  		let toast = this.toastCtrl.create({
          message: 'Please enter comments.', 
          duration: 3000,
          position: 'top',
          cssClass: 'danger'
         });
         toast.present(); 
         return false;
  	}

  	var submittals = JSON.stringify(this.all_submittals);
  	const loading = this.loadingCtrl.create({});
    loading.present(); 
    var rec_sign = '';
    if(this.errors.indexOf(this.sender_sign) == -1){
    	if(this.sender_id != this.userId){
    		rec_sign = this.sender_sign;
    		this.sender_sign = '';
    	}
    }
    this.companyProvider.editTransmittal(subject,rec_id,'0',comments,submittals,this.tid,this.senders,desc,sending_items,this.userId,this.sender_sign,this.other_type,rec_sign).subscribe((formdata)=>{
    	loading.dismissAll();
    	if(formdata.status == '1')
    	{
    		let toast = this.toastCtrl.create({
	          message: 'Transmittal updated successfully.',
	          duration: 3000,
	          position: 'top',
            cssClass: 'success'
	         });
	         toast.present();
	         this.myTransmittals();
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

  seeAcItems(act_items){
    let modal = this.modalCtrl.create('ActionItemsPage', {action_items : act_items});
    modal.present();
  }

  insertContactToArray(event,item){
      if(event.checked == true){
        this.action_items.push(item);
      }
      else{
        this.removeArray(this.action_items, item);
      }
      console.log(this.action_items)
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

  getContractsTradeWise(tradeId=0){
    var all_sentTo = [];
    var all_emails = [];
    var contracts = [];
    var self = this;
    this.companyProvider.tradeContacts(this.jobId).subscribe((j_contacts)=>{
      this.companyProvider.jobCoworkers(this.jobId).subscribe((coworkers)=>{
        if(j_contacts.length > 0){
          all_sentTo = all_sentTo.concat(j_contacts);
        }
        if(coworkers.length > 0){
          all_sentTo = all_sentTo.concat(coworkers);
        }
        if(this.all_contracts_list.length > 0){
          all_sentTo = all_sentTo.concat(this.all_contracts_list);
        }
        if(all_sentTo.length > 0){
          all_sentTo.forEach(function(cont){
            if(cont.inviteId == 0){
              if(all_emails.indexOf(cont.invite_email) == -1){
                all_emails.push(cont.invite_email);
                contracts.push({
                  user_email : cont.invite_email,
                  user_name : cont.invite_name,
                  inviteId : contracts.length + 1
                });
              }
            }
            else{
              if(self.errors.indexOf(cont.user_email) == -1){
                if(all_emails.indexOf(cont.user_email) == -1){
                  all_emails.push(cont.user_email);
                  contracts.push({
                    user_email : cont.user_email,
                    user_name : cont.invite_name,
                    inviteId : cont.inviteId
                  });
                }
              }
              else{
                if(all_emails.indexOf(cont.invite_email) == -1){
                  all_emails.push(cont.invite_email);
                  contracts.push({
                    user_email : cont.invite_email,
                    user_name : cont.invite_name,
                    inviteId : cont.inviteId
                  });
                }
              }
            }
          });
          this.all_contracts = contracts;
          console.log(contracts)
        }
      });
    });
    // if(tradeId != '' && tradeId != undefined && tradeId != null){
    //   this.rec_id = '';
    //   if(this.all_contracts_list != ''){
    //     var contracts = [];
    //     this.all_contracts_list.forEach(function(contract){
    //       if(contract.tradeId == tradeId){
    //         contracts.push(contract);
    //       }
    //     });
    //     this.all_contracts = contracts;
    //   }
    // }
  }

  removeSubReqs(){
  	if(this.all_submittals.length > 0){
  		var count = 0;
  		var all_submittals = this.all_submittals;
  		this.all_submittals.forEach(function(sub){
  			if(sub.type == 'request'){
  				all_submittals.splice(count,1);
  			}
  			count = count + 1;
  		});
  		this.all_submittals = all_submittals;
  	}
  }

  removeSubmittal(index)
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
  				this.all_submittals.splice(index,1);
            }
          }
        ]
      });
      confirm.present();
  }

  filemanagerFiles()
  {
    let modal = this.modalCtrl.create('FilemanagerfilesPage',{transmittal_file : '1'});
     modal.onDidDismiss(data => {
      if(data != undefined && data != '' && data != null)
          {       
            var self = this;
            if(data.length > 0){
              data.forEach(function(file){
                var new_item = {
                  type : self.submittal_type == 'other' ? (self.errors.indexOf(self.sub_other_type) == -1 ? self.sub_other_type : 'other') : self.submittal_type,
                  item : file.path,
                  submittal_number : Math.floor(Math.random() * 100000),
                  issue_date : self.issue_date,
			        due_date : self.due_date,
			        quantity : self.quantity,
			        sub_by : self.send_from,
			        tradeId : self.tradeId,
			        state : self.state,
			        sign : self.sub_sign,
			        sub_comments : self.sub_comments,
			        action_items : self.action_items
                };
                self.all_submittals.splice(0,0,new_item);
                self.removeSubReqs();
              });
              self.submittal_type = '';
		      self.issue_date = self.current_date;
		      self.due_date = '';
		      self.quantity = '';
		      self.tradeId = '';
		      self.state = 'new';
		      self.sub_comments = '';
		      self.sub_sign = '';
		      self.action_items = [];
              self.item = '';
            }
          }
     });
     modal.present();
  }

  uploadFiles()
  {
    let modal = this.modalCtrl.create('UploadfilePage', {transmittal_file : '1'});
     modal.onDidDismiss(data => {
      if(data != undefined && data != '' && data != null)
      {
        var self = this;
        if(data.length > 0){
          data.forEach(function(file){
            console.log(file)
            var new_item = {
              type : self.submittal_type == 'other' ? (self.errors.indexOf(self.sub_other_type) == -1 ? self.sub_other_type : 'other') : self.submittal_type,
              item : 'directory/transmittal_files/'+file.file,
              submittal_number : Math.floor(Math.random() * 100000),
              date_created : file.date,
              issue_date : self.issue_date,
	        due_date : self.due_date,
	        quantity : self.quantity,
	        sub_by : self.send_from,
	        tradeId : self.tradeId,
	        state : self.state,
	        sign : self.sub_sign,
	        sub_comments : self.sub_comments,
	        action_items : self.action_items
            };
            self.all_submittals.splice(0,0,new_item);
            self.removeSubReqs();
          });
          self.submittal_type = '';
		      self.issue_date = self.current_date;
		      self.due_date = '';
		      self.quantity = '';
		      self.tradeId = '';
		      self.state = 'new';
		      self.sub_sign = '';
		      self.sub_comments = '';
		      self.action_items = [];
          self.item = '';
        }
      }
     });
     modal.present();
  }

  // jobFiles()
  // {
  //   let modal = this.modalCtrl.create('JobfilesPage', {jobId : this.jobId});
  //    modal.onDidDismiss(data => {
  //     if(data != undefined && data != '' && data != null)
  //     {
  //       console.log(data)
  //       var self = this;
  //       var file_item;
  //       if(data.length > 0){
  //         data.forEach(function(file){
  //           console.log(file)
  //           if(data.path == undefined)
  //           {
  //             file_item = 'directory/jobs_data/'+file.file_name;
  //           }
  //           else
  //           {
  //             file_item = file.path;
  //           }
  //           var new_item = {
  //             type : 'files',
  //             item : file_item,
  //             code : Math.floor(Math.random() * 100000),
  //             date_created : file.date_created,
  //             by : self.send_from
  //           };
  //           self.all_submittals.push(new_item);
  //         });
  //         // this.submittal_type = '';
  //         this.item = '';
  //       }
  //     }
  //    });
  //    modal.present();
  // }

  uploadNow()
  {
  	this.uploader.uploadAll();
  }

  root(){
      this.navCtrl.setRoot('DashboardPage');
    };

  myTransmittals(){
  		var params = {
			jobId : this.jobId,
			inviteId : this.inviteId
		};
		if(this.errors.indexOf(this.userId) >= 0){
			params['email'] = this.u_email;
		}
		console.log(params)
		this.navCtrl.push('direct-transmittals',params);
	}

  backPage()
  {
    this.viewCtrl.dismiss();
  }

  goToBids(){
    this.navCtrl.push('bidjobs', {
      type: '0'
    });
  };
    
}