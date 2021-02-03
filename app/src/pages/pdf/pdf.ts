import { Component } from '@angular/core';
import { IonicPage, ToastController, NavController, NavParams, ViewController, LoadingController } from 'ionic-angular';
import { CompanyProvider } from '../../providers/company/company';
import { PdfmakeService } from 'ng-pdf-make/pdfmake/pdfmake.service';
import { Cell, Row, Table } from 'ng-pdf-make/objects/table';
import * as pdfMake from 'pdfmake/build/pdfmake.js';
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@IonicPage()
@Component({
  selector: 'page-pdf',
  templateUrl: 'pdf.html',
  providers: [CompanyProvider]
})
export class PdfPage {
jobId:any;
bidId:any;
tradeId:any;
userId:any;
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
  constructor(public navCtrl: NavController, public navParams: NavParams, public companyProvider: CompanyProvider, public viewCtrl: ViewController, private pdfmake: PdfmakeService, public loadingCtrl: LoadingController, public toastCtrl: ToastController) {

  	this.jobId = navParams.get('jobId');
	this.bidId = navParams.get('bidId');
	this.tradeId = navParams.get('tradeId');
	this.APIURL = localStorage.getItem('APIURL');

	const loading = this.loadingCtrl.create({});
		loading.present();

	this.companyProvider.jobDetails(this.jobId).subscribe((jobdetails)=>{
        jobdetails = jobdetails[0];
        this.job_number = jobdetails.job_number;
        this.job_title = jobdetails.job_title;
        this.userId = jobdetails.userId;
	        this.companyProvider.viewContractDetails(this.bidId,this.userId).subscribe((contractdetails)=>{
				this.main_email = contractdetails.main_email;
				this.main_name = contractdetails.main_name;
				this.main_image = contractdetails.main_image;
				this.user_email = contractdetails.user_email;
				this.user_name = contractdetails.user_name;
				this.user_image = contractdetails.user_image;
                if(contractdetails._doc != undefined) {
    				this.contract_date = contractdetails._doc.contract_date;
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
                }
                else{
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
    			this.companyProvider.tradeDetails(this.tradeId).subscribe((tradedetails)=>{
    				loading.dismissAll();
					if(tradedetails != '')
					{
						this.trade_name = tradedetails.trade_name;
				        this.trade_task = tradedetails.trade_task;
				        this.job_description = tradedetails.job_description;
					}
// start pdf
this.pdfmake.docDefinition.content = [];
this.pdfmake.configureStyles({ header: { fontSize: 15, bold: true, margin: [0, 5] } });

// Add a text with style
this.pdfmake.addText('Contract #'+this.job_number, 'header');
// Create Headers cells
const header1 = new Cell('PO/Job');
const header2 = new Cell(this.job_number);

// Create headers row
const headerRows = new Row([header1, header2]);

// Create a content row
const row1 = new Row([new Cell('Job Title'), new Cell(this.job_title)]);
const row2 = new Row([new Cell('Trade'), new Cell(this.trade_name)]);
const row3 = new Row([new Cell('Task'), new Cell(this.trade_task)]);
const row4 = new Row([new Cell('Description'), new Cell(this.job_description)]);
const row5 = new Row([new Cell('Contract Date'), new Cell(this.contract_date)]);
const row6 = new Row([new Cell('Project Manager Name'), new Cell(this.pm_name)]);
const row7 = new Row([new Cell('Project Manager Contact'), new Cell(this.pm_contact)]);
const row8 = new Row([new Cell('Project Manager Contact'), new Cell(this.pm_contact)]);
const row9 = new Row([new Cell('Contractor Name'), new Cell(this.main_name)]);
const row10 = new Row([new Cell('Contractor Email'), new Cell(this.main_email)]);
const row11 = new Row([new Cell('Site Address'), new Cell(this.site_address)]);
const row12 = new Row([new Cell('Site Address2'), new Cell(this.site_address2)]);
const row13 = new Row([new Cell('Site City'), new Cell(this.site_city)]);
const row14 = new Row([new Cell('Site State'), new Cell(this.site_state)]);
const row15 = new Row([new Cell('Site Country'), new Cell(this.site_country)]);
const row16 = new Row([new Cell('Site Zip'), new Cell(this.site_zip)]);
const row17 = new Row([new Cell('Owner Name'), new Cell(this.owner_name)]);
const row18 = new Row([new Cell('Owner Address'), new Cell(this.owner_address)]);
const row19 = new Row([new Cell('Owner City'), new Cell(this.owner_city)]);
const row20 = new Row([new Cell('Owner State'), new Cell(this.owner_state)]);
const row21 = new Row([new Cell('Owner Country'), new Cell(this.owner_country)]);
const row22 = new Row([new Cell('Owner Zip'), new Cell(this.owner_zip)]);
const row23 = new Row([new Cell('Total owned by owner'), new Cell(this.total_owned_by_owner)]);
const row24 = new Row([new Cell('Total GC owes Subs'), new Cell(this.total_gc_owes_subs)]);
const row25 = new Row([new Cell('Original Contract Amount'), new Cell(this.original_contract_amount)]);
const row26 = new Row([new Cell('Sub Contractor Cost'), new Cell(this.sub_contract_amount)]);
const row27 = new Row([new Cell('Net CO’s to date'), new Cell(this.net_co_to_date)]);
const row28 = new Row([new Cell('Subs change orders'), new Cell(this.subs_change_orders)]);
const row29 = new Row([new Cell('Updated contract amount'), new Cell(this.updated_contract_amount)]);
const row30 = new Row([new Cell('Total sub contractors'), new Cell(this.total_sub_contractors)]);
const row31 = new Row([new Cell('Retainage Due'), new Cell(this.retainage_due)]);
const row32 = new Row([new Cell('Sub Retainage Due'), new Cell(this.sub_retainage_due)]);
const row33 = new Row([new Cell('Total paid by Owner'), new Cell(this.total_paid_by_owner)]);
const row34 = new Row([new Cell('Total GC paid to subs'), new Cell(this.total_gc_paid_subs)]);
const row35 = new Row([new Cell('Retainage Contractor (%)'), new Cell(this.retainage_contractor)]);
const row36 = new Row([new Cell('Retainage for Subs (%)'), new Cell(this.retainage_for_subs)]);
const row37 = new Row([new Cell('Bonding due or withheld'), new Cell(this.bonding_due_or_withheld)]);
const row38 = new Row([new Cell('Project start date'), new Cell(this.project_start_date)]);
const row39 = new Row([new Cell('Schedule (days)'), new Cell(this.schedule_days)]);
const row40 = new Row([new Cell('Schedule Impact (days)'), new Cell(this.schedule_impact_days)]);
const row41 = new Row([new Cell('Proposed finish date'), new Cell(this.proposed_finish_date)]);
const row42 = new Row([new Cell('Bonding Required'), new Cell(this.bonding_required == '1' ? 'Yes' : 'No')]);
const row43 = new Row([new Cell('Bonding Amount'), new Cell(this.bonding_input)]);
const row44 = new Row([new Cell('Profit & overhead (%)'), new Cell(this.profit_overhead)]);

// Custom  column widths
const widths = [150, 350, 200, '*']; 

// Create table object
const table = new Table(headerRows, [row1,row2,row3,row4,row5,row6,row7,row8,row9,row10,row11,row12,row13,row14,row15,row16,row17,row18,row19,row20,row21,row22,row23,row24,row25,row26,row27,row28,row29,row30,row31,row32,row33,row34,row35,row36,row37,row38,row39,row40,row41,row42,row43,row44], widths);

// Add table to document
this.pdfmake.addTable(table);
this.pdfmake.download("contract-"+this.job_number);
this.viewCtrl.dismiss();
// end pdf
},
    err => {
        loading.dismissAll();
        this.showTechnicalError('1');
    });
},
    err => {
        loading.dismissAll();
        this.showTechnicalError('1');
    });
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
}
