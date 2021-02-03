import { Component } from '@angular/core';
import {IonicPage, NavController, PopoverController, LoadingController, ModalController, Events, AlertController, ToastController} from 'ionic-angular';
import { ContactserviceProvider } from '../../providers/contactservice/contactservice';

@IonicPage()
@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html',
  providers:[ContactserviceProvider]
})
export class NotificationPage {
  notifications:any;
  isBrowser:any;
  API_ENDPOINT_URL : any = localStorage.getItem('API_ENDPOINT_URL');
  imageUrl :string;
 constructor(public navCtrl: NavController, public popoverCtrl: PopoverController, public modalCtrl: ModalController, public loadingCtrl: LoadingController, public contactserviceProvider: ContactserviceProvider, public events: Events, public alertCtrl : AlertController, public toastCtrl: ToastController) 
  {
    this.imageUrl = this.API_ENDPOINT_URL+'images/';
    this.isBrowser = localStorage.getItem('isBrowser');
  }

  ionViewDidLoad() {
    const loading = this.loadingCtrl.create({});
    loading.present();
    this.contactserviceProvider.getLevelNotifications(localStorage.getItem('userinfo'),localStorage.getItem('notifyLevel') ).subscribe((all_files)=>{
        loading.dismissAll();
        this.notifications = all_files.data;  
    },
    err => {
        loading.dismissAll();
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

  delete(nid,index){
    let alert = this.alertCtrl.create({
      title: 'Are you sure?',
      message: '',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            const loading = this.loadingCtrl.create({});
            loading.present();
            this.contactserviceProvider.deleteNotis(nid).subscribe((result)=>{
              loading.dismissAll();
              if(result.status == 1){
                this.notifications.splice(index,1);
                this.events.publish('big_bell_update:changed', '');
                let toast = this.toastCtrl.create({
                    message: 'Notification removed.',
                    duration: 3000,
                    position: 'top',
                    cssClass: 'success'
                });
                toast.present();
              }
              else{
                let toast = this.toastCtrl.create({
                    message: 'Error, please try later.',
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
            // deleteNotis
          }
        }
      ]
    });
    alert.present();
  }

  removeAll(){
    let alert = this.alertCtrl.create({
      title: 'Are you sure?',
      message: 'It will remove all notifications from all of the levels for you.',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            const loading = this.loadingCtrl.create({});
            loading.present();
            var userId = localStorage.getItem('userinfo');
            this.contactserviceProvider.removeAllNotis(userId).subscribe((result)=>{
              loading.dismissAll();
              if(result.status == 1){
                this.notifications = [];
                this.events.publish('big_bell_update:changed', '');
                let toast = this.toastCtrl.create({
                    message: 'All notifications removed.',
                    duration: 3000,
                    position: 'top',
                    cssClass: 'success'
                });
                toast.present();
              }
              else{
                let toast = this.toastCtrl.create({
                    message: 'Error, please try later.',
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
            // deleteNotis
          }
        }
      ]
    });
    alert.present();
  }

  readNotification(notification){
    this.contactserviceProvider.readNotifications(localStorage.getItem('userinfo'), notification._id).subscribe((all_files)=>{
      //this.events.publish('level:changed', all_files);
    },
    err => {
        this.showTechnicalError('1');
    });
  };

  presentPopover1(myEvent1) {
    let popover = this.popoverCtrl.create('AddnotificationPage');
    popover.present({
      ev: myEvent1
    });
  }

  presentModal(myEvent1) {
    let modal = this.modalCtrl.create('ModalsPage');
    modal.present({
      ev: myEvent1
    });
  };

  root(){
    this.navCtrl.setRoot('DashboardPage');
  }

  goToDash(nid){
    const loading = this.loadingCtrl.create({});
    loading.present();
    this.contactserviceProvider.readNotis(nid).subscribe((read_notis)=>{
      loading.dismissAll();
      this.navCtrl.push('DashboardPage');
    },
    err => {
        loading.dismissAll();
        this.showTechnicalError('1');
    });
  }

  openBidPage(type = '0'){
    this.navCtrl.push('bidjobs', {
      type: '0'
    });
  };

  openTransmittalPage(info){
    if(info.inviteId != undefined && info.inviteId != null && info.inviteId != ''){
        this.navCtrl.push('bidding-page', {
            bidJobId: info.inviteId,
            status: 5,
            go_transmittal: '1'
        });
    }
    else{
        this.openBidPage();
    }
  };

  openRfiPage(info){
    if(info.inviteId != undefined && info.inviteId != null && info.inviteId != ''){
        this.navCtrl.push('bidding-page', {
            bidJobId: info.inviteId,
            status: null,
            from_page: '1'
        });
    }
    else{
        this.openBidPage();
    }
  }

  openJobPage(){
    this.navCtrl.push('ManagejobPage',{
      is_direct : '0'
    });
  };

  openRFIPage(others,info){
    var switched_comp = localStorage.getItem('switched_comp');
    if(switched_comp == info.companyId){
      localStorage.setItem('active_job_breadcrumb',others);
      if(info.jobId != localStorage.getItem('currentJobId')){
        localStorage.removeItem('saved_filter_list');
        localStorage.removeItem('saved_filter_trades');
        localStorage.removeItem('saved_filter_trade_names');
      }
      localStorage.setItem('currentJobId',info.jobId); 
      this.navCtrl.push('RfisPage', {jobId : info.jobId});
    }
    else{
      let toast = this.toastCtrl.create({
        message: 'Please switch to company '+info.companyName+' to access the RFI page.',
        duration: 3000,
        position: 'top',
        cssClass: 'danger'
      });
      toast.present();
    }
  }

  openLicensePage(nid){
    const loading = this.loadingCtrl.create({});
    loading.present();
    this.contactserviceProvider.readNotis(nid).subscribe((read_notis)=>{
      loading.dismissAll();
      this.navCtrl.push('LicensePage');
    },
    err => {
        loading.dismissAll();
        this.showTechnicalError('1');
    });
    
  };

  openFilesPage(){
    this.navCtrl.push('FilemanagerPage',{
      notis_redirect : '1'
    });
  };

  goToContacts(){
    this.navCtrl.push('ContactsPage');
  };

  goToSmail(nid,others){
    const loading = this.loadingCtrl.create({});
    loading.present();
    this.contactserviceProvider.readNotis(nid).subscribe((read_notis)=>{
      loading.dismissAll();
      this.navCtrl.push('SmailInboxPage',{
          'notis' : '32',
          '_id' : others
      });
    },
    err => {
        loading.dismissAll();
        this.showTechnicalError('1');
    });
  }

  openSmail(nid){
    const loading = this.loadingCtrl.create({});
    loading.present();
    this.contactserviceProvider.readNotis(nid).subscribe((read_notis)=>{
      loading.dismissAll();
      this.navCtrl.push('SmailInboxPage');
    },
    err => {
        loading.dismissAll();
        this.showTechnicalError('1');
    });
  }
}
