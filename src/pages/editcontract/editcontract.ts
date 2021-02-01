import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams  , ModalController, AlertController,ToastController,LoadingController,ViewController } from 'ionic-angular';
import { CompanyProvider } from '../../providers/company/company';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-editcontract',
  templateUrl: 'editcontract.html',
  providers: [CompanyProvider, FormBuilder]
})
export class EditcontractPage {
tabInput: string = "basicdetail";
form: FormGroup;
job_number: any;
job_title: any;
trade_name: any;
trade_task: any;
contract_date: any;
min_date: any;
max_date: any;
job_description: any;
jobId: any;
ContId: any;
tradeId: any;
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
isBrowser = localStorage.getItem('isBrowser');
active_job_breadcrumb = localStorage.getItem('active_job_breadcrumb');
  constructor(public modalCtrl: ModalController, public navCtrl: NavController, public navParams: NavParams, public companyProvider: CompanyProvider, public alertCtrl: AlertController, public toastCtrl: ToastController,public loadingCtrl: LoadingController, private formBuilder:FormBuilder, public viewCtrl: ViewController) {

  		this.jobId = navParams.get('jobId');
  		this.ContId = navParams.get('ContId');
  		this.tradeId = navParams.get('tradeId');
  		this.form = this.formBuilder.group({
      		  job_title: new FormControl({value: this.job_title, disabled: true}, Validators.required),
		      job_number: new FormControl({value: this.job_number, disabled: true}, Validators.required),
		      trade_name: new FormControl({value: this.trade_name, disabled: true}, Validators.required),
		      trade_task: ['', [Validators.required]],
		      job_description: ['', [Validators.required]],
		      contract_date: ['', [Validators.required]],
		      pm_name: ['', []],
		      pm_contact: ['', []],
		      site_address: ['', []],
		      site_address2: ['', []],
		      site_city: ['', []],
		      site_state: ['', []],
		      site_country: ['', []],
		      site_zip: ['', []],
		      owner_name: ['', []],
		      owner_address: ['', []],
		      owner_city: ['', []],
		      owner_state: ['', []],
		      owner_country: ['', []],
		      owner_zip: ['', []],
		      last_updated: ['', []],
		      total_owned_by_owner: ['', []],
		      total_gc_owes_subs: ['', []],
		      original_contract_amount: ['', []],
		      sub_contract_amount: ['', []],
		      net_co_to_date: ['', []],
		      subs_change_orders: ['', []],
		      updated_contract_amount: ['', []],
		      total_sub_contractors: ['', []],
		      retainage_due: ['', []],
		      sub_retainage_due: ['', []],
		      total_paid_by_owner: ['', []],
		      total_gc_paid_subs: ['', []],
		      retainage_contractor: ['', []],
		      retainage_for_subs: ['', []],
		      bonding_due_or_withheld: ['', []],
		      project_start_date: ['', []],
		      schedule_days: ['', []],
		      schedule_impact_days: ['', []],
		      proposed_finish_date: ['', []],
		      bonding_required: ['', []],
		      bonding_input: ['', []],
		      profit_overhead: ['', []]
		    });
  		if(this.jobId == undefined)
	    {
	      	// this.navCtrl.push('ContractsPage');
	      	this.jobId = localStorage.getItem('edit_cont_jobId');
	  		this.ContId = localStorage.getItem('edit_cont_ContId');
	  		this.tradeId = localStorage.getItem('edit_cont_tradeId');
	    }
	    else
	    {
	    	localStorage.setItem('edit_cont_jobId',this.jobId);
	    	localStorage.setItem('edit_cont_ContId',this.ContId);
	    	localStorage.setItem('edit_cont_tradeId',this.tradeId);
	    }
	    	const loading = this.loadingCtrl.create({});
      		loading.present();
	    	this.min_date = this.getToday();
	    	this.max_date = + this.getFullYear() + 30;
	    	this.companyProvider.jobDetails(this.jobId).subscribe((jobdetails)=>{
	    		jobdetails = jobdetails[0];
		        this.job_number = jobdetails.job_number;
		        this.job_title = jobdetails.job_title;
		      },
			    err => {
			        loading.dismissAll();
			        this.showTechnicalError();
			    });
	    	this.companyProvider.tradeDetails(this.tradeId).subscribe((tradedetails)=>{
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
	    	this.companyProvider.contractDetails(this.ContId).subscribe((contractdetails)=>{
	    		if(contractdetails != '')
	    		{
	    			this.contract_date = contractdetails.contract_date;
	    			this.pm_name = contractdetails.pm_name;
	    			this.pm_contact = contractdetails.pm_contact;
	    			this.site_address = contractdetails.site_address;
	    			this.site_address2 = contractdetails.site_address2;
	    			this.site_city = contractdetails.site_city;
	    			this.site_state = contractdetails.site_state;
	    			this.site_country = contractdetails.site_country;
	    			this.site_zip = contractdetails.site_zip;
	    			this.owner_name = contractdetails.owner_name;
	    			this.owner_address = contractdetails.owner_address;
	    			this.owner_city = contractdetails.owner_city;
	    			this.owner_state = contractdetails.owner_state;
	    			this.owner_country = contractdetails.owner_country;
	    			this.owner_zip = contractdetails.owner_zip;
	    			this.last_updated = contractdetails.last_updated;
	    			this.total_owned_by_owner = contractdetails.total_owned_by_owner;
	    			this.total_gc_owes_subs = contractdetails.total_gc_owes_subs;
	    			this.original_contract_amount = contractdetails.original_contract_amount;
	    			this.sub_contract_amount = contractdetails.sub_contract_amount;
	    			this.net_co_to_date = contractdetails.net_co_to_date;
	    			this.subs_change_orders = contractdetails.subs_change_orders;
	    			this.updated_contract_amount = contractdetails.updated_contract_amount;
	    			this.total_sub_contractors = contractdetails.total_sub_contractors;
	    			this.retainage_due = contractdetails.retainage_due;
	    			this.sub_retainage_due = contractdetails.sub_retainage_due;
	    			this.total_paid_by_owner = contractdetails.total_paid_by_owner;
	    			this.total_gc_paid_subs = contractdetails.total_gc_paid_subs;
	    			this.retainage_contractor = contractdetails.retainage_contractor;
	    			this.retainage_for_subs = contractdetails.retainage_for_subs;
	    			this.bonding_due_or_withheld = contractdetails.bonding_due_or_withheld;
	    			this.project_start_date = contractdetails.project_start_date;
	    			this.schedule_days = contractdetails.schedule_days;
	    			this.schedule_impact_days = contractdetails.schedule_impact_days;
	    			this.proposed_finish_date = contractdetails.proposed_finish_date;
	    			this.bonding_required = contractdetails.bonding_required;
	    			this.bonding_input = contractdetails.bonding_input;
	    			this.profit_overhead = contractdetails.profit_overhead;
	    		}
	    		loading.dismissAll();
		      },
		    err => {
		        loading.dismissAll();
		        this.showTechnicalError();
		    });

  }

  getToday()
  {
  	var today,dd,mm = '';
  	 today = new Date();
	 dd = today.getDate();
	 mm = today.getMonth()+1; //January is 0!

	var yyyy = today.getFullYear();
	if(dd < '10'){
	    dd='0'+dd;
	} 
	if(mm < '10'){
	    mm='0'+mm;
	} 
	return today = yyyy+'-'+mm+'-'+dd;
  }

  submit_cont_edit(){
  	document.getElementById('submit_cont_edit').click();
  }

  getFullYear()
  {
  	var today,year = '';
  	today = new Date();
	year = today.getFullYear();
	return year; 
  }

  addContract(){ 
    for (let i in this.form.controls) {
      this.form.controls[i].markAsTouched();
    }
    if(this.form.valid){
    	const loading = this.loadingCtrl.create({});
      	loading.present();
        
        this.companyProvider.editContract(this.ContId,this.form.value).subscribe((formdata)=>{
	        if(formdata.status == '1')
	        {
	        	loading.dismissAll()
                  let toast = this.toastCtrl.create({
                      message: 'Contract updated successfully.',
                      duration: 3000,
                      position: 'top',
                      cssClass: 'success'
                     });
                     toast.present(); 
                     this.viewCtrl.dismiss();
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
    else
    {
    	let toast = this.toastCtrl.create({
          message: 'Please fill required fields.',
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

  backToPage()
  {
    this.viewCtrl.dismiss();
  }

  backToTradeDash()
  {
    this.navCtrl.push('TradeDashboardPage',{
      back : '1'
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


}
