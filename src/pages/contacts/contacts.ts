import { Component } from '@angular/core';
import { IonicPage,ToastController, NavController, NavParams, AlertController, LoadingController, Events } from 'ionic-angular';
import 'rxjs/Rx';
import { CompanyProvider } from '../../providers/company/company';
import { ContactserviceProvider } from '../../providers/contactservice/contactservice';
import { GroupserviceProvider } from '../../providers/groupservice/groupservice';
import { ComposePage } from '../compose/compose';
import { Http, Headers, RequestOptions} from '@angular/http';
import * as CryptoJS from 'crypto-js'; 

@IonicPage()
@Component({
  selector: 'page-contacts', 
  templateUrl: 'contacts.html',
  providers: [ContactserviceProvider, GroupserviceProvider, CompanyProvider]
})


export class ContactsPage {
// @Input('countChanged') countChanged;
countChanged:any;
data: any;
userId : string;
isActive: boolean;
shownGroup = null;
buttonClicked:  any[] = [];
showDtata: any[] = [];
isdoneShow: any;
open_levels: any;
isLevelZero: any = '0'; 
force_level_changed: any = '0'; 
done: any[] = [];
hidebutton : any;
forceStatus: string;
top_tab: string = 'contacts';
updatedata: {};
senderSetLevel:any = '';
reciverSetLevel:any;
searchTerm: string = '';
selectLevel: '';
index:any;
isBrowser:any;
prevLevel:any = null;
selectedFirst:any = 0;
selectedSecond:any = 0;
selectedthird:any = 0;
selectedForth:any = 0;
selectedFirst1:any = 0;
selectedSecond1:any = 0;
selectedthird1:any = 0;
selectedForth1:any = 0;
level0 : string;
level1 : string;
level2 : string;
level3 : string;
level4 : string;
alllevel:any;
selectedFolder:any;
count:number;
items:any = [];
all_groups:any = [];
selectedGroups = [];
testCheckboxOpen: any;
selectedContacts:any = [];
selectedConIds:any = [];
directory:any;
timestamp:any;
folders = [];
isThumbActive:boolean = false;
allContacts = [];
allFilteredContacts = [];
level1Contacts = [];
level2Contacts = [];
level3Contacts = [];
level4Contacts = [];
lastOpenedLevel = 0;
searchBoxValue = '';
itemsNew: any = [];
filteredRecords:any = [];
arrayLength: number;
getGroupData = 'getGroupData';
list = [];
selected_Ids: any = [];
selected_groups: any = [];
API_ENDPOINT_URL : any = localStorage.getItem('API_ENDPOINT_URL');
  constructor(public alertCtrl: AlertController, public navCtrl: NavController,public http:Http, public loadingCtrl: LoadingController,public toastCtrl: ToastController, public ContactserviceProvider: ContactserviceProvider, public groupservice: GroupserviceProvider, public companyprovider: CompanyProvider, public events: Events, public navParams: NavParams) {
    this.http = http;

    this.getOpenLevels();

    this.userId = localStorage.getItem('userinfo');
    var current_date = new Date();
    this.timestamp = current_date.getTime();
    this.companyprovider.getFolders(this.userId).subscribe((all_files)=>{ 
      if(all_files.data.length == 0 ){
        this.directory = [];
      }else{
        this.directory = all_files.data;
      } 
    },
    err => {
        this.showTechnicalError();
    });

    events.subscribe('openLevel:changed', data => {  
      this.locksClicked();
    });

    // this.ContactserviceProvider.readNotification(localStorage.getItem('userinfo'), localStorage.getItem('notifyLevel'), localStorage.getItem('notifyType')).subscribe((all_files)=>{
    //   console.log(all_files);
    //   this.events.publish('level:changed', all_files);
    //   //this.notifications = all_files.data; 
    // });
  };

  ionViewWillUnload() {
      this.events.unsubscribe('openLevel:changed');
    }

  caclHeight(){
    var fixed_div = document.getElementById("calc_height_conts"+this.timestamp);
      if(fixed_div != null){
        var fixed_div_height = fixed_div.offsetHeight;
        document.getElementById('fixed_height_conts'+this.timestamp).style.marginTop = fixed_div_height+'px';
      }
  }

  getOpenLevels()
  {
    this.open_levels = [];
    this.alllevel = JSON.parse(localStorage.getItem('alllevel'));
    var userId  = localStorage.getItem('userinfo');
    if(this.alllevel){
      this.alllevel.forEach((value) => {
          var decrypted = CryptoJS.AES.decrypt(value, userId);
        if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level1'){
        
          this.level1 = 'false';
          this.selectedFirst = 1;
          this.selectedFirst1 = 1;
          this.lastOpenedLevel = 1;
          this.open_levels.push('1');
        }else if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level2'){
          
           this.level2 = 'false';
           this.selectedSecond = 2;
           this.selectedSecond1 = 2;
           this.lastOpenedLevel = 2;
           this.open_levels.push('2');
        }else if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level3'){
           this.level3 = 'false';
           this.selectedthird = 3;
           this.selectedthird1 = 3;
           this.lastOpenedLevel = 3;
           this.open_levels.push('3');
        }else if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level4'){
           this.level4 = 'false';
           this.selectedForth = 4;
           this.selectedForth1 = 4;
           this.lastOpenedLevel = 4;
           this.open_levels.push('4');
        }
      });
    }
  }

  locksClicked(){
    this.level1Contacts = [];
    this.level2Contacts = [];
    this.level3Contacts = [];
    this.level4Contacts = [];
    this.open_levels = [];
    this.level2 = 'true'; this.level1 = 'true'; this.level3 = 'true'; this.level4 = 'true'; 

    this.alllevel = JSON.parse(localStorage.getItem('alllevel'));
    var userId  = localStorage.getItem('userinfo');
    var decrypted;
    if(this.alllevel.length > this.lastOpenedLevel){
      if(this.alllevel.length == 1){
        decrypted = CryptoJS.AES.decrypt(this.alllevel[0], userId);
        if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level1'){
          this.level1 = 'false';
          this.selectedFirst = 1;
          this.open_levels.push('1');
        }else{
          this.selectedFirst = 0;
        }
        
      }else if(this.alllevel.length == 2){
        this.level2 = 'false';
        this.selectedSecond = 2;
        this.open_levels.push('2');
      }else if(this.alllevel.length == 3){
        this.level2 = 'false';
        this.selectedthird = 3;
        this.open_levels.push('3');
      }else if(this.alllevel.length == 4){
        this.level4 = 'false';
        this.selectedForth = 4;
        this.open_levels.push('4');
      }
    }else{
      if(this.alllevel.length == 1){
        decrypted = CryptoJS.AES.decrypt(this.alllevel[0], userId);
        if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level0'){
          this.selectedFirst = 0;
          this.selectedSecond = 0;
          this.selectedthird = 0;
          this.selectedForth = 0;
        }else{
          this.level1 = 'false';
          this.selectedFirst = 1;
          this.selectedSecond = 0;
          this.selectedthird = 0;
          this.selectedForth = 0;
        }
      }else if(this.alllevel.length == 2){
        
        this.selectedthird = 0;
        this.selectedForth = 0;
      }else if(this.alllevel.length == 3){
        this.selectedForth = 0;
      }else if(this.alllevel.length == 0){
        this.selectedFirst = 0;
      }
    }
    this.lastOpenedLevel = this.alllevel.length;
    
    if(this.alllevel){
      this.alllevel.forEach((value) => {
          var decrypted = CryptoJS.AES.decrypt(value, userId);
        if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level1'){
          this.level1 = 'false';

        }else if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level2'){
           this.level2 = 'false';
        }else if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level3'){
           this.level3 = 'false';
        }else if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level4'){
           this.level4 = 'false';
        }
      });
    }

    this.userId = localStorage.getItem('userinfo');

    this.companyprovider.getFolders(this.userId).subscribe((all_files)=>{ 
      if(all_files.data.length == 0 ){
        this.directory = [];
      }else{
        this.directory = all_files.data;
      }
    },
    err => {
        this.showTechnicalError();
    });

    this.ContactserviceProvider.contactsList(this.userId).subscribe((data)=>{
      this.data = data;
      var i;
      if(this.selectedFirst != 1){
        for(i = Number(this.data.length - 1); i >= 0; i--){
          if(this.data[i].senderId == this.userId){
            if(this.data[i].senderSetLevel == 1){
              this.data.splice(i, 1);
            }
          }else{
            if(this.data[i].reciverSetLevel == 1){
              this.data.splice(i, 1);
            }
          }
        }
      }

      if(this.selectedSecond != 2){
        for(i = Number(this.data.length - 1); i >= 0; i--){
          if(this.data[i].senderId == this.userId){
            if(this.data[i].senderSetLevel == 2){
              this.data.splice(i, 1);
            }
          }else{
            if(this.data[i].reciverSetLevel == 2){
              this.data.splice(i, 1);
            }
          }
        }
      }

      if(this.selectedthird != 3){
        for(i = Number(this.data.length - 1); i >= 0; i--){
          if(this.data[i].senderId == this.userId){
            if(this.data[i].senderSetLevel == 3){
              this.data.splice(i, 1);
            }
          }else{
            if(this.data[i].reciverSetLevel == 3){
              this.data.splice(i, 1);
            }
          }
        }
      }

      if(this.selectedForth != 4){
        for(i = Number(this.data.length - 1); i >= 0; i--){
          if(this.data[i].senderId == this.userId){
            if(this.data[i].senderSetLevel == 4){
              this.data.splice(i, 1);
            }
          }else{
            if(this.data[i].reciverSetLevel == 4){
              this.data.splice(i, 1);
            }
          }
        }
      }
    },
    err => {
        this.showTechnicalError();
    });
    this.groupsList();

   this.getOpenLevels();  
  }


  ionViewDidLoad() {
    this.caclHeight();
    this.isBrowser = localStorage.getItem('isBrowser');
    this.isActive = false;
    //this.showDtata = false;
    this.hidebutton = false;
    this.forceStatus = '0';
    this.isdoneShow = false;
    this.userId = localStorage.getItem('userinfo');
    const loading = this.loadingCtrl.create({});
    loading.present();

      this.ContactserviceProvider.contactsList(this.userId).subscribe((data)=>{
        loading.dismissAll()
        this.allContacts = data;
        var newArray = [];
        var  count = 0
         data.forEach(newItem => {
            if(newItem.senderSetLevel == '0' && newItem.senderId == this.userId){
             // if(this.level1 == 'false'){
                  
                  newArray.push(newItem)
                  count = count + 1;
              //}
            }else if(newItem.reciverSetLevel == '0' && newItem.reciverId == this.userId){
             // if(this.level1 == 'false'){
                  
                  newArray.push(newItem)
                  count = count + 1;
              //}
            }else if(newItem.reciverId == this.userId){
              if(newItem.reciverSetLevel == '1'){
                this.level1Contacts.push(newItem);
              }else if(newItem.reciverSetLevel == '2'){
                this.level2Contacts.push(newItem);
              }else if(newItem.reciverSetLevel == '3'){
                this.level3Contacts.push(newItem);
              }else if(newItem.reciverSetLevel == '4'){
                this.level4Contacts.push(newItem);
              }
            }else{
              if(newItem.senderSetLevel == '1'){
                this.level1Contacts.push(newItem);
              }else if(newItem.senderSetLevel == '2'){
                this.level2Contacts.push(newItem);
              }else if(newItem.senderSetLevel == '3'){
                this.level3Contacts.push(newItem);
              }else if(newItem.senderSetLevel == '4'){
                this.level4Contacts.push(newItem);
              }
            }
      })
        this.items = newArray;
        this.data = data;
        localStorage.setItem('crecords', JSON.stringify(this.data));
        this.allFilteredContacts = data;
        var i;
        if(this.navParams.get('isLevelZero') == '0')
        {
          this.selectedFirst = 0;
          this.selectedSecond = 0;
          this.selectedthird = 0;
          this.selectedForth = 0;
          if(this.selectedFirst != 1){
            for(i = Number(this.data.length - 1); i >= 0; i--){
              if(this.data[i].senderId == this.userId){
                if(this.data[i].senderSetLevel == 1){
                  this.data.splice(i, 1);
                }
              }else{
                if(this.data[i].reciverSetLevel == 1){
                  this.data.splice(i, 1);
                }
              }
            }
          }

          if(this.selectedSecond != 2){
            for(i = Number(this.data.length - 1); i >= 0; i--){
              if(this.data[i].senderId == this.userId){
                if(this.data[i].senderSetLevel == 2){
                  this.data.splice(i, 1);
                }
              }else{
                if(this.data[i].reciverSetLevel == 2){
                  this.data.splice(i, 1);
                }
              }
            }
          }

          if(this.selectedthird != 3){
            for(i = Number(this.data.length - 1); i >= 0; i--){
              if(this.data[i].senderId == this.userId){
                if(this.data[i].senderSetLevel == 3){
                  this.data.splice(i, 1);
                }
              }else{
                if(this.data[i].reciverSetLevel == 3){
                  this.data.splice(i, 1);
                }
              }
            }
          }

          if(this.selectedForth != 4){
            for(i = Number(this.data.length - 1); i >= 0; i--){
              if(this.data[i].senderId == this.userId){
                if(this.data[i].senderSetLevel == 4){
                  this.data.splice(i, 1);
                }
              }else{
                if(this.data[i].reciverSetLevel == 4){
                  this.data.splice(i, 1);
                }
              }
            }
          }
        }else{
          if(this.selectedFirst != 1){
            for(i = Number(this.data.length - 1); i >= 0; i--){
              if(this.data[i].senderId == this.userId){
                if(this.data[i].senderSetLevel == 1){
                  this.data.splice(i, 1);
                }
              }else{
                if(this.data[i].reciverSetLevel == 1){
                  this.data.splice(i, 1);
                }
              }
            }
          }

          if(this.selectedSecond != 2){
            for(i = Number(this.data.length - 1); i >= 0; i--){
              if(this.data[i].senderId == this.userId){
                if(this.data[i].senderSetLevel == 2){
                  this.data.splice(i, 1);
                }
              }else{
                if(this.data[i].reciverSetLevel == 2){
                  this.data.splice(i, 1);
                }
              }
            }
          }

          if(this.selectedthird != 3){
            for(i = Number(this.data.length - 1); i >= 0; i--){
              if(this.data[i].senderId == this.userId){
                if(this.data[i].senderSetLevel == 3){
                  this.data.splice(i, 1);
                }
              }else{
                if(this.data[i].reciverSetLevel == 3){
                  this.data.splice(i, 1);
                }
              }
            }
          }

          if(this.selectedForth != 4){
            for(i = Number(this.data.length - 1); i >= 0; i--){
              if(this.data[i].senderId == this.userId){
                if(this.data[i].senderSetLevel == 4){
                  this.data.splice(i, 1);
                }
              }else{
                if(this.data[i].reciverSetLevel == 4){
                  this.data.splice(i, 1);
                }
              }
            }
          }
        }

        if(this.navParams.get('selected_contacts') != undefined){
          if(this.navParams.get('selected_contacts').length > 0){
            this.selectedContacts = this.navParams.get('selected_contacts');
            var self = this;
            this.selectedContacts.forEach(function(cont){
              self.selectedConIds.push(cont.member_id);
            });
          }
        }

      
    },
    err => {
        loading.dismissAll();
        this.showTechnicalError();
    });
    this.groupsList();
  };

  groupsList(){
    let headers = new Headers({
        'Content-Type': 'application/json'
    });
    let options = new RequestOptions({
        headers: headers
    });
    return this.http.get(this.API_ENDPOINT_URL+this.getGroupData + '/' + this.userId, options)
        .map(res => res.json())
        .subscribe(data => {
            this.itemsNew = data;
            var all_groups = [], self = this;
            data.forEach(newItem => {
                if(self.open_levels.indexOf(newItem.userLevel) >= 0){
                  newItem.display = newItem.name;
                  newItem.value = newItem.name;
                  all_groups.push(newItem);
                }
            })
            this.list = all_groups;
            this.all_groups = all_groups;
            this.filteredRecords = all_groups;
            this.arrayLength = this.all_groups.length;
            localStorage.setItem('records', JSON.stringify(this.list));
            if(this.navParams.get('selected_groups') != undefined){
              if(this.navParams.get('selected_groups').length > 0){
                this.selected_groups = this.navParams.get('selected_groups');
                this.selected_groups.forEach(function(gro){
                  self.selected_Ids.push(gro._id);
                });
              }
            }
        },
        err => {
            this.showTechnicalError();
        });
  }

  insertToArray(event,group){
    if(event.target.checked == true)
      {
        this.selected_Ids.push(group._id);
        this.selected_groups.push(group);
      }
      else
      {
        this.removeArray(this.selected_Ids, group._id);
        this.removeArray(this.selected_groups, group);
      }  
  }

  removeArray(arr,what) {
    var a = arguments, L = a.length, ax;
    while (L > 1 && arr.length) {
        what = a[--L];
        while ((ax= arr.indexOf(what)) !== -1) {
            arr.splice(ax, 1);
        }
    }
    return arr;
  }

  updateCbValue(value, e:any){
    this.count = 0;
    var i;

    if(e.checked == true){
      this.count = 1;
       if(value == '1'){
        this.selectedFirst = 1;
        //return;
      }else if(value == '2'){
        this.selectedSecond = 2;
        //return;
      }
      else if(value == '3'){
        this.selectedthird = 3;
        //return;
      }else{
        this.selectedForth = 4;
       // return;
      }

      var list = JSON.parse(localStorage.getItem('crecords'));
      for(i=0; i < list.length; i++){
        if(list[i].senderId == this.userId){
          if(list[i].senderSetLevel == value){
            this.data.push(list[i]);
          } 
        }else{
          if(list[i].reciverSetLevel == value){
            this.data.push(list[i]);
          }
        }
      }

      // for groups
      this.list = JSON.parse(localStorage.getItem('records'));
        for(i=0; i < this.list.length; i++){
          if(this.list[i].userLevel == value){
            this.all_groups.push(this.list[i]);
          }
        }

        // if the value is an empty string don't filter the items
        if (this.searchBoxValue && this.searchBoxValue.trim() != '') {
          this.all_groups = this.all_groups.filter((item) => {
            return (item.name.toLowerCase().indexOf(this.searchBoxValue.toLowerCase()) > -1);
          })
        }

      // if the value is an empty string don't filter the items
      // if (this.searchBoxValue && this.searchBoxValue.trim() != '') {
      //   this.items = this.items.filter((item) => {
      //     console.log(item.name);
      //     return (item.name.toLowerCase().indexOf(this.searchBoxValue.toLowerCase()) > -1);
      //   })
      // }
    }else{
      if(this.count == 0){
        if(value == '1'){
          this.selectedFirst = 0;
          //return;
        }else if(value == '2'){
          this.selectedSecond = 0;
          //return;
        }
        else if(value == '3'){
          this.selectedthird = 0;
          //return;
        }else{
          this.selectedForth = 0;
          //return;
        }
      } 

      for(i = Number(this.data.length - 1); i >= 0; i--){
        if(this.data[i].senderId == this.userId){
          if(this.data[i].senderSetLevel == value){
            this.data.splice(i, 1);
          }
        }else{
          if(this.data[i].reciverSetLevel == value){
            this.data.splice(i, 1);
          }
        }
      }
      this.allFilteredContacts = JSON.parse(localStorage.getItem('crecords'));
      // for groups
      for(i = Number(this.all_groups.length - 1); i >= 0; i--){
          if(this.all_groups[i].userLevel == value){
            this.all_groups.splice(i, 1);
          }
        }

        // if the value is an empty string don't filter the items
        if (this.searchBoxValue && this.searchBoxValue.trim() != '') {
          this.all_groups = this.all_groups.filter((item) => {
            return (item.name.toLowerCase().indexOf(this.searchBoxValue.toLowerCase()) > -1);
          })
        }

      //console.log(this.allFilteredContacts);
      // if the value is an empty string don't filter the items
      // if (this.searchBoxValue && this.searchBoxValue.trim() != '') {
      //   this.items = this.items.filter((item) => {
      //     console.log(item.name);
      //     return (item.name.toLowerCase().indexOf(this.searchBoxValue.toLowerCase()) > -1);
      //   })
      // }
    }

    if (this.searchBoxValue && this.searchBoxValue.trim() != '') {
      this.data = this.data.filter((item) => {
        return (item.name.toLowerCase().indexOf(this.searchBoxValue.toLowerCase()) > -1);
      })
    }
  }

  showConfirmGroup(item, index) {
    let confirm = this.alertCtrl.create({
        message: 'Are you sure you want to delete this ?',
        buttons: [{
                text: 'No',
                handler: () => {
                    console.log('Disagree clicked');
                }
            },
            {
                text: 'Yes',
                handler: () => {
                    let headers = new Headers({
                        'Content-Type': 'application/json'
                    });
                    let options = new RequestOptions({
                        headers: headers
                    });
                    return this.http.delete(this.API_ENDPOINT_URL+this.getGroupData + "/" + item._id, options)
                        .map(res => res.json())
                        .subscribe(data => {                               
  
                            for(var i=0; i < this.list.length; i++){
                              if(this.list[i]._id == item._id){
                                this.list.splice(i, 1);
                              }
                            }
 
                            this.all_groups.splice(index, 1);
                            let toast = this.toastCtrl.create({
                                message: 'Group has been deleted successfully.',
                                duration: 3000
                            });
                            toast.present();
                        },
                        err => {
                            this.showTechnicalError('1');
                        });
                    }
                }
            ]
        });
        confirm.present();
    };
  
  showConfirm(item, index) {
    let confirm = this.alertCtrl.create({ 
      message: 'Are you sure you want to delete this ?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            // console.log('Disagree clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            var data = {
              memberId : item.member_id,
              memberstatus : 0,
              requsetType: 'delete',
              fromId: this.userId,
              toId: this.userId == item.senderId ? item.reciverId : item.senderId
            };
           
            const loading = this.loadingCtrl.create({});
            loading.present();
           
            return this.ContactserviceProvider.acceptInvitation(data).subscribe(data => {
              loading.dismissAll();
              let toast = this.toastCtrl.create({
                  message: 'Contact has been removed.',
                  duration: 3000,
                  cssClass: 'success',
                  position: 'top'
               });
              toast.present();
              if(item.senderSetLevel != '0' && item.reciverSetLevel != '0'){
                this.getContact();
              }
              else{
                this.getContact('0');
              }  
              this.events.publish('countChanged:changed', '');
              this.countChanged = '1';
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
  };

  toggleGroup(group) {
    if (this.isGroupShown(group)) {
      this.shownGroup = null;
    } else {
      this.shownGroup = group;
    }
  };

  isGroupShown(group) {
    return this.shownGroup === group;
  };

  getContact(type = null){
    this.level1Contacts = [];
    this.level2Contacts = [];
    this.level3Contacts = [];
    this.level4Contacts = [];
    this.selectedthird = 0; this.selectedFirst = 0; this.selectedSecond = 0; this.selectedForth = 0;
    this.level2 = 'true'; this.level1 = 'true'; this.level3 = 'true'; this.level4 = 'true';  
    this.alllevel = JSON.parse(localStorage.getItem('alllevel'));
    var userId  = localStorage.getItem('userinfo');
    if(this.alllevel && type == null){
      this.alllevel.forEach((value) => {
          var decrypted = CryptoJS.AES.decrypt(value, userId);
        if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level1'){
        
          this.level1 = 'false';
          this.selectedFirst = 1;

        }else if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level2'){
          
           this.level2 = 'false';
           this.selectedSecond = 2;

        }else if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level3'){
           this.level3 = 'false';
           this.selectedthird = 3;

        }else if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level4'){
           this.level4 = 'false';
           this.selectedForth = 4;
        }
      });
    }

    this.userId = localStorage.getItem('userinfo');

    this.companyprovider.getFolders(this.userId).subscribe((all_files)=>{ 
      if(all_files.data.length == 0 ){
        this.directory = [];
      }else{
        this.directory = all_files.data;
      }
    },
    err => {
        this.showTechnicalError();
    });

    this.ContactserviceProvider.contactsList(this.userId).subscribe((data)=>{
       localStorage.setItem('crecords',(JSON.stringify(data)));
        this.data = data;
        var i;

        if(this.selectedFirst != 1){
          for(i = Number(this.data.length - 1); i >= 0; i--){
            if(this.data[i].senderId == this.userId){
              if(this.data[i].senderSetLevel == 1){
                this.data.splice(i, 1);
              }
            }else{
              if(this.data[i].reciverSetLevel == 1){
                this.data.splice(i, 1);
              }
            }
          }
        }

        if(this.selectedSecond != 2){
          for(i = Number(this.data.length - 1); i >= 0; i--){
            if(this.data[i].senderId == this.userId){
              if(this.data[i].senderSetLevel == 2){
                this.data.splice(i, 1);
              }
            }else{
              if(this.data[i].reciverSetLevel == 2){
                this.data.splice(i, 1);
              }
            }
          }
        }

        if(this.selectedthird != 3){
          for(i = Number(this.data.length - 1); i >= 0; i--){
            if(this.data[i].senderId == this.userId){
              if(this.data[i].senderSetLevel == 3){
                this.data.splice(i, 1);
              }
            }else{
              if(this.data[i].reciverSetLevel == 3){
                this.data.splice(i, 1);
              }
            }
          } 
        }

        if(this.selectedForth != 4){
          for(i = Number(this.data.length - 1); i >= 0; i--){
            if(this.data[i].senderId == this.userId){
              if(this.data[i].senderSetLevel == 4){
                this.data.splice(i, 1);
              }
            }else{
              if(this.data[i].reciverSetLevel == 4){
                this.data.splice(i, 1);
              }
            }
          }
        }
        //this.items = newArray;
    },
    err => {
        this.showTechnicalError();
    });
  };

  onClick(isActive, level){

    if(isActive == true){
      const loading = this.loadingCtrl.create({});
      loading.present();
      this.companyprovider.getFolders(this.userId).subscribe((all_files)=>{ 
        if(all_files.data.length == 0 ){
          this.folders = [];
          this.isActive = true;
          this.forceStatus = '1';
          loading.dismissAll();
        }else{
          this.folders = [];
          var myArray = all_files.data, allowed_levels = [];
          allowed_levels.push('level'+level);
          var i;
          for (i = myArray.length - 1; i >= 0; --i) {
            if (allowed_levels.indexOf(myArray[i].name) == -1) {
                 myArray.splice(i,1);
             }
          }
          for(i=0;i < myArray.length; i++){
            for(var j=0; j < myArray[i].children.length; j++){
              this.folders.push(myArray[i].children[j])
            }
          }

          this.isActive = true;
          this.forceStatus = '1';
          loading.dismissAll();
        }
      },
      err => {
          loading.dismissAll();
          this.showTechnicalError();
      });

      //this.folders = myArray;
    }else{
      this.isActive = false; 
      this.forceStatus = '0';
    }
  };

  levelChanged(level,isForce,prevLevel,type){
    this.prevLevel = prevLevel;
    if(isForce == true && prevLevel != level){
      let confirm = this.alertCtrl.create({ 
        message: 'All forced messages for this contact will be moved to the new level selected do you wish to proceed?',
        buttons: [
          {
            text: 'Yes',
            handler: () => {
              this.force_level_changed = '1';
            }
          },
          {
            text: 'No',
            handler: () => { 
              if(type == 'rec'){
                this.reciverSetLevel = prevLevel;
              }
              else{
                this.senderSetLevel = prevLevel;
              }
              this.force_level_changed = '0';
            }
          }
        ]
      });
      confirm.present();
    }
    
    // this.isActive = false;
  }

  getExternalContacts(){
    this.navCtrl.push('ExtcontPage');
  };

  goToManageGroup(){
    if(this.level1 != 'false'){
      let toast = this.toastCtrl.create({
        message: 'Please open level first.',
        duration: 3000,
        cssClass: 'danger',
        position: 'top'
      });
      toast.present();
    }else{
      this.navCtrl.push('EditgroupPage');
    }
  };

  editgroup(item) {
      if(this.level1 == 'true'){
        let toast = this.toastCtrl.create({
            message: 'Please open level first.',
            duration: 3000
        });
        toast.present();
      }else{
        this.navCtrl.push('EditgrpPage', {data: item});
      }
    }

  goToeditGroup(){
    if(this.level1 != 'false'){
      let toast = this.toastCtrl.create({
        message: 'Please open level first.',
        duration: 3000,
        cssClass: 'danger',
        position: 'top'
      });
      toast.present();
    }else{
      this.navCtrl.push('ManagegroupPage');
    }
  };

  showdata(id: number){
    if(this.showDtata[id] == true){
      this.showDtata[id] = false;
    }else{
      this.showDtata[id] = true;
    }

  };
  
  onButtonClick(id : number, item) {
    this.showDtata[id] = false;
    this.done[id] = true; 
    this.buttonClicked[id] = true;
    this.selectedFolder = item.folder;
    if(item.senderId == this.userId){
      this.senderSetLevel = item.senderSetLevel;
      if(item.senderThumb == 'Show'){
        this.isThumbActive = true;
      }else{
        this.isThumbActive = false;
      }
    }else{
      this.reciverSetLevel = item.reciverSetLevel;
      if(item.receiverThumb == 'Show'){
        this.isThumbActive = true;
      }else{
        this.isThumbActive = false;
      }
    }

    this.folders = [];
    if(item.force == true){
      // this.forceStatus = '1';
      this.isActive = true;
      var myArray = this.directory, allowed_levels = [];
      allowed_levels.push('level'+item.senderSetLevel);
      var i;
        for (i = myArray.length - 1; i >= 0; --i) {
        if (allowed_levels.indexOf(myArray[i].name) == -1) {
             myArray.splice(i,1);
         }
      }
      for(i=0;i < myArray.length; i++){
        for(var j=0; j < myArray[i].children.length; j++){
          this.folders.push(myArray[i].children[j])
        }
      }
      this.selectedFolder = item.folder;
      //this.folders = myArray;
    }else{
      this.isActive = false;
      //this.forceStatus = '0';
    }
  };

 

  update(data, level, index){
    data.folder = this.folders.length > 0 ? data.folder : null;
    
    if(level == 0)
    {
      let toast = this.toastCtrl.create({
          message: 'Please set level first.',
          duration: 3000,
          cssClass: 'danger',
          position: 'top'
      });
      toast.present();
    }
    else
    {
      if(this.isActive == false){
        data.folder  = null;
      } 
      var forceBtnClicked = false;
      if(this.isActive == true){
        forceBtnClicked = true;
      }

      var thumb = 'Hide';
      if(this.isThumbActive == true){
        thumb = 'Show';
      }

      if(data.senderId == localStorage.getItem('userinfo')){
        this.updatedata  = {
         'senderSetLevelStatus':'1',
         'senderSetLevel': level,
         'memberId':data.member_id,
         'level' :level,
         'info': level,
         'send':level,
         'index': level,
         'share': level,
         'force': forceBtnClicked,
         'folder': data.folder,
         'thumb': thumb,
         'loginId': localStorage.getItem('userinfo'),
         'force_level_changed': this.force_level_changed,
         'old_level': data.senderSetLevel
        };

        const loading = this.loadingCtrl.create({});
        loading.present();
        return this.ContactserviceProvider.setSenderLevel(this.updatedata)
            .subscribe(data => {
            loading.dismissAll();
              let toast = this.toastCtrl.create({
                  message: 'Contact has been updated successfully.',
                  duration: 3000,
                  cssClass: 'success',
                  position: 'top'
              });
              this.data[index].senderSetLevel = level;
              this.done[this.data[index]._id] = false;
              this.buttonClicked[this.data[index]._id] = false;
              toast.present(); 
              this.getContact();
              this.events.publish('countChanged:changed', '');
              this.countChanged = '1';
              this.force_level_changed = '0';
            },
            err => {
                loading.dismissAll();
                this.showTechnicalError('1');
            });
      }else{
        this.updatedata  = {
          'recevierSetLevelStatus':'1',
          'reciverSetLevel':level,
          'memberId':data.member_id,
          'level' : level,
          'info':level,
          'send': level,
          'index': level,
          'share': level,
          'force': forceBtnClicked,
          'folder':data.folder,
          'thumb': thumb,
          'loginId': localStorage.getItem('userinfo'),
          'force_level_changed': this.force_level_changed,
          'old_level': data.reciverSetLevel
        }
        const loading = this.loadingCtrl.create({});
        loading.present();
        //let body = JSON.stringify(this.updatedata);
       this.ContactserviceProvider.setReceiverLevel(this.updatedata)
              .subscribe(data => {
               loading.dismissAll();
               let toast = this.toastCtrl.create({
                    message: 'Contact has been updated successfully.',
                    duration: 3000,
                    cssClass: 'success',
                    position: 'top'
                  });
                this.data[index].reciverSetLevel = level;
                this.done[this.data[index]._id] = false;
                this.buttonClicked[this.data[index]._id] = false;
                toast.present(); 
                this.getContact();
                this.events.publish('countChanged:changed', '');
                this.countChanged = '1';
                this.force_level_changed = '0';
            },
            err => {
                loading.dismissAll();
                this.showTechnicalError('1');
            });
      }
    }

  };

  getItemsGroup(ev){
    let val = ev.target.value;
    this.searchBoxValue = val;
    var i;
    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.all_groups = this.filteredRecords.filter((item) => {
        console.log(item.name);
        return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }else{
      this.all_groups = this.filteredRecords;
      if(this.selectedFirst != 1){
        for(i = Number(this.all_groups.length - 1); i >= 0; i--){
          if(this.all_groups[i].userLevel == 1){
            this.all_groups.splice(i, 1);
          }
        }
      }

      if(this.selectedSecond != 2){
        for(i = Number(this.all_groups.length - 1); i >= 0; i--){
          if(this.all_groups[i].userLevel == 2){
            this.all_groups.splice(i, 1);
          }
        }
      }

      if(this.selectedthird != 3){
        for(i = Number(this.all_groups.length - 1); i >= 0; i--){
          if(this.all_groups[i].userLevel == 3){
            this.all_groups.splice(i, 1);
          }
        }
      }

      if(this.selectedForth != 4){
        for(i = Number(this.all_groups.length - 1); i >= 0; i--){
          if(this.all_groups[i].userLevel == 4){
            this.all_groups.splice(i, 1);
          }
        }
      }  
    }
  }

  getItems(ev) {
    let val = ev.target.value;
    this.searchBoxValue = val;
    var i;
    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.data = this.allFilteredContacts.filter((item) => {
        return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })


      if(this.selectedFirst != 1){
        for(i = Number(this.data.length - 1); i >= 0; i--){
          if(this.data[i].senderId == this.userId){
            if(this.data[i].senderSetLevel == 1){
              this.data.splice(i, 1);
            }
          }else{
            if(this.data[i].reciverSetLevel == 1){
              this.data.splice(i, 1);
            }
          }
        }
      }

      if(this.selectedSecond != 2){
        for(i = Number(this.data.length - 1); i >= 0; i--){
          if(this.data[i].senderId == this.userId){
            if(this.data[i].senderSetLevel == 2){
              this.data.splice(i, 1);
            }
          }else{
            if(this.data[i].reciverSetLevel == 2){
              this.data.splice(i, 1);
            }
          }
        }
      }

      if(this.selectedthird != 3){
        for(i = Number(this.data.length - 1); i >= 0; i--){
          if(this.data[i].senderId == this.userId){
            if(this.data[i].senderSetLevel == 3){
              this.data.splice(i, 1);
            }
          }else{
            if(this.data[i].reciverSetLevel == 3){
              this.data.splice(i, 1);
            }
          }
        }
      }

      if(this.selectedForth != 4){
        for(i = Number(this.data.length - 1); i >= 0; i--){
          if(this.data[i].senderId == this.userId){
            if(this.data[i].senderSetLevel == 4){
              this.data.splice(i, 1);
            }
          }else{
            if(this.data[i].reciverSetLevel == 4){
              this.data.splice(i, 1);
            }
          }
        }
      }
    }else{
      this.data = this.allFilteredContacts;
      if(this.selectedFirst != 1){
        for(i = Number(this.data.length - 1); i >= 0; i--){
          if(this.data[i].senderId == this.userId){
            if(this.data[i].senderSetLevel == 1){
              this.data.splice(i, 1);
            }
          }else{
            if(this.data[i].reciverSetLevel == 1){
              this.data.splice(i, 1);
            }
          }
        }
      }

      if(this.selectedSecond != 2){
        for(i = Number(this.data.length - 1); i >= 0; i--){
          if(this.data[i].senderId == this.userId){
            if(this.data[i].senderSetLevel == 2){
              this.data.splice(i, 1);
            }
          }else{
            if(this.data[i].reciverSetLevel == 2){
              this.data.splice(i, 1);
            }
          }
        }
      }

      if(this.selectedthird != 3){
        for(i = Number(this.data.length - 1); i >= 0; i--){
          if(this.data[i].senderId == this.userId){
            if(this.data[i].senderSetLevel == 3){
              this.data.splice(i, 1);
            }
          }else{
            if(this.data[i].reciverSetLevel == 3){
              this.data.splice(i, 1);
            }
          }
        }
      }

      if(this.selectedForth != 4){
        for(i = Number(this.data.length - 1); i >= 0; i--){
          if(this.data[i].senderId == this.userId){
            if(this.data[i].senderSetLevel == 4){
              this.data.splice(i, 1);
            }
          }else{
            if(this.data[i].reciverSetLevel == 4){
              this.data.splice(i, 1);
            }
          }
        }
      }
    }
    this.allFilteredContacts = JSON.parse(localStorage.getItem('crecords'))
  };

  goToSmail(){
    this.navCtrl.push('ComposePage', {data: {'selectedGroups':this.selected_groups, 'selectedContacts': this.selectedContacts}});
    // if(this.selected_groups.length > 0 || this.selectedContacts.length > 0){
    //   this.navCtrl.push('ComposePage', {data: {'selectedGroups':this.selected_groups, 'selectedContacts': this.selectedContacts}});
    // }
    // else{
    //   let toast = this.toastCtrl.create({
    //       message: 'Please select atleast one contact or group.',
    //       duration: 3000,
    //       cssClass: 'danger',
    //       position: 'top'
    //   });
    //   toast.present(); 
    // }
  };

  groupListing(){
    const loading = this.loadingCtrl.create({});
    loading.present();
    this.groupservice.getGroupData(this.userId).subscribe(response => {
      loading.dismissAll();
      let alert = this.alertCtrl.create();
      if(response.length == 0){
        alert.setTitle('No Group Created Yet!');
      }else if(this.level1 != 'false'){
        alert.setTitle('Please open level first.');
      }else{
        alert.setTitle('Select Group');
      }
      

      for(var i=0; i < response.length; i++){
        if(this.level1 == 'false' && response[i].userLevel == 1 || this.level2 == 'false' && response[i].userLevel == 2 || this.level3 == 'false' && response[i].userLevel == 3 || this.level4 == 'false' && response[i].userLevel == 4){
            alert.addInput({
              type: 'checkbox',
              label: response[i].name,
              value: response[i],
              checked: false
            });
        }
        
      }

      alert.addButton('Cancel');

      alert.addButton({
        text: 'Okay',
        handler: data => {
          this.testCheckboxOpen = false;
          this.selectedGroups = data;

          for(var j=0; j < data.length; j++){
            for(var i=0; i < this.data.length; i++){
              if(this.data[i]._id == data[j]){
                this.data.splice(i, 1);
              }
            }
          }
        }
      });

      alert.present().then(() => {
        this.testCheckboxOpen = true;
      });

    },
    err => {
        loading.dismissAll();
        this.showTechnicalError('1');
    });
  };

  checkBoxClicked(event, contact){
    if(event.checked == true){
      console.log(contact)
      this.selectedContacts.push(contact);
      this.selectedConIds.push(contact.member_id);
    }else{
      for(var i=0; i < this.selectedContacts.length; i++){
        if(this.selectedContacts[i]._id == contact._id){
          this.selectedContacts.splice(i, 1);
          this.selectedConIds.splice(i, 1);
        }
      }
    }
  };

  root(){
    this.navCtrl.setRoot('DashboardPage');
  };

  myComposePage(){
    this.navCtrl.setRoot(ComposePage);
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