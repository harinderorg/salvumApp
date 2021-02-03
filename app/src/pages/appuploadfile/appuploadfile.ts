import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams , ModalController , ActionSheetController, ViewController, LoadingController,ToastController} from 'ionic-angular';
import { File } from '@ionic-native/file';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { CompanyProvider } from '../../providers/company/company';

declare var cordova: any; 

@IonicPage()
@Component({
  selector: 'page-appuploadfile',
  templateUrl: 'appuploadfile.html',
  providers: [CompanyProvider]
})
export class AppuploadfilePage {
  imagenew:any;
  lastImage:any;
  correctImage:any;
  imagesArray = [];
  apiEndPoint:any;
  additionalParameter = null;
  modal_title:any;
  filterTradeId:any;
  jobId:any;
  alltrades:any = [];
  file_path:any;
  folder_path:any;
  imagedate:any;
  uploadedImages = [];
  counter = 0;
  constructor(public modalCtrl: ModalController , public viewCtrl: ViewController , public navCtrl: NavController, public navParams: NavParams, private camera: Camera, private transfer: Transfer, private file: File, private filePath: FilePath, public actionSheetCtrl: ActionSheetController,public toastCtrl: ToastController, public companyProvider: CompanyProvider, public loadingCtrl: LoadingController) {
    this.file_path = localStorage.getItem('current_file_path');
      var APIURL = localStorage.getItem('APIURL');
      if(this.navParams.get('bid_upload') == '1')
      {
        this.modal_title = 'Upload files';
        this.filterTradeId = '1';

        var dateTime = this.navParams.get('dateTime');
          
        this.apiEndPoint= APIURL+'/bidFilesUpload/'+dateTime;
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
          });
          this.apiEndPoint = APIURL+'/tradeFilesUpload'; 
           
        }
        else
        {
          var userId = localStorage.getItem('userinfo');
          this.folder_path = this.file_path.split('files/')[1];
          this.modal_title = 'Upload files in ('+this.folder_path+') folder';
          this.apiEndPoint = APIURL+'/dirFileUpload/'+userId;
          //itemAlias: 'file', 
          this.additionalParameter = this.file_path;
                //folder_path: this.file_path
        }
    }
  };

  ionViewDidLoad() {
  }
  // dismiss()
  // {
  //   this.viewCtrl.dismiss();
  // }

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
  this.imagenew = imagePath;
      this.filePath.resolveNativePath(imagePath)
        .then(filePath => {
          let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);


          let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
          this.correctImage = currentName;
  
          this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
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
      this.imagesArray.push(this.lastImage);
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

  removeFile(image, index){
    this.imagesArray.splice(index, 1);
  }

  public uploadImage(image, index) {
    // File for Upload
    var targetPath = this.pathForImage(image);
    // File name only
    var filename = image;
    const loading = this.loadingCtrl.create({});
    loading.present();

    this.imagedate = {
      userId : localStorage.getItem('userinfo')
    }
    let body = JSON.stringify({'folder_path': this.additionalParameter});
    var options;
    if(this.additionalParameter != null){
      options = {
        fileKey: "file",
        fileName: filename,
        chunkedMode: false,
        mimeType: "multipart/form-data",
        params : {'fileName': filename , 'fields':body}
      };

    }else{
      options = {
        fileKey: "file",
        fileName: filename,
        chunkedMode: false,
        mimeType: "multipart/form-data",
        params : {'fileName': filename, 'fields':'' }
      };

    }
    
    const fileTransfer: TransferObject = this.transfer.create();

    fileTransfer.upload(targetPath, this.apiEndPoint, options).then(data => {
      console.log(data);
      loading.dismissAll()
            let toast = this.toastCtrl.create({
                message: 'Success',
                duration: 3000,
                cssClass: 'success',
                position: 'top'
              });
        toast.present(); 
        this.uploadedImages.push(image);
        this.imagesArray.splice(index, 1);
        //this.navCtrl.push(ProfilePage,imageData);
    });
  };


dismisss(){
  this.viewCtrl.dismiss();
}

 dismiss(tradeId){
    if(this.navParams.get('bid_upload') == '1')
      {
        this.viewCtrl.dismiss(this.uploadedImages);
      }
      else
      {
        if(this.navParams.get('page_type') == '1')
        {
          if(this.filterTradeId == '0' && this.uploadedImages.length > 0)
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
          else
          {
            localStorage.setItem('filt_TradeId',localStorage.getItem('filterTradeId'));
          }
          this.viewCtrl.dismiss(this.uploadedImages);
        }
        else
        {
          this.viewCtrl.dismiss();
        }
      }
  };

  uploadAllFiles(){
    if(this.counter < this.imagesArray.length){
      // File for Upload
      var targetPath = this.pathForImage(this.imagesArray[this.counter]);
      // File name only
      var filename = this.imagesArray[this.counter];
      

      this.imagedate = {
        userId : localStorage.getItem('userinfo')
      }
      let body = JSON.stringify({'folder_path': this.additionalParameter});
      var options;
      if(this.additionalParameter != null){
        options = {
          fileKey: "file",
          fileName: filename,
          chunkedMode: false,
          mimeType: "multipart/form-data",
          params : {'fileName': filename , 'fields':body}
        };

      }else{
        options = {
          fileKey: "file",
          fileName: filename,
          chunkedMode: false,
          mimeType: "multipart/form-data",
          params : {'fileName': filename, 'fields':'' }
        };
      }
      
      this.uploadFiles(targetPath, this.apiEndPoint, options);
    } 
  };


  uploadFiles(targetPath, apiEndPoint, options){
    const loading = this.loadingCtrl.create({});
      loading.present();
    const fileTransfer: TransferObject = this.transfer.create();

    fileTransfer.upload(targetPath, apiEndPoint, options).then(data => {
      loading.dismissAll();
            let toast = this.toastCtrl.create({
                message: 'Success',
                duration: 3000,
                cssClass: 'success',
                position: 'top'
              });
        toast.present(); 
        this.uploadedImages.push();
        this.imagesArray.splice(this.counter, 1);
        if(this.counter == this.imagesArray.length - 1){
          let toast = this.toastCtrl.create({
                message: 'Files has been uploaded successfully.',
                duration: 3000,
                cssClass: 'success',
                position: 'top'
              });
            toast.present(); 
            this.counter = 0;
            this.imagesArray = [];
        }else{
          this.counter = this.counter + 1;
          this.uploadAllFiles();
        }
        //this.navCtrl.push(ProfilePage,imageData);
    });
  };
}
