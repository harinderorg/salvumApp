import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController, ToastController } from 'ionic-angular';
import { CompanyProvider } from '../../providers/company/company';
import * as CryptoJS from 'crypto-js';
@IonicPage()
@Component({
  selector: 'page-jobfiles',
  templateUrl: 'jobfiles.html',
  providers: [CompanyProvider]   
})
export class JobfilesPage {    
sorted_photos : any;
all_photos : any;
breadcrums : any;
related_files : any;
file_types : any;
selected_files : any = [];
job_id : any = 0;
trade_id : any = 0;
jobId : any;
folders : any;
file_path : any;
isShared : any;
onLevel : any;
enable_level1 : any;
enable_level2 : any;
enable_level3 : any;
enable_level4 : any;
opened_levels : any;
userId : any = localStorage.getItem('userinfo');
APIURL : any = localStorage.getItem('APIURL');
has_thumbs : any;
is_video : any;
jobs : any = [];
trades : any = [];
show_file_code : any;
single_allowed : any;
file_code : any = 'O';
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public companyProvider: CompanyProvider, public loadingCtrl: LoadingController, public toastCtrl: ToastController) {
  	this.file_types = ['txt','docx','mp3','mp4','php','ppt','pptx','psd','xls','xlsx','zip','doc','odt','png','jpg','jpeg','gif','pdf','csv']; 
    this.has_thumbs = ['png','jpg','jpeg','gif','mp4','mov','wmv','3gp','avi'];
    this.is_video = ['mp4','mov','wmv','3gp','avi'];
  	this.jobId = navParams.get('jobId');
    this.isShared = navParams.get('isShared');
    this.file_path = localStorage.getItem('current_file_path');
    this.show_file_code = navParams.get('show_file_code');
    this.file_code = navParams.get('fileCode');
    this.single_allowed = navParams.get('single_allowed');
  	this.getAllFiles();
    // get open levels
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
      this.opened_levels.push('1');
    }
    if(this.enable_level2 == 'false')
    {
      this.opened_levels.push('2');
    }
    if(this.enable_level3 == 'false')
    {
      this.opened_levels.push('3');
    }
    if(this.enable_level4 == 'false')
    {
      this.opened_levels.push('4');
    }
  }

  getAllFiles(){ 
  	this.folders = '0';
  	localStorage.setItem('files_folder_path','directory/jobs_data');
  	this.getBreadCrums();
  	const loading = this.loadingCtrl.create({});
    loading.present(); 
  	this.companyProvider.getJobFiles(this.jobId,'2',this.userId).subscribe((photos)=>{
  		loading.dismissAll()
      this.all_photos = photos; 
	  	this.sorted_photos = photos; 
      console.log(this.sorted_photos)
      if(photos != ''){
        var all_jobs = [];  
        this.jobs = [];    
        var self = this;
        photos.forEach(function(job){
          if(all_jobs.indexOf(job.jobId) == -1){
            all_jobs.push(job.jobId);
            self.jobs.push({
              jobId: job.jobId,
              job_title: job.job_title
            })
          }
        })
        this.getTrades();
        if(this.job_id != 0){
          this.changeJob(this.job_id);
          if(this.trade_id != 0){
            this.changeTrade(this.trade_id);
          }
        }
        console.log(this.jobs)
      }
	  },
    err => {
        loading.dismissAll();
        this.showTechnicalError();
    });
  }

  getTrades(){
    var all_trades = [];
    this.trades = [];
    var self = this;
    if(this.sorted_photos != '') {
      // this.trade_id = 0;
      this.sorted_photos.forEach(function(job){
      if(all_trades.indexOf(job.tradeId) == -1){
          all_trades.push(job.tradeId);
          self.trades.push({
            tradeId: job.tradeId,
            trade_name: job.trade_name
          })
        }
      });
    }
  }

  changeJob(job_id){
    if(job_id == 0){
      this.getAllFiles();
    }
    else{
      if(this.all_photos != '') {
        var sorted = [];
        this.all_photos.forEach(function(job){
          if(job.jobId == job_id){
            sorted.push(job);
          }
        })
        this.sorted_photos = sorted;
        this.getTrades();
      }
    }
  }

  changeTrade(trade_id){
    if(trade_id == 0){
      this.changeJob(this.job_id);
    }
    else{
      if(this.all_photos != '') {
        var sorted = [];
        this.all_photos.forEach(function(trade){
          if(trade.tradeId == trade_id){
            sorted.push(trade);
          }
        })
        this.sorted_photos = sorted;
      }
    }
  }

  getBreadCrums()
  {
    var file_path = localStorage.getItem('files_folder_path');
      var breadcrums = [];
      file_path.split('/').forEach(function(bread){
        breadcrums.push(bread);
      });
      this.breadcrums = breadcrums;
  }

  clickFolder(file_name)
  {
  	if(file_name.search('____') == -1)
  	{
  		this.folders = '1';
  		localStorage.setItem('files_folder_path','directory/jobs_data/'+file_name);
  		this.getRelatedFiles();
  	}
  }

  clickBreadcrumb(clicked_bread) 
  {
  	var current_path = localStorage.getItem('files_folder_path');
  	if(current_path.search(clicked_bread) >= 0)
    {
        var file_path = current_path.split(clicked_bread)[0];
        file_path = file_path+clicked_bread;
        localStorage.setItem('files_folder_path',file_path);
        this.getRelatedFiles();
    }
  }

  openIt(filePath,fileType)
  {
  	if(fileType == 'directory')
  	{
  		localStorage.setItem('files_folder_path',filePath);
  		this.getRelatedFiles();
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

  getRelatedFiles(){
  	const loading = this.loadingCtrl.create({});
    loading.present(); 
    this.getBreadCrums();
  	this.companyProvider.getDirectoryFiles(localStorage.getItem('files_folder_path')).subscribe((related_files)=>{
    	if(related_files.data != null)
    	{
        	this.related_files = related_files.data.children; 
    	}
    	else
    	{
    		this.related_files = [];
    	}
      console.log(this.related_files)
    	loading.dismissAll();
    },
    err => {
        loading.dismissAll();
        this.showTechnicalError();
    });
  }

  dismiss(){
  	this.viewCtrl.dismiss();
  }

  insertFilesToArray(event,file){
  if(event.checked == true)
  {
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

 addFiles(){
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
  if(this.show_file_code == '1'){
    localStorage.setItem('sal_file_code',this.file_code);
  }
  this.viewCtrl.dismiss(this.selected_files);
 }

}
