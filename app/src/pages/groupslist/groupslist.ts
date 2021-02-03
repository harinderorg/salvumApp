import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams , ViewController, AlertController,ToastController,LoadingController } from 'ionic-angular';
import { CompanyProvider } from '../../providers/company/company';
import * as CryptoJS from 'crypto-js';

@IonicPage()
@Component({
  selector: 'page-groupslist',
  templateUrl: 'groupslist.html',
  providers: [CompanyProvider]
})
export class GroupslistPage {
allGroups : any;
selected_groups : any = [];
userId : any = localStorage.getItem('userinfo');
enable_level1:any;
enable_level2:any;
enable_level3:any;
enable_level4:any;
allowed_levels:any;
  constructor(public navCtrl: NavController, public navParams: NavParams , public viewCtrl: ViewController, public companyProvider: CompanyProvider, public alertCtrl: AlertController, public toastCtrl: ToastController,public loadingCtrl: LoadingController) {

  	this.allowed_levels = [];

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
      this.allowed_levels.push('1');
    }
    if(this.enable_level2 == 'false')
    {
      this.allowed_levels.push('2');
    }
    if(this.enable_level3 == 'false')
    {
      this.allowed_levels.push('3');
    }
    if(this.enable_level4 == 'false')
    {
      this.allowed_levels.push('4');
    }
    var allowed_levels = this.allowed_levels;

  	this.companyProvider.getUserGroups(this.userId).subscribe((allGroups)=>{
  		this.allGroups = allGroups;
  		if(allGroups != '')
  		{
  			var LevelGroups = [];
  			allGroups.forEach(function(data){
  				if(allowed_levels.indexOf(data.userLevel) >= 0)
		        {
		          LevelGroups.push(data);
		        }
  			});
  			this.allGroups = LevelGroups;
  		}
  	},
    err => {
        this.showTechnicalError();
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

  dismiss()
  {
  	this.viewCtrl.dismiss({});
  }

  addGroups()
  {
  	this.viewCtrl.dismiss(this.selected_groups);
  }

  insertGroupToArray(event,group){
	if(event.checked == true)
	{
		this.selected_groups.push(group);
	}
	else
	{
		this.removeArray(this.selected_groups, group);
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
