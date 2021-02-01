import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams , ViewController, ModalController, AlertController,ToastController,LoadingController } from 'ionic-angular';
import { CompanyProvider } from '../../providers/company/company';
import { FileUploader } from 'ng2-file-upload';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';


@IonicPage()
@Component({
  selector: 'page-edit-transmittal',
  templateUrl: 'edit-transmittal.html',
  providers: [CompanyProvider]
})
export class EditTransmittalPage {
@ViewChild(SignaturePad) signaturePad: SignaturePad;
selectOptions1 = {  
  cssClass: 'drop-select', 
};
public uploader: FileUploader;
uploaderOptions: any;
tabs: string = "basicdetail";
filterTradeId : any;
tradeId : any = '';
show_duplicate : any = '0';
sending_items : any=[];
alltrades : any;
other_type : any = '';
all_RFIs : any;
jobId : any;
userId : any;
all_submittals : any = [];
all_contracts : any;
all_contracts_list : any;
contracts : any;
submittal_type : any = '';
sub_other_type : any;
item : any;
tid : any;
subject : any;
sender_id : any;
rec_id : any;
comments : any;
desc : any;
indexed_rfis:any;
indexed_conts:any;
action_items:any = [];
isBrowser:any;
senders:any={};
errors:any = ['',null,undefined];
APIURL:any = localStorage.getItem('APIURL')
send_from:any = localStorage.getItem('userName');
curr_comp_name:any = localStorage.getItem('curr_comp_name');
active_job_breadcrumb = localStorage.getItem('active_job_breadcrumb');
sender_sign:any='';
sub_sign:any='';
uploaded_sender_sign:any='';
uploaded_rec_sign:any='';
issue_date:any;
current_date:any;
due_date:any;
quantity :any;
all_selected_trades:any=[];
state:any = 'new';
sub_comments:any = '';
private signaturePadOptions: Object = { // passed through to szimek/signature_pad constructor
    'minWidth': 1,
    'canvasWidth': 500,
    'canvasHeight': 100,
    'backgroundColor': '#fff'
  };
all_action_items:any;
  constructor(public navCtrl: NavController, public navParams: NavParams , public viewCtrl: ViewController, public companyProvider: CompanyProvider, public alertCtrl: AlertController, public toastCtrl: ToastController,public loadingCtrl: LoadingController,public modalCtrl: ModalController) {
    this.isBrowser = localStorage.getItem('isBrowser');
  	this.filterTradeId = localStorage.getItem('filterTradeId');
    if(this.filterTradeId == null || this.filterTradeId == undefined || this.filterTradeId == ''){
      this.filterTradeId = '0';
    }
  	this.userId = localStorage.getItem('userinfo');
  	this.jobId = navParams.get('jobId');
  	this.tid = navParams.get('tid');
    var current_date = new Date();
    this.current_date = current_date.getFullYear()+"-"+("0"+(current_date.getMonth()+1)).slice(-2)+"-"+("0"+current_date.getDate()).slice(-2);
    this.issue_date = this.current_date;

    if(navParams.get('type') == '1'){
      this.tabs = 'submittals_tab';
    }
  	if(this.jobId == undefined){
      // this.navCtrl.push('TransmittalsPage');
      this.jobId = localStorage.getItem('edit_trans_jobId');
      this.tid = localStorage.getItem('edit_trans_tid');
    }
    else{
      localStorage.setItem('edit_trans_jobId',this.jobId);
      localStorage.setItem('edit_trans_tid',this.tid);
    }

    this.all_action_items = ['For approval','For your use','As requested','Approved as submitted','Approved as noted','Return for corrections','Resubmit copies for approval','submit [#] copies for distribution','return [#] corrected prints','for review and comment','revise and resubmit/work may not proceed','for bids due','prints returned after loan'];

      	const loading = this.loadingCtrl.create({});
	      loading.present(); 
        this.companyProvider.getTransmittalDetails(this.tid).subscribe((transmittal)=>{
          if(transmittal != null)
          {
          this.subject = transmittal[0].subject;
          this.sender_id = transmittal[0].sender_id;
          this.comments = transmittal[0].comments;
          this.desc = transmittal[0].description;
          this.rec_id = transmittal[0].rec_id;
          // this.tradeId = transmittal[0].tradeId;
          this.other_type = transmittal[0].other_type;
          this.uploaded_sender_sign = transmittal[0].sender_sign;
          this.uploaded_rec_sign = transmittal[0].rec_sign;
          this.all_submittals = transmittal[0].submittals;
          this.senders = transmittal[0].senders;
          this.sending_items = transmittal[0].sending_items;
          console.log(this.sending_items)
          this.companyProvider.getContracts(this.jobId).subscribe((contracts)=>{
              this.all_contracts_list = contracts;
              this.getContractsTradeWise();
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
	  	
      	this.companyProvider.allTrades(this.jobId).subscribe((alltrades)=>{
  		    this.alltrades = alltrades;
  		  },
        err => {
            this.showTechnicalError();
        });

        this.companyProvider.getRFIs(this.jobId).subscribe((RFIs)=>{
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
      	

     //  	var APIURL = localStorage.getItem('APIURL');
	    // this.uploader  = new FileUploader({
	    //   url: APIURL+'/transmittalFilesUpload', 
	    //   itemAlias: 'file'
	    //  });

     //    this.uploader.onBeforeUploadItem = (item) => {
     //        item.withCredentials = false;
     //    }

     //    this.uploader.onCompleteItem = (item:any, response:any, status:any, headers:any) => {
     //    	var response = JSON.parse("[" + response + "]");
     //      if(response != '')
     //      {
     //        if(response[0].status == '1')
     //        {
     //          this.item = response[0].data.file_name;
     //        }
     //      }  
     //    };

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

  tabschanged(){
    if(this.tabs == 'submittals_tab' && this.sender_sign != ''){
      this.show_duplicate = '1';
    }
  }

  ngAfterViewInit() {
    // this.signaturePad is now available
    this.signaturePad.set('minWidth', 1); // set szimek/signature_pad options at runtime
    this.signaturePad.clear(); // invoke functions from szimek/signature_pad API
  }
 
  drawComplete() {
    // will be notified of szimek/signature_pad's onEnd event
    this.show_duplicate = '0';
    this.sender_sign = this.signaturePad.toDataURL();
    console.log(this.sender_sign)
  }

  drawCompleteS() {
    this.sub_sign = this.signaturePad.toDataURL();
    console.log(this.sub_sign)
  }

  clearSignS(){
    this.signaturePad.clear(); 
    this.sub_sign = '';
  }
 
  drawStart() {
    // will be notified of szimek/signature_pad's onBegin event
    console.log('begin drawing');
  }

  clearSign(){
    this.signaturePad.clear(); 
    this.sender_sign = '';
  }

  changeSign(){
    this.uploaded_sender_sign = '';
  }

  changeSignR(){
    this.uploaded_rec_sign = '';
  }

    addSubmittalReq(submittal_type){
      if(submittal_type == 'request'){
        var new_item = {
          type : 'request',
          item : '',
          added_at : new Date(),
          submittal_number : Math.floor(Math.random() * 100000),
          issue_date : this.issue_date,
          due_date : this.due_date,
          sub_by : this.send_from,
          quantity : this.quantity,
          tradeId : this.tradeId,
          state : this.state,
          sub_comments : this.sub_comments,
          action_items : this.action_items,
          sign : this.sub_sign
        };
        this.all_submittals.splice(0,0,new_item);
        this.submittal_type = '';
        this.issue_date = this.current_date;
        this.due_date = '';
        this.quantity = '';
        this.tradeId = '';
        this.state = 'new';
        this.sub_comments = '';
        this.sub_sign = '';
        this.action_items = [];
      }
    }

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
            added_at : new Date(),
            submittal_number : Math.floor(Math.random() * 100000),
            issue_date : self.issue_date,
            due_date : self.due_date,
            sub_by : self.send_from,
            quantity : self.quantity,
            tradeId : self.tradeId,
            state : self.state,
            sub_comments : self.sub_comments,
            sign : self.sub_sign,
            action_items : self.action_items
          };
          self.all_submittals.splice(0,0,new_item);
          if(self.sending_items.indexOf('rfi') == -1){
            self.sending_items.push('rfi');
          }
          counter = counter + 1;
          if(counter == item.length){
            self.submittal_type = '';
            self.item = '';
            self.issue_date = self.current_date;
            self.due_date = '';
            self.quantity = '';
            self.tradeId = '';
            self.state = 'new';
            self.sub_comments = '';
            self.sub_sign = '';
            self.action_items = [];
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
        added_at : new Date(),
        submittal_number : Math.floor(Math.random() * 100000),
        issue_date : this.issue_date,
        due_date : this.due_date,
        quantity : this.quantity,
        sub_by : this.send_from,
        tradeId : this.tradeId,
        state : this.state,
        sub_comments : this.sub_comments,
        sign : this.sub_sign,
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
        this.item = '';
        this.issue_date = this.current_date;
        this.due_date = '';
        this.quantity = '';
        this.tradeId = '';
        this.state = 'new';
        this.sub_comments = '';
        this.sub_sign = '';
        this.action_items = [];
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

    var self = this;
    if(this.all_submittals.length > 0){
      this.all_submittals.forEach(function(sub){
        if(self.all_selected_trades.indexOf(sub.tradeId) == -1 && self.errors.indexOf(sub.tradeId) == -1){
          self.all_selected_trades.push(sub.tradeId);
        }
      });
    }

    console.log(this.all_submittals)

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
    if(this.sender_id != this.userId){
      var all_selected_trades = '0';
    }
    else{
      var all_selected_trades = JSON.stringify(this.all_selected_trades);
    }
    this.companyProvider.editTransmittal(subject,rec_id,all_selected_trades,comments,submittals,this.tid,this.senders,desc,sending_items,this.userId,this.sender_sign,this.other_type,rec_sign).subscribe((formdata)=>{
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
	         this.backPage();
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
                  added_at : new Date(),
                  submittal_number : Math.floor(Math.random() * 100000),
                  sub_by : self.send_from,
                  issue_date : self.issue_date,
                  due_date : self.due_date,
                  quantity : self.quantity,
                  tradeId : self.tradeId,
                  state : self.state,
                  sub_comments : self.sub_comments,
                  sign : self.sub_sign,
                  action_items : self.action_items
                };
                self.all_submittals.splice(0,0,new_item);
                if(self.sending_items.indexOf(new_item['type']) == -1){
                  self.sending_items.push(new_item['type']);
                }
              });
              this.submittal_type = '';
              this.item = '';
              this.sub_other_type = '';
              this.issue_date = this.current_date;
              this.due_date = '';
              this.quantity = '';
              this.tradeId = '';
              this.state = 'new';
              this.sub_comments = '';
              this.sub_sign = '';
              this.action_items = [];
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
              added_at : new Date(),
              sub_by : self.send_from,
              issue_date : self.issue_date,
              due_date : self.due_date,
              quantity : self.quantity,
              tradeId : self.tradeId,
              state : self.state,
              sub_comments : self.sub_comments,
              sign : self.sub_sign,
              action_items : self.action_items
            };
            self.all_submittals.splice(0,0,new_item);
            if(self.sending_items.indexOf(new_item['type']) == -1){
              self.sending_items.push(new_item['type']);
            }
            console.log(new_item)
          });
          this.submittal_type = '';
          this.item = '';
          this.sub_other_type = '';
          this.issue_date = this.current_date;
          this.tradeId = '';
          this.due_date = '';
          this.quantity = '';
          this.state = 'new';
          this.sub_comments = '';
          this.sub_sign = '';
          this.action_items = [];
        }
      }
     });
     modal.present();
  }

  jobFiles()
  {
    let modal = this.modalCtrl.create('JobfilesPage', {jobId : this.jobId});
     modal.onDidDismiss(data => {
      if(data != undefined && data != '' && data != null)
      {
        console.log(data)
        var self = this;
        var file_item;
        if(data.length > 0){
          data.forEach(function(file){
            console.log(file)
            if(data.path == undefined)
            {
              file_item = 'directory/jobs_data/'+file.file_name;
            }
            else
            {
              file_item = file.path;
            }
            var new_item = {
              type : self.submittal_type == 'other' ? (self.errors.indexOf(self.sub_other_type) == -1 ? self.sub_other_type : 'other') : self.submittal_type,
              item : file_item,
              submittal_number : Math.floor(Math.random() * 100000),
              date_created : file.date_created,
              sub_by : self.send_from,
              added_at : new Date(),
              issue_date : self.issue_date,
              due_date : self.due_date,
              quantity : self.quantity,
              tradeId : self.tradeId,
              state : self.state,
              sub_comments : self.sub_comments,
              sign : self.sub_sign,
              action_items : self.action_items
            };
            self.all_submittals.splice(0,0,new_item);
            if(self.sending_items.indexOf(new_item['type']) == -1){
              self.sending_items.push(new_item['type']);
            }
          });
          this.submittal_type = '';
          this.item = '';
          this.sub_other_type = '';
          this.issue_date = this.current_date;
          this.due_date = '';
          this.quantity = '';
          this.tradeId = '';
          this.state = 'new';
          this.sub_comments = '';
          this.sub_sign = '';
          this.action_items = [];
        }
      }
     });
     modal.present();
  }

  uploadNow()
  {
  	this.uploader.uploadAll();
  }

  backPage()
  {
  	this.navCtrl.push('TransmittalsPage');
  }

  root(){
      this.navCtrl.setRoot('DashboardPage');
    };
    
    editSub(sub){ 
      this.navCtrl.push('EditSubmittalPage',{
       sub : sub,
       alltrades : this.alltrades,
       all_RFIs : this.all_RFIs,
       all_contracts_list : this.all_contracts_list,
       jobId : this.jobId,
       transId : this.tid,
       restricted_access : '0'
      });
    };

    goToJobs(){
      this.navCtrl.push('ManagejobPage',{
      is_direct : '0'
      });
    };

    backToTradeDash()
    {
      this.navCtrl.push('TradeDashboardPage',{
        back : '1'
      });
    }

}
