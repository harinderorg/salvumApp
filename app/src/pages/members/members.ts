import { Component } from '@angular/core';
import { IonicPage, ToastController, NavController, NavParams, LoadingController } from 'ionic-angular';
import {Http} from '@angular/http';
import 'rxjs/Rx';
import { MemberserviceProvider } from '../../providers/memberservice/memberservice';
import { Socket } from 'ng-socket-io';
@IonicPage()
@Component({
  selector: 'page-members',
  templateUrl: 'members.html',
  providers: [MemberserviceProvider]
})
export class MembersPage {
  items: any;
  level: any;
  sendData = {};
  filterValue = '';
  resend = {}
  userId : string;
  isBrowser:any;
  baseUrl:String = localStorage.getItem('baseUrl');
  APIURL:String = localStorage.getItem('APIURL');
  allMembers:any = [];
  constructor(public navCtrl: NavController, public navParams: NavParams,public http:Http,public toastCtrl: ToastController,public loadingCtrl: LoadingController,public MemberserviceProvider: MemberserviceProvider,private socket: Socket) { 
   this.http = http;
  };

  ionViewDidLoad() {
    this.isBrowser = localStorage.getItem('isBrowser');
    this.level = '1';
    const loading = this.loadingCtrl.create({});
    loading.present();
    this.userId = localStorage.getItem('userinfo');
    this.MemberserviceProvider.membersList(this.userId).subscribe((data)=>{
      //console.log(data);
      loading.dismissAll()
      //console.log(data);
      this.items = data;
      this.allMembers = data;
    },
    err => {
        loading.dismissAll();
        this.showTechnicalError();
    });
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

  chanegLevel(selectedValue: any){
    this.level = selectedValue
  };    

  sendInvitation (items, index){
     this.sendData = {
       level : this.level,
       mails : items,
       senderId : localStorage.getItem('userinfo'),
       senderName : localStorage.getItem('userName'),
       senderSetLevel: this.level,
       status : '1',
       info:'0',
       send:'0',
       index:'0',
       share:'0',
       member_id: items.member_id
     }
      this.MemberserviceProvider.sendInvitation(this.sendData).subscribe((data)=>{
        this.socket.emit('new_notification', data.notify);
        let toast = this.toastCtrl.create({
            message: 'Invitation mail has been sent.',
            duration: 3000,
            position: 'top',
            cssClass: 'success'
          });
        this.items[index].memberstatus = 1;
        this.items[index].senderId = this.userId;
          toast.present();
          this.userId = localStorage.getItem('userinfo');
          this.MemberserviceProvider.membersList(this.userId).subscribe((data)=>{
            this.allMembers = data;
            if (this.filterValue && this.filterValue != '') {
              this.items = this.allMembers.filter((item) => {
                //console.log(item.name);
                return (item.email.toLowerCase().indexOf(this.filterValue.toLowerCase()) > -1);
              })
            }else{
              this.items = this.allMembers;
            }
          },
          err => {
              this.showTechnicalError();
          });
        },
        err => {
            this.showTechnicalError('1');
        });
  };

  resendInvitation(items){
    this.resend = {
      level : this.level,
      mails : items,
      senderName : localStorage.getItem('userName')
    };
    this.MemberserviceProvider.resendInvitation(this.resend).subscribe((data)=>{
      //console.log(data);
      this.socket.emit('new_notification', data.notify);
      let toast = this.toastCtrl.create({
          message: 'Invitation Mail Send.',
          duration: 3000,
          position: 'top',
          cssClass: 'success'
        });
      toast.present(); 
      const loading = this.loadingCtrl.create({});
      loading.present();
      this.userId = localStorage.getItem('userinfo');
      this.MemberserviceProvider.membersList(this.userId).subscribe((data)=>{
        //console.log(data);
        loading.dismissAll();
        //console.log(data);
        this.allMembers = data;
        if (this.filterValue && this.filterValue != '') {
          this.items = this.allMembers.filter((item) => {
            //console.log(item.name);
            return (item.email.toLowerCase().indexOf(this.filterValue.toLowerCase()) > -1);
          })
        }else{
          this.items = this.allMembers;
        }
      },
      err => {
          loading.dismissAll();
          this.showTechnicalError();
      });
    },
    err => {
        this.showTechnicalError();
    });
  };

  setFilteredItems(ev) {
    let val = ev;
    this.filterValue = val;
    // if the value is an empty string don't filter the items
    if (val && val != '') {
      this.items = this.allMembers.filter((item) => {
        //console.log(item.name);
        return (item.email.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }else{
      this.items = this.allMembers;
    }
  };

  acceptContact(contact){
    var data = {
      memberId : contact.memberId,
      memberstatus : '2',
    };

    const loading = this.loadingCtrl.create({});
    loading.present();
    return this.MemberserviceProvider.acceptInvitation(data).subscribe(data => {
      let toast = this.toastCtrl.create({
          message: 'Invitation has been accpted.',
          duration: 3000,
          position: 'top',
          cssClass: 'success'
       });
      toast.present();
      this.userId = localStorage.getItem('userinfo');
      this.MemberserviceProvider.membersList(this.userId).subscribe((data)=>{
        //console.log(data);
        loading.dismissAll();
        //console.log(data);
        this.allMembers = data;
        if (this.filterValue && this.filterValue != '') {
          this.items = this.allMembers.filter((item) => {
            //console.log(item.name);
            return (item.email.toLowerCase().indexOf(this.filterValue.toLowerCase()) > -1);
          })
        }else{
          this.items = this.allMembers;
        }
      });
    },
    err => {
        loading.dismissAll();
        this.showTechnicalError('1');
    });
  };

  rejectContact(contact){
    var data = {
      memberId : contact.memberId,
      memberstatus : 0,
      'action': 'reject'
    };

    const loading = this.loadingCtrl.create({});
    loading.present();
    return this.MemberserviceProvider.acceptInvitation(data).subscribe(data => {
      // var newdata = data;
      this.userId = localStorage.getItem('userinfo');
      this.MemberserviceProvider.membersList(this.userId).subscribe((data)=>{
        //console.log(data);
        loading.dismissAll();
        //console.log(data);
        this.allMembers = data;
        if (this.filterValue && this.filterValue != '') {
          this.items = this.allMembers.filter((item) => {
            //console.log(item.name);
            return (item.email.toLowerCase().indexOf(this.filterValue.toLowerCase()) > -1);
          })
        }else{
          this.items = this.allMembers;
        }
      },
      err => {
          loading.dismissAll();
          this.showTechnicalError();
      });
      let toast = this.toastCtrl.create({
          message: 'Invitation has been declined.',
          duration: 3000,
          position: 'top',
          cssClass: 'success'
       });
      toast.present();
    },
    err => {
        loading.dismissAll();
        this.showTechnicalError('1');
    });
  };

  root(){
    this.navCtrl.setRoot('DashboardPage');
  };
}