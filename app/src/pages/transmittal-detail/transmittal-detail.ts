import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController, AlertController,ToastController,LoadingController } from 'ionic-angular';
import { CompanyProvider } from '../../providers/company/company';
import * as $ from 'jquery';

@IonicPage()
@Component({
  selector: 'page-transmittal-detail',
  templateUrl: 'transmittal-detail.html',
  providers: [CompanyProvider]
})         
export class TransmittalDetailPage {
tid:any;               
userId:any;
userName:any;      
userAddress:any;          
userPhone:any;           
userCompany:any;           
transmittal:any;       
transmittal_number: any;       
subject: any;    
sender_id: any;  
comments: any; 
description: any;   
submittals: any;  
date_sent: any;   
isSent: any;    
senders: any;
jobId: any;
tradeId: any;
trade_name: any;
trade_task: any;
trade_icon: any;
job_name: any;
job_number: any;
rec_id: any;
toName: any;
toEmail: any;
tocompany: any;
toAddress: any;
sending_items : any=[];
alltrades : any=[];
toPhone: any;
sender_sign:any;
rec_sign:any;   
APIURL:any = localStorage.getItem('APIURL')
isBrowser = localStorage.getItem('isBrowser');
my_name = localStorage.getItem('userName');
active_job_breadcrumb = localStorage.getItem('active_job_breadcrumb');
errors:any=['',null,undefined];
all_sending_items:any;
all_action_items:any=[];
  constructor(public modalCtrl: ModalController, public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams, public companyProvider: CompanyProvider, public alertCtrl: AlertController, public toastCtrl: ToastController,public loadingCtrl: LoadingController ) {
  	this.tid = navParams.get('tid');
    if(this.tid == undefined){
          // this.navCtrl.push('TransmittalsPage');
          this.tid = localStorage.getItem('current_tr_id');
      }
      else{
        localStorage.setItem('current_tr_id',this.tid); 
      }
      this.userId = localStorage.getItem('userinfo');
      this.getTransmittalDetails();

      this.getCurrentuser(); 
      this.all_sending_items = {
          'plans' : 'Plans',
          'drawings' : 'Drawings',
          'specifications' : 'Specifications',
          'copy of letter' : 'Copy of Letter',
          'prints' : 'Prints',
          'shop drawings' : 'Shop Drawings',
          'letter' : 'Letter',
          'samples' : 'Samples',
          'rfi' : 'RFI',
          'contract' : 'Contract',
          'change order' : 'Change Order',
          'reproducible' : 'Reproducible',
          'other' : 'Other'
      };
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

  getAllTrades(){
  var self = this;
    this.companyProvider.allTrades(this.jobId).subscribe((alltrades)=>{
      if(alltrades.length > 0){
        alltrades.forEach(function(trade){
          self.alltrades[trade._id] = {
            trade_id : trade._id,
            trade_icon : trade.trade_icon,
            trade_name : trade.trade_name,
            trade_task : trade.trade_task
          }
        });
      }
    });
  }

  getTransmittalDetails(){
  	const loading = this.loadingCtrl.create({});
    loading.present(); 
  	this.companyProvider.getTransmittalDetails(this.tid).subscribe((transmittal)=>{
  		
  		this.transmittal = transmittal;  
  		if(transmittal != null)
  		{
			this.transmittal_number = transmittal[0].transmittal_number;
			this.subject = transmittal[0].subject;
			this.sender_id = transmittal[0].sender_id;
			this.rec_id = transmittal[0].rec_id;
      this.comments = transmittal[0].comments;
      this.description = transmittal[0].description;
			this.sending_items = transmittal[0].sending_items;
			this.submittals = transmittal[0].submittals;
      console.log(this.submittals)
			this.date_sent = transmittal[0].date_sent;
			this.isSent = transmittal[0].isSent;
      this.jobId = transmittal[0].jobId;
			this.senders = transmittal[0].senders;
			this.tradeId = transmittal[0].tradeId;
			this.trade_name = transmittal[0].trade_name;
			this.trade_task = transmittal[0].trade_task;
			this.trade_icon = transmittal[0].trade_icon;
      this.job_name = transmittal[0].job_name;
      this.sender_sign = transmittal[0].sender_sign;
			this.rec_sign = transmittal[0].rec_sign;
            this.job_number = transmittal[0].job_number;
            var self = this;
            if(this.submittals.length > 0){
              this.submittals.forEach(function(subm){
                if(subm.action_items.length > 0){
                  subm.action_items.forEach(function(acitm){
                    if(self.all_action_items.indexOf(acitm) == -1){
                      self.all_action_items.push(acitm);
                    }
                  })
                }
              });
            }
            console.log(this.all_action_items)
            this.getAllTrades();
            this.companyProvider.getTransmittalReceiver(this.sender_id).subscribe((recUser)=>{
    	  			this.toName = recUser.name;
    	  			this.toEmail = recUser.email;
    	  			this.tocompany = recUser.company;
              this.toAddress = recUser.address;
    	  			this.toPhone = recUser.phone;
              this.companyProvider.getCompanyDetails(this.jobId).subscribe((myCompany)=>{
                console.log(myCompany)
                if(myCompany.status == '1')
                {
                  this.userCompany = myCompany.data.company_name;
                  this.userAddress = myCompany.data.address;
                }
                else
                {
                  this.userCompany = '';
                  this.userAddress = '';
                }
                loading.dismissAll();
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
      else
      {
        loading.dismissAll();
      }
	  },
    err => {
        loading.dismissAll();
        this.showTechnicalError();
    });
  }

  seeAcItems(act_items){
    let modal = this.modalCtrl.create('ActionItemsPage', {action_items : act_items});
    modal.present();
  }

  submittalClicked(type,item,sub){
    console.log(sub)
    if(type == 'contract'){
      this.navCtrl.push('ViewcontractPage',{
        jobId : this.jobId,
        tradeId : this.tradeId,
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

  editTransmittal(type)
  {
    this.navCtrl.push('EditTransmittalPage',{
      jobId : this.jobId,
      tid : this.tid,
      type : type
    });
  }

  getCurrentuser(){
  	this.companyProvider.viewUser(this.userId).subscribe((currentUser)=>{
  		if(currentUser != null)
  		{
  			this.userName = currentUser.name;
  			this.userPhone = currentUser.phone;
  		}
  	},
    err => {
        this.showTechnicalError();
    });
  }

  printIt(){
    var printContent = $(".trans_cover_letter").html();
    const WindowPrt = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
    WindowPrt.document.write(printContent);
    WindowPrt.document.close();
    WindowPrt.focus();
    setTimeout(function() {
        WindowPrt.print();
        WindowPrt.close();
    }, 2000);
  }

  backPage(){
    this.navCtrl.push('TransmittalsPage');
  }

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
