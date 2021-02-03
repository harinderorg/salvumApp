import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController, LoadingController } from 'ionic-angular';
import { CompanyProvider } from '../../providers/company/company';
import { PdfmakeService } from 'ng-pdf-make/pdfmake/pdfmake.service';
import { Cell, Row, Table } from 'ng-pdf-make/objects/table';
import * as pdfMake from 'pdfmake/build/pdfmake.js';
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@IonicPage()
@Component({
  selector: 'page-export-bid',
  templateUrl: 'export-bid.html',
  providers: [CompanyProvider]
})
export class ExportBidPage {
page_type:any;
direct_link:any;
direct_href:any;
comment:any;
files:any;
jobId:any;
tradeId:any;
bid_breakdown:any;
bid:any;
exported_cats:any = [];
baseUrl:any = localStorage.getItem('baseUrl');
APIURL:any = localStorage.getItem('APIURL');
isBrowser:any = localStorage.getItem('isBrowser');
userId:any = localStorage.getItem('userinfo');
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public toastCtrl: ToastController,private pdfmake: PdfmakeService, public loadingCtrl: LoadingController,public companyProvider: CompanyProvider) {
  	this.direct_link = navParams.get('direct_link');
  	this.direct_href = navParams.get('direct_href');
  	this.page_type = navParams.get('page_type');
  	this.comment = navParams.get('comment');
  	this.files = navParams.get('files');
  	this.bid_breakdown = navParams.get('bid_breakdown');
  	this.bid = navParams.get('bid');
  	this.jobId = navParams.get('jobId');
  	this.tradeId = navParams.get('tradeId');
  }

  ionViewDidLoad() {
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  catChecked(event,catname){
  	if(event.checked == true){
  		this.exported_cats.push(catname);
  	}
  	else{
  		this.exported_cats.splice(this.exported_cats.indexOf(catname),1);
  	}
  }

  export(destination){
  	if(destination == undefined || destination == null || destination == ''){
  		let toast = this.toastCtrl.create({
		    message: 'Please select the destination to export',
		    duration: 3000,
		    position:'top',
		    cssClass: 'danger'
	   	});
	  	toast.present();
  	}
  	else{
  		if(this.page_type == '1'){
  			this.viewCtrl.dismiss(destination);
  		}
  		else{
		  	var self = this;
			// start pdf
			this.pdfmake.docDefinition.content = [];
			this.pdfmake.configureStyles({ header: { fontSize: 15, bold: true, margin: [0, 5] } });

			// Add a text with style
			this.pdfmake.addText('Bid information', 'header');
			// Create Headers cells
			const header1 = new Cell('User Name');
			const header2 = new Cell(this.bid.posted_by);

			// Create headers row
			const headerRows = new Row([header1, header2]);

			// Create a content row
			const row1 = new Row([new Cell('User Email'), new Cell(this.bid.posted_email)]);
			const row2 = new Row([new Cell('Trade Title'), new Cell(this.bid.trade_name)]);
			const row3 = new Row([new Cell('Trade Task'), new Cell(this.bid.trade_task)]);
			const row4 = new Row([new Cell('Bid Comments'), new Cell(this.comment)]);


			// Custom  column widths
			const widths = [150, 350, 200, '*']; 

			// Create table object
			const table = new Table(headerRows, [row1,row2,row3,row4], widths);

			// Add table to document
			this.pdfmake.addTable(table);

			if(this.files.length > 0){
				self.pdfmake.addText("Bid attachments", 'header');
				this.files.forEach(function(file){
					self.pdfmake.docDefinition.content.push({text:file.split('____').pop(-1), link:self.APIURL+'/salvum/directory/bids_data/'+file.replace(' ','_'), decoration:"underline", fontSize:13});
				})
			}

			if((this.bid_breakdown.bid_breakdown_type == 1 && this.bid_breakdown.bid_breakdown_manual != undefined && this.bid_breakdown.bid_breakdown_manual != '' && this.bid_breakdown.bid_breakdown_manual != null) || (this.bid_breakdown.bid_breakdown_type == 0 && this.bid_breakdown.bid_breakdown_files.length > 0)){

				if(this.exported_cats.indexOf('Bid breakdown') >= 0 && (this.bid_breakdown.bid_breakdown_type == 1 && this.bid_breakdown.bid_breakdown_manual != undefined && this.bid_breakdown.bid_breakdown_manual != '' && this.bid_breakdown.bid_breakdown_manual != null) || (this.bid_breakdown.bid_breakdown_type == 0 && this.bid_breakdown.bid_breakdown_files.length > 0)){
					self.pdfmake.addText("Bid breakdown", 'header');
					if(this.bid_breakdown.bid_breakdown_type == '0'){
						this.bid_breakdown.bid_breakdown_files.forEach(function(file){
							self.pdfmake.docDefinition.content.push({text:file.file_name, link:self.APIURL+'/salvum/directory/bids_data/'+file.name.replace(' ','_'), decoration:"underline", fontSize:13});
						})
					}
					else{
						self.pdfmake.docDefinition.content.push({text:self.bid_breakdown.bid_breakdown_manual, fontSize:13});
					}

					if(this.bid_breakdown.bid_breakdown_tasks.length > 0){
						this.pdfmake.addText('Tasks', 'header');
						const header1 = new Cell('Task');
						const header2 = new Cell('Cost');
						const header3 = new Cell('Percent');
						const header4 = new Cell('Days');
						const headerRows = new Row([header1, header2, header3, header4]);
						var all_rows = [],rows;
						this.bid_breakdown.bid_breakdown_tasks.forEach(function(task){
							rows = new Row([new Cell(task.task), new Cell('$'+task.cost), new Cell(task.percent+'%'), new Cell(task.days)]);
							all_rows.push(rows);
						})
						
						const widths = [200, 100, 100, '*']; 
						const table = new Table(headerRows, all_rows, widths);
						this.pdfmake.addTable(table);
						self.pdfmake.docDefinition.content.push({text: 'Bid Total Price - $'+this.bid_breakdown.bid_total_price, fontSize:13});
					}
				}

			}

			if(this.bid_breakdown.submitted_categories_vals.length > 0){
				this.bid_breakdown.submitted_categories_vals.forEach(function(cat){
					if(self.exported_cats.indexOf(cat.cat) >= 0){
						self.pdfmake.addText(cat.cat, 'header');
						if(cat.type == '0'){
							cat.files.forEach(function(file){
								self.pdfmake.docDefinition.content.push({text:file.file_name, link:self.APIURL+'/salvum/directory/bids_data/'+file.name.replace(' ','_'), decoration:"underline", fontSize:13});
							})
						}
						else{
							self.pdfmake.docDefinition.content.push({text:(cat.cat == 'Total Estimated Cost') ? '$'+cat.summary : cat.summary, fontSize:13});
						}
					}
				});
			}
			var msg,path;
			if(destination == 'local'){
				msg = 'File is downloading on your local device.';
				this.pdfmake.download("bid_export");
			}
			else if(destination == 'job'){
				path = 'directory/jobs_data/';
				msg = 'File has been saved to docs section of the job dashboard.';
			}
			else{
				path = 'directory/'+this.userId+'/files/level1/';
				msg = 'File has been saved to level1 of your file manager.';
			}
			if(destination != 'local'){
				var file_name = 'Bid_Export_'+this.bid.trade_name+'_'+this.bid.posted_by.replace(' ','_');
				pdfMake.createPdf(self.pdfmake.docDefinition).getDataUrl(function(dataUrl){
					self.companyProvider.saveBidPdf({file : dataUrl, file_name : file_name, path : path, type : destination,jobId : self.jobId, tradeId : self.tradeId}).subscribe((result)=>{
						//expored successfully
					},
				    err => {
				        let toast = this.toastCtrl.create({
						    message: 'Technical error,Plz try after some time.',
						    duration: 3000,
						    position:'top',
						    cssClass: 'danger'
					   	});
					  	toast.present();
				    });
				});
			}
			let toast = this.toastCtrl.create({
			    message: msg,
			    duration: 3000,
			    position:'top',
			    cssClass: 'success'
		   	});
		  	toast.present();
			this.viewCtrl.dismiss();
		}
	}
  }

}
