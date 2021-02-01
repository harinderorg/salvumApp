import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams , ViewController, ModalController, AlertController,ToastController,LoadingController } from 'ionic-angular';
import { CompanyProvider } from '../../providers/company/company';
import { FileUploader } from 'ng2-file-upload';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';


@IonicPage()
@Component({
  selector: 'page-edit-submittal',
  templateUrl: 'edit-submittal.html',
  providers: [CompanyProvider]
})
export class EditSubmittalPage {
@ViewChild(SignaturePad) signaturePad: SignaturePad;
private signaturePadOptions: Object = { 
    'minWidth': 1,
    'canvasWidth': 500,
    'canvasHeight': 100,
    'backgroundColor': '#fff'
};
all_RFIs:any;
all_contracts_list:any;
alltrades:any;
submittal:any;
all_action_items:any;
submittal_type:any;
tradeId:any;
issue_date:any;
due_date:any;
quantity:any;
state:any;
sub_comments:any;
action_items:any;
item:any;
sign:any;
sub_sign:any='';
sub_other_type : any;
subId:any;
jobId:any;
active_job_breadcrumb = localStorage.getItem('active_job_breadcrumb');
APIURL:any = localStorage.getItem('APIURL')
errors:any = ['',null,undefined];
selectOptions1 = {  
  cssClass: 'drop-select', 
};
date_created:any='';
sub_by:any='';
restricted_access:any;
inviteId:any;
u_email:any;
send_from:any = localStorage.getItem('userName');
userId:any;
transId:any;
bid_job_name:any = localStorage.getItem('bid_job_name');
  constructor(public navCtrl: NavController, public navParams: NavParams, public companyProvider: CompanyProvider, public loadingCtrl: LoadingController, public toastCtrl: ToastController, public modalCtrl: ModalController, public viewCtrl: ViewController) {
  	this.all_action_items = ['For approval','For your use','As requested','Approved as submitted','Approved as noted','Return for corrections','Resubmit copies for approval','submit [#] copies for distribution','return [#] corrected prints','for review and comment','revise and resubmit/work may not proceed','for bids due','prints returned after loan'];
  	this.all_RFIs = navParams.get('all_RFIs');
  	this.all_contracts_list = navParams.get('all_contracts_list');
  	this.alltrades = navParams.get('alltrades');
  	this.jobId = navParams.get('jobId');
  	this.submittal = navParams.get('sub');
  	this.restricted_access = navParams.get('restricted_access');
  	this.inviteId = navParams.get('inviteId');
  	this.u_email = navParams.get('u_email');
  	this.transId = navParams.get('transId');
  	this.userId = localStorage.getItem('userinfo');
  	if(this.submittal == undefined){
  		if(this.restricted_access == '0'){
	  		this.all_RFIs = JSON.parse(localStorage.getItem('es_all_RFIs'));
		  	this.all_contracts_list = JSON.parse(localStorage.getItem('es_all_contracts_list'));
		  	this.alltrades = JSON.parse(localStorage.getItem('es_alltrades'));
	  	}
	  	this.submittal = JSON.parse(localStorage.getItem('es_submittal'));
	  	this.jobId = localStorage.getItem('es_jobId');
	  	this.restricted_access = localStorage.getItem('es_restricted_access');
	  	this.inviteId = localStorage.getItem('es_inviteId');
	  	this.u_email = localStorage.getItem('es_u_email');
	  	this.transId = localStorage.getItem('es_transId');
  	}
  	else{
  		if(this.restricted_access == '0'){
	  		localStorage.setItem('es_all_RFIs',JSON.stringify(this.all_RFIs));
	  		localStorage.setItem('es_all_contracts_list',JSON.stringify(this.all_contracts_list));
	  		localStorage.setItem('es_alltrades',JSON.stringify(this.alltrades));
  		}
  		localStorage.setItem('es_submittal',JSON.stringify(this.submittal));
  		localStorage.setItem('es_jobId',this.jobId);
  		localStorage.setItem('es_restricted_access',this.restricted_access);
  		localStorage.setItem('es_inviteId',this.inviteId);
  		localStorage.setItem('es_u_email',this.u_email);
  		localStorage.setItem('es_transId',this.transId);
  	}
  	console.log(this.submittal)
  	this.submittal_type = this.submittal.type;
  	this.tradeId = this.submittal.tradeId;
  	this.issue_date = this.submittal.issue_date;
  	this.due_date = this.submittal.due_date;
  	this.quantity = this.submittal.quantity;
  	this.state = this.submittal.state;
  	this.sub_comments = this.submittal.sub_comments;
  	this.action_items = this.submittal.action_items;
  	this.item = this.submittal.item;
  	this.sign = this.submittal.sign;
  	this.subId = this.submittal._id;
  	if(this.errors.indexOf(this.subId) >= 0){
  		this.sub_sign = this.sign;
  	}
  	if(this.restricted_access == '1'){
  		this.tradeId = '1';
  	}
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad EditSubmittalPage');
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

  drawCompleteS() {
    this.sub_sign = this.signaturePad.toDataURL();
  }

  clearSign(){
  	this.sub_sign = '';
    this.signaturePad.clear(); 
  }

  changeSign(){
  	this.sign = '';
  	this.sub_sign = '';
  }

  filemanagerFiles()
  {
    let modal = this.modalCtrl.create('FilemanagerfilesPage',{transmittal_file : '1', single_allowed: '1'});
     modal.onDidDismiss(data => {
      if(data != undefined && data != '' && data != null)
          {       
            var self = this;
            if(data.length > 0){
              data.forEach(function(file){
              	self.item = file.path;
		        self.sub_by = self.send_from;
              });
            }
          }
     });
     modal.present();
  }

  uploadFiles()
  {
    let modal = this.modalCtrl.create('UploadfilePage', {transmittal_file : '1', single_allowed : '1'});
     modal.onDidDismiss(data => {
      if(data != undefined && data != '' && data != null)
      {
        var self = this;
        console.log(data)
        if(data.length > 0){
          data.forEach(function(file){
          	self.item = 'directory/transmittal_files/'+file.file;
	        self.date_created = file.date;
	        self.sub_by = self.send_from;
          });
        }
      }
     });
     modal.present();
  }

  jobFiles()
  {
    let modal = this.modalCtrl.create('JobfilesPage', {jobId : this.jobId, single_allowed : '1'});
     modal.onDidDismiss(data => {
      if(data != undefined && data != '' && data != null)
      {
        console.log(data)
        var self = this;
        var file_item;
        if(data.length > 0){
          data.forEach(function(file){
            console.log(file)
            if(data.path == undefined){
              file_item = 'directory/jobs_data/'+file.file_name;
            }
            else{
              file_item = file.path;
            }

            self.item = file_item;
	        self.date_created = file.date_created;
	        self.sub_by = self.send_from;
          });
        }
      }
     });
     modal.present();
  }

  editSubmittal(){
  	var sub_item = {
      type : this.submittal_type == 'other' ? (this.errors.indexOf(this.sub_other_type) == -1 ? this.sub_other_type : 'other') : this.submittal_type,
      item : this.item,
      issue_date : this.issue_date,
      due_date : this.due_date,
      quantity : this.quantity,
      tradeId : this.tradeId,
      state : this.state,
      sub_comments : this.sub_comments,
      sign : this.sub_sign,
      action_items : this.action_items,
      subId : this.subId,
      date_created : this.date_created,
      sub_by : this.sub_by,
      sub_sign : this.sub_sign,
      transId : this.transId
    };

    console.log(sub_item)
    const loading = this.loadingCtrl.create({});
    loading.present(); 
    this.companyProvider.postData('editSubmittal',sub_item).subscribe((formdata)=>{
    	loading.dismissAll();
    	if(formdata.status == '1')
    	{
    		let toast = this.toastCtrl.create({
	          message: 'Submittal updated successfully.',
	          duration: 3000,
	          position: 'top',
            cssClass: 'success'
	         });
	         toast.present();
	         if(this.restricted_access == '1'){
	         	this.backPage();
	         }
	         else{
	         	this.back();
	         }
	         
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

  back(){
  	this.navCtrl.push('EditTransmittalPage');
  }

  transmittals(){
  	this.navCtrl.push('TransmittalsPage');
  }

  backToTradeDash(){
	this.navCtrl.push('TradeDashboardPage',{
	back : '1'
	});
  }

  root(){
	this.navCtrl.setRoot('DashboardPage');
  };
    
  goToJobs(){
	  this.navCtrl.push('ManagejobPage',{
	   is_direct : '0'
	  });
  };

  goToBids(){
    this.navCtrl.push('bidjobs', {
      type: '0'
    });
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

	backPage(){
    this.navCtrl.push('EditDirTransmittalPage');
  }

}
