import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, ModalController, AlertController, Events} from 'ionic-angular';
import {Http} from '@angular/http';
import 'rxjs/Rx';
import { AlllicenseserviceProvider } from '../../providers/alllicenseservice/alllicenseservice';
import { CompanyProvider } from '../../providers/company/company';
import * as copy from 'copy-to-clipboard';

@IonicPage()
@Component({
  selector: 'page-license',
  templateUrl: 'license.html',
  providers: [AlllicenseserviceProvider, CompanyProvider]
})
export class LicensePage {
  licenses: Array<{}>;
  shared_licenses: any;
  subscription_amount:any;
  currentDate:any;
  showAssigned:any = '0';
  showAssigned_shared:any = '0';
  autoFilled:any;
  loginId:any = localStorage.getItem('userinfo');
  isBrowser = localStorage.getItem('isBrowser');
  assignLicense = [];
  assignLicense1 = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, public http:Http, public loadingCtrl: LoadingController, public AlllicenseserviceProvider: AlllicenseserviceProvider, public toastCtrl: ToastController, public modalCtrl:ModalController, public alertCtrl:AlertController, public companyProvider:CompanyProvider, public events: Events) {
    this.http = http;
    var date = new Date().toISOString();;
    this.currentDate = Date.parse(date);
  }

  ionViewDidLoad() {
    this.getAllLicenses();
    this.getUsersubscriptions();
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

  getAllLicenses(){
    const loading = this.loadingCtrl.create({});
    loading.present();
    var userId = localStorage.getItem('userinfo');
    var companyId = localStorage.getItem('switched_comp');
    this.AlllicenseserviceProvider.getLicenseList(userId,companyId,'0').subscribe((data)=>{
        this.licenses = data;
        this.AlllicenseserviceProvider.getLicenseList(userId,companyId,'1').subscribe((shared_data)=>{
            loading.dismissAll()
            this.shared_licenses = shared_data;
            console.log(shared_data)
            var autoFilled = ''; 
            var showAssigned = '0';
            var showAssigned_shared = '0';
            var currentDate = this.currentDate;
            if(this.licenses.length > 0)
            {
              data.forEach(function(myLicenses){
                if(currentDate < myLicenses.status && showAssigned == '0')
                {
                  showAssigned = '1';
                }
                if(myLicenses.user_name !== null)
                {
                  if(myLicenses.usedBy == userId)
                  {
                     autoFilled = myLicenses.license_number;
                  }
                }
              });
              this.autoFilled = autoFilled;
              this.showAssigned = showAssigned;
            }

            if(this.shared_licenses.length > 0)
            {
              // console.log(this.shared_licenses)
              this.shared_licenses.forEach(function(myLicenses){
                if(myLicenses.privileges.indexOf(userId) >= 0 && showAssigned_shared == '0')
                {           
                  showAssigned_shared = '1';
                }
                if(myLicenses.user_name !== null)
                {
                  if(myLicenses.usedBy == userId)
                  {
                     autoFilled = myLicenses.license_number;
                  }
                }
              });
              this.autoFilled = autoFilled;
              this.showAssigned_shared = showAssigned_shared;
            }
            
        },
        err => {
            loading.dismissAll();
            this.showTechnicalError();
        });
    },
    err => {
        loading.dismissAll();
        this.showTechnicalError();
    });
  }

  deActivateLicense(licenseId){
    let confirm = this.alertCtrl.create({
      title: 'Are you sure you want to unassign this license?',
      message: '',
      buttons: [
        {
          text: 'No',
          handler: () => {
            //console.log('Disagree clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            const loading = this.loadingCtrl.create({});
            loading.present();
            this.AlllicenseserviceProvider.deActivateLicense(licenseId,this.loginId).subscribe((result)=>{
              if(result.status == 1){
                loading.dismissAll();
                let toast = this.toastCtrl.create({
                    message: 'License unassigned successfully.',
                    duration: 3000,
                    position: 'top',
                    cssClass: 'success'
                   });
                   toast.present(); 
                   this.getAllLicenses();
              }
              else{
                  loading.dismissAll()
                    let toast = this.toastCtrl.create({
                      message: 'Error, plz try later.',
                      duration: 3000,
                      position: 'top',
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
        }
      ]
    });
    confirm.present();
  }

  getUsersubscriptions(){
    var userId = localStorage.getItem('userinfo');
    this.companyProvider.getUserCurrentSubscription(userId).subscribe((subscription)=>{  
      this.subscription_amount = subscription.amount;
    },
    err => {
        this.showTechnicalError();
    });
  }

  openAddmorelicensePage(){
    if(this.subscription_amount > '0')
    {
      this.navCtrl.push('AddmorelicensePage');
    }
    else
    {
      let toast = this.toastCtrl.create({
        message: 'Access Denied,Please upgrade your package first.',
        duration: 3000,
        position : 'top',
        cssClass: 'info'
       });
       toast.present();
    }
  };
  
  root(){
    this.navCtrl.setRoot('DashboardPage');
  };

  parseDate(license, date){
    license.status = Date.parse(date);
    //console.log(license);
    return;
  };

  updateLicense(){
    let modal = this.modalCtrl.create('UpdateLicensePage',{
      autoFilled:this.autoFilled
    });
    modal.onDidDismiss(data => {
      if(data != null &&data != undefined)
      {
        if(data == '1')
        {
          this.getAllLicenses();
          this.events.publish('is_license_activated:changed', '');
          let toast = this.toastCtrl.create({
            message: 'License has been updated successfully.',
            duration: 3000,
            position : 'top',
            cssClass: 'success'
           });
           toast.present(); 
        }
      }
   });
    modal.present();
  }

  listCheckbox(isChecked, license){

    if (this.assignLicense.indexOf(license._id) == -1) {
      this.assignLicense.push(license._id);
    } else {
      for (var i = 0; i < this.assignLicense.length; i++) {
          if (this.assignLicense[i] == license._id) {
              this.assignLicense.splice(i, 1);
          }
      }
    }
  };

  listCheckbox1(isChecked, license){

    if (this.assignLicense1.indexOf(license._id) == -1) {
      this.assignLicense1.push(license._id);
    } else {
      for (var i = 0; i < this.assignLicense1.length; i++) {
          if (this.assignLicense1[i] == license._id) {
              this.assignLicense1.splice(i, 1);
          }
      }
    }
  };

  assignLicenseToUsers(type){
    if(type == '1')
    {
      if(this.assignLicense.length == 0){
        let toast = this.toastCtrl.create({
            message: 'Select atleast one record.',
            duration: 3000,
            position:'top',
            cssClass: 'info'
        });
        toast.present();
      }
      else
      {
        this.callAssignLicense(type);
      }
    }
    else if(type == '0')
    {
      if(this.assignLicense1.length == 0){
        let toast = this.toastCtrl.create({
            message: 'Select atleast one record.',
            duration: 3000,
            position:'top',
            cssClass: 'info'
        });
        toast.present();
      }
      else
      {
        this.callAssignLicense(type);
      }
    }
  }

  callAssignLicense(type)
  {
    var assignLicenses = [];
      if(type == '1')
      {
        assignLicenses = this.assignLicense;
      }
      else
      {
        assignLicenses = this.assignLicense1;
      }
      //var userId = localStorage.getItem('userinfo'); 
      let modal = this.modalCtrl.create('ContactslistPage',{
        license_page : '1',
        page_type : type
      });
      modal.onDidDismiss(data => {
        if(data != null && data != undefined)
        {
          if(data.length != undefined)
          {
            const loading = this.loadingCtrl.create({});
            loading.present();
            var contacts = [];
            var privileges = [];
            for(var i=0; i < data.length; i++){
              contacts.push(data[i].userId);
              if(data[i].privilege == '1')
              {
                privileges.push(data[i].userId);
              }
            }
            var userName = localStorage.getItem('userName');
            var loginid = localStorage.getItem('userinfo');
            // var companyId = localStorage.getItem('s_companyId');
            this.AlllicenseserviceProvider.assignLicenseToUsers(assignLicenses, contacts, userName, privileges, loginid).subscribe((data)=>{
              loading.dismissAll()
              if(data.n == '1')
              {
                this.getAllLicenses();
                this.assignLicense = [];
                this.assignLicense1 = [];
                let toast = this.toastCtrl.create({
                  message: 'Licenses has been assigned successfully.',
                  duration: 3000,
                  position : 'top',
                  cssClass: 'success'
                 });
                 toast.present(); 
              }
              else
              {
                let toast = this.toastCtrl.create({
                  message: 'Error, please try later.',
                  duration: 3000,
                  position : 'top',
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
        }
      });
      modal.present();
  }

  removeUser(licenseId,userId)
  { 
    let confirm = this.alertCtrl.create({
      title: 'Are you sure?',
      message: '',
      buttons: [
        {
          text: 'No',
          handler: () => {
            //console.log('Disagree clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            const loading = this.loadingCtrl.create({});
            loading.present();
            var loginId = localStorage.getItem('userinfo');
            this.AlllicenseserviceProvider.removeUserFromLicense(licenseId,userId,loginId).subscribe((deleted)=>{
              if(deleted.status == 1)
              {
                loading.dismissAll();
                let toast = this.toastCtrl.create({
                    message: 'User unassigned successfully.',
                    duration: 3000,
                    position: 'top',
                    cssClass: 'success'
                   });
                   toast.present(); 
                   this.getAllLicenses();
              }
              else
              {
                  loading.dismissAll()
                    let toast = this.toastCtrl.create({
                        message: 'Error, plz try later.',
                        duration: 3000,
                        position: 'top',
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
        }
      ]
    });
    confirm.present();
  }

  copyKey(licenseKey)
  {
    copy(licenseKey);
    copy(licenseKey);
    let toast = this.toastCtrl.create({
      message: 'Copy to clipboard.',
      duration: 3000,
      position: 'top',
      cssClass: 'success'
     });
     toast.present();
  }

  removeAssignedLicense(licenseId,userId)
  {
    let confirm = this.alertCtrl.create({
      title: 'Are you sure?',
      message: '',
      buttons: [
        {
          text: 'No',
          handler: () => {
            //console.log('Disagree clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            const loading = this.loadingCtrl.create({});
            loading.present();
            var loginId = localStorage.getItem('userinfo');
            this.AlllicenseserviceProvider.removeAssignedLicense(licenseId,userId,loginId).subscribe((deleted)=>{
              if(deleted.status == 1)
              {
                loading.dismissAll();
                let toast = this.toastCtrl.create({
                    message: 'License updated successfully.',
                    duration: 3000,
                    position: 'top',
                    cssClass: 'success'
                   });
                   toast.present(); 
                   this.getAllLicenses();
              }
              else
              {
                  loading.dismissAll()
                    let toast = this.toastCtrl.create({
                        message: 'Error, plz try later.',
                        duration: 3000,
                        position: 'top',
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
        }
      ]
    });
    confirm.present();
  }
}
