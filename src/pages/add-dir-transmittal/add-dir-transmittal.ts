import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams , ViewController, ModalController, AlertController,ToastController,LoadingController } from 'ionic-angular';
import { CompanyProvider } from '../../providers/company/company';
import { FileUploader } from 'ng2-file-upload';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';

@IonicPage()
@Component({
  selector: 'page-add-dir-transmittal',
  templateUrl: 'add-dir-transmittal.html',
})
export class AddDirTransmittalPage {
	selectOptions1 = {  
  cssClass: 'drop-select', 
};
@ViewChild(SignaturePad) signaturePad: SignaturePad;
public uploader: FileUploader;
uploaderOptions: any;
tabs: string = "basicdetail";
filterTradeId : any;
alltrades : any;
jobId : any;
sub_sign:any='';
userId : any;
sender_sign:any='';
show_duplicate : any = '0';
all_submittals : any = [];
other_type : any = '';
sub_other_type : any;
all_contracts : any;
all_contracts_list : any;
all_RFIs : any;
issue_date:any;
current_date:any;
due_date:any;
quantity :any;
action_items:any = [];
submittal_type : any = '';
senders:any={};
indexed_conts : any;
item : any;
inviteId : any;
rec_id : any = '';
isBrowser:any;
sending_items:any=[];
indexed_rfis:any;
state:any = 'new';
sub_comments:any = '';
tradeId:any = '';
all_action_items:any;
all_senders:any;
send_from:any = localStorage.getItem('userName');
curr_comp_name:any = localStorage.getItem('curr_comp_name');
active_job_breadcrumb = localStorage.getItem('active_job_breadcrumb');
errors:any=['',null,undefined];
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
  	this.inviteId = navParams.get('InviteId');
  	this.jobId = navParams.get('jobId');


  	if(this.inviteId == undefined){
      this.inviteId = localStorage.getItem('dir_inv_id');
      this.jobId = localStorage.getItem('dir_job_id');
    }
    else{
      localStorage.setItem('dir_inv_id',this.inviteId);
      localStorage.setItem('dir_job_id',this.jobId);
    }

    if(this.filterTradeId == null || this.filterTradeId == undefined || this.filterTradeId == ''){
      this.filterTradeId = '0';
    }
  	this.userId = localStorage.getItem('userinfo');

  	this.all_action_items = ['For approval','For your use','As requested','Approved as submitted','Approved as noted','Return for corrections','Resubmit copies for approval','submit [#] copies for distribution','return [#] corrected prints','for review and comment','revise and resubmit/work may not proceed','for bids due','prints returned after loan'];

  	var current_date = new Date();
    this.current_date = current_date.getFullYear()+"-"+("0"+(current_date.getMonth()+1)).slice(-2)+"-"+("0"+current_date.getDate()).slice(-2);
    this.issue_date = this.current_date;

    this.companyProvider.postData('allSenders',{userId: this.userId}).subscribe((all_senders)=>{
		    this.all_senders = [];
		    var all_sender_emails = [];
		    if(all_senders.length > 0){
		    	var self = this;
		    	all_senders.forEach(function(sender){
		    		if(all_sender_emails.indexOf(sender.invite_email) == -1){
		    			all_sender_emails.push(sender.invite_email);
		    			self.all_senders.push(sender);
		    		}
		    	});
		    	console.log(this.all_senders)
		    }
		  },
      err => {
          this.showTechnicalError();
      });
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

  ngAfterViewInit() {
    this.signaturePad.set('minWidth', 1); 
    this.signaturePad.clear(); 
  }
 
  drawComplete() {
    this.sender_sign = this.signaturePad.toDataURL();
  }

  tabschanged(){
    if(this.tabs == 'submittals_tab' && this.sender_sign != ''){
      this.show_duplicate = '1';
    }
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

  seeAcItems(act_items){
    let modal = this.modalCtrl.create('ActionItemsPage', {action_items : act_items});
    modal.present();
  }

  sendToSelected(){
    var self = this;
    if(this.all_senders.length > 0){
      this.all_senders.forEach(function(cont){
        if(cont.invite_id == self.rec_id){
          self.senders = {
          	inviteId : cont.invite_id,
          	user_name : cont.invite_name,
          	user_email : cont.invite_email
          };
        }
      });
    } 
    console.log(this.senders)
  }

  addTransmittal(subject,rec_id,tradeId='0',comments,description,sending_items,type = null)
  {
    if(type == 'submittal'){
      this.tabs = 'submittals_tab'; 
    }
    else{
    	if(subject == '' || subject == undefined)
    	{
    		let toast = this.toastCtrl.create({
            message: 'Please enter valid subject.',
            duration: 3000,
            position: 'top',
            cssClass: 'danger'
           });
           toast.present(); 
           this.tabs = 'basicdetail'; 
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
           this.tabs = 'basicdetail'; 
           return false;
    	}
    	// if(this.filterTradeId == '0')
    	// {
    	// 	if(tradeId == '' || tradeId == undefined)
  	  // 	{
  	  // 		let toast = this.toastCtrl.create({
  	  //         message: 'Please select valid trade.',
  	  //         duration: 3000,
  	  //         position: 'top',
     //          cssClass: 'danger'
  	  //        });
  	  //        toast.present(); 
     //         this.tabs = 'basicdetail'; 
  	  //        return false;
  	  // 	}
    	// }
    	// else
    	// {
     //    // tradeId = localStorage.getItem('filterTradeId');
    	// 	tradeId = '0';
    	// }
    	if(description == '' || description == undefined)
      {
        let toast = this.toastCtrl.create({
            message: 'Please enter description.',
            duration: 3000,
            position: 'top',
            cssClass: 'danger'
           });
           toast.present(); 
           this.tabs = 'basicdetail'; 
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
           this.tabs = 'basicdetail'; 
           return false;
    	}

    	var submittals = JSON.stringify(this.all_submittals);
    	const loading = this.loadingCtrl.create({});
      loading.present(); 
      this.companyProvider.addTransmittal(subject,rec_id,'0',comments,this.userId,this.jobId,submittals,this.senders,description,sending_items,this.sender_sign,this.other_type).subscribe((formdata)=>{
      	loading.dismissAll();
      	if(formdata.status == '1')
      	{
      		let toast = this.toastCtrl.create({
  	          message: 'Transmittal added successfully.',
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
  	if(item == '' || item == undefined || item == null)
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
            code : Math.floor(Math.random() * 100000),
            issue_date : self.issue_date,
	        due_date : self.due_date,
	        quantity : self.quantity,
	        sub_by : self.send_from,
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
        code : Math.floor(Math.random() * 100000),
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
                  code : Math.floor(Math.random() * 100000),
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
              });
              // this.submittal_type = '';
              this.item = '';
              this.submittal_type = '';
		      this.issue_date = this.current_date;
		      this.due_date = '';
		      this.quantity = '';
		      this.tradeId = '';
		      this.state = 'new';
		      this.sub_sign = '';
		      this.sub_comments = '';
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
            var new_item = {
              type : self.submittal_type == 'other' ? (self.errors.indexOf(self.sub_other_type) == -1 ? self.sub_other_type : 'other') : self.submittal_type,
              item : 'directory/transmittal_files/'+file.file,
              code : Math.floor(Math.random() * 100000),
              date_created : file.date,
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
          });
          // this.submittal_type = '';
          this.item = '';
          this.submittal_type = '';
	      this.issue_date = this.current_date;
	      this.due_date = '';
	      this.quantity = '';
	      this.tradeId = '';
	      this.state = 'new';
	      this.sub_sign = '';
	      this.sub_comments = '';
	      this.action_items = [];
        }
      }
     });
     modal.present();
  }


  uploadNow(){
  	this.uploader.uploadAll();
  }

  root(){
    this.navCtrl.setRoot('DashboardPage');
  };

  myTransmittals()
	{
		this.navCtrl.push('direct-transmittals',{
			jobId : this.jobId,
			inviteId : this.inviteId
		});
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
