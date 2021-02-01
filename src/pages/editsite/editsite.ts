import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController, LoadingController, ActionSheetController, ToastController} from 'ionic-angular';
import { Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/Rx';
import { File} from '@ionic-native/file';
import { Transfer, TransferObject} from '@ionic-native/transfer';
import { FilePath} from '@ionic-native/file-path';
import { Camera} from '@ionic-native/camera';
import { FileUploader } from 'ng2-file-upload';

declare var cordova: any;
 
@IonicPage()
@Component({
    selector: 'page-editsite',
    templateUrl: 'editsite.html',
})
export class EditsitePage {
    addweb: Object = {};
    lastImage: string;
    imageData: string;
    isBrowser: any;
    uploader:any;
    loading:any;
    iswebfileUploader:Boolean = false;
    extnal:any;
    filetype_error: any = '0';
    filesize_error: any = '0';
    APIURL = localStorage.getItem('APIURL');
    API_ENDPOINT_URL : any = localStorage.getItem('API_ENDPOINT_URL');
    constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public toastCtrl: ToastController, public newCtrl: ViewController, public loadingCtrl: LoadingController, private camera: Camera, private transfer: Transfer, private file: File, private filePath: FilePath, public actionSheetCtrl: ActionSheetController) {
      this.http = http;
      this.isBrowser = localStorage.getItem('isBrowser');
      this.uploader  = new FileUploader({
        url: this.APIURL + '/updatewebsitedata',
        allowedMimeType: ['image/png', 'image/jpg', 'image/jpeg', 'image/gif'], 
        itemAlias: 'file', 
        additionalParameter: {
          folder_path: 'images',
          'fields' : JSON.stringify(this.addweb)
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
        console.log('complete');
        this.loading.dismissAll();
        let toast = this.toastCtrl.create({
            message: 'Site has been updated successfully.',
            duration: 3000,
            cssClass: 'success',
            position: 'top'
        });
        toast.present();
        this.navCtrl.setRoot('SitesPage');
      };
    };

    closeErrorS(){
      this.filesize_error = '0';
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

    ionViewDidLoad() {
      if (this.navParams.data._id) {
        localStorage.setItem('siteDetail', JSON.stringify(this.navParams.data));
      }
      this.addweb =  JSON.parse(localStorage.getItem('siteDetail'));
    };

    dismiss() {
      this.newCtrl.dismiss();
    };


    updateWebsite(addweb) {
      if(addweb.selectCategory == undefined || addweb.selectCategory == ''){
       let toast = this.toastCtrl.create({
          message: 'Select site category.',
          duration: 3000,
          cssClass: 'danger',
          position: 'top'
         });
         toast.present();
      }else if(addweb.weblink == undefined || addweb.weblink == ''){
       let toast = this.toastCtrl.create({
                message: 'Please add link of the website.',
                duration: 3000,
                cssClass: 'danger',
                position: 'top'
               });
               toast.present();
      }else if(addweb.username == undefined || addweb.username == ''){
       let toast = this.toastCtrl.create({
                message: 'Please enter your username/email.',
                duration: 3000,
                cssClass: 'danger',
                position: 'top'
               });
               toast.present();
      }else if(addweb.password == undefined || addweb.password == ''){
       let toast = this.toastCtrl.create({
                message: 'Please enter your password.',
                duration: 3000,
                cssClass: 'danger',
                position: 'top'
               });
               toast.present();
      }else if(addweb.weblevel == undefined || addweb.weblevel == ''){
       let toast = this.toastCtrl.create({
                message: 'Please select level.',
                duration: 3000,
                cssClass: 'danger',
                position: 'top'
               });
               toast.present();
      }else{
        this.addweb = {
          selectCategory: addweb.selectCategory,
          weblink : addweb.weblink,
          username: addweb.username,
          password : addweb.password,
          weblevel : addweb.weblevel,
          _id: addweb._id
        };
        if(this.isBrowser == 'true'){
          
          if(this.uploader.queue.length == 0){
            this.updateSiteData(); 
          }else{
        
            this.loading = this.loadingCtrl.create({});
            this.loading.present();
           // let body = JSON.stringify(this.extnal);
            //this.addweb = this.extnal;
             console.log(JSON.stringify(this.addweb));
             this.uploader.queue[0].options.additionalParameter.fields = JSON.stringify(this.addweb);
            this.uploader.queue[0].upload();
          }
        }else{
          // File for Upload
          var targetPath = this.pathForImage(this.lastImage);
          if(targetPath == "file:///data/user/0/io.ionic.starter/files/undefined"){
            // Destination URL
            const loading = this.loadingCtrl.create({});
            loading.present();

            // File name only
            var filename = this.lastImage;
            let body = JSON.stringify(this.addweb);
            var options = {
                fileKey: "file",
                fileName: filename,
                chunkedMode: false,
                mimeType: "multipart/form-data",
                params: {
                    'fileName': filename,
                    'fields': body
                }
            };
            console.log(options);
            const fileTransfer: TransferObject = this.transfer.create();

            fileTransfer.upload(targetPath, this.APIURL + '/updatewebsitedata', options).then(data => {
                console.log(data);
                loading.dismissAll()
                let toast = this.toastCtrl.create({
                    message: 'Site updated successfully.',
                    duration: 3000,
                    cssClass: 'success',
                    position: 'top'
                });
                toast.present();
                this.navCtrl.push('SitesPage');

            })
          }else{
            this.updateSiteData();
          }
        }
      }
    };


    updateSiteData(){
      let body = this.addweb;
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });
      return this.http.post(this.APIURL + '/updatewebsite', body, options).map(res => res.json()).subscribe(data => {
        console.log(data);
        let toast = this.toastCtrl.create({
            message: 'Site updated successfully.',
            duration: 3000,
            cssClass: 'success',
            position: 'top'
        });
        toast.present();
        this.navCtrl.push('SitesPage');
      },
      err => {
          this.showTechnicalError('1');
      });
    };

    public presentActionSheet() {
      let actionSheet = this.actionSheetCtrl.create({
            title: 'Select Image Source',
            buttons: [{
              text: 'Choose Image',
              handler: () => {
                if(this.isBrowser == true){
                  this.iswebfileUploader = true;
                }else{
                  this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY); 
                }
              }
            },
            {
              text: 'Cancel',
              role: 'cancel'
            }
          ]
        });
          actionSheet.present();
    };


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
            this.filePath.resolveNativePath(imagePath).then(filePath => {
              let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
              let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));


                    this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
                });
        }, (err) => {

        });
    }

    // Create a new name for the image
    private createFileName() {
        var d = new Date(),
            n = d.getTime(),
            newFileName = n + ".jpg";
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
            position: 'top'
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
        // Destination URL
        const loading = this.loadingCtrl.create({});
        loading.present();

        // File for Upload
        var targetPath = this.pathForImage(this.lastImage);

        // File name only
        var filename = this.lastImage;
        let body = JSON.stringify(this.addweb);
        var options = {
            fileKey: "file",
            fileName: filename,
            chunkedMode: false,
            mimeType: "multipart/form-data",
            params: {
                'fileName': filename,
                'fields': body
            }
        };
        console.log(options);
        const fileTransfer: TransferObject = this.transfer.create();

        fileTransfer.upload(targetPath, this.APIURL + 'updatewebsite', options).then(data => {
            console.log(data);
            loading.dismissAll()
            let site = data;
            let toast = this.toastCtrl.create({
                message: 'Site updated successfully.',
                duration: 3000,
                cssClass: 'success',
                position: 'top'
            });
            toast.present();
            this.navCtrl.push('SitesPage', site);

        })
    };

  wallet(){
    this.navCtrl.setRoot('WalletsPage');
  };

  root(){
    this.navCtrl.setRoot('DashboardPage');
  }

  site(){
    this.navCtrl.setRoot('SitesPage');
  }

  closeError(){
    this.filetype_error = '0';
  }
}