import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams , ViewController, AlertController,ToastController,LoadingController } from 'ionic-angular';
import { CompanyProvider } from '../../providers/company/company';
import { FileUploader } from 'ng2-file-upload';
import * as CryptoJS from 'crypto-js';

@IonicPage()
@Component({
  selector: 'page-uploadfile',
  templateUrl: 'uploadfile.html',
  providers: [CompanyProvider]
})
export class UploadfilePage {
file_path : any;
folder_path : any;
modal_title : any;
public uploader: FileUploader;
uploaderOptions: any;
filterTradeId: any;
jobId: any;
alltrades: any;
public hasBaseDropZoneOver:boolean = false;
allowed_levels: any;
enable_level1: any;
enable_level2: any;
enable_level3: any;
enable_level4: any;
show_add_folder: any;
filetype_error: any = '0';
filesize_error: any = '0';
fileQueue_error: any = '0';
isShared: any = '0';
onLevel:any = '1';
transmittal_file : any;
single_allowed : any;
userId: any = localStorage.getItem('userinfo');
  constructor(public navCtrl: NavController, public navParams: NavParams , public viewCtrl: ViewController, public companyProvider: CompanyProvider, public alertCtrl: AlertController, public toastCtrl: ToastController,public loadingCtrl: LoadingController) {
  		this.file_path = localStorage.getItem('current_file_path');
      this.transmittal_file = navParams.get('transmittal_file');
      this.single_allowed = navParams.get('single_allowed');
  		var APIURL = localStorage.getItem('APIURL');
      if(this.navParams.get('bid_upload') == '1')
      {
        this.modal_title = 'Upload files';
        this.filterTradeId = '1';

        var dateTime = this.navParams.get('dateTime');
          this.uploader  = new FileUploader({
            allowedMimeType: ['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','application/zip','application/octet-stream','text/csv','text/plain', 'text/html', 'video/mp4', 'video/x-msvideo', 'video/quicktime', 'video/x-ms-wmv', 'video/3gpp','application/vnd.ms-powerpoint','image/vnd.adobe.photoshop','application/vnd.openxmlformats-officedocument.presentationml.presentation','application/x-photoshop','application/photoshop','application/psd','image/psd','application/x-zip-compressed','','image/hpgl','application/x-hgl','application/x-hgl','application/vnd.hp-HPGL','application/postscript','application/hgl','application/freelance','zz-application/zz-winassoc-hgl','zz-application/zz-winassoc-HGL','vector/x-hpgl2','image/x-plt','image/plt','application/vnd.hp-HPGL','application/plt','application/x-prn','application/dwf', 'application/x-dwf', 'drawing/x-dwf', 'image/vnd.dwf', 'image/x-dwf','image/tiff','application/acad','image/vnd.dwg','image/x-dwg','application/dxf' , 'application/x-autocad ', 'application/x-dxf' , 'drawing/x-dxf' , 'image/vnd.dxf',' image/x-autocad' , 'image/x-dxf' , 'zz-application/zz-winassoc-dxf','application/vnd.ms-project', 'application/msproj', 'application/x-msproject', 'application/x-ms-project', 'application/x-dos_ms_project', 'application/mpp', 'zz-application/zz-winassoc-mpp','application/x-rar-compressed','multipart/x-zip','application/x-zip','application/x-compress','application/x-compressed','audio/x-musepack','application/x-rar'],
            url: APIURL+'/bidFilesUpload/'+dateTime, 
            itemAlias: 'file',
            maxFileSize: 500*1024*1024
           });

          this.uploader.onWhenAddingFileFailed = (check) => { 
              if(check.size > 500*1024*1024){
                this.filesize_error = '1';
              }
              else{
                this.filetype_error = '1';
              }
            }

          this.uploader.onBeforeUploadItem = (item) => {
                item.withCredentials = false;
            }
      }
      else
      {
        
        if(this.navParams.get('page_type') == '1')
        {
          this.modal_title = 'Upload files';
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

          this.uploader  = new FileUploader({
            allowedMimeType: ['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','application/zip','application/octet-stream','text/csv','text/plain', 'text/html', 'video/mp4', 'video/x-msvideo', 'video/quicktime', 'video/x-ms-wmv', 'video/3gpp','application/vnd.ms-powerpoint','image/vnd.adobe.photoshop','application/vnd.openxmlformats-officedocument.presentationml.presentation','application/x-photoshop','application/photoshop','application/psd','image/psd','application/x-zip-compressed','','image/hpgl','application/x-hgl','application/x-hgl','application/vnd.hp-HPGL','application/postscript','application/hgl','application/freelance','zz-application/zz-winassoc-hgl','zz-application/zz-winassoc-HGL','vector/x-hpgl2','image/x-plt','image/plt','application/vnd.hp-HPGL','application/plt','application/x-prn','application/dwf', 'application/x-dwf', 'drawing/x-dwf', 'image/vnd.dwf', 'image/x-dwf','image/tiff','application/acad','image/vnd.dwg','image/x-dwg','application/dxf' , 'application/x-autocad ', 'application/x-dxf' , 'drawing/x-dxf' , 'image/vnd.dxf',' image/x-autocad' , 'image/x-dxf' , 'zz-application/zz-winassoc-dxf','application/vnd.ms-project', 'application/msproj', 'application/x-msproject', 'application/x-ms-project', 'application/x-dos_ms_project', 'application/mpp', 'zz-application/zz-winassoc-mpp','application/x-rar-compressed','multipart/x-zip','application/x-zip','application/x-compress','application/x-compressed','audio/x-musepack','application/x-rar'],
            url: APIURL+'/tradeFilesUpload', 
            itemAlias: 'file',
            maxFileSize: 500*1024*1024
           });

          this.uploader.onWhenAddingFileFailed = (check) => { 
              if(check.size > 500*1024*1024){
                this.filesize_error = '1';
              }
              else{
                this.filetype_error = '1';
              }
            }

          this.uploader.onBeforeUploadItem = (item) => {
                item.withCredentials = false;
            }
        }
        else
        {
          if(navParams.get('isShared') == '1')
          {
            this.isShared = '1';
            this.show_add_folder = navParams.get('show_add_folder');
            this.getOpenLevels();

            this.folder_path = this.file_path.split('files/')[1];
            this.modal_title = 'Upload Files';
            this.uploader  = new FileUploader({
              allowedMimeType: ['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','application/zip','application/octet-stream','text/csv','text/plain', 'text/html', 'video/mp4', 'video/x-msvideo', 'video/quicktime', 'video/x-ms-wmv', 'video/3gpp','application/vnd.ms-powerpoint','image/vnd.adobe.photoshop','application/vnd.openxmlformats-officedocument.presentationml.presentation','application/x-photoshop','application/photoshop','application/psd','image/psd','application/x-zip-compressed','','image/hpgl','application/x-hgl','application/x-hgl','application/vnd.hp-HPGL','application/postscript','application/hgl','application/freelance','zz-application/zz-winassoc-hgl','zz-application/zz-winassoc-HGL','vector/x-hpgl2','image/x-plt','image/plt','application/vnd.hp-HPGL','application/plt','application/x-prn','application/dwf', 'application/x-dwf', 'drawing/x-dwf', 'image/vnd.dwf', 'image/x-dwf','image/tiff','application/acad','image/vnd.dwg','image/x-dwg','application/dxf' , 'application/x-autocad ', 'application/x-dxf' , 'drawing/x-dxf' , 'image/vnd.dxf',' image/x-autocad' , 'image/x-dxf' , 'zz-application/zz-winassoc-dxf','application/vnd.ms-project', 'application/msproj', 'application/x-msproject', 'application/x-ms-project', 'application/x-dos_ms_project', 'application/mpp', 'zz-application/zz-winassoc-mpp','application/x-rar-compressed','multipart/x-zip','application/x-zip','application/x-compress','application/x-compressed','audio/x-musepack','application/x-rar'],
            url: APIURL+'/dirFileUpload/'+this.userId, 
            itemAlias: 'file', 
            maxFileSize: 500*1024*1024,
            additionalParameter: {
                  folder_path: this.file_path,
                  userId: this.userId,
                  isShared: this.isShared,
                  onLevel: this.onLevel,
                  toId: localStorage.getItem('clicked_user_id'),
                  toLevel: localStorage.getItem('clicked_whichLevel'),
                  from_user: localStorage.getItem('userName'),
                  show_add_folder: this.show_add_folder,
                  clicked_fid: localStorage.getItem('clicked_fid')
              }
           });

            this.uploader.onWhenAddingFileFailed = (check) => { 
              if(check.size > 500*1024*1024){
                this.filesize_error = '1';
              }
              else{
                this.filetype_error = '1';
              }
            }

              this.uploader.onBeforeUploadItem = (item) => {
                // const loading = this.loadingCtrl.create({}); 
                // loading.present();
                item.withCredentials = false;
              }

              this.uploader.onCompleteItem = (item:any, response:any, status:any, headers:any) => {
                var response = JSON.parse("[" + response + "]");
                if(response != '')
                {
                  if(response[0].status == '1')
                  {
                   if(this.uploader.getNotUploadedItems().length == 0)
                   {
                    let toast = this.toastCtrl.create({
                      message: 'Files uploaded successfully.',
                      duration: 3000,
                      position: 'top',
                      cssClass: 'success'
                     });
                   toast.present();
                    this.dismiss(null);
                   }
                  }
                  else
                  {
                    let toast = this.toastCtrl.create({
                    message: 'Error while uploading.',
                    duration: 3000,
                    position: 'top',
                    cssClass: 'danger'
                   });
                   toast.present();
                  }
                }
              };
          }
          else
          {
            if(navParams.get('transmittal_file') == '1'){
              var all_files = [];
              this.uploader  = new FileUploader({
                url: APIURL+'/transmittalFilesUpload', 
                queueLimit: this.single_allowed == '1' ? 1 : 10,
                itemAlias: 'file',
                maxFileSize: 500*1024*1024,
                allowedMimeType: ['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','application/zip','application/octet-stream','text/csv','text/plain', 'text/html', 'video/mp4', 'video/x-msvideo', 'video/quicktime', 'video/x-ms-wmv', 'video/3gpp','application/vnd.ms-powerpoint','image/vnd.adobe.photoshop','application/vnd.openxmlformats-officedocument.presentationml.presentation','application/x-photoshop','application/photoshop','application/psd','image/psd','application/x-zip-compressed','','image/hpgl','application/x-hgl','application/x-hgl','application/vnd.hp-HPGL','application/postscript','application/hgl','application/freelance','zz-application/zz-winassoc-hgl','zz-application/zz-winassoc-HGL','vector/x-hpgl2','image/x-plt','image/plt','application/vnd.hp-HPGL','application/plt','application/x-prn','application/dwf', 'application/x-dwf', 'drawing/x-dwf', 'image/vnd.dwf', 'image/x-dwf','image/tiff','application/acad','image/vnd.dwg','image/x-dwg','application/dxf' , 'application/x-autocad ', 'application/x-dxf' , 'drawing/x-dxf' , 'image/vnd.dxf',' image/x-autocad' , 'image/x-dxf' , 'zz-application/zz-winassoc-dxf','application/vnd.ms-project', 'application/msproj', 'application/x-msproject', 'application/x-ms-project', 'application/x-dos_ms_project', 'application/mpp', 'zz-application/zz-winassoc-mpp','application/x-rar-compressed','multipart/x-zip','application/x-zip','application/x-compress','application/x-compressed','audio/x-musepack','application/x-rar'],
               });

                this.uploader.onBeforeUploadItem = (item) => {
                    item.withCredentials = false;
                }

                this.uploader.onWhenAddingFileFailed = (check,error) => { 
                  if(error.name == 'queueLimit'){
                    this.fileQueue_error = '1';
                  }
                  else{
                    if(check.size > 500*1024*1024){
                      this.filesize_error = '1';
                    }
                    else{
                      this.filetype_error = '1';
                    }
                  }
                  // let toast = this.toastCtrl.create({
                  //       message: 'You can add only one file at once.',
                  //       duration: 3000,
                  //       position: 'top',
                  //       cssClass: 'danger'
                  //      });
                  //    toast.present();
                }

                this.uploader.onCompleteItem = (item:any, response:any, status:any, headers:any) => {
                  var response = JSON.parse("[" + response + "]");
                  if(response != '')
                  {
                    if(response[0].status == '1')
                    {
                      all_files.push({file : response[0].data.file_name, date : item.some.lastModifiedDate});
                      if(this.uploader.getNotUploadedItems().length == 0){
                        this.viewCtrl.dismiss(all_files);
                      }
                    }
                    else
                    {
                      this.viewCtrl.dismiss(null);
                    }
                  }
                  else
                  {
                    this.viewCtrl.dismiss(null);
                  }
                };
            }
            else{
              this.folder_path = this.file_path.split('files/')[1];
              this.modal_title = this.file_path != 'nopath' ? 'Upload files in ('+this.folder_path.split('_--_').pop(-1)+') folder' : 'Upload Files';
              this.uploader  = new FileUploader({
              allowedMimeType: ['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','application/zip','application/octet-stream','text/csv','text/plain', 'text/html', 'video/mp4', 'video/x-msvideo', 'video/quicktime', 'video/x-ms-wmv', 'video/3gpp','application/vnd.ms-powerpoint','image/vnd.adobe.photoshop','application/vnd.openxmlformats-officedocument.presentationml.presentation','application/x-photoshop','application/photoshop','application/psd','image/psd','application/x-zip-compressed','','image/hpgl','application/x-hgl','application/x-hgl','application/vnd.hp-HPGL','application/postscript','application/hgl','application/freelance','zz-application/zz-winassoc-hgl','zz-application/zz-winassoc-HGL','vector/x-hpgl2','image/x-plt','image/plt','application/vnd.hp-HPGL','application/plt','application/x-prn','application/dwf', 'application/x-dwf', 'drawing/x-dwf', 'image/vnd.dwf', 'image/x-dwf','image/tiff','application/acad','image/vnd.dwg','image/x-dwg','application/dxf' , 'application/x-autocad ', 'application/x-dxf' , 'drawing/x-dxf' , 'image/vnd.dxf',' image/x-autocad' , 'image/x-dxf' , 'zz-application/zz-winassoc-dxf','application/vnd.ms-project', 'application/msproj', 'application/x-msproject', 'application/x-ms-project', 'application/x-dos_ms_project', 'application/mpp', 'zz-application/zz-winassoc-mpp','application/x-rar-compressed','multipart/x-zip','application/x-zip','application/x-compress','application/x-compressed','audio/x-musepack','application/x-rar'],
              url: APIURL+'/dirFileUpload/'+null, 
              itemAlias: 'file', 
              maxFileSize: 500*1024*1024,
              additionalParameter: {
                    folder_path: this.file_path
                }
             });

              this.uploader.onWhenAddingFileFailed = (check) => { 
                if(check.size > 500*1024*1024){
                  this.filesize_error = '1';
                }
                else{
                  this.filetype_error = '1';
                }
              }

                this.uploader.onBeforeUploadItem = (item) => {
                    item.withCredentials = false;
                }

                this.uploader.onCompleteItem = (item:any, response:any, status:any, headers:any) => {
                  var response = JSON.parse("[" + response + "]");
                  if(response != '')
                  {
                    if(response[0].status == '1')
                    {
                      
                     if(this.uploader.getNotUploadedItems().length == 0)
                     {
                      let toast = this.toastCtrl.create({
                        message: 'Files uploaded successfully.',
                        duration: 3000,
                        position: 'top',
                        cssClass: 'success'
                       });
                     toast.present();
                      this.dismiss(null);
                     }
                    }
                    else
                    {
                      let toast = this.toastCtrl.create({
                      message: 'Error while uploading.',
                      duration: 3000,
                      position: 'top',
                      cssClass: 'danger'
                     });
                     toast.present();
                    }
                  }
                };
            }
          }
        }
      }
  	}

 closeErrorS(){
  this.filesize_error = '0';
 }

 closeErrorQ(){
  this.fileQueue_error = '0';
 }

 dismiss(tradeId){
    if(this.navParams.get('bid_upload') == '1')
      {
        this.viewCtrl.dismiss(this.uploader.queue);
      }
      else
      {
        if(this.navParams.get('page_type') == '1')
        {
          if(this.filterTradeId == '0' && this.uploader.queue.length > 0)
          {
            if(tradeId == undefined || tradeId == '')
            {
              let toast = this.toastCtrl.create({
                message: 'Please select trade.',
                duration: 3000,
                position: 'top',
                cssClass: 'danger'
               });
               toast.present(); 
               return false;
            }
            localStorage.setItem('filt_TradeId',tradeId);
          }
          else
          {
            localStorage.setItem('filt_TradeId',localStorage.getItem('filterTradeId'));
          }
          this.viewCtrl.dismiss(this.uploader.queue);
        }
        else
        {
          this.viewCtrl.dismiss();
        }
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

  getOpenLevels(){
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

  closeError(){
    this.filetype_error = '0';
  }

  public fileOverBase(e:any):void {
    this.hasBaseDropZoneOver = e;
  }

}
