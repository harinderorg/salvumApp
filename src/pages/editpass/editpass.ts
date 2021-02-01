import { Component } from '@angular/core';
import { IonicPage,ToastController, NavController, NavParams ,ViewController,ActionSheetController, Platform, LoadingController} from 'ionic-angular';
import {Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/Rx';
import { File } from '@ionic-native/file';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { FileUploader } from 'ng2-file-upload';

declare var cordova: any;

@IonicPage()
@Component({
  selector: 'page-editpass',
  templateUrl: 'editpass.html', 
})
export class EditpassPage {
  data: Object = {};
  lastImage:string;
  currentName:string;
  imageData:string;
  filetype_error: any = '0';
  filesize_error: any = '0';
  API_ENDPOINT_URL : any = localStorage.getItem('API_ENDPOINT_URL');
  updateURL = 'updatepassword';
  uploader:any;
  loading:any;
  iswebfileUploader:Boolean = false;
  extnal:any;
  APIURL = localStorage.getItem('APIURL');
  isBrowser:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,public newCtrl: ViewController,public http:Http ,public toastCtrl: ToastController,private camera: Camera, private transfer: Transfer, private file: File, private filePath: FilePath, public actionSheetCtrl: ActionSheetController, public platform: Platform, public loadingCtrl: LoadingController) {
    this.http = http;
    this.isBrowser = localStorage.getItem('isBrowser');
    this.uploader  = new FileUploader({
      url: this.APIURL + '/updatepassword', 
      allowedMimeType: ['image/png', 'image/jpg', 'image/jpeg', 'image/gif'],
      itemAlias: 'file', 
      additionalParameter: {
        folder_path: 'images',
        'fields' : JSON.stringify(this.data)
      },
      maxFileSize: 500*1024*1024
    });

    this.uploader.onBeforeUploadItem = (item) => {
      item.withCredentials = false;
    }

    this.uploader.onWhenAddingFileFailed = (check) => { 
      if(check.size > 500*1024*1024){
        this.filesize_error = '1';
      }
      else{
        this.filetype_error = '1';
      }
    }

    this.uploader.onCompleteItem = (item:any, response:any, status:any, headers:any) => {
      this.iswebfileUploader = false;
    };

    this.uploader.onCompleteAll = () => {
      this.loading.dismissAll();
      let toast = this.toastCtrl.create({
          message: 'Password has been updated successfully.',
          duration: 3000,
          cssClass: 'success',
          position: 'top'
      });
      toast.present();
      this.navCtrl.setRoot('PasswordsPage');
    };
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

  closeErrorS(){
    this.filesize_error = '0';
  }

  ionViewDidLoad() {
    this.data  = JSON.parse(localStorage.getItem('passworddetail'));
    console.log(this.data);
  }

  dismiss() {
    this.newCtrl.dismiss('empty');
  } 

  updatePasword(){
     let body = this.data;
     let headers = new Headers({ 'Content-Type': 'application/json' });
     let options = new RequestOptions({ headers: headers });
     return this.http.post(this.APIURL +'/walletDeatil/12341241214',  body, options)
          .map(res => res.json())
          .subscribe(data => {
           let toast = this.toastCtrl.create({
                message: 'Password has been updated successfully.',
                duration: 3000,
                cssClass: 'success',
                position: 'top'
              });
             toast.present();
             this.newCtrl.dismiss(); 
            },
            err => {
                this.showTechnicalError('1');
            });
  }



   public presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Image Source',
      buttons: [
        {
          text: 'Choose Image',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }


  public takePicture(sourceType) {
  // Create options for the Camera Dialog
  var options = {
    quality: 100,
    sourceType: sourceType,
    saveToPhotoAlbum: false,
    correctOrientation: true
  };
 
  // Get the data of an image
  this.camera.getPicture(options).then((imagePath) => {
   this.imageData = imagePath;
      this.filePath.resolveNativePath(imagePath)
        .then(filePath => {
          let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);


          this.currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
      
  
          this.copyFileToLocalDir(correctPath, this.currentName, this.createFileName());
        });
  }, (err) => {
    
  });
}

  // Create a new name for the image
  private createFileName() {
    var d = new Date(),
    n = d.getTime(),
    newFileName =  n + ".jpg";
    return newFileName;
  }
 
  // Copy the image to a local folder
  private copyFileToLocalDir(namePath, currentName, newFileName) {
    this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
      this.lastImage = newFileName;
    }, error => {
      this.presentToast('Error while storing file.');
    });
  }
 
  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top',
      cssClass: 'danger'
    });
    toast.present();
  }
 
  // Always get the accurate path to your apps folder
  public pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return cordova.file.dataDirectory + img;
    }
  }

  public uploadImage() {
    if(this.isBrowser == 'true'){
      this.loading = this.loadingCtrl.create({});
      this.loading.present();
      // let body = JSON.stringify(this.extnal);
      //this.addweb = this.extnal;
      if(this.uploader.queue.length == 0){
        this.updatePasword(); 
      }else{
        this.loading = this.loadingCtrl.create({});
        this.loading.present();
        // let body = JSON.stringify(this.extnal);
        //this.addweb = this.extnal;
        this.uploader.queue[0].options.additionalParameter.fields = JSON.stringify(this.data);
        this.uploader.queue[0].upload();
      }
    }else{
      // Destination URL
      const loading = this.loadingCtrl.create({});
      loading.present();
     
      // File for Upload
      var targetPath = this.pathForImage(this.lastImage);
     
      // File name only
      var filename = this.lastImage;
      let body = JSON.stringify(this.data);
      var options = {
        fileKey: "file",
        fileName: filename,
        chunkedMode: false,
        mimeType: "multipart/form-data",
        params : {'fileName': filename , 'fields' : body}
      };
      const fileTransfer: TransferObject = this.transfer.create();

      fileTransfer.upload(targetPath, this.API_ENDPOINT_URL+this.updateURL, options).then(data => {
        loading.dismissAll()
        let passadddata = data;
        let toast = this.toastCtrl.create({
          message: 'Password was updated successfully',
          duration: 3000,
          cssClass: 'success',
          position: 'top'
        });
        toast.present(); 
        this.navCtrl.push('PasswordsPage',passadddata);
      });
    }
  }

  closeError(){
    this.filetype_error = '0';
  }

}