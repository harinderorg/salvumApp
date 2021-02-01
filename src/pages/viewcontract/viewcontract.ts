import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams , AlertController,ToastController,LoadingController,ViewController, ModalController } from 'ionic-angular';
import { CompanyProvider } from '../../providers/company/company';

@IonicPage()
@Component({
  selector: 'page-viewcontract',
  templateUrl: 'viewcontract.html',
  providers: [CompanyProvider]
})
export class ViewcontractPage {
jobId:any;
bidId:any;
tradeId:any;
userId:any;
loginId:any;
trade_name:any;
trade_task:any;
job_description:any;
job_number:any;
job_title:any;
contractdetails:any;
main_email:any;
main_name:any;
main_image:any;
user_email:any;
user_name:any;
user_image:any;
status:any;
APIURL:any;
contract_date:any;
pm_name : any;
pm_contact : any;
site_address : any;
site_address2 : any;
site_city : any;
site_state : any;
site_country : any;
site_zip : any;
owner_name : any;
owner_address : any;
owner_city : any;
owner_state : any;
owner_country : any;
owner_zip : any;
last_updated : any;
total_owned_by_owner : any;
total_gc_owes_subs : any;
original_contract_amount : any;
sub_contract_amount : any;
net_co_to_date : any;
subs_change_orders : any;
updated_contract_amount : any;
total_sub_contractors : any;
retainage_due : any;
sub_retainage_due : any;
total_paid_by_owner : any;
total_gc_paid_subs : any;
retainage_contractor : any;
retainage_for_subs : any;
bonding_due_or_withheld : any;
project_start_date : any;
schedule_days : any;
schedule_impact_days : any;
proposed_finish_date : any;
bonding_required : any;
bonding_input : any;
profit_overhead : any; 
state : any; 
isBrowser = localStorage.getItem('isBrowser');
bid_job_name = localStorage.getItem('bid_job_name');
  constructor(public navCtrl: NavController, public navParams: NavParams, public companyProvider: CompanyProvider, public alertCtrl: AlertController, public toastCtrl: ToastController,public loadingCtrl: LoadingController, public viewCtrl: ViewController, public modalCtrl: ModalController) {

  	this.jobId = navParams.get('jobId');
	this.bidId = navParams.get('bidId');
	this.tradeId = navParams.get('tradeId');
    this.APIURL = localStorage.getItem('APIURL');
	this.loginId = localStorage.getItem('userinfo');
    this.state = null;
    if(navParams.get('page_type') == '1')
    {
        this.state = '1';
    }

	const loading = this.loadingCtrl.create({});
		loading.present();
	this.companyProvider.jobDetails(this.jobId).subscribe((jobdetails)=>{
        jobdetails = jobdetails[0];
        this.job_number = jobdetails.job_number;
        this.job_title = jobdetails.job_title;
        this.userId = jobdetails.userId;
	        this.companyProvider.viewContractDetails(this.bidId,this.userId,this.state).subscribe((contractdetails)=>{
                if(contractdetails._doc == undefined){
                    loading.dismissAll();
                    let toast = this.toastCtrl.create({
                        message: 'Contract has been deleted.',
                        duration: 3000,
                        position: 'top',
                        cssClass: 'danger'
                    });
                    toast.present();
                    this.viewCtrl.dismiss();
                }
				this.main_email = contractdetails.main_email;
				this.main_name = contractdetails.main_name;
				this.main_image = contractdetails.main_image;
				this.user_email = contractdetails.user_email; 
				this.user_name = contractdetails.user_name;
				this.user_image = contractdetails.user_image;
                this.contract_date = contractdetails._doc.contract_date;
				this.status = contractdetails._doc.status;
    			this.pm_name = contractdetails._doc.pm_name;
    			this.pm_contact = contractdetails._doc.pm_contact;
    			this.site_address = contractdetails._doc.site_address;
    			this.site_address2 = contractdetails._doc.site_address2;
    			this.site_city = contractdetails._doc.site_city;
    			this.site_state = contractdetails._doc.site_state;
    			this.site_country = contractdetails._doc.site_country;
    			this.site_zip = contractdetails._doc.site_zip;
    			this.owner_name = contractdetails._doc.owner_name;
    			this.owner_address = contractdetails._doc.owner_address;
    			this.owner_city = contractdetails._doc.owner_city;
    			this.owner_state = contractdetails._doc.owner_state;
    			this.owner_country = contractdetails._doc.owner_country;
    			this.owner_zip = contractdetails._doc.owner_zip;
    			this.last_updated = contractdetails._doc.last_updated;
    			this.total_owned_by_owner = contractdetails._doc.total_owned_by_owner;
    			this.total_gc_owes_subs = contractdetails._doc.total_gc_owes_subs;
    			this.original_contract_amount = contractdetails._doc.original_contract_amount;
    			this.sub_contract_amount = contractdetails._doc.sub_contract_amount;
    			this.net_co_to_date = contractdetails._doc.net_co_to_date;
    			this.subs_change_orders = contractdetails._doc.subs_change_orders;
    			this.updated_contract_amount = contractdetails._doc.updated_contract_amount;
    			this.total_sub_contractors = contractdetails._doc.total_sub_contractors;
    			this.retainage_due = contractdetails._doc.retainage_due;
    			this.sub_retainage_due = contractdetails._doc.sub_retainage_due;
    			this.total_paid_by_owner = contractdetails._doc.total_paid_by_owner;
    			this.total_gc_paid_subs = contractdetails._doc.total_gc_paid_subs;
    			this.retainage_contractor = contractdetails._doc.retainage_contractor;
    			this.retainage_for_subs = contractdetails._doc.retainage_for_subs;
    			this.bonding_due_or_withheld = contractdetails._doc.bonding_due_or_withheld;
    			this.project_start_date = contractdetails._doc.project_start_date;
    			this.schedule_days = contractdetails._doc.schedule_days;
    			this.schedule_impact_days = contractdetails._doc.schedule_impact_days;
    			this.proposed_finish_date = contractdetails._doc.proposed_finish_date;
    			this.bonding_required = contractdetails._doc.bonding_required;
    			this.bonding_input = contractdetails._doc.bonding_input;
    			this.profit_overhead = contractdetails._doc.profit_overhead;

    			this.companyProvider.tradeDetails(this.tradeId).subscribe((tradedetails)=>{
    				loading.dismissAll();
    					if(tradedetails != '')
        					{
        						this.trade_name = tradedetails.trade_name;
        				        this.trade_task = tradedetails.trade_task;
        				        this.job_description = tradedetails.job_description;
        					}
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
				},
                err => {
                    loading.dismissAll();
                    this.showTechnicalError();
                });
  }

    backPage()
    {
    	this.viewCtrl.dismiss();
    }
    downloadPdf()
    {
    	let modal = this.modalCtrl.create('PdfPage', {
    		jobId : this.jobId,
    		tradeId : this.tradeId,
    		bidId : this.bidId
    	});
        modal.present();
    }
    root(){
        this.navCtrl.setRoot('DashboardPage');
      };
    goToBids(){
        this.navCtrl.push('bidjobs', {
            type: '0'
        });
    };

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

}
