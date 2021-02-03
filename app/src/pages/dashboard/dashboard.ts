import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, PopoverController, Events, ModalController,AlertController,ToastController, NavParams, LoadingController } from 'ionic-angular';
import { CompanyProvider } from '../../providers/company/company';
import { Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/Rx';
import { MemberserviceProvider } from '../../providers/memberservice/memberservice';
import * as CryptoJS from 'crypto-js';
import * as filesize from 'filesize';
import { Socket } from 'ng-socket-io';
import { Observable } from 'rxjs/Observable';
// import { GanttEditorComponent, GanttEditorOptions } from 'ng-gantt';
@IonicPage({
    segment: 'dashboard/:id' 
}) 
@Component({
  selector: 'page-dashboard',
  styles: [`
    .split-pane-side {
      display: none !important;
    }
  `] ,
  templateUrl: 'dashboard.html',
  providers: [CompanyProvider, MemberserviceProvider] 
})

export class DashboardPage {
 countChanged:any;
  level0:string;
  level1:string;
  level2:string;
  level3:string;
  isBrowser:any;
  count :any;
  userId :any;
  dashboard_data :any;
  subscription :any;
  subscription_amount :any = '0';
  subscription_expiry :any;
  license_expiry :any;
  total_contacts :string = '0';
  total_jobs_posted :string = '0';
  total_jobs_invitation :string = '0';
  total_applied_jobs :string = '0';
  subscription_title :string = '';
  consumed_percent :any = '0';
  is_license_activated :any;
  space_type :any;
  is_recurring_billing : any;
  subscriptionId : any;
  stats :any ;
  companies :any ;
  current_companyId :any ;
  companyId :any ;
  data: Object = {};
  email: Object = {};
  sms: Object = {};
  checkDate : any;
  passinfo:any;
  sendData = {};
  items: Array<{}>;
  lenthlevel1 : number;
  lenthlevel2 : number;
  lenthlevel3 : number;
  lenthlevel4 : number;
  API_ENDPOINT_URL : any = localStorage.getItem('API_ENDPOINT_URL');
  accptInvitation = 'accptinvitation';
  notificationData = 'notification';
  alllevel:any;
  new_notis:any;
  members:any = [];
  APIURL:any = localStorage.getItem('APIURL');
  @ViewChild( 'content' ) content; 
  // public editorOptions: GanttEditorOptions;
  // public data2: any;
  // @ViewChild(GanttEditorComponent) editor: GanttEditorComponent;
  constructor(private navCtrl: NavController, public popoverCtrl: PopoverController, public modalCtrl: ModalController,public alertCtrl: AlertController,public http:Http,public toastCtrl: ToastController, public obj: NavParams, public loadingCtrl: LoadingController, public companyProvider: CompanyProvider, public memberServiceProvider: MemberserviceProvider,  public events: Events,private socket: Socket) {
    //  this.editorOptions = new GanttEditorOptions()
    //  this.data2 = [{
    //   'pID': 1,
    //   'pName': 'Define Chart API',
    //   'pStart': '',
    //   'pEnd': '',
    //   'pClass': 'ggroupblack',
    //   'pLink': '',
    //   'pMile': 0,
    //   'pRes': 'Brian',
    //   'pComp': 0,
    //   'pGroup': 1,
    //   'pParent': 0,
    //   'pOpen': 1,
    //   'pDepend': '',
    //   'pCaption': '',
    //   'pNotes': 'Some Notes text'
    // }];
    this.http = http;
    localStorage.setItem('openedLevel', null);
    this.events.publish('is_license_activated:changed', '');
    if(obj.data.userId != ':id' && obj.data.userId != '0' && obj.data.userId != ':userId' && obj.data.userId != undefined){
      localStorage.setItem('isUserId', 'true');
      localStorage.setItem('memberId', obj.data.userId);
      this.sendData = {
        memberId : obj.data.userId,
        memberstatus : '2'
      }
      localStorage.setItem('view', 'Inbox');
      this.memberServiceProvider.acceptInvitation(this.sendData).subscribe((dashboard_data)=>{
        if(dashboard_data.error){
            let toast = this.toastCtrl.create({
                message: dashboard_data.error,
                duration: 3000,
                position: 'top',
                cssClass: 'danger'
            });
            toast.present();
        }else{
            let toast = this.toastCtrl.create({
                message: 'Invitation has been accepted successfully.',
                duration: 3000,
                position: 'top',
                cssClass: 'success'
            });
            toast.present();
            this.events.publish('countChanged:changed', '');
            this.countChanged = '1';
        }
      },
      err => {
          this.showTechnicalError();
      });
    }
    this.userId = localStorage.getItem('userinfo');
    this.getUpdates().subscribe(new_notis => {
      this.new_notis = new_notis;
      if(this.new_notis.type == 1){
        this.friendRequests();
      }
    });

    if(localStorage.getItem('job_alert_popup') == '1'){
      let confirm = this.alertCtrl.create({
        title: '',
        message: 'Would you like to get job alerts on another secondary email?',
        buttons: [
          {
            text: 'No',
            handler: () => {
              localStorage.removeItem('job_alert_popup');
            }
          },
          {
            text: 'Yes',
            handler: () => {
              this.navCtrl.push('ProfilePage');
            }
          }
        ]
      });
      confirm.present();
    }
  };

  getUpdates() {
    var self = this;
    let observable = new Observable(observer => {
      self.socket.on(self.userId, (data) => {
        observer.next(data);
      });
    })
    return observable;
  }

  ionViewDidLoad() { 
    this.isBrowser = localStorage.getItem('isBrowser');
    // get dashboard data
      const loading = this.loadingCtrl.create({});
      loading.present();
      var created_date = new Date();
      var expiry_date, timeDiff;
      this.companyProvider.getUserDashboardData(this.userId).subscribe((dashboard_data)=>{  
        this.dashboard_data = dashboard_data[0];
        this.subscription = this.dashboard_data['subscription'];
        this.stats = this.dashboard_data['stats'];
        this.space_type = this.stats.space_type;
        this.companyId = this.stats.companyId;
        this.current_companyId = this.stats.companyId;
        localStorage.setItem('switched_comp',this.companyId);
        this.is_recurring_billing = this.stats.is_recurring_billing;
        this.subscriptionId = this.stats.subscriptionId;
        var space_type = this.space_type;
        var gbs = filesize(this.stats.actual_consumed_space, {exponent: (space_type == 'bytes' ? 0 : (space_type == 'KB' ? 1 : (space_type == 'MB' ? 2 : (space_type == 'GB' ? 3 : (space_type == 'TB' ? 4 : 5)))))}).split(' ')[0];
        this.consumed_percent = Math.round((gbs/this.stats.actual_consumed_space)*100);
        if(this.subscription != '')
        {
          this.subscription_title = this.subscription['title'];
          this.subscription_amount = this.subscription['amount'];
          expiry_date = new Date(this.subscription['expiry_date']);

          timeDiff = Math.abs(expiry_date.getTime() - created_date.getTime());
          this.subscription_expiry = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
        }
        else
        {
          this.subscription_amount = '0';
        }

        this.is_license_activated = this.dashboard_data['is_license_activated'];
        if(this.is_license_activated > 0){
          expiry_date = new Date(this.stats['license_end']);

          timeDiff = Math.abs(expiry_date.getTime() - created_date.getTime());
          this.license_expiry = Math.ceil(timeDiff / (1000 * 3600 * 24));
        }
        this.total_contacts = this.dashboard_data['total_contacts'];
        this.total_jobs_posted = this.dashboard_data['total_jobs_posted'];
        this.total_jobs_invitation = this.dashboard_data['total_jobs_invitation'].length;
        this.total_applied_jobs = this.dashboard_data['total_applied_jobs'];
          //get user companies
          this.companyProvider.userCompaniesList(this.userId).subscribe((companies)=>{
            this.companies=companies;
            if(companies != ''){
              var self = this;
              companies.forEach(function(company){
                if(company._id == self.companyId){
                  localStorage.setItem('curr_comp_name',company.company_name);
                }
              });
            }
          },
          err => {
              this.showTechnicalError();
          });
        loading.dismissAll();
      },
      err => {
          loading.dismissAll();
          this.showTechnicalError();
      });

      this.friendRequests();
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

  // printFn(){
  //   const printContent = document.getElementById("abcdef");
  //   const WindowPrt = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
  //   WindowPrt.document.write(printContent.innerHTML);
  //   WindowPrt.document.close();
  //   WindowPrt.focus();
  //   WindowPrt.print();
  //   WindowPrt.close();
  // }

  presentPopover1(myEvent1) {
    let popover = this.popoverCtrl.create('AddnotificationPage');
    popover.present({
      ev: myEvent1
    });
  };

  presentModal(myEvent1) {
    let modal = this.modalCtrl.create('ModalsPage');
    modal.present({
      ev: myEvent1
    });
  };

  showMessages(){
    this.navCtrl.push('MessagePage',this.items)
  };

  switchCompany(){
    if(this.companyId != '' && this.companyId != undefined && this.companyId != null){
      if(this.companyId == this.current_companyId){
        let toast = this.toastCtrl.create({
          message: 'Please change another company to switch.you are already under this company.',
          duration: 4000,
          position: 'top',
          cssClass: 'danger'
        });
        toast.present();
      }
      else{
        let confirm = this.alertCtrl.create({
        title: '',
        message: 'After switching the company, you will only see the selected company job and license system. Do you wish to continue?',
        buttons: [
          {
            text: 'No',
            handler: () => {
              this.companyId = this.current_companyId;
            }
          },
          {
            text: 'Yes',
            handler: () => {
              const loading = this.loadingCtrl.create({});
              loading.present();
              this.companyProvider.switchUserCompany({userId : this.userId, companyId : this.companyId}).subscribe((result)=>{
                if(result.status == 1)
                {
                  loading.dismissAll();
                  let toast = this.toastCtrl.create({
                      message: 'You are switched to selected company.',
                      duration: 3000,
                      position: 'top',
                      cssClass: 'success'
                     });
                     toast.present(); 
                     this.current_companyId = this.companyId;
                     localStorage.setItem('switched_comp',this.companyId);
                     this.events.publish('is_license_activated:changed', '');
                     this.is_license_activated = '0';
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
    else{
      let toast = this.toastCtrl.create({
        message: 'Please select company.',
        duration: 3000,
        position: 'top',
        cssClass: 'danger'
      });
      toast.present();
    }
  }

  openSmailPage(){
    localStorage.setItem('view', 'Inbox');
    this.alllevel = JSON.parse(localStorage.getItem('alllevel'));
    var userId = localStorage.getItem('userinfo');
    var isLevelOpened = false;
    if (this.alllevel) {
      this.alllevel.forEach((value) => {
          //console.log(value);
          var decrypted = CryptoJS.AES.decrypt(value, userId);
          if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level1' || decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level2' || decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level3' || decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level4') {
              isLevelOpened = true;
          }
      });
    }

    if (!isLevelOpened) {
      // let toast = this.toastCtrl.create({
      //   message: 'Please open level first.',
      //   duration: 3000,
      //   position: 'top',
      //   cssClass: 'info'
      // });
      // toast.present();
      localStorage.setItem('openedLevel', '0')
      this.navCtrl.push('SmailInboxPage');
    }else{
      localStorage.setItem('openedLevel','all')
      this.navCtrl.push('SmailInboxPage');
    }
  };

  openBidPage(){
    this.alllevel = JSON.parse(localStorage.getItem('alllevel'));
    var userId = localStorage.getItem('userinfo');
    var isLevelOpened = false;
    if (this.alllevel) {
      this.alllevel.forEach((value) => {
          //console.log(value);
          var decrypted = CryptoJS.AES.decrypt(value, userId);
          if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level1' || decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level2' || decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level3' || decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level4') {
              isLevelOpened = true;
          }
      });
    }

    if (!isLevelOpened) {
      let toast = this.toastCtrl.create({
        message: 'Please open level first.',
        duration: 3000,
        position: 'top',
        cssClass: 'info'
      });
      toast.present();
    }else{
      this.navCtrl.push('bidjobs', {
        type: '0'
      });
    }
    
  };

  openFilesPage(){
    this.alllevel = JSON.parse(localStorage.getItem('alllevel'));
    var userId = localStorage.getItem('userinfo');
    var isLevelOpened = false;
    if (this.alllevel) {
      this.alllevel.forEach((value) => {
          //console.log(value);
          var decrypted = CryptoJS.AES.decrypt(value, userId);
          if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level1' || decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level2' || decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level3' || decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level4') {
              isLevelOpened = true;
          }
      });
    }

    if (!isLevelOpened) {
      let toast = this.toastCtrl.create({
        message: 'Please open level first.',
        duration: 3000,
        position: 'top',
        cssClass: 'info'
      });
      toast.present();
    }else{
      this.navCtrl.push('FilemanagerPage');
    }
    
  };

  openJobsPage(){
    if(this.is_license_activated == '0')
    {
        let modal = this.modalCtrl.create('UpdateLicensePage');
        modal.onDidDismiss(data => {
          if(data != null &&data != undefined)
          {
            if(data == '1')
            {
              let toast = this.toastCtrl.create({
                message: 'License has been updated successfully.',
                duration: 3000,
                position : 'top',
                cssClass: 'success'
               });
               toast.present(); 
               this.events.publish('is_license_activated:changed', '');
               this.goToJobsPage();
            }
          }
       });
      modal.present();
    }
    else
    {
      this.goToJobsPage();
    }    
  };

  goToJobsPage()
  {
    this.alllevel = JSON.parse(localStorage.getItem('alllevel'));
      var userId = localStorage.getItem('userinfo');
      var isLevelOpened = false;
      if (this.alllevel) {
        this.alllevel.forEach((value) => {
            //console.log(value);
            var decrypted = CryptoJS.AES.decrypt(value, userId);
            if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level1' || decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level2' || decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level3' || decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level4') {
                isLevelOpened = true;
            }
        });
      }

      if (!isLevelOpened) {
        let toast = this.toastCtrl.create({
          message: 'Please open level first.',
          duration: 3000,
          position: 'top',
          cssClass: 'info'
        });
        toast.present();
      }else{
        this.navCtrl.push('ManagejobPage',{
          is_direct : '0'
        });
      }
  }

  openContacts(){
    this.navCtrl.push('ContactsPage');
  };
  
  openUpgradePack(){
    if(this.is_recurring_billing == '1'){
      let confirm = this.alertCtrl.create({
      title: 'Are you sure?',
      message: 'It will cancel the auto renewable subscriptiion and your package will be remain in working till expiry date.',
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
            this.companyProvider.cancelSubscription({userId : this.userId,subscriptionId : this.subscriptionId}).subscribe((result)=>{
              if(result.status == 1)
              {
                loading.dismissAll();
                let toast = this.toastCtrl.create({
                    message: 'Your subscriptiion has been canceled.',
                    duration: 3000,
                    position: 'top',
                    cssClass: 'success'
                   });
                   toast.present(); 
                   this.is_recurring_billing = '0';
                   this.subscriptionId = null;
                   this.events.publish('no_recurring:changed', '');
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
    else{
      this.navCtrl.push('PricingPage');
    }
  };

  acceptContact(contact){
    var data = {
      memberId : contact.memberId,
      memberstatus : '2',
    };

    const loading = this.loadingCtrl.create({});
    loading.present();
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.put(this.API_ENDPOINT_URL+'accptinvitation', data, options).map(res => res.json()).subscribe(data => {
      if(data.error){
          let toast = this.toastCtrl.create({
              message: data.error,
              duration: 3000,
              position: 'top',
              cssClass: 'danger'
          });
          toast.present();
      }else{
          let toast = this.toastCtrl.create({
              message: 'Invitation has been accepted successfully.',
              duration: 3000,
              position: 'top',
              cssClass: 'success'
          });
          toast.present();
          this.events.publish('countChanged:changed', '');
          this.countChanged = '1';
      }
      loading.dismissAll();
      this.friendRequests();
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
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.put(this.API_ENDPOINT_URL + 'accptinvitation', data, options).map(res => res.json()).subscribe(response => {
      // var newdata = data;
      this.friendRequests();
      loading.dismissAll();
      if(response.error != null){
        let toast = this.toastCtrl.create({
          message: response.error,
          duration: 3000,
          position: 'top',
          cssClass: 'danger'
        });
        toast.present();
      }else{
        let toast = this.toastCtrl.create({
          message: 'Invitation has been declined.',
          duration: 3000,
          position: 'top',
          cssClass: 'success'
         });
        toast.present();
      }
      this.events.publish('countChanged:changed', '');
      this.countChanged = '1';
    },
      err => {
          loading.dismissAll();
          this.showTechnicalError('1');
      });
  };

  friendRequests(){
    // this.userId = localStorage.getItem('userinfo');
    // this.memberServiceProvider.membersList(this.userId).subscribe((data)=>{
    //   this.members = [];
    //   for(var i=0; i < data.length; i++){
    //     if(data[i].memberstatus == 1 && data[i].senderId != this.userId){
    //       this.members.push(data[i]);
    //     }
    //   }
    // });
    this.memberServiceProvider.friend_requests(this.userId).subscribe((data)=>{
      this.members = data;
    },
    err => {
        this.showTechnicalError();
    });
  }

  openExtraspace(){
   this.navCtrl.push('ExtraspacePage',{
    page_type : '1'
   });
  };
}
