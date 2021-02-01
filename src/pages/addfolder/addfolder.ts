import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams , ViewController, AlertController,ToastController,LoadingController } from 'ionic-angular';
import { CompanyProvider } from '../../providers/company/company';
import * as CryptoJS from 'crypto-js';

@IonicPage()
@Component({
  selector: 'page-addfolder',
  templateUrl: 'addfolder.html',
  providers: [CompanyProvider] 
})
export class AddfolderPage {
folder_name: any;
file_path: any;
jobId: any;
main_page_title: any;
file_type: any;
alltrades: any;
filterTradeId: any;
allowed_levels: any;
enable_level1: any;
enable_level2: any;
enable_level3: any;
enable_level4: any;
show_add_folder: any;
isShared: any = '0';
userId: any = localStorage.getItem('userinfo');
  constructor(public navCtrl: NavController, public navParams: NavParams , public viewCtrl: ViewController, public companyProvider: CompanyProvider, public alertCtrl: AlertController, public toastCtrl: ToastController,public loadingCtrl: LoadingController) {

      this.file_path = localStorage.getItem('current_file_path');
      if(navParams.get('is_smail_folder') == '1')
      {
        this.file_path = localStorage.getItem('smail_path');
        if(!this.file_path)
        {
          this.file_path = 'nopath';
        }
      }
  		if(navParams.get('folder_name') != undefined)
  		{ 
  			this.main_page_title = 'Rename Folder';
  			this.folder_name = navParams.get('folder_name');
  		}
  		else
  		{
  			this.main_page_title = 'Add Folder';
  		}

      if(navParams.get('job_files') == '1')
      {
        this.filterTradeId = localStorage.getItem('filterTradeId');
        if(this.filterTradeId == null || this.filterTradeId == undefined || this.filterTradeId == ''){
          this.filterTradeId = '0';
        }
        console.log(this.filterTradeId)
        this.file_type = navParams.get('file_type');
        this.jobId = navParams.get('jobId');
        this.companyProvider.allTrades(this.jobId).subscribe((alltrades)=>{
          this.alltrades = alltrades;
        },
          err => {
              this.showTechnicalError();
          });
      }

      if(navParams.get('isShared') == '1')
      {
        this.isShared = '1';
        this.show_add_folder = navParams.get('show_add_folder');
        this.getOpenLevels();
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

  getOpenLevels()
  {
    this.allowed_levels = [];
    var levels_array = JSON.parse(localStorage.getItem('alllevel'));
    if(levels_array){
      levels_array.forEach((value) => {
        var decrypted = CryptoJS.AES.decrypt(value, this.userId);
        if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level0'){
          this.enable_level1 = 'true';
          this.enable_level2 = 'true';
          this.enable_level3 = 'true';
          this.enable_level4 = 'true';
        }
        if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level1'){
          this.enable_level1  = 'false';
          this.enable_level2 = 'true';
          this.enable_level3 = 'true';
          this.enable_level4 = 'true';
        } if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level2'){
          this.enable_level1  = 'false';
          this.enable_level2  = 'false';
          this.enable_level3 = 'true';
          this.enable_level4 = 'true';
        } if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level3'){
          this.enable_level1  = 'false';
          this.enable_level2  = 'false';
          this.enable_level3  = 'false';
          this.enable_level4 = 'true';
        } if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level4'){
          this.enable_level1  = 'false';
          this.enable_level2  = 'false';
          this.enable_level3  = 'false';
          this.enable_level4  = 'false';
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
  }

  dismiss()
  {
  	this.viewCtrl.dismiss();
  }
  addFolderEvent(folder_name,tradeId,onLevel){ 

    if(folder_name == undefined || folder_name == '')
    {
      let toast = this.toastCtrl.create({
          message: 'Please enter valid folder name.',
          duration: 3000,
          position : 'top',
          cssClass: 'danger'
         });
         toast.present();
    }
    else
    {     
        if(this.navParams.get('folder_name') != undefined)
        {
          const loading = this.loadingCtrl.create({});
          loading.present();
          var new_path = this.file_path.split('/').slice(0, -1).join('/')+'/'+folder_name;
          this.companyProvider.renameDirectoryFolder(this.file_path,new_path,'0').subscribe((formdata)=>{
            if(formdata.status == 1)
              {
                 loading.dismissAll();
                this.viewCtrl.dismiss('4'); 
              }
              else if(formdata.status == 2)
              {
                  loading.dismissAll()
                    let toast = this.toastCtrl.create({
                        message: 'Folder name already exists.',
                        duration: 3000,
                        position : 'top',
                        cssClass: 'danger'
                       });
                       toast.present(); 
              }
              else
              {
                  loading.dismissAll()
                    let toast = this.toastCtrl.create({
                        message: 'Error, plz try later.',
                        duration: 3000,
                        position : 'top',
                        cssClass: 'danger'
                       });
                       toast.present(); 
                  this.viewCtrl.dismiss('0');
              }
          },
          err => {
              loading.dismissAll();
              this.showTechnicalError('1');
          });
        }
        else
        {
          if(this.navParams.get('job_files') == '1')
          {
            if(this.filterTradeId == '0')
              {
                if(tradeId == undefined || tradeId == '')
                {
                  let toast = this.toastCtrl.create({
                    message: 'Please select trade.',
                    duration: 3000,
                    position : 'top',
                    cssClass: 'danger'
                   });
                   toast.present(); 
                   return false;
                }
              }
              else
              {
                tradeId = localStorage.getItem('filterTradeId');
              }
             
              var fileobj = {
                file_name : folder_name,
                status : '0',
                type : this.file_type,
                folder_path : localStorage.getItem('files_folder_path')
              }
              // console.log(fileobj);

              const loading = this.loadingCtrl.create({});
              loading.present();
              this.companyProvider.addFoldersFiles(this.jobId,tradeId,fileobj).subscribe((formdata)=>{
                if(formdata.status == 1)
                  {
                     loading.dismissAll();
                    this.viewCtrl.dismiss('1');  
                  }
                  else if(formdata.status == 2)
                  {
                      loading.dismissAll()
                        let toast = this.toastCtrl.create({
                            message: 'Folder name already exists.',
                            duration: 3000,
                            position : 'top',
                            cssClass: 'danger'
                           });
                           toast.present(); 
                  }
                  else
                  {
                      loading.dismissAll()
                        let toast = this.toastCtrl.create({
                            message: 'Error, plz try later.',
                            duration: 3000,
                            position : 'top',
                            cssClass: 'danger'
                           });
                           toast.present(); 
                      this.viewCtrl.dismiss('0');
                  }
              },
              err => {
                  loading.dismissAll();
                  this.showTechnicalError('1');
              });
          }
          else
          {
            if(this.file_path == 'nopath')
            {
              if(this.isShared == '1')
              {
                if(onLevel == undefined || onLevel == '')
                {
                  let toast = this.toastCtrl.create({
                      message: 'Please select level.',
                      duration: 3000,
                      position : 'top',
                      cssClass: 'danger'
                     });
                     toast.present();
                     return false;
                }
              }
              else
              {
                onLevel = null;
              }
            }
            else
            {
              onLevel = null;
            }
            if(this.navParams.get('is_smail_folder') == '1')
            {
              const loading = this.loadingCtrl.create({});
               loading.present();
              this.companyProvider.createFolder(this.userId, {
                                        name: folder_name,
                                        level: localStorage.getItem('smail_path'),
                                        userId: this.userId
                                    }).subscribe((formdata)=>{
                if(formdata.status == 1)
                  {
                     loading.dismissAll();
                    this.viewCtrl.dismiss('1');  
                  }
                  else if(formdata.status == 2)
                  {
                      loading.dismissAll()
                        let toast = this.toastCtrl.create({
                            message: 'Folder name already exists.',
                            duration: 3000,
                            position : 'top',
                            cssClass: 'danger'
                           });
                           toast.present(); 
                  }
                  else
                  {
                      loading.dismissAll()
                        let toast = this.toastCtrl.create({
                            message: 'Error, plz try later.',
                            duration: 3000,
                            position : 'top',
                            cssClass: 'danger'
                           });
                           toast.present(); 
                      this.viewCtrl.dismiss('0');
                  }
              },
              err => {
                  loading.dismissAll();
                  this.showTechnicalError('1');
              });
            }
            else
            {
              const loading = this.loadingCtrl.create({});
               loading.present();
              this.companyProvider.addDirectoryFolders(this.file_path,folder_name,this.userId,this.isShared,onLevel,localStorage.getItem('clicked_user_id'),localStorage.getItem('clicked_whichLevel'),localStorage.getItem('userName'),this.show_add_folder,localStorage.getItem('clicked_fid')).subscribe((formdata)=>{
                if(formdata.status == 1)
                  {
                     loading.dismissAll();
                     localStorage.setItem('new_dir_folder',folder_name);
                    this.viewCtrl.dismiss('1');  
                  }
                  else if(formdata.status == 2)
                  {
                      loading.dismissAll()
                        let toast = this.toastCtrl.create({
                            message: 'Folder name already exists.',
                            duration: 3000,
                            position : 'top',
                            cssClass: 'danger'
                           });
                           toast.present(); 
                  }
                  else
                  {
                      loading.dismissAll()
                        let toast = this.toastCtrl.create({
                            message: 'Error, plz try later.',
                            duration: 3000,
                            position : 'top',
                            cssClass: 'danger'
                           });
                           toast.present(); 
                      this.viewCtrl.dismiss('0');
                  }
              },
              err => {
                  loading.dismissAll();
                  this.showTechnicalError('1');
              });
            }
          }
          
        }

    }
  }
}
