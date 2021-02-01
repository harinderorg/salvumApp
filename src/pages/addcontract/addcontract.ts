import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams  , ModalController, AlertController,ToastController,LoadingController,ViewController } from 'ionic-angular';
import { CompanyProvider } from '../../providers/company/company';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
@IonicPage()
@Component({
  selector: 'page-addcontract',
  templateUrl: 'addcontract.html',
  providers: [CompanyProvider, FormBuilder]
})
export class AddcontractPage {
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
tradeId: any;
BidId: any;
InvId: any;
active_job_breadcrumb = localStorage.getItem('active_job_breadcrumb');
  constructor(public modalCtrl: ModalController, public navCtrl: NavController, public navParams: NavParams, public companyProvider: CompanyProvider, public alertCtrl: AlertController, public toastCtrl: ToastController,public loadingCtrl: LoadingController, private formBuilder:FormBuilder, public viewCtrl: ViewController) {

  		this.jobId = navParams.get('jobId');
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
	      	this.navCtrl.push('ManagejobPage',{
	      		is_direct : '0'
	      	});
	    }
	    else
	    {
	    	const loading = this.loadingCtrl.create({});
      		loading.present();
	    	this.tradeId = navParams.get('tradeId');
	    	this.InvId = navParams.get('InvId');
	    	this.BidId = navParams.get('BidId');
	    	this.contract_date = this.getToday();
	    	this.min_date = this.getToday();
	    	this.max_date = + this.getFullYear() + 30;
	    	this.companyProvider.jobDetails(this.jobId).subscribe((jobdetails)=>{
	    		jobdetails = jobdetails[0];
		        this.job_number = jobdetails.job_number;
		        this.job_title = jobdetails.job_title;
		      },
	          err => {
	              this.showTechnicalError();
	          });
	    	this.companyProvider.tradeDetails(this.tradeId).subscribe((tradedetails)=>{
	    		if(tradedetails != '')
	    		{
	    			this.trade_name = tradedetails.trade_name;
			        this.trade_task = tradedetails.trade_task;
			        this.job_description = tradedetails.job_description;
	    		}
	    		loading.dismissAll();
		      },
	          err => {
	              loading.dismissAll();
	              this.showTechnicalError();
	          });
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

  submit_cont_frm(){
  	document.getElementById('submit_cont_frm').click();
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
        var InvtId = (this.InvId == null || this.InvId == '') ? '0' : this.InvId;
        this.companyProvider.addContract(InvtId,this.BidId,this.jobId,this.tradeId,this.form.value).subscribe((formdata)=>{
	        if(formdata.status == '1')
	        {
	        	loading.dismissAll()
                  let toast = this.toastCtrl.create({
                      message: 'Contract added successfully.',
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


}
