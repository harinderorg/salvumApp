import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController, ToastController } from 'ionic-angular';
import { CompanyProvider } from '../../providers/company/company';
import * as CryptoJS from 'crypto-js';
@IonicPage()
@Component({
  selector: 'page-smailfiles',
  templateUrl: 'smailfiles.html',
  providers: [CompanyProvider] 
})
export class SmailfilesPage {
selected_files : any;
smail_files : any;
fileType : any;
modal_title : any;
file_path : any;
isShared : any;
file_types : any;
onLevel : any;
enable_level1 : any;
enable_level2 : any;
enable_level3 : any;
enable_level4 : any;
opened_levels : any;
userId : any = localStorage.getItem('userinfo');
  constructor(public navCtrl: NavController, public toastCtrl : ToastController, public navParams: NavParams, public viewCtrl: ViewController, public companyProvider: CompanyProvider, public loadingCtrl: LoadingController) {
  	this.fileType = navParams.get('file_type');
    this.isShared = navParams.get('isShared');
    this.file_path = localStorage.getItem('current_file_path');
  	if(this.fileType == '0')
  	{
  		this.modal_title = 'Select Photos';
  	}
  	else
  	{
  		this.modal_title = 'Select Docs';
  	}
    if(this.fileType == '4'){
      this.modal_title = 'Select Smail Files';
    }
    this.file_types = ['txt','docx','mp3','mp4','php','ppt','psd','xls','xlsx','zip','doc','odt','png','jpg','jpeg','gif','pdf','csv']; 
  	this.selected_files = [];
  	var file_path = "directory/smail_data";
  	const loading = this.loadingCtrl.create({});
    loading.present(); 
  	this.companyProvider.getDirectoryFiles(file_path).subscribe((smail_files)=>{
  		if(smail_files.data != null)
  		{
  			var image_types = ['png','jpg','jpeg','gif','bmp']; 
  			if(this.fileType == '0')
  			{
  				var smail_images = [];
  				smail_files.data.children.forEach(function(smail_data){
  					if(image_types.indexOf(smail_data.name.split('.').pop()) >= 0)
  					{
  						smail_images.push(smail_data);
  					}
  				});
  				this.smail_files = smail_images;
  			}
  			else
  			{
  				var smail_docs = [];
  				smail_files.data.children.forEach(function(smail_data){
  					if(image_types.indexOf(smail_data.name.split('.').pop()) == -1)
  					{
  						smail_docs.push(smail_data);
  					}
  				});
  				this.smail_files = smail_docs;
  			}
  		}
  		else
  		{
  			this.smail_files = []; 
  		}
  		loading.dismissAll();

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
  	},
    err => {
        loading.dismissAll();
        this.showTechnicalError();
    });
  }

 dismiss()
  {
  	this.viewCtrl.dismiss();
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
  
  addFiles()
  {
    if(this.selected_files.length == 0)
    {
      this.dismiss();
    }
  	else
 	  {
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
        this.viewCtrl.dismiss(this.selected_files);
      }
      else{
        this.viewCtrl.dismiss(this.selected_files);
      }
  	}
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
