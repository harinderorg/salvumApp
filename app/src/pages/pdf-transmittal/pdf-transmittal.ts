import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController, ToastController } from 'ionic-angular';
import { CompanyProvider } from '../../providers/company/company';
import { PdfmakeService } from 'ng-pdf-make/pdfmake/pdfmake.service';
import { Cell, Row, Table } from 'ng-pdf-make/objects/table';
import * as pdfMake from 'pdfmake/build/pdfmake.js';
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@IonicPage()
@Component({
  selector: 'page-pdf-transmittal',
  templateUrl: 'pdf-transmittal.html',
  providers: [CompanyProvider]
})
export class PdfTransmittalPage {
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
transmittalId : any; 
all_submittals : any; 
transmittal_number : any; 
image_types : any; 
  constructor(public navCtrl: NavController, public navParams: NavParams, public companyProvider: CompanyProvider, public viewCtrl: ViewController, private pdfmake: PdfmakeService, public loadingCtrl: LoadingController, public toastCtrl : ToastController) {

this.APIURL = localStorage.getItem('APIURL');
this.transmittalId = navParams.get('transmittalId');
this.image_types = ['png','jpg','jpeg','gif','bmp'];
const loading = this.loadingCtrl.create({});
	loading.present();
var counter = 0;
var file_counter = 0;
var rfi_counter = 0;
var page_counter = 0;
this.companyProvider.getTransmittalDetails(this.transmittalId).subscribe((transmittal)=>{
if(transmittal == null){
	loading.dismissAll();
	let toast = this.toastCtrl.create({
      message: 'Error while downloading the transmittal.',
      duration: 3000,
      position: 'top',
      cssClass: 'danger'
     });
     toast.present();
}
	else
	{
	this.jobId = transmittal[0].jobId;
	this.bidId = transmittal[0].rec_id;
	this.tradeId = transmittal[0].tradeId;
	this.job_title = transmittal[0].job_name;
	this.job_number = transmittal[0].job_number;
	this.transmittal_number = transmittal[0].transmittal_number;
	this.userId = transmittal[0].sender_id;
	this.all_submittals = transmittal[0].submittals;	

	if(this.all_submittals == ''){
		let toast = this.toastCtrl.create({
	      message: 'No submittals to download.',
	      duration: 3000,
	      position: 'top',
	      cssClass: 'danger'
	     });
     toast.present();
		loading.dismissAll();
	}
	else{
		var self = this;
		// start pdf
		this.pdfmake.docDefinition.content = [];
		this.pdfmake.configureStyles({ header: { fontSize: 15, bold: true,margin: [0, 5] } });
		this.all_submittals.forEach(function(submittal){
			if(submittal.type == 'contract'){
				counter = counter + 1;
				self.companyProvider.viewContractDetails(self.bidId,self.userId).subscribe((contractdetails)=>{
				self.main_email = contractdetails.main_email;
				self.main_name = contractdetails.main_name;
				self.main_image = contractdetails.main_image;
				self.user_email = contractdetails.user_email;
				self.user_name = contractdetails.user_name;
				self.user_image = contractdetails.user_image;
				self.contract_date = contractdetails._doc.contract_date;
				self.pm_name = contractdetails._doc.pm_name;
				self.pm_contact = contractdetails._doc.pm_contact;
				self.site_address = contractdetails._doc.site_address;
				self.site_address2 = contractdetails._doc.site_address2;
				self.site_city = contractdetails._doc.site_city;
				self.site_state = contractdetails._doc.site_state;
				self.site_country = contractdetails._doc.site_country;
				self.site_zip = contractdetails._doc.site_zip;
				self.owner_name = contractdetails._doc.owner_name;
				self.owner_address = contractdetails._doc.owner_address;
				self.owner_city = contractdetails._doc.owner_city;
				self.owner_state = contractdetails._doc.owner_state;
				self.owner_country = contractdetails._doc.owner_country;
				self.owner_zip = contractdetails._doc.owner_zip;
				self.last_updated = contractdetails._doc.last_updated;
				self.total_owned_by_owner = contractdetails._doc.total_owned_by_owner;
				self.total_gc_owes_subs = contractdetails._doc.total_gc_owes_subs;
				self.original_contract_amount = contractdetails._doc.original_contract_amount;
				self.sub_contract_amount = contractdetails._doc.sub_contract_amount;
				self.net_co_to_date = contractdetails._doc.net_co_to_date;
				self.subs_change_orders = contractdetails._doc.subs_change_orders;
				self.updated_contract_amount = contractdetails._doc.updated_contract_amount;
				self.total_sub_contractors = contractdetails._doc.total_sub_contractors;
				self.retainage_due = contractdetails._doc.retainage_due;
				self.sub_retainage_due = contractdetails._doc.sub_retainage_due;
				self.total_paid_by_owner = contractdetails._doc.total_paid_by_owner;
				self.total_gc_paid_subs = contractdetails._doc.total_gc_paid_subs;
				self.retainage_contractor = contractdetails._doc.retainage_contractor;
				self.retainage_for_subs = contractdetails._doc.retainage_for_subs;
				self.bonding_due_or_withheld = contractdetails._doc.bonding_due_or_withheld;
				self.project_start_date = contractdetails._doc.project_start_date;
				self.schedule_days = contractdetails._doc.schedule_days;
				self.schedule_impact_days = contractdetails._doc.schedule_impact_days;
				self.proposed_finish_date = contractdetails._doc.proposed_finish_date;
				self.bonding_required = contractdetails._doc.bonding_required;
				self.bonding_input = contractdetails._doc.bonding_input;
				self.profit_overhead = contractdetails._doc.profit_overhead;

				self.companyProvider.tradeDetails(self.tradeId).subscribe((tradedetails)=>{
					if(tradedetails != '')
					{
						self.trade_name = tradedetails.trade_name;
				        self.trade_task = tradedetails.trade_task;
				        self.job_description = tradedetails.job_description;
					}
				// Add a text with style
				self.pdfmake.addText('Contract #'+self.job_number, 'header');
				// Create Headers cells
				const header1 = new Cell('PO/Job');
				const header2 = new Cell(self.job_number);

				// Create headers row
				const headerRows = new Row([header1, header2]);

				// Create a content row
				const row1 = new Row([new Cell('Job Title'), new Cell(self.job_title)]);
				const row2 = new Row([new Cell('Trade'), new Cell(self.trade_name)]);
				const row3 = new Row([new Cell('Task'), new Cell(self.trade_task)]);
				const row4 = new Row([new Cell('Description'), new Cell(self.job_description)]);
				const row5 = new Row([new Cell('Contract Date'), new Cell(self.contract_date)]);
				const row6 = new Row([new Cell('Project Manager Name'), new Cell(self.pm_name)]);
				const row7 = new Row([new Cell('Project Manager Contact'), new Cell(self.pm_contact)]);
				const row8 = new Row([new Cell('Project Manager Contact'), new Cell(self.pm_contact)]);
				const row9 = new Row([new Cell('Contractor Name'), new Cell(self.main_name)]);
				const row10 = new Row([new Cell('Contractor Email'), new Cell(self.main_email)]);
				const row11 = new Row([new Cell('Site Address'), new Cell(self.site_address)]);
				const row12 = new Row([new Cell('Site Address2'), new Cell(self.site_address2)]);
				const row13 = new Row([new Cell('Site City'), new Cell(self.site_city)]);
				const row14 = new Row([new Cell('Site State'), new Cell(self.site_state)]);
				const row15 = new Row([new Cell('Site Country'), new Cell(self.site_country)]);
				const row16 = new Row([new Cell('Site Zip'), new Cell(self.site_zip)]);
				const row17 = new Row([new Cell('Owner Name'), new Cell(self.owner_name)]);
				const row18 = new Row([new Cell('Owner Address'), new Cell(self.owner_address)]);
				const row19 = new Row([new Cell('Owner City'), new Cell(self.owner_city)]);
				const row20 = new Row([new Cell('Owner State'), new Cell(self.owner_state)]);
				const row21 = new Row([new Cell('Owner Country'), new Cell(self.owner_country)]);
				const row22 = new Row([new Cell('Owner Zip'), new Cell(self.owner_zip)]);
				const row23 = new Row([new Cell('Total owned by owner'), new Cell(self.total_owned_by_owner)]);
				const row24 = new Row([new Cell('Total GC owes Subs'), new Cell(self.total_gc_owes_subs)]);
				const row25 = new Row([new Cell('Original Contract Amount'), new Cell(self.original_contract_amount)]);
				const row26 = new Row([new Cell('Sub Contractor Cost'), new Cell(self.sub_contract_amount)]);
				const row27 = new Row([new Cell('Net CO’s to date'), new Cell(self.net_co_to_date)]);
				const row28 = new Row([new Cell('Subs change orders'), new Cell(self.subs_change_orders)]);
				const row29 = new Row([new Cell('Updated contract amount'), new Cell(self.updated_contract_amount)]);
				const row30 = new Row([new Cell('Total sub contractors'), new Cell(self.total_sub_contractors)]);
				const row31 = new Row([new Cell('Retainage Due'), new Cell(self.retainage_due)]);
				const row32 = new Row([new Cell('Sub Retainage Due'), new Cell(self.sub_retainage_due)]);
				const row33 = new Row([new Cell('Total paid by Owner'), new Cell(self.total_paid_by_owner)]);
				const row34 = new Row([new Cell('Total GC paid to subs'), new Cell(self.total_gc_paid_subs)]);
				const row35 = new Row([new Cell('Retainage Contractor (%)'), new Cell(self.retainage_contractor)]);
				const row36 = new Row([new Cell('Retainage for Subs (%)'), new Cell(self.retainage_for_subs)]);
				const row37 = new Row([new Cell('Bonding due or withheld'), new Cell(self.bonding_due_or_withheld)]);
				const row38 = new Row([new Cell('Project start date'), new Cell(self.project_start_date)]);
				const row39 = new Row([new Cell('Schedule (days)'), new Cell(self.schedule_days)]);
				const row40 = new Row([new Cell('Schedule Impact (days)'), new Cell(self.schedule_impact_days)]);
				const row41 = new Row([new Cell('Proposed finish date'), new Cell(self.proposed_finish_date)]);
				const row42 = new Row([new Cell('Bonding Required'), new Cell(self.bonding_required == '1' ? 'Yes' : 'No')]);
				const row43 = new Row([new Cell('Bonding Amount'), new Cell(self.bonding_input)]);
				const row44 = new Row([new Cell('Profit & overhead (%)'), new Cell(self.profit_overhead)]);

				// Custom  column widths
				const widths = [150, 350, 200, '*']; 

				// Create table object
				const table = new Table(headerRows, [row1,row2,row3,row4,row5,row6,row7,row8,row9,row10,row11,row12,row13,row14,row15,row16,row17,row18,row19,row20,row21,row22,row23,row24,row25,row26,row27,row28,row29,row30,row31,row32,row33,row34,row35,row36,row37,row38,row39,row40,row41,row42,row43,row44], widths);

				// Add table to document
				self.pdfmake.addTable(table);
				
				if(page_counter != self.all_submittals.length - 1){
					page_counter = page_counter + 1;
					self.pdfmake.docDefinition.content.push({text:"", pageBreak: "after"});
				}
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
			}
			
			else if(submittal.type == 'rfi'){
				counter = counter + 1; 				
							
				self.companyProvider.getRFIDetails(submittal.item).subscribe((rfiDetails)=>{
					if(rfiDetails != null && rfiDetails != ''){
					rfi_counter = rfi_counter + 1; 	
						// Add a text with style
					self.pdfmake.addText('RFI '+rfi_counter, 'header');
					// Create Headers cells
					const header1 = new Cell('Question');
					const header2 = new Cell(rfiDetails.question);

					// Create headers row
					const headerRows = new Row([header1, header2]);
					const row1 = new Row([new Cell('Answer'), new Cell(rfiDetails.answer)]);
					const widths = [150, 350, 200, '*']; 
					// Create table object
					const table = new Table(headerRows, [row1], widths);	
					self.pdfmake.addTable(table);
					var rfi_attachments,random,zip_href;
					if(Array.isArray(rfiDetails.question_files)){
						if(rfiDetails.question_files.length > 0){
							rfi_attachments = [];
							rfiDetails.question_files.forEach(function(file){
								var obj = {
					      				source : 'directory/bids_data/'+file,
					      				target : file.split('____').pop(-1)
					      			}
								rfi_attachments.push(obj);
							});
							random = Math.floor(Math.random() * 1000000);
							zip_href = self.APIURL+'/salvum/directory/temp_data/attachment'+random+'.zip';
							self.pdfmake.docDefinition.content.push({text: "Download question attachments", link:zip_href, decoration:"underline", fontSize:13, margin: [0, 5] });
							self.companyProvider.makeZipAttachments(rfi_attachments,random).subscribe((downloaded)=>{
								// zip done
							},
						    err => {
						        loading.dismissAll();
						        this.showTechnicalError('1');
						    });
						}
					}
					if(Array.isArray(rfiDetails.answer_files[0])){
						if(rfiDetails.answer_files[0].length > 0){
							rfi_attachments = [];
							rfiDetails.answer_files[0].forEach(function(file){
								var obj = {
					      				source : 'directory/bids_data/'+file,
					      				target : file.split('____').pop(-1)
					      			}
								rfi_attachments.push(obj);
							});
							random = Math.floor(Math.random() * 1000000);
							zip_href = self.APIURL+'/salvum/directory/temp_data/attachment'+random+'.zip';
							self.pdfmake.docDefinition.content.push({text: "Download answer attachments", link:zip_href, decoration:"underline", fontSize:13, margin: [0, 5] });
							self.companyProvider.makeZipAttachments(rfi_attachments,random).subscribe((downloaded)=>{
								// zip done
							},
						    err => {
						        loading.dismissAll();
						        this.showTechnicalError('1');
						    });
						}
					}
					if(page_counter != self.all_submittals.length - 1){
						page_counter = page_counter + 1;
						self.pdfmake.docDefinition.content.push({text:"", pageBreak: "after"});
					}
					}
					else{
						rfi_counter = rfi_counter + 1; 	
						// Add a text with style
						self.pdfmake.addText('RFI '+rfi_counter, 'header');
						self.pdfmake.docDefinition.content.push({text:"RFI information has been deleted by Project manager.", fontSize:13, margin: [0, 5]});
						if(page_counter != self.all_submittals.length - 1){
							page_counter = page_counter + 1;
							self.pdfmake.docDefinition.content.push({text:"", pageBreak: "after"});
						}
					}
				},
			    err => {
			        loading.dismissAll();
			        this.showTechnicalError();
			    });
			}
			else{
				counter = counter + 1;
				if(submittal.type != 'request'){
					file_counter = file_counter + 1;

				// if(self.image_types.indexOf(submittal.item.split('.').pop().toLowerCase()) >= 0){
				// 	self.pdfmake.addText("File", 'header');
				// 	self.pdfmake.addImage(self.APIURL+'/salvum/'+submittal.item, 500, 500);
				// }
				// else{ 
					self.pdfmake.addText("File "+file_counter, 'header');
					self.pdfmake.docDefinition.content.push({text:"Click here to access file", link:self.APIURL+'/salvum/'+submittal.item, decoration:"underline", fontSize:13});
					if(page_counter != self.all_submittals.length - 1){
						page_counter = page_counter + 1;
						self.pdfmake.docDefinition.content.push({text:"", pageBreak: "after"});
					}
				}
				// }
			}
			if(counter == self.all_submittals.length){
				// download it
				setTimeout(function(){ 
					self.pdfmake.download("transmittal-"+self.transmittal_number+'.pdf');
					loading.dismissAll();
					self.viewCtrl.dismiss();
				 }, 3000);
			}
		});
	}

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
}
