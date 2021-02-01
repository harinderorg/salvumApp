import {Component,ViewChild} from '@angular/core';
import {IonicPage,NavController,PopoverController,Events,App,ModalController,LoadingController,AlertController,ToastController,MenuController} from 'ionic-angular';
import {Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/Rx';
import * as CryptoJS from 'crypto-js';
import { ContactserviceProvider} from '../../providers/contactservice/contactservice';
import { CompanyProvider } from '../../providers/company/company';
import * as $ from 'jquery';
import { Socket } from 'ng-socket-io';
import { Observable } from 'rxjs/Observable';
import HandyTimeAgo from 'handy-timeago';
import { PushNotificationService } from 'ng-push-notification';
@IonicPage()
@Component({
    selector: 'app-header',
    templateUrl: 'customheader.html',
    providers: [ContactserviceProvider, CompanyProvider, PushNotificationService]
})
export class CustomheaderPage {
    @ViewChild('content') navCtrl: NavController;
    level0: string = 'false';
    level1: string = 'true';
    level2: string = 'true';
    level3: string = 'true';
    level4: string = 'true';
    alllevel: any;
    isBrowser: any;
    count: any = 0;
    alert: any;
    APIURL: any;
    password:any;
    counts:any;
    zeroLevelCount:any;
    functionClick: Number = 0;
    userImage: any;
    data: Object = {};
    email: Object = {};
    sms: Object = {};
    checkDate: any;
    passinfo: any;
    sendData = {};
    items: Array < {} > ;
    API_ENDPOINT_URL : any = localStorage.getItem('API_ENDPOINT_URL');
    unlockpassURL = 'addlevel';
    showdataUrl = 'allleveldata';
    notificationData = 'notification';
    notification0: any = [];
    notification1: any = [];
    notification2: any = [];
    notification3: any = [];
    notification4: any = [];
    smail0: any = [];
    smail1: any = [];
    smail2: any = [];
    smail3: any = [];
    smail4: any = [];
    loginId: any;
    displayGrid: boolean = false;
    allNotice: boolean = false;
    bellnotification: any = [];
    level0Notice: boolean = false;
    level1Notice: boolean = false;
    level2Notice: boolean = false;
    level3Notice: boolean = false;
    level4Notice: boolean = false;
    notificationType: any;
    otp: any;
    ans:any;
    level: any;
    new_notis: any;
    imageUrl :string;
    passwordModal: boolean = false;
    otpModal: boolean = false;
    otpNumber: any;
    isBackEnb: any;
    modal = {
        password: ''
    };
    forgetPwdModal:boolean = false;
    showPasswordField:boolean = false;
    contacts = [];
    order: string = 'created_on';
    reverse: boolean = true;
    userId: any = localStorage.getItem('userinfo');
    constructor(private app: App,public loadingCtrl: LoadingController, public popoverCtrl: PopoverController, public modalCtrl: ModalController, public alertCtrl: AlertController, public http: Http, public toastCtrl: ToastController, public contactserviceProvider: ContactserviceProvider, public companyProvider: CompanyProvider, public menuCtrl: MenuController, public events: Events,private socket: Socket, private pushNotification: PushNotificationService) {
        this.http = http;

        this.imageUrl = this.API_ENDPOINT_URL+'images/';
        this.alllevel = JSON.parse(localStorage.getItem('alllevel'));
        this.isBrowser = localStorage.getItem('isBrowser');
        var userId = localStorage.getItem('userinfo');
        this.APIURL = localStorage.getItem('APIURL');
        this.loginId = localStorage.getItem('userinfo');
        this.userImage = localStorage.getItem('userImage');

        this.getUpdates().subscribe(new_notis => {
            // console.log('new notis')
            // console.log(new_notis)
            this.getAllNotifications();
            this.new_notis = new_notis;
            this.pushNotification.show(this.new_notis.message);
        });

        var isLevelOpened = false;
        if (this.alllevel) {
            this.alllevel.forEach((value) => {
                var decrypted = CryptoJS.AES.decrypt(value, userId);
                if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level1' || decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level2' || decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level3' || decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level4') {
                    isLevelOpened = true;
                }
            });
        }

        this.app.viewDidEnter.subscribe((evt) => {
            // console.log(evt.instance.title);
            if(this.app.getActiveNav() != undefined){
                var self = this;
                setTimeout(function(){  
                    self.isBackEnb = self.navCtrl.length();
                }, 300); 
            }
        });

        if (!isLevelOpened) {
          
          //console.log(this.app.getActiveNav().getActive())
          
            // if(this.app.getActiveNav().getActive().name == 'DashboardPage'){
                // let toast = this.toastCtrl.create({
                //     message: 'Please open level first.',
                //     duration: 3000
                // });
                // toast.present();
                // if(this.app.getActiveNav().getActive().name != 'DashboardPage'){
                //     this.app.getActiveNav().push(DashboardPage);
                // }
            // }else {
                
            // }
        }

        $(document).click(function(event) {
            if (!$(event.target).hasClass('notification-section')) {
                $(".form_wrapper").hide();
            }
        });

        events.subscribe('username:changed', username => {
            this.APIURL = localStorage.getItem('APIURL');
            this.userImage = localStorage.getItem('userImage');
            this.alllevel = JSON.parse(localStorage.getItem('alllevel'));
            this.loginId = localStorage.getItem('userinfo');
            if(this.isBrowser == 'true'){
                this.getAllNotifications();
                this.getZerolevels();
            }
        });

        events.subscribe('countChanged:changed', username => {
            this.getZerolevels();
        });

        events.subscribe('level:changed', username => {
            if(this.isBrowser == 'true'){
                this.getAllNotifications();
                this.getZerolevels();
            }
        });

        events.subscribe('big_bell_update:changed', username => {
            this.getAllNotifications();
        });

        events.subscribe('level:its_opened_footer', res => {
            this.showLevelOpenClose();
        });

        // events.subscribe('level:app_loaded', res => {
        //     if(this.isBrowser == 'true'){
        //         let nav = this.app.getActiveNav();
        //         if(this.app.getActiveNav() == undefined){
        //             this.app.getActiveNav() = nav;
        //         }
        //     }
        // });

        events.subscribe('read_mail:changed', level_number => {
            if(this.isBrowser == 'true'){
                this.getAllNotifications();
            }
        });

        events.subscribe('read_notiss:changed', level_number => {
            if(level_number == '0')
            {
                this.notification0.splice(0,1);
            }
            else if(level_number == '1')
            {
                this.notification1.splice(0,1);
            }
            else if(level_number == '2')
            {
                this.notification2.splice(0,1);
            }
            else if(level_number == '3')
            {
                this.notification3.splice(0,1);

            }
            else if(level_number == '4')
            {
                this.notification4.splice(0,1);
            }
        });

        var current_url = document.URL.split('#')[1];
        this.checkNavExist();
        if (this.loginId == '' || this.loginId == undefined || this.loginId == null) {
            if(current_url != undefined)
              {
                // if(current_url.search('bidding') == -1)
                // {
                //   this.app.getActiveNav().push('LoginPage');
                // }
                // else
                // {
                //   if(current_url.search('/0') >= 0)  
                //   {
                //     this.app.getActiveNav().push('LoginPage');
                //   }
                // }
                if(current_url.search('bidding') >= 0 || current_url.search('direct-transmittals') >= 0){
                  // console.log('ifffff 2')
                  if(current_url.search('/0') >= 0){
                    // console.log('again iffff 2')
                    this.app.getActiveNav().setRoot('LoginPage');
                  }
                }
                else{
                  // console.log('elseeee')
                  this.app.getActiveNav().setRoot('LoginPage');
                }
              }
              else
              {
                this.app.getActiveNav().push('LoginPage');
              }
        } else {
            this.showLevelOpenClose();
            
        }
    this.getAllNotifications();
    this.getZerolevels();
        
    }

    ionViewWillUnload() {
      this.events.unsubscribe('username:changed');
      this.events.unsubscribe('countChanged:changed');
      this.events.unsubscribe('level:changed');
      this.events.unsubscribe('level:its_opened');
      this.events.unsubscribe('read_mail:changed');
      this.events.unsubscribe('read_notiss:changed');
      this.events.unsubscribe('big_bell_update:changed');
      // this.getUpdates().subscribe().unsubscribe();
      this.userId = null;
    }

    getUpdates() {
        var self = this;
        let observable = new Observable(observer => {
          self.socket.on(self.userId, (data) => {
            observer.next(data);
          });
        })
        return observable;
    }

    timesAgo(date_time){
        return HandyTimeAgo(new Date(date_time).getTime());
    }

    backButton(){
        if(this.app.getActiveNav().length() > 1){
            this.app.getActiveNav().pop();
        }
    }

    showLevelOpenClose(){
        var userId = localStorage.getItem('userinfo');
        this.alllevel = JSON.parse(localStorage.getItem('alllevel'));
        this.APIURL = localStorage.getItem('APIURL');
        if (this.alllevel) {
            this.level1 = 'true';
            this.level2 = 'true';
            this.level3 = 'true';
            this.level4 = 'true';
            this.alllevel.forEach((value) => {

                var decrypted = CryptoJS.AES.decrypt(value, userId);

                if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level1') {
                    this.level1 = 'false';
                    localStorage.setItem('levelOpened', '1');
                } else if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level2') {
                    this.level2 = 'false';
                    localStorage.setItem('levelOpened', '2');
                } else if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level3') {
                    this.level3 = 'false';
                    localStorage.setItem('levelOpened', '3');
                } else if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level4') {
                    this.level4 = 'false';
                    localStorage.setItem('levelOpened', '4');
                } else if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level0') {
                    this.level1 = 'true';
                    this.level2 = 'true';
                    this.level3 = 'true';
                    this.level4 = 'true';
                    localStorage.setItem('levelOpened', '0');
                }
            });
        }
    }

    getAllNotifications(){
        this.contactserviceProvider.getNotificationsCount(localStorage.getItem('userinfo'), 4).subscribe((counts) => {
            if(counts.status == '1'){
                this.counts = counts;
                this.contactserviceProvider.getNotifications(localStorage.getItem('userinfo'), 4).subscribe((all_files) => {
                    this.notification0 = all_files.notify0;
                    this.notification1 = all_files.notify1;
                    this.notification2 = all_files.notify2;
                    this.notification3 = all_files.notify3;
                    this.notification4 = all_files.notify4;
                    // this.contacts = all_files.contacts;
                    this.smail0 = all_files.smail0;
                    this.smail1 = all_files.smail1;
                    this.smail2 = all_files.smail2;
                    this.smail3 = all_files.smail3;
                    this.smail4 = all_files.smail4;
                },
                err => {
                    this.showTechnicalError();
                });
            }
            else{
                let prompt = this.alertCtrl.create({
                    title: "Your account has been removed.",
                    buttons: [
                        {
                            text: 'Ok',
                            handler: data => {
                                this.Logout();
                            }
                        }
                    ]
                });
                prompt.present();
            }
        },
        err => {
            this.showTechnicalError();
        });
    }

    Logout(){
      localStorage.removeItem('level0');
      localStorage.removeItem('level1');
      localStorage.removeItem('level2');
      localStorage.removeItem('level3');
      localStorage.removeItem('passinfo');
      localStorage.removeItem('count');
      localStorage.removeItem('userinfo');
      localStorage.removeItem('alllevel');
      localStorage.removeItem('userName');
      localStorage.removeItem('userImage');
      this.app.getActiveNav().setRoot('LoginPage');   
    }

    // ngOnChanges(changes: SimpleChanges) {
    //   if(changes.hasOwnProperty('countChanged')){
    //     if(this.countChanged == '1')
    //     {
    //       this.getZerolevels();
    //     }
    //   }
    // } 

    getZerolevels(){
        var loginId = localStorage.getItem('userinfo');
        this.contactserviceProvider.contactsList(loginId).subscribe((zerolevel_data)=>{
            if(zerolevel_data.length > 0)
            {
              var zeroLevels = [];
              zerolevel_data.forEach(function(zerolevel){
                // if(zerolevel.senderId != loginId && zerolevel.reciverSetLevel == '0')
                // {
                //   zeroLevels.push(zerolevel);
                // }
                if(zerolevel.senderId != loginId)
                  {
                    if(zerolevel.reciverSetLevel == '0')
                    {
                      zeroLevels.push(zerolevel);
                    }
                  }
                  else
                  {
                    if(zerolevel.senderSetLevel == '0')
                    {
                      zeroLevels.push(zerolevel);
                    }
                  } 
              });
              this.zeroLevelCount = zeroLevels.length;
            }
            else
            {
                this.zeroLevelCount = '0';
            }
        },
        err => {
            this.showTechnicalError();
        });
    }


    presentPopover(myEvent) { 
        this.level4Notice = false;
        this.level3Notice = false;
        this.level2Notice = false;
        this.level1Notice = false;
        this.level0Notice = false;
        this.allNotice = false;
        if (this.displayGrid) {
            this.count = 0;
            this.displayGrid = false;
        } else {
            this.displayGrid = true;

        }
    };


    presentPopover1(myEvent1) {
        this.displayGrid = false;
        this.level4Notice = false;
        this.level3Notice = false;
        this.level2Notice = false;
        this.level1Notice = false;
        this.level0Notice = false;
        if (this.allNotice) {
            this.count = 0;
            this.allNotice = false;
        } else {
            this.allNotice = true;  
            // this.contactserviceProvider.getAllNotification(localStorage.getItem('userinfo'), 1).subscribe((all_files) => {
            //     this.bellnotification = all_files.data;
            //     this.allNotice = true;
            // });
        }
    };

    presentModalunlock(myEvent11) {
        let modal = this.modalCtrl.create('UnlocklevelPage');
        modal.present({
            ev: myEvent11
        });
    }

    doPrompt() {
        let prompt = this.alertCtrl.create({
            message: "Are you sure !",
            buttons: [{
                    text: 'Cancel',
                    handler: data => {
                        //console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Ok',
                    handler: data => {
                        //console.log('Saved clicked');
                    }
                }
            ]
        });
        prompt.present();
    }

    openNotificationPage() {
        this.closeDropDown();
        this.checkNavExist();
        this.app.getActiveNav().push('NotificationPage');
    }

    openDashboardPage() {
        this.checkNavExist();
        this.app.getActiveNav().push('DashboardPage',{id : '0'});
        this.onClickedOutside(null);
        this.closeDropDown();
    }

    setDashboardPage() {
        this.checkNavExist();
        this.app.getActiveNav().setRoot('DashboardPage',{id : '0'});
        this.app.getActiveNav().push('DashboardPage',{id : '0'});
        this.onClickedOutside(null);
        this.closeDropDown();
        // this.isBackEnb = 1;
    }

    closeDropDown(){
        if($(".ng2-dropdown-menu").hasClass("ng2-dropdown-menu--open") == true){
            $(".ng2-dropdown-button").click();
        }
    }

    checkNavExist(){
        if(this.app.getActiveNav() == undefined){
            let nav = this.app.getActiveNav();
            // this.app.getActiveNav() = nav;
        } 
    }
 


    // ionViewDidLoad() {
    //     console.log('custom header');
    //     // this.obj.data = '';
    //     var levelOneArray = [];
    //     var levelSecondArray = [];
    //     var levelThirdArray = [];
    //     var levelFourthArray = [];
    //     var userId = localStorage.getItem('userinfo')
    //     let headers = new Headers({
    //         'Content-Type': 'application/json'
    //     });
    //     let options = new RequestOptions({
    //         headers: headers
    //     });
    //     return this.http.get(this.API_ENDPOINT_URL+this.notificationData + '/' + userId, options).map(res => res.json()).subscribe(data => {
    //         console.log('data');
    //         console.log(data);
    //         console.log('data');
    //         this.items = data;

    //         data.forEach(eachObj => {
    //             //console.log(eachObj);
    //             if (eachObj.level == 1) {
    //                 levelOneArray.push(eachObj);
    //                 this.lenthlevel1 = levelOneArray.length;
    //             } else if (eachObj.level == 2) {
    //                 levelSecondArray.push(eachObj)
    //                 this.lenthlevel2 = levelSecondArray.length;
    //             } else if (eachObj.level == 3) {
    //                 levelThirdArray.push(eachObj)
    //                 this.lenthlevel3 = levelThirdArray.length;
    //             } else {
    //                 levelFourthArray.push(eachObj)
    //                 this.lenthlevel4 = levelFourthArray.length;
    //             }
    //         })

    //         if (localStorage.getItem('levelOpened')) {
    //             this.passinfo = localStorage.getItem('levelOpened');
    //         } else {
    //             this.passinfo = 0;
    //         }

    //         if (localStorage.getItem('count')) {
    //             this.count = localStorage.getItem('count');
    //         } else {
    //             this.count = 0;
    //         }
    //     });
    // };


    showMessages() {
        this.checkNavExist();
        this.app.getActiveNav().push('MessagePage', this.items)
    };

    //this.functionClick = 0;

    goToAddPassWordPage(level) {
        // console.log(level)
        this.closeDropDown();
        this.level = level;
        this.alllevel = JSON.parse(localStorage.getItem('alllevel'));
        var userId = localStorage.getItem('userinfo');
        let headers = new Headers({
            'Content-Type': 'application/json'
        });
        let options = new RequestOptions({
            headers: headers
        });
        return this.http.get(this.API_ENDPOINT_URL+this.showdataUrl + "/" + userId + "/" + level, options).map(res => res.json()).subscribe(data => {
            this.checkDate = data.data;
            // console.log(data);
            let newlevel = 0
            newlevel = level - 1;
            this.passinfo = localStorage.getItem('levelOpened');
            this.count = localStorage.getItem('count');
            // console.log(this.passinfo)
            if (this.count > 0) {
                if (level == 1) {
                    if (newlevel < this.passinfo && newlevel != 0) {
                        const loading = this.loadingCtrl.create({});
                        loading.present();
                        return this.http.get(this.API_ENDPOINT_URL+this.showdataUrl + "/" + userId + "/" + level, options).map(res => res.json()).subscribe(data => {
                            this.checkDate = data.data;
                            loading.dismissAll();
                            // console.log(this.alllevel);
                            if (newlevel < this.passinfo) {
                                if (level == 1 && this.passinfo == 2 ) {
                                    this.alert = this.alertCtrl.create({
                                        subTitle: 'Are you sure you want to lock ?',
                                        buttons: [{
                                            text: 'Yes',
                                            handler: data => {
                                                this.functionClick = 0;
                                                for (var i = this.alllevel.length - 1; i >= 0; i--) {
                                                    var decrypted = CryptoJS.AES.decrypt(this.alllevel[i], userId);
                                                    //console.log(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0]);
                                                    if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level2') {
                                                        this.alllevel.splice(i, 1);
                                                        localStorage.setItem('alllevel', JSON.stringify(this.alllevel));
                                                    } else if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level3') {
                                                        this.alllevel.splice(i, 1);
                                                        localStorage.setItem('alllevel', JSON.stringify(this.alllevel));
                                                    } else if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level4') {
                                                        this.alllevel.splice(i, 1);
                                                        localStorage.setItem('alllevel', JSON.stringify(this.alllevel));
                                                    }
                                                }

                                                this.level2 = 'true';
                                                this.level3 = 'true';
                                                this.level4 = 'true';
                                                localStorage.setItem('levelOpened', '1');
                                                localStorage.setItem('count', '1');
                                                // this.openLevel.emit('1');
                                                this.events.publish('openLevel:changed', '1');
                                                this.levelOpend();
                                            }
                                        },
                                        {
                                            text: 'No',
                                            handler: data => {
                                                //console.log('Cancel clicked');
                                                this.functionClick = 0;
                                            }
                                        }]
                                    });
                                    this.alert.present();
                                }
                            }
                        },
                        err => {
                            loading.dismissAll();
                            this.showTechnicalError('1');
                        });
                    }else{
                        if (level == 1 && this.passinfo > 1 ) {
                                    this.alert = this.alertCtrl.create({
                                        subTitle: 'Are you sure you want to lock ?',
                                        buttons: [{
                                            text: 'Yes',
                                            handler: data => {
                                                this.functionClick = 0;
                                                for (var i = this.alllevel.length - 1; i >= 0; i--) {
                                                    var decrypted = CryptoJS.AES.decrypt(this.alllevel[i], userId);
                                                    //console.log(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0]);
                                                    if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level2') {
                                                        this.alllevel.splice(i, 1);
                                                        localStorage.setItem('alllevel', JSON.stringify(this.alllevel));
                                                    } else if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level3') {
                                                        this.alllevel.splice(i, 1);
                                                        localStorage.setItem('alllevel', JSON.stringify(this.alllevel));
                                                    } else if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level4') {
                                                        this.alllevel.splice(i, 1);
                                                        localStorage.setItem('alllevel', JSON.stringify(this.alllevel));
                                                    }
                                                }

                                                this.level2 = 'true';
                                                this.level3 = 'true';
                                                this.level4 = 'true';
                                                localStorage.setItem('levelOpened', '1');
                                                localStorage.setItem('count', '1');
                                                this.events.publish('openLevel:changed', '1');
                                                this.levelOpend();
                                            }
                                        },
                                        {
                                            text: 'No',
                                            handler: data => {
                                                //console.log('Cancel clicked');
                                                this.functionClick = 0;
                                            }
                                        }]
                                    });
                                    this.alert.present();
                                }
                    }
                }

                if (level == 2) {
                    if (newlevel < this.passinfo) {
                        const loading = this.loadingCtrl.create({});
                        loading.present();
                        return this.http.get(this.API_ENDPOINT_URL+this.showdataUrl + "/" + userId + "/" + level, options).map(res => res.json()).subscribe(data => {
                            this.checkDate = data.data;
                            loading.dismissAll();
                            if (newlevel < this.passinfo) {
                                if (level == 2 && this.passinfo > 2 ) {
                                    this.alert = this.alertCtrl.create({
                                        subTitle: 'Are you sure you want to lock ?',
                                        buttons: [
                                            {
                                                text: 'Yes',
                                                handler: data => {
                                                    for (var i = this.alllevel.length - 1; i >= 0; i--) {
                                                        var decrypted = CryptoJS.AES.decrypt(this.alllevel[i], userId);
                                                        //console.log(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0]);
                                                        if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level3') {
                                                            this.alllevel.splice(i, 1);
                                                            localStorage.setItem('alllevel', JSON.stringify(this.alllevel));
                                                        } else if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level4') {
                                                            this.alllevel.splice(i, 1);
                                                            localStorage.setItem('alllevel', JSON.stringify(this.alllevel));
                                                        }
                                                    }
                                                    this.level3 = 'true';
                                                    this.level4 = 'true';
                                                    localStorage.setItem('levelOpened', '2');
                                                    localStorage.setItem('count', '2');
                                                    this.events.publish('openLevel:changed', '2');
                                                    this.levelOpend();
                                                }
                                            },
                                            {
                                                text: 'No',
                                                handler: data => {
                                                    this.functionClick = 0;
                                                    //console.log('Cancel clicked');
                                                }
                                            }
                                        ]
                                    });
                                    this.alert.present();
                                }
                            }
                        },
                        err => {
                            loading.dismissAll();
                            this.showTechnicalError('1');
                        });
                    }
                }

                if (level == 3) {
                    if (newlevel < this.passinfo) {
                        const loading = this.loadingCtrl.create({});
                        loading.present();
                        return this.http.get(this.API_ENDPOINT_URL+this.showdataUrl + "/" + userId + "/" + level, options).map(res => res.json()).subscribe(data => {
                            this.checkDate = data.data;
                            loading.dismissAll();
                            if (newlevel < this.passinfo) {
                                if (level == 3 && this.passinfo == 4) {
                                    this.alert = this.alertCtrl.create({
                                        subTitle: 'Are you sure you want to lock ?',
                                        buttons: [
                                            {
                                                text: 'Yes',
                                                handler: data => {
                                                    this.functionClick = 0;
                                                    for (var i = this.alllevel.length - 1; i >= 0; i--) {
                                                        var decrypted = CryptoJS.AES.decrypt(this.alllevel[i], userId);
                                                        //console.log(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0]);
                                                        if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level4') {
                                                            this.alllevel.splice(i, 1);
                                                            localStorage.setItem('alllevel', JSON.stringify(this.alllevel));
                                                        }
                                                    }
                                                    this.level4 = 'true';
                                                    localStorage.setItem('levelOpened', '3');
                                                    localStorage.setItem('count', '3');
                                                    this.events.publish('openLevel:changed', '3');
                                                    this.levelOpend();
                                                }
                                            },
                                            {
                                                text: 'No',
                                                handler: data => {
                                                    //console.log('Cancel clicked');
                                                    this.functionClick = 0;
                                                }
                                            }
                                        ]
                                    });
                                    this.alert.present();
                                }
                            }
                        },
                        err => {
                            loading.dismissAll();
                            this.showTechnicalError('1');
                        });
                    }
                }
            }
            //console.log(this.checkDate);
            if (this.checkDate) {
                const loading = this.loadingCtrl.create({});
                loading.present();
                return this.http.get(this.API_ENDPOINT_URL+this.showdataUrl + "/" + userId + "/" + level, options).map(res => res.json()).subscribe(data => {
                    this.checkDate = data.data;
                    loading.dismissAll();
                    if (this.checkDate.level == level) {
                        // console.log(level)
                        if (newlevel == this.passinfo) {
                            // console.log(this.alertCtrl);
                            this.modal.password = '';
                            this.passwordModal = true;
                        } else if (level == 1 && this.passinfo == 2 || level == 1 && this.passinfo == 3) {

                        } else if (level == 2 && this.passinfo == 3 || level == 2 && this.passinfo == 1) {

                        } else if (level == 3 && this.passinfo == 4) {

                        }
                    }
                },
                err => {
                    loading.dismissAll();
                    this.showTechnicalError('1');
                });
            } else {
                const loading = this.loadingCtrl.create({});
                loading.present();
                return this.http.get(this.API_ENDPOINT_URL+this.showdataUrl + "/" + userId + "/" + level, options).map(res => res.json()).subscribe(data => {
                    this.checkDate = data.data;
                    loading.dismissAll();
                    if (newlevel == this.passinfo) {
                        this.alert = this.alertCtrl.create({
                            subTitle: 'You have not added details for this level !!',
                            buttons: [{
                                    text: 'Cancel',
                                    handler: data => {
                                        //console.log('Cancel clicked');
                                        this.functionClick = 0;
                                    }
                                },
                                {
                                    text: 'Manage this level',
                                    handler: data => {
                                        this.functionClick = 0;
                                        localStorage.setItem('selectedLevel', level);
                                        this.checkNavExist();
                                        this.app.getActiveNav().push('AddpasswordlevelPage', level);

                                    }
                                }
                            ]

                        });
                        this.alert.present();
                    }
                },
                err => {
                    loading.dismissAll();
                    this.showTechnicalError('1');
                });
            }
        },
        err => {
            this.showTechnicalError();
        });
        
    };

    dismissModal(){
        this.passwordModal = false;
    }

    openLevelUsingPassword(password){
        //console.log(password)
        if(password == undefined  || password == ''){
            let toast = this.toastCtrl.create({
                message: 'Please enter your level password',
                duration: 3000,
                position: 'top',
                cssClass: 'danger'
            });
            toast.present();
        }else{
            const loading = this.loadingCtrl.create({});
            loading.present();
            let headers = new Headers({
                'Content-Type': 'application/json'
            });
            let options = new RequestOptions({
                headers: headers
            });
            return this.http.get(this.API_ENDPOINT_URL+this.unlockpassURL + "/" + this.level + "/" + password + '/' + localStorage.getItem('userinfo'), options)
            .map(res => res.json())
            .subscribe(data => {
               // console.log(data)
                if (data.status == 1) {
                    localStorage.setItem('count', this.level);
                    var password,levels,i,encrypted,string;
                    if(this.level < 3){
                        
                        password = localStorage.getItem('userinfo'), levels = [];
                        this.passwordModal = false;
                        for(i=1; i <= this.level;i++){
                            string = 'level' + i +'#' + localStorage.getItem('userinfo');
                            encrypted = CryptoJS.AES.encrypt(string, password);
                            this.modal.password = '';
                            levels.push(encrypted.toString());
                        }
                    
                        localStorage.setItem('alllevel', JSON.stringify(levels));
                         if(this.level == 1){
                            this.level1 = "false";
                        }else if(this.level == 2){
                            this.level2 = "false";
                        }
                        // else if(this.level == 3){
                        //     this.level3 = "false";
                        // }else if(this.level == 4){
                        //     this.level4 = "false";
                        // }
                        loading.dismissAll();
                        localStorage.setItem('levelOpened', this.level);
                        this.events.publish('openLevel:changed', '1');
                    }else{
                        if(this.level == 3){
                            if (data.data.isOn == true) {
                                var num = Math.floor(Math.random() * 90000) + 10000;
                                this.otpNumber = num;
                                this.email = {
                                    email: data.data.email,
                                    emailOtp: num,
                                    userId: localStorage.getItem('userinfo')
                                };
                                let body = JSON.stringify(this.email);
                                let headers = new Headers({
                                    'Content-Type': 'application/json'
                                });
                                let options = new RequestOptions({
                                    headers: headers
                                });
                                return this.http.post(this.API_ENDPOINT_URL+'sendMail', body, options)
                                .map(res => res.json())
                                .subscribe(data => {
                                    let toast = this.toastCtrl.create({
                                        message: 'OTP Send on your mail.',
                                        duration: 3000,
                                        position: 'top',
                                        cssClass: 'success'
                                    });
                                    toast.present();
                                    loading.dismissAll();
                                    this.passwordModal = false;
                                    this.otpModal = true;
                                    this.modal.password = '';
                                },
                                err => {
                                    loading.dismissAll();
                                    this.showTechnicalError('1');
                                });
                            }else{
                                localStorage.setItem('count', '3');
                                password = localStorage.getItem('userinfo'), levels = [];
                                for(i=1; i <= this.level;i++){
                                    string = 'level' + i +'#' + localStorage.getItem('userinfo');
                                    encrypted = CryptoJS.AES.encrypt(string, password);
                                    this.password = '';
                                    levels.push(encrypted.toString());
                                }
                                this.modal.password = '';
                                localStorage.setItem('alllevel', JSON.stringify(levels));
                                this.level3 = 'false';
                                localStorage.setItem('levelOpened', '3');
                                this.passwordModal = false;
                                loading.dismissAll();
                                this.events.publish('openLevel:changed', '5');
                                this.levelOpend();
                                
                            }

                        }else{
                            if (data.data.isOn == true) {
                                var numsms = Math.floor(Math.random() * 90000) + 10000;
                                this.otpNumber = numsms;
                                this.sms = {
                                    contact: data.data.contact,
                                    smsOtp: numsms,
                                    userId: localStorage.getItem('userinfo')
                                }
                                let body = JSON.stringify(this.sms);
                                let headers = new Headers({
                                    'Content-Type': 'application/json'
                                });
                                let options = new RequestOptions({
                                    headers: headers
                                });
                                return this.http.post(this.API_ENDPOINT_URL+'sendSms', body, options)
                                .map(res => res.json())
                                .subscribe(data => {
                                    let otptoast = this.toastCtrl.create({
                                        message: 'OTP send on your contact number.',
                                        duration: 3000,
                                        position: 'top',
                                        cssClass: 'success'
                                    });
                                    otptoast.present();
                                    loading.dismissAll();
                                    this.passwordModal = false;
                                    this.otpModal = true;
                                    this.modal.password = '';
                                },
                                err => {
                                    loading.dismissAll();
                                    this.showTechnicalError('1');
                                });
                            }else{
                                 password = localStorage.getItem('userinfo'), levels = [];
                                this.passwordModal = false;
                                for(i=1; i <= this.level;i++){
                                    string = 'level' + i +'#' + localStorage.getItem('userinfo');
                                    encrypted = CryptoJS.AES.encrypt(string, password);
                                    this.modal.password = '';
                                    levels.push(encrypted.toString());
                                }
                            
                                localStorage.setItem('alllevel', JSON.stringify(levels));
                                this.level4 = "false";
                                this.modal.password = '';
                                localStorage.setItem('levelOpened', this.level);
                                loading.dismissAll();  
                                this.events.publish('openLevel:changed', '4');
                                
                            }
                        }
                       
                    }
                    

                } else {
                    let otptoast = this.toastCtrl.create({
                        message: 'Password incorrect',
                        duration: 3000,
                        position: 'top',
                        cssClass: 'danger'
                    });
                    otptoast.present(); 
                    loading.dismissAll();
                }
            },
            err => {
                loading.dismissAll();
                this.showTechnicalError();
            });
        }
    }


    dismissOtpModal (){
        this.otpModal = false;
    }

    validateOtp(otp){
        var string,encrypted,i,password,levels;
        if(this.level == 3){
            if(otp == undefined || otp == ''){
                let toast = this.toastCtrl.create({
                    message: 'Please enter OTP.',
                    duration: 3000,
                    position: 'top',
                    cssClass: 'danger'
                });
                toast.present();
            }else if(otp != this.otpNumber){
                let toast = this.toastCtrl.create({
                    message: 'Wrong otp.',
                    duration: 3000,
                    position: 'top',
                    cssClass: 'danger'
                });
                toast.present();
            }else{
                localStorage.setItem('count', '3');
                password = localStorage.getItem('userinfo'), levels = [];
                for(i=1; i <= this.level;i++){
                    string = 'level' + i +'#' + localStorage.getItem('userinfo');
                    encrypted = CryptoJS.AES.encrypt(string, password);
                    this.modal.password = '';
                    levels.push(encrypted.toString());
                }

                localStorage.setItem('alllevel', JSON.stringify(levels));
                this.level3 = 'false';
                localStorage.setItem('levelOpened', '3');
                this.otpModal = false;
                this.otp = '';
                this.events.publish('openLevel:changed', '5');
                this.levelOpend();
            }
        }else{
            if(otp == undefined || otp == ''){
                let toast = this.toastCtrl.create({
                    message: 'Please enter OTP.',
                    duration: 3000,
                    position: 'top',
                    cssClass: 'danger'
                });
                toast.present();
            }else if(otp != this.otpNumber){
                let toast = this.toastCtrl.create({
                    message: 'Wrong otp.',
                    duration: 3000,
                    cssClass: 'danger'
                });
                toast.present();
            }else{
                localStorage.setItem('count', '4');
                password = localStorage.getItem('userinfo'), levels = [];
                for(i=1; i <= this.level;i++){
                    string = 'level' + i +'#' + localStorage.getItem('userinfo');
                    encrypted = CryptoJS.AES.encrypt(string, password);
                    this.modal.password = '';
                    levels.push(encrypted.toString());
                }

                localStorage.setItem('alllevel', JSON.stringify(levels));
                this.level4 = 'false';
                localStorage.setItem('levelOpened', '4');
                this.otpModal = false;
                this.events.publish('openLevel:changed', '4');
                this.levelOpend();
            }
        }
        
    };

    lockAllLevel() {
        this.closeDropDown();
        this.alert = this.alertCtrl.create({
            subTitle: 'Are you sure you want to lock?',
            buttons: [
                {
                    text: 'Yes',
                    handler: data => {
                        var levels = [];
                        var string = 'level0#' + localStorage.getItem('userinfo');
                        var password = localStorage.getItem('userinfo');
                        var encrypted = CryptoJS.AES.encrypt(string, password);
                        levels.push(encrypted.toString());
                        // console.log(levels);
                        localStorage.setItem('alllevel', JSON.stringify(levels));
                        this.level1 = 'true';
                        this.level2 = 'true';
                        this.level3 = 'true';
                        this.level4 = 'true';

                        localStorage.setItem('levelOpened', '0');
                        this.passinfo = 0;
                        localStorage.setItem('count', '0');
                        this.events.publish('openLevel:changed', '0');
                        this.levelOpend();
                    }
                },
                {
                    text: 'No',
                    handler: data => {
                        //console.log('Cancel clicked');
                    }
                }
            ]

        });
        this.alert.present();
    };

    openSmailPage() {
         localStorage.setItem('openedLevel', null);
         this.checkNavExist();
        this.app.getActiveNav().push('SmailInboxPage');
        this.closeDropDown();
    };

    opennotification(level) {
        this.closeDropDown();
        // console.log(level)
        this.notificationType = 'notify';
        localStorage.setItem('notifyType', 'notify');
        if (level == 0 ) {
                this.level4Notice = false;
                this.level3Notice = false;
                this.level2Notice = false;
                this.level1Notice = false;
                this.level0Notice = false;
                // let toast = this.toastCtrl.create({
                //     message: 'No Notification Yet!',
                //     duration: 3000
                // });
                // toast.present();
                this.checkNavExist();
                this.app.getActiveNav().push('ContactsPage',{
                    isLevelZero : '0'
                });
                return
            }
        this.allNotice = false;
        this.displayGrid = false;
        if (this.level1 == 'true') {
            let toast = this.toastCtrl.create({
                message: 'Please open level first.',
                duration: 3000,
                position: 'top',
                cssClass: 'danger'
            });
            toast.present();
        } else {
            localStorage.setItem('notifyLevel', level);
            if (level == 1 && this.notification1.length == 0) {
                this.level4Notice = false;
                this.level3Notice = false;
                this.level2Notice = false;
                this.level1Notice = false;
                this.level0Notice = false;
                let toast = this.toastCtrl.create({
                    message: 'No Notification Yet!',
                    duration: 3000,
                    position: 'top',
                    cssClass: 'info'
                });
                toast.present();
            } else if (level == 2 && this.notification2.length == 0) {
                this.level4Notice = false;
                this.level3Notice = false;
                this.level2Notice = false;
                this.level1Notice = false;
                this.level0Notice = false;
                let toast = this.toastCtrl.create({
                    message: 'No Notification Yet!',
                    duration: 3000,
                    position: 'top',
                    cssClass: 'info'
                });
                toast.present();
            } else if (level == 3 && this.notification3.length == 0) {
                this.level4Notice = false;
                this.level3Notice = false;
                this.level2Notice = false;
                this.level1Notice = false;
                this.level0Notice = false;
                let toast = this.toastCtrl.create({
                    message: 'No Notification Yet!',
                    duration: 3000,
                    position: 'top',
                    cssClass: 'info'
                });
                toast.present();
            } else if (level == 4 && this.notification4.length == 0) {
                this.level4Notice = false;
                this.level3Notice = false;
                this.level2Notice = false;
                this.level1Notice = false;
                this.level0Notice = false;
                let toast = this.toastCtrl.create({
                    message: 'No Notification Yet!',
                    duration: 3000,
                    position: 'top',
                    cssClass: 'info'
                });
                toast.present();
            } else if (level == 0 ) {
                this.level4Notice = false;
                this.level3Notice = false;
                this.level2Notice = false;
                this.level1Notice = false;
                this.level0Notice = false;
                // let toast = this.toastCtrl.create({
                //     message: 'No Notification Yet!',
                //     duration: 3000
                // });
                // toast.present();
                this.checkNavExist();
                this.app.getActiveNav().push('ContactsPage',{
                    isLevelZero : '0'
                });
            // }  else if (level == 0 && this.notification0.length > 0) {
            //     this.level4Notice = false;
            //     this.level3Notice = false;
            //     this.level2Notice = false;
            //     this.level1Notice = false;
            //     this.allNotice = false;
            //     this.displayGrid = false;
            //     if (this.level0Notice) {
            //         this.level0Notice = false;
            //     } else {
            //         this.level0Notice = true;
            //     }
            } else if (level == 1 && this.notification1.length > 0) {
                this.level0Notice = false;
                this.level3Notice = false;
                this.level2Notice = false;
                this.level4Notice = false;
                this.allNotice = false;
                this.displayGrid = false;
                if (this.level1Notice) {
                    this.count = 0;
                    this.level1Notice = false;
                } else {
                    this.level1Notice = true;
                }
            } else if (level == 2 && this.notification2.length > 0) {
                this.level0Notice = false;
                this.level3Notice = false;
                this.level4Notice = false;
                this.level1Notice = false;
                this.allNotice = false;
                this.displayGrid = false;
                if (this.level2Notice) {
                    this.count = 0;
                    this.level2Notice = false;
                } else {
                    this.level2Notice = true;
                }
            } else if (level == 3 && this.notification3.length > 0) {
                this.level0Notice = false;
                this.level4Notice = false;
                this.level2Notice = false;
                this.allNotice = false;
                this.level1Notice = false;
                this.displayGrid = false;
                if (this.level3Notice) {
                    this.count = 0;
                    this.level3Notice = false;
                } else {
                    this.level3Notice = true;
                }
            } else if (level == 4 && this.notification4.length > 0) {
                this.level0Notice = false;
                this.level3Notice = false;
                this.level2Notice = false;
                this.level1Notice = false;
                this.allNotice = false;
                this.displayGrid = false;
                if (this.level4Notice) {
                    this.count = 0;
                    this.level4Notice = false;
                } else {
                    this.level4Notice = true;
                }
            }
        }
    };


    seeAllLevelNotifications(level) {
        this.checkNavExist();
        this.closeDropDown();
        if (level == 0) {
            if (localStorage.getItem('notifyType') == 'smail') {
                this.app.getActiveNav().push('SmailInboxPage');
            } else {
                this.app.getActiveNav().push('MembersPage');
            }
        } else {
            this.app.getActiveNav().push('NotificationPage');
        }
    };

    members(){
        this.checkNavExist();
        this.onClickedOutside(null);
        this.app.getActiveNav().push('MembersPage');
    }

    mails(level) {
        this.closeDropDown();
        this.notificationType = 'smail';
        localStorage.setItem('notifyType', 'smail');
        // if(level == 0){
            // localStorage.setItem('openedLevel', level);
        //     this.app.getActiveNav().push(SmailInboxPage);
        // }else if (this.level1 == 'true') {
        //     let toast = this.toastCtrl.create({
        //         message: 'Please open level first.',
        //         duration: 3000
        //     });
        //     toast.present();
        // } else {
        //     //this.app.getActiveNav().push(SmailInboxPage);
        //     this.allNotice = false;
        //     this.displayGrid = false;
        //     if (this.level1 == 'true') {
        //         let toast = this.toastCtrl.create({
        //             message: 'Please open level first.',
        //             duration: 3000
        //         });
        //         toast.present();
        //     } else {
        //         console.log(level);
        //         localStorage.setItem('notifyLevel', level);
        //         if (level == 1 && this.smail1.length == 0) {
        //             this.level4Notice = false;
        //             this.level3Notice = false;
        //             this.level2Notice = false;
        //             this.level1Notice = false;
        //             this.level0Notice = false;
        //             let toast = this.toastCtrl.create({
        //                 message: 'No Message Yet!',
        //                 duration: 3000
        //             });
        //             toast.present();
        //         } else if (level == 2 && this.smail2.length == 0) {
        //             this.level4Notice = false;
        //             this.level3Notice = false;
        //             this.level2Notice = false;
        //             this.level1Notice = false;
        //             this.level0Notice = false;
        //             let toast = this.toastCtrl.create({
        //                 message: 'No Message Yet!',
        //                 duration: 3000
        //             });
        //             toast.present();
        //         } else if (level == 3 && this.smail3.length == 0) {
        //             this.level4Notice = false;
        //             this.level3Notice = false;
        //             this.level2Notice = false;
        //             this.level1Notice = false;
        //             this.level0Notice = false;
        //             let toast = this.toastCtrl.create({
        //                 message: 'No Message Yet!',
        //                 duration: 3000
        //             });
        //             toast.present();
        //         } else if (level == 4 && this.smail4.length == 0) {
        //             this.level4Notice = false;
        //             this.level3Notice = false;
        //             this.level2Notice = false;
        //             this.level1Notice = false;
        //             this.level0Notice = false;
        //             let toast = this.toastCtrl.create({
        //                 message: 'No Message Yet!',
        //                 duration: 3000
        //             });
        //             toast.present();
        //         } else{
        //             this.level4Notice = false;
        //             this.level3Notice = false;
        //             this.level2Notice = false;
        //             this.level1Notice = false;
        //             this.level0Notice = false;
                    // let toast = this.toastCtrl.create({
                    //     message: 'No Notification Yet!',
                    //     duration: 3000
                    // });
                    // toast.present();
                    this.checkNavExist();
                    localStorage.setItem('openedLevel', level);
                    this.app.getActiveNav().push('SmailInboxPage');
        //         }
        //     }
        // }
    };

    SupportLoginUser() {
        var baseUrl = localStorage.getItem('baseUrl');
        localStorage.setItem('currentSupportId', localStorage.getItem('userinfo'));
        localStorage.setItem('currentSupportName', localStorage.getItem('userName'));
        localStorage.setItem('currentSupportImage', '');
        localStorage.setItem('currentSupportType', 'user');
        localStorage.setItem('currentNavbar', 'supportUserNav');
        window.open(baseUrl + '/#/tickets');
    };

    toggleMenu() {
        this.menuCtrl.toggle('right');
        //this.menuCtrl.enable(true, 'authenticated');
    };

    smail() {
        this.closeDropDown();
        this.onClickedOutside(null);
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
          let toast = this.toastCtrl.create({
            message: 'Please open level first.',
            duration: 3000,
            position: 'top',
            cssClass: 'danger'
          });
          toast.present();
        }else{
            localStorage.setItem('openedLevel', null);
            this.checkNavExist();
            // this.app.getActiveNav().push('SmailInboxPage');
            this.app.getActiveNav().push('SmailInboxPage');
        }
       
    };

    file() {
        this.closeDropDown();
        this.onClickedOutside(null);
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
            cssClass: 'danger'
          });
          toast.present();
        }else{
            this.checkNavExist();
            // this.app.getActiveNav().push('FilemanagerPage');
            this.app.getActiveNav().push('FilemanagerPage');
        }
        
    };

    Invite() {
        this.checkNavExist();
        this.onClickedOutside(null);
        this.app.getActiveNav().push('InvitePage');
    };

    Wallets() {
        this.onClickedOutside(null);
        this.alllevel = JSON.parse(localStorage.getItem('alllevel'));
        var userId = localStorage.getItem('userinfo');
        var isLevelOpened = false;
        if (this.alllevel) {
          this.alllevel.forEach((value) => {
             // console.log(value);
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
            cssClass: 'danger'
          });
          toast.present();
        }else{
            this.checkNavExist();
            this.app.getActiveNav().push('WalletsPage');
        }
        
    };

    Contacts() {
        this.onClickedOutside(null);
        // this.alllevel = JSON.parse(localStorage.getItem('alllevel'));
        // var userId = localStorage.getItem('userinfo');
        // var isLevelOpened = false;
        // if (this.alllevel) {
        //     this.alllevel.forEach((value) => {
        //         console.log(value);
        //         var decrypted = CryptoJS.AES.decrypt(value, userId);
        //         if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level1' || decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level2' || decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level3' || decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level4') {
        //             isLevelOpened = true;
        //         }
        //     });
        // }

        // if (!isLevelOpened) {
        //   let toast = this.toastCtrl.create({
        //     message: 'Please open level first.',
        //     duration: 3000
        //   });
        //   toast.present();
        // }else{
            this.checkNavExist();
            // this.app.getActiveNav().push('ContactsPage');
            this.app.getActiveNav().push('ContactsPage');
        // }
      
    };

    goToContacts(){
        this.checkNavExist();
        this.app.getActiveNav().push('ContactsPage');
    };

    goToBidJobs(){
        this.checkNavExist();
        this.onClickedOutside(null);
        // this.app.getActiveNav().push('bidjobs', {
        //     type: '0'
        // });

        this.app.getActiveNav().push('bidjobs', {
            type: '0'
        });
    };

    goToJobs(){
        this.checkNavExist();
        this.onClickedOutside(null);
        // this.app.getActiveNav().push('ManagejobPage',{
        //     //is_direct : '0'
        // });

        this.app.getActiveNav().push('ManagejobPage', {
            // type: '0'
        });
    };

    openFilesPage(){
        this.closeDropDown();
        this.checkNavExist();
        this.app.getActiveNav().push('FilemanagerPage',{
          notis_redirect : '1'
        });
    };

    seeAllNotifications() {
        this.checkNavExist();
        this.onClickedOutside(null);
        localStorage.setItem('notifyLevel', '0');
        localStorage.setItem('notifyType', 'notify');
        this.app.getActiveNav().push('NotificationPage');
    };

    levelOpend() {
        this.events.publish('level:its_opened', '');
        // this.getAllNotifications();
    };

    forgotPassword(){
        // this.passwordModal = false;
        this.forgetPwdModal = true;
    };

    dismissPwdModal(){
        this.forgetPwdModal = false;
        this.showPasswordField = false;
        this.ans = '';
    };

    validateAnswer(ans){
        if(ans == '' || ans == undefined){
            let toast = this.toastCtrl.create({
                message: 'Answer is required.',
                duration: 3000,
                position: 'top',
                cssClass: 'danger'
            });
            toast.present();
            
        }
        else if(this.checkDate.answer != ans){
            let toast = this.toastCtrl.create({
                message: 'Answer is incorrect for level' + this.level,
                duration: 3000,
                position: 'top',
                cssClass: 'danger'
            });
            toast.present();
            
        }else{
            this.showPasswordField = true;
        }
    };

    readNotis(nid,type,others = null,info = null){
        this.closeDropDown();
        this.onClickedOutside(null);
        this.checkNavExist();
        this.contactserviceProvider.readNotis(nid).subscribe((read_notis)=>{
            // console.log('read successfully.')
        },
        err => {
            this.showTechnicalError();
        });
        if(type == 15 || type == 16 || type == 17 || type == 18 || type == 27 || type == 28 || type == 29 || type == 31){
            this.app.getActiveNav().push('LicensePage');
        } 
        if(type == 150){
            this.app.getActiveNav().push('direct-transmittals');
        } 
        if(type == 1 || type == 9 || type == 33|| type == 34){
            this.openDashboardPage();
        }  
        if(type == 4){
            this.goToBidJobs();
        } 
        if(type == 200){
            this.checkNavExist();
            this.onClickedOutside(null);
            this.app.getActiveNav().push('bidjobs', {
                type: '1'
            });
        }
        if(type == 8){
            if(info.inviteId != undefined && info.inviteId != null && info.inviteId != ''){
                this.app.getActiveNav().push('bidding-page', {
                    bidJobId: info.inviteId,
                    status: null,
                    from_page: '1'
                });
            }
            else{
                this.goToBidJobs();
            }
        }

        if(type == 30){
            if(info.inviteId != undefined && info.inviteId != null && info.inviteId != ''){
                this.app.getActiveNav().push('bidding-page', {
                    bidJobId: info.inviteId,
                    status: 5,
                    go_transmittal: '1'
                });
            }
            else{
                this.goToBidJobs();
            }
        }
        if(type == 7){
            var switched_comp = localStorage.getItem('switched_comp');
            if(switched_comp == info.companyId){
              localStorage.setItem('active_job_breadcrumb',others);
              if(info.jobId != localStorage.getItem('currentJobId')){
                localStorage.removeItem('saved_filter_list');
                localStorage.removeItem('saved_filter_trades');
                localStorage.removeItem('saved_filter_trade_names');
              }
              localStorage.setItem('currentJobId',info.jobId); 
              this.app.getActiveNav().push('RfisPage', {jobId : info.jobId});
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
        if(type == 26 || type == 36 || type == 38){
            this.goToJobs();
        } 
        if(type == 0 || type == 101 || type == 37){
            this.goToContacts();
        }
        if(type == 2){
            this.openSmailPage();
        }
        if(type == 3 || type == 6 || type == 19 || type == 20 || type == 21 || type == 22 || type == 23 || type == 24 || type == 25){
            this.openFilesPage();
        }
        if(type == 32){
            this.app.getActiveNav().push('SmailInboxPage',{
                'notis' : '32',
                '_id' : others
            });
        } 
        if(type == 35 || type == 5){
            this.app.getActiveNav().push('SmailInboxPage');
        }       
    }

    onClickedOutside(event){
        if(this.count == 0){
            this.count = 1;
        }else{
            this.displayGrid = false;
            this.count = 0;
            this.level4Notice = false;
            this.level3Notice = false;
            this.level2Notice = false;
            this.level1Notice = false;
            this.level0Notice = false;
            this.allNotice = false;
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
    
}