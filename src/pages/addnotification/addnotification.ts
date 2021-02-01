import { Component } from '@angular/core';
import { IonicPage, PopoverController, NavParams, NavController, ToastController } from 'ionic-angular';
import { ContactserviceProvider } from '../../providers/contactservice/contactservice';

@IonicPage()
@Component({
  selector: 'page-addnotification',
  templateUrl: 'addnotification.html',
  providers: [ContactserviceProvider]
})
export class AddnotificationPage {
  notification: any = '';
  constructor(public toastCtrl: ToastController, public popoverCtrl: PopoverController, public navParams: NavParams, public contactserviceProvider: ContactserviceProvider, public navCtrl: NavController) {
  }


  ionViewDidLoad() {
    this.contactserviceProvider.getAllNotification(localStorage.getItem('userinfo'), 1).subscribe((all_files)=>{
      this.notification = all_files.data;
    },
    err => {
        this.showTechnicalError();
    });
  };

  presentPopover1(myEvent1) {
    let popover = this.popoverCtrl.create(AddnotificationPage);
    popover.present({
      ev: myEvent1
    });
  };

  seeAllNotifications(){
    this.navCtrl.push('MessagePage');
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
}
