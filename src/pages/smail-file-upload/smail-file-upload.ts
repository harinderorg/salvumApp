import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams , ViewController, AlertController,ToastController,LoadingController } from 'ionic-angular';
import { CompanyProvider } from '../../providers/company/company';
import { FileUploader } from 'ng2-file-upload';

@IonicPage()
@Component({
  selector: 'page-smail-file-upload',
  templateUrl: 'smail-file-upload.html',
  providers: [CompanyProvider]
})
export class SmailFileUploadPage {

  	file_path : any; 
	folder_path : any;
	public uploader: FileUploader;
	filetype_error: any = '0';
	filesize_error: any = '0';
	public hasBaseDropZoneOver:boolean = false;
	attachments = [];
	  constructor(public navCtrl: NavController, public navParams: NavParams , public viewCtrl: ViewController, public companyProvider: CompanyProvider, public alertCtrl: AlertController, public toastCtrl: ToastController,public loadingCtrl: LoadingController) {
	  		this.file_path = localStorage.getItem('current_smail_path');
	  		//this.folder_path = this.file_path.split('smail/')[1];
	  		var APIURL = localStorage.getItem('APIURL');

	  		//this.uploader  = new FileUploader({url: APIURL + "/dirFileUpload", itemAlias: 'file'});
	  		this.uploader  = new FileUploader({
	  			url: APIURL + '/dirFilesUpload', 
	  			allowedMimeType: ['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','application/zip','application/octet-stream','text/csv','text/plain', 'text/html','application/vnd.ms-powerpoint','image/vnd.adobe.photoshop', 'video/mp4', 'video/x-msvideo', 'video/quicktime', 'video/x-ms-wmv', 'video/3gpp', 'application/vnd.openxmlformats-officedocument.presentationml.presentation','application/x-photoshop','application/photoshop','application/psd','image/psd','application/x-zip-compressed','','image/hpgl','application/x-hgl','application/x-hgl','application/vnd.hp-HPGL','application/postscript','application/hgl','application/freelance','zz-application/zz-winassoc-hgl','zz-application/zz-winassoc-HGL','vector/x-hpgl2','image/x-plt','image/plt','application/vnd.hp-HPGL','application/plt','application/x-prn','application/dwf', 'application/x-dwf', 'drawing/x-dwf', 'image/vnd.dwf', 'image/x-dwf','image/tiff','application/acad','image/vnd.dwg','image/x-dwg','application/dxf' , 'application/x-autocad ', 'application/x-dxf' , 'drawing/x-dxf' , 'image/vnd.dxf',' image/x-autocad' , 'image/x-dxf' , 'zz-application/zz-winassoc-dxf','application/vnd.ms-project', 'application/msproj', 'application/x-msproject', 'application/x-ms-project', 'application/x-dos_ms_project', 'application/mpp', 'zz-application/zz-winassoc-mpp','application/x-rar-compressed','multipart/x-zip','application/x-zip','application/x-compress','application/x-compressed','audio/x-musepack','application/x-rar'], 
	  			itemAlias: 'file', 
	  			additionalParameter: {
       				folder_path: 'directory/smail_data/'
   				},
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

	        this.uploader.onCompleteItem = (item:any, response:any, status:any, headers:any) => {
	           
	            var response = JSON.parse(response);
	            this.attachments.push(response.data.file_name);

	        };

	  		this.uploader.onCompleteAll = () => {
			    console.log('complete');
			};
	  }

	closeErrorS(){
		this.filesize_error = '0';
	}

	 dismiss()
	  {	
	  	this.viewCtrl.dismiss(this.attachments);
	  }
	  public fileOverBase(e:any):void {
	    this.hasBaseDropZoneOver = e;
  	}

  	closeError(){
    this.filetype_error = '0';
  }

}
