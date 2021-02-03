import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {DomSanitizer} from '@angular/platform-browser';
import { CompanyProvider } from '../../providers/company/company';
import * as filesize from 'filesize';

@IonicPage()
@Component({
  selector: 'page-viewfile',
  templateUrl: 'viewfile.html',
  providers: [CompanyProvider] 
})
export class ViewfilePage {
file_path:any;
file_types:any;
fileSize:any;
file_created_at:any;
file_name:any;
file_by:any;
isImage:any;
APIURL:any;
doc_types:any;
errors:any=['',null,undefined];
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public sanitizer: DomSanitizer, public companyProvider: CompanyProvider) {
  	this.APIURL = localStorage.getItem('APIURL');
    this.file_path = navParams.get('file_path');
    this.file_name = navParams.get('file_name');
    this.file_created_at = navParams.get('created_at');
    this.file_by = navParams.get('file_by');
    console.log(this.file_created_at)
    if(navParams.get('fileSize') != undefined)
    {
      this.fileSize = '('+filesize(navParams.get('fileSize'))+')';
    }
  	this.file_types = ['jpg','jpeg','png','gif','bmp'];
  	this.doc_types = ['doc','docx','ppt','xls','xlsx','odt','psd'];
  	this.sanitizer = sanitizer; 
  	if(this.file_types.indexOf(this.file_path.split('.').pop(-1)) >= 0)
  	{
  		this.isImage = '1';
  	}
  	else
  	{
  		// this.companyProvider.generateFile(this.file_path).subscribe((file)=>{
  		// 	console.log(file)
  		// });
  		// window.open(this.APIURL+'/salvum/'+this.file_path, '_system', 'location=no')
  		this.isImage = '0';
  		this.file_path = this.APIURL+'/salvum/'+this.file_path;
  	}
  }

  secureURL() {
    return this.sanitizer.bypassSecurityTrustUrl(this.file_path);
  }

  dismiss()
  {
  	this.viewCtrl.dismiss(); 
  }

}
