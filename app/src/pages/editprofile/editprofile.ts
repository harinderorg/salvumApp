import { Component } from '@angular/core';
import { IonicPage,ToastController, NavController, NavParams ,Platform ,ActionSheetController, LoadingController, Events} from 'ionic-angular';
import {Http} from '@angular/http';
import 'rxjs/Rx';
import { File } from '@ionic-native/file';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { FileUploader } from 'ng2-file-upload';
import { ContactserviceProvider } from '../../providers/contactservice/contactservice';
import * as $ from 'jquery';
declare var cordova: any; 

@IonicPage()
@Component({
  selector: 'page-editprofile',
  templateUrl: 'editprofile.html',
  providers: [ContactserviceProvider]
})
export class EditprofilePage {
  data : object = {'linkdin': '', 'gplus': '', 'twitter': '','facebook':''} 
  imagedate : object = {} 
  public uploader: FileUploader;
  imagenew:string;
  uid : object = {};
  userSocialLink : object = {};
  lastImage:string;
  isBrowser:any;
  filetype_error: any = '0';
  filesize_error: any = '0';
  image:any = '';
  updateImageURL = localStorage.getItem('APIURL') + '/updateProfile';
  imageUrl = localStorage.getItem('APIURL') + '/images/';
  correctImage = '';
  constructor(public navCtrl: NavController, public navParams: NavParams,public http:Http,private camera: Camera, private transfer: Transfer, private file: File, private filePath: FilePath,public toastCtrl: ToastController,public actionSheetCtrl: ActionSheetController, public platform: Platform, public loadingCtrl: LoadingController, public contactserviceProvider: ContactserviceProvider, public events: Events) {
    var APIURL = localStorage.getItem('APIURL');
      this.uploader  = new FileUploader({
        url: APIURL + '/profileFilesUpload', 
        allowedMimeType: ['image/png', 'image/jpg', 'image/jpeg', 'image/gif'],
        itemAlias: 'file', 
        additionalParameter: {
          folder_path: 'images'
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
        const loading = this.loadingCtrl.create({});
        loading.present();
      }

     // this.events.publish('username:changed', []);

      this.uploader.onCompleteItem = (item:any, response:any, status:any, headers:any) => {
        const loading = this.loadingCtrl.create({});
        loading.present();
        var data = JSON.parse(response);
        this.contactserviceProvider.updateImage(localStorage.getItem('userinfo'), data.data.file_name).subscribe((all_files)=>{
          let toast = this.toastCtrl.create({
            message: 'Profile Picture has been updated successfully.',
            duration: 3000,
            position:'top',
            cssClass: 'success'
          });
          toast.present(); 
          loading.dismissAll();
          this.navCtrl.push('ProfilePage', item.file.name);
        },
        err => {
            loading.dismissAll();
            this.showTechnicalError('1');
        });
      };

      this.uploader.onCompleteAll = () => {
        console.log('complete');
      };
  }

  closeErrorS(){
    this.filesize_error = '0';
  }

  ionViewDidLoad() {
    this.isBrowser = localStorage.getItem('isBrowser');
    this.data = this.navParams.data;
    if(this.navParams.get('email') == undefined)
    {
      this.navCtrl.push('ProfilePage');
    }
  };

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

  updateGernalInfo (data){ 
    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    if(data.name == undefined || data.name == ''){
      let toast = this.toastCtrl.create({
        message: 'Please enter your name.',
        duration: 3000,
        position:'top',
        cssClass: 'danger'
      });
      toast.present();
    }else if(data.email == undefined || data.email == ''){
      let toast = this.toastCtrl.create({
        message: 'Please enter your email address.',
        duration: 3000,
        position:'top',
        cssClass: 'danger'
      });
      toast.present();
    }else if(reg.test(data.email) == false){
      let toast = this.toastCtrl.create({
        message: 'Please enter valid email address.',
        duration: 3000,
        position:'top',
        cssClass: 'danger'
      });
      toast.present();
    }else{
      const loading = this.loadingCtrl.create({});
      loading.present();
      let body = this.data;
      return this.contactserviceProvider.updateUserData(body).subscribe(data => {
        //this.data = data;
        loading.dismissAll();
        if(data.status == '1')
        {
          let profiledata = data;
          let toast = this.toastCtrl.create({
            message: 'General information has been updated successfully.',
            duration: 3000,
            position:'top',
            cssClass: 'success'
          });
          toast.present(); 
          this.navCtrl.push('ProfilePage',profiledata);
        }
        else if(data.status == '2')
        {
          let toast = this.toastCtrl.create({
            message: 'Email already exist.',
            duration: 3000,
            position:'top',
            cssClass: 'danger'
          });
          toast.present(); 
        }
        else
        {
          let toast = this.toastCtrl.create({
            message: 'Error, please try later.',
            duration: 3000,
            position:'top',
            cssClass: 'danger'
          });
          toast.present(); 
        }
        
      },
      err => {
          loading.dismissAll();
          this.showTechnicalError('1');
      });
    }
    
  };



  updateUserSocialLink (){
    // if(this.data.linkdin){
    //   if(this.data.linkdin.indexOf('http') == -1 && (this.data.linkdin != '' || this.data.linkdin != undefined)){
    //     this.data.linkdin = 'http://' + this.data.linkdin;
    //   }else if(this.data.gplus.indexOf('http') == -1 && (this.data.gplus != '' || this.data.gplus != undefined)){
    //     this.data.gplus = 'http://' + this.data.gplus;
    //   }else if(this.data.facebook.indexOf('http') == -1 && (this.data.facebook != '' || this.data.facebook != undefined)){
    //     this.data.facebook = 'http://' + this.data.facebook;
    //   }else if(this.data.twitter.indexOf('http') == -1 && (this.data.twitter != '' || this.data.twitter != undefined)){
    //     this.data.twitter = 'http://' + this.data.twitter;
    //   }
    // }
    const loading = this.loadingCtrl.create({});
    loading.present();
    let body = this.data;
      return this.contactserviceProvider.updateSocialLink(body)
        .subscribe(data => {
          this.data = data;
          loading.dismissAll();
            if(data.status == '1')
            {
              let socialdata = data;
              let toast = this.toastCtrl.create({
                message: 'Social Links has been updated successfully.',
                duration: 3000,
                position:'top',
                cssClass: 'success'
              });
              toast.present(); 
              this.navCtrl.push('ProfilePage',socialdata);
            }
            else
            {
              let toast = this.toastCtrl.create({
                message: 'Error, please try later.',
                duration: 3000,
                position:'top',
                cssClass: 'danger'
              });
              toast.present(); 
            }
      },
      err => {
          loading.dismissAll();
          this.showTechnicalError('1');
      });
  };


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
    // File for Upload
    var targetPath = this.pathForImage(this.lastImage);
    // File name only
    var filename = this.lastImage;
    const loading = this.loadingCtrl.create({});
    loading.present();

    this.imagedate = {
      userId : localStorage.getItem('userinfo')
    }
    let body = JSON.stringify(this.imagedate);
    var options = {
      fileKey: "file",
      fileName: filename,
      chunkedMode: false,
      mimeType: "multipart/form-data",
      params : {'fileName': filename , 'fields' : body}
    };

    const fileTransfer: TransferObject = this.transfer.create();

    fileTransfer.upload(targetPath, this.updateImageURL, options).then(data => {
      loading.dismissAll()
      let imageData = data;
        let toast = this.toastCtrl.create({
            message: 'Profile has been updated successfully.',
            duration: 3000,
            position: 'top',
            cssClass: 'success'
          });
        toast.present(); 
        this.navCtrl.push('ProfilePage',imageData);
    });
  };

  profile(){
    this.navCtrl.setRoot('ProfilePage');
  };

  root(){
    this.navCtrl.setRoot('DashboardPage');
  }

  readUrl(event:any) {
  if (event.target.files && event.target.files[0]) {
    var reader = new FileReader();

    reader.onload = (event:any) => {
      $('.preview_image').attr('src', event.target.result);
    }

    reader.readAsDataURL(event.target.files[0]);
  }
}

  uploadImg(){ 
    if(this.uploader.queue.length > 0){
      this.uploader.queue[0].upload();
    }
  }

  closeError(){
    this.filetype_error = '0';
  }
}