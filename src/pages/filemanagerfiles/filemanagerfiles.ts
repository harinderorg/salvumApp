import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController, ToastController } from 'ionic-angular';
import { CompanyProvider } from '../../providers/company/company';
import * as CryptoJS from 'crypto-js';

@IonicPage()
@Component({
  selector: 'page-filemanagerfiles',
  templateUrl: 'filemanagerfiles.html',
  providers: [CompanyProvider] 
})
export class FilemanagerfilesPage {
selected_files : any;
smail_files : any;
fileType : any;
modal_title : any;
pages : any;
userId : any;
enable_level1 : any;
enable_level2 : any;
enable_level3 : any;
enable_level4 : any;
file_types : any;
rootDir : any;
allowed_levels : any;
opened_levels : any;
filterTradeId: any;
jobId: any;
alltrades: any;
transmittal_file : any;
file_path : any;
reply_rfi : any;
show_file_code : any;
file_code : any = 'O';
isShared : any;
onLevel : any;
is_video : any;
has_thumbs : any;
single_allowed : any;
breadcrumbs : any = [];
current_path : any = [];
APIURL : any = localStorage.getItem('APIURL');
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public companyProvider: CompanyProvider, public loadingCtrl: LoadingController, public toastCtrl: ToastController) {
    this.fileType = navParams.get('file_type');
    this.isShared = navParams.get('isShared');
    this.file_path = localStorage.getItem('current_file_path');
    this.transmittal_file = navParams.get('transmittal_file');
    this.reply_rfi = navParams.get('reply_rfi');
    this.show_file_code = navParams.get('show_file_code');
    this.file_code = navParams.get('fileCode');
    this.single_allowed = navParams.get('single_allowed');
    this.file_types = ['txt','docx','mp3','mp4','php','ppt','psd','xls','xlsx','zip','doc','odt','png','jpg','jpeg','gif','pdf','csv']; 
    this.has_thumbs = ['png','jpg','jpeg','gif','mp4','mov','wmv','3gp','avi'];
    this.is_video = ['mp4','mov','wmv','3gp','avi'];
  	this.userId = localStorage.getItem('userinfo');
  	if(this.fileType == '0')
  	{
  		this.modal_title = 'Select Photos';
  	}
  	else if(this.fileType == '1')
    {
      this.modal_title = 'Select Docs';
    }
    else 
  	{
      this.modal_title = 'Select Files';
  	}
  	this.selected_files = [];

    // get open levels
    this.allowed_levels = [];
    this.opened_levels = [];

    var levels_array = JSON.parse(localStorage.getItem('alllevel'));
    if(levels_array){
      levels_array.forEach((value) => {
        var decrypted = CryptoJS.AES.decrypt(value, this.userId);
        if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level1'){
          this.enable_level1  = 'false';
        }else if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level2'){
          this.enable_level2  = 'false';
        }else if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level3'){
          this.enable_level3  = 'false';
        }else if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level4'){
          this.enable_level4  = 'false';
        }else if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level0'){
          this.enable_level1 = 'true';
          this.enable_level2 = 'true';
          this.enable_level3 = 'true';
          this.enable_level4 = 'true';
        }
      });
    }

    if(this.enable_level1 == 'false') 
    {
      this.allowed_levels.push('level1');
      this.opened_levels.push('1');
    }
    if(this.enable_level2 == 'false')
    {
      this.allowed_levels.push('level2');
      this.opened_levels.push('2');
    }
    if(this.enable_level3 == 'false')
    {
      this.allowed_levels.push('level3');
      this.opened_levels.push('3');
    }
    if(this.enable_level4 == 'false')
    {
      this.allowed_levels.push('level4');
      this.opened_levels.push('4');
    }
  	this.fetchTreeView();

      this.filterTradeId = localStorage.getItem('filterTradeId');
      if(this.filterTradeId == null || this.filterTradeId == undefined || this.filterTradeId == ''){
        this.filterTradeId = '0';
      }
      this.jobId = navParams.get('jobId');
      this.companyProvider.allTrades(this.jobId).subscribe((alltrades)=>{
        this.alltrades = alltrades;
      },
      err => {
          this.showTechnicalError();
      });

  }

  rootFolders(){
    this.rootDir = '1';
    this.breadcrumbs = [];
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

  fetchTreeView()
  {
    const loading = this.loadingCtrl.create({});
    loading.present();
    this.rootDir = '1';
    this.companyProvider.getDirectory(this.userId,'files').subscribe((all_files)=>{
        loading.dismissAll();
        this.pages = all_files.data.children;
        var myArray = this.pages;
        for (var i = myArray.length - 1; i >= 0; --i) {
        if (this.allowed_levels.indexOf(myArray[i].name) == -1) {
            myArray.splice(i,1);
        }
    }
    this.pages = myArray;
    },
    err => {
        loading.dismissAll();
        this.showTechnicalError();
    });
  }

  breadClicked(bread){
    var filePath = this.current_path.split(bread)[0]+bread;
    this.fetchDirectory(filePath,'directory');
  }

  fetchDirectory(file_path,file_type)
  {
    if(file_type == 'directory')
    {
      this.current_path = file_path;
      var breadcrumbs = file_path.split(this.userId+'/files/')[1];
      this.breadcrumbs = breadcrumbs.split('/');
      this.rootDir = '0';
      localStorage.setItem('filemanager_file_path',file_path);
      const loading = this.loadingCtrl.create({});
      loading.present(); 
      this.companyProvider.getDirectoryFiles(file_path).subscribe((smail_files)=>{
        if(smail_files.data != null)
        {
          this.smail_files = smail_files.data.children;
          // var image_types = ['png','jpg','jpeg','gif','bmp']; 
          // if(this.fileType == '0')
          // {
          //   var smail_images = [];
          //   smail_files.data.children.forEach(function(smail_data){
          //     if(image_types.indexOf(smail_data.name.split('.').pop()) >= 0)
          //     {
          //       smail_images.push(smail_data);
          //     }
          //   });
          //   this.smail_files = smail_images;
          // }
          // else
          // {
          //   var smail_docs = [];
          //   smail_files.data.children.forEach(function(smail_data){
          //     if(image_types.indexOf(smail_data.name.split('.').pop()) == -1)
          //     {
          //       smail_docs.push(smail_data);
          //     }
          //   });
          //   this.smail_files = smail_docs;
          // }
        }
        else
        {
          this.smail_files = []; 
        }
        console.log(smail_files.data)
        loading.dismissAll();
      },
      err => {
          loading.dismissAll();
          this.showTechnicalError();
      });
    }
  }

 dismiss()
  {
  	this.viewCtrl.dismiss();
  }
  addFiles(tradeId)
  {
    if(this.selected_files.length == 0)
    {
      this.dismiss();
    }
  	else
 	  {
      if(this.filterTradeId == '0' && this.transmittal_file != '1' && this.reply_rfi != '1')
        {
          if(tradeId == undefined || tradeId == '')
            {
              let toast = this.toastCtrl.create({
                message: 'Please select trade.',
                duration: 3000,
                cssClass: 'danger',
                position: 'top'
               });
               toast.present(); 
               return false;
            }
            localStorage.setItem('filt_TradeId',tradeId);
        }
      if(this.isShared == '1' && this.file_path == 'nopath'){
        if(this.onLevel == undefined || this.onLevel == '' || this.onLevel == null){
          let toast = this.toastCtrl.create({
            message: 'Please select level.',
            duration: 3000,
            cssClass: 'danger',
            position: 'top'
           });
           toast.present(); 
           return false;
        }
        localStorage.setItem('file_upload_level',this.onLevel);
      }
      else
      {
        localStorage.setItem('filt_TradeId',localStorage.getItem('filterTradeId'));
      }
      if(this.show_file_code == '1'){
        localStorage.setItem('sal_file_code',this.file_code);
      }
      this.viewCtrl.dismiss(this.selected_files);
  	}
  }

 insertFilesToArray(event,file){
	if(event.checked == true)
	{
    // if(this.transmittal_file == '1')
    // {
    //   this.viewCtrl.dismiss(file);
    // }
		 this.selected_files.push(file);
	}
	else
	{
		this.removeArray(this.selected_files, file);
	}
  if(this.selected_files.length == 1 && this.single_allowed == '1'){
    this.viewCtrl.dismiss(this.selected_files);
  }
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

}
