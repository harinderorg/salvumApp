import {Component} from '@angular/core';
import {IonicPage, ModalController, ViewController, NavParams, NavController,    ActionSheetController, Platform, LoadingController, ToastController} from 'ionic-angular';
import {Http, Headers, RequestOptions} from '@angular/http';
import { File} from '@ionic-native/file';
import { Transfer, TransferObject} from '@ionic-native/transfer';
import { FilePath} from '@ionic-native/file-path';
import { Camera} from '@ionic-native/camera';
import { FileUploader } from 'ng2-file-upload';
import * as CryptoJS from 'crypto-js';
declare var cordova: any;

@IonicPage()
@Component({
    selector: 'page-addpassword',
    templateUrl: 'addpassword.html',
})

export class AddpasswordPage {
    name: string;
    username: string;
    filetype_error: any = '0';
    filesize_error: any = '0';
    password: string;
    passwordlevel: string;
    data: Object = {};
    lastImage: string;
    extnal: {}
    passwordURL = localStorage.getItem('APIURL') + '/wallPassword';
    isBrowser:any = '';
    APIURL:any = localStorage.getItem('APIURL');
    uploadedImage:String = '';
    uploader:any;
    loading:any;
    userId:any;
    all_levels:any = [];
    allowed_levels:any = [];
    iswebfileUploader:boolean = false;
    constructor(public modalCtrl: ModalController, public viewCtrl: ViewController, public navParams: NavParams, public http: Http, public toastCtrl: ToastController, public navCtrl: NavController, private camera: Camera, private transfer: Transfer, private file: File, private filePath: FilePath, public actionSheetCtrl: ActionSheetController, public platform: Platform, public loadingCtrl: LoadingController) {
      this.http = http;
      this.unlock();
      this.uploader  = new FileUploader({url: this.passwordURL, itemAlias: 'file', 
        allowedMimeType: ['image/png', 'image/jpg', 'image/jpeg', 'image/gif'],
        additionalParameter: {
          folder_path: 'images',
          'fields' : JSON.stringify(this.data)
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
        this.iswebfileUploader = false;
      };

      this.uploader.onCompleteAll = () => {
        this.loading.dismissAll();
        this.viewCtrl.dismiss();
      };
    }

    closeError(){
      this.filetype_error = '0'; 
    }

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

    unlock(){
      this.userId =  localStorage.getItem('userinfo');
      this.all_levels = JSON.parse(localStorage.getItem('alllevel'));

      if(this.all_levels && this.all_levels.length > 0){
        this.all_levels.forEach((value) => {

          this.allowed_levels = [];
          var decrypted = CryptoJS.AES.decrypt(value, this.userId);
          var i;

          if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level1'){
            this.allowed_levels = [];
            for(i = 1; i <= 1; i++){
              this.allowed_levels.push(i);
            }   
          }else if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level2'){
            this.allowed_levels = [];
            for(i = 1; i <= 2; i++){
              this.allowed_levels.push(i);
            }
          }else if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level3'){
            this.allowed_levels = [];
            for(i = 1; i <= 3; i++){
              this.allowed_levels.push(i);
            }
          }else if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level4'){
            this.allowed_levels = [];
            for(i = 1; i <= 4; i++){
              this.allowed_levels.push(i);
            }
          }else if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level0'){
            this.allowed_levels = [];
          }
        });
      }
    };

    ionViewDidLoad() {
      this.isBrowser = localStorage.getItem('isBrowser');
    };

    presentModal2(myEvent1) {
      let modal = this.modalCtrl.create(AddpasswordPage);
      modal.present({
          ev: myEvent1
      });
    };

    dismiss() {
      this.viewCtrl.dismiss('empty');
    };



    addPasword() {
      let body = JSON.stringify(this.data);
      let headers = new Headers({
          'Content-Type': 'application/json'
      });
      let options = new RequestOptions({
          headers: headers
      });
      this.loading = this.loadingCtrl.create({});
      this.loading.present();
      return this.http.post(this.passwordURL, body, options).map(res => res.json()).subscribe(data => {
        let passadddata = data;

        let toast = this.toastCtrl.create({
            message: 'Password has been added successfully.',
            duration: 3000,
            position : 'top',
            cssClass: 'success'
        });
        toast.present();
        this.navCtrl.push('PasswordsPage', passadddata);
      },
      err => {
          this.loading.dismissAll();
          this.showTechnicalError('1');
      });
    };



    public presentActionSheet() {
      let actionSheet = this.actionSheetCtrl.create({
          title: 'Select Image Source',
          buttons: [{
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
            this.filePath.resolveNativePath(imagePath)
                .then(filePath => {
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

        if (this.name == undefined || this.name == '') {
            let toast = this.toastCtrl.create({
                message: 'please enter name',
                duration: 3000,
                position : 'top',
                cssClass: 'danger'
            });
            toast.present();
        } else if (this.username == undefined || this.username == '') {
            let toast = this.toastCtrl.create({
                message: 'please enter username',
                duration: 3000,
                position : 'top',
                cssClass: 'danger'
            });
            toast.present();

        } else if (this.password == undefined || this.password == '') {
            let toast = this.toastCtrl.create({
                message: 'please enter password',
                duration: 3000,
                position : 'top',
                cssClass: 'danger'
            });
            toast.present();

        } else if (this.passwordlevel == undefined || this.passwordlevel == '') {
            let toast = this.toastCtrl.create({
                message: 'please select level',
                duration: 3000,
                position : 'top',
                cssClass: 'danger'
            });
            toast.present();

        } else {

          if(this.isBrowser == 'true'){
            this.data = {
              name: this.name,
              username: this.username,
              password: this.password,
              passwordlevel: this.passwordlevel,
            };

            if(this.uploader.queue.length == 0){
              let toast = this.toastCtrl.create({
                message: 'Please select logo.',
                duration: 3000,
                position : 'top',
                cssClass: 'danger'
              });
              toast.present(); 
            }else{
              this.extnal = {
                'userId': localStorage.getItem('userinfo'),
                'passwordData': this.data
              };

              this.loading = this.loadingCtrl.create({});
              this.loading.present();
              // let body = JSON.stringify(this.extnal);
              this.data= this.extnal;
              console.log(JSON.stringify(this.data));
              this.uploader.queue[0].options.additionalParameter.fields = JSON.stringify(this.data);
              this.uploader.queue[0].upload();
            }
          }else{
            // File for Upload
            var targetPath = this.pathForImage(this.lastImage);
            console.log(targetPath);
            if (targetPath == "file:///data/user/0/io.ionic.starter/files/undefined") {
                let toast = this.toastCtrl.create({
                    message: 'please select image',
                    duration: 3000,
                    position : 'top',
                    cssClass: 'danger'
                });
                toast.present();
            } else {
                // File name only
                var filename = this.lastImage;

                this.data = {
                    name: this.name,
                    username: this.username,
                    password: this.password,
                    passwordlevel: this.passwordlevel,
                }
                const loading = this.loadingCtrl.create({});
                loading.present();

                this.extnal = {
                    'userId': localStorage.getItem('userinfo'),
                    'passwordData': this.data
                }
                let body = JSON.stringify(this.extnal);
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

                fileTransfer.upload(targetPath, this.passwordURL, options).then(data => {
                    console.log(data);
                    loading.dismissAll()
                    let passadddata = data;
                    let toast = this.toastCtrl.create({
                        message: 'Password has been added successfully.',
                        duration: 3000,
                        position : 'top',
                        cssClass: 'success'
                    });
                    toast.present();
                    this.navCtrl.push('PasswordsPage', passadddata);

                })

            }
          }
        };


    }
}