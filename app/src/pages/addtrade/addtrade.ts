import { Component, Input } from '@angular/core';
import { IonicPage, NavController, NavParams  , ModalController, AlertController,ToastController,LoadingController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CompanyProvider } from '../../providers/company/company';
import { FileUploader } from 'ng2-file-upload';

@IonicPage()
@Component({
  selector: 'page-addtrade',
  templateUrl: 'addtrade.html',
  providers: [CompanyProvider, FormBuilder] 
})
export class AddtradePage { 
@Input('whichOne') whichOne;  
public uploader: FileUploader;
uploaderOptions: any;
  pet: string = "basicdetail";
  isAndroid: boolean = false;
  isOther: boolean = false;
  jobdetails : any;
  job_number : string;
  pm_name : string;
  pm_contact : string;
  timestamp : any;
  site_address : string;
  trade_name : string;
  site_city : string;
  site_state : string;
  site_zip : string;
  all_events_name : any;
  userId : string;
  job_title : string; 
  job_id : string; 
  files_tab : string = 'local'; 
  icon_choosed : string = '0'; 
  trade_choosed : string = '1'; 
  filetype_error: any = '0'; 
  filesize_error: any = '0';
  add_disabled: boolean;
  trade_icon:string;
  form: FormGroup;
  all_icons: any = [];
  alls_icons: any = [];
  all_invitees : any;
  all_events : any;
  my_events : any;
  events : any;
  all_codeTypes : any;
  images_types : any;
  reminder_one_month: string;
  reminder_two_weeks: string;
  reminder_one_week: string;
  reminder_three_days: string;
  reminder_one_day: string;
  calendarDate: any = null;
  dte:any;
  mnth:any;
  all_trades:any;
  all_files:any = [];
  // alls_trades:any;
  curr_year:any;
  allYears:any;
  baseUrl:any = localStorage.getItem('baseUrl');
  eventSource : any;
  dateTime:any;
  viewTitle;
  isBrowser:any;
  file_uploader_cats:any;
  isToday:boolean;
  calendar = {
    mode: 'month',
    currentDate: new Date()
  };
  active_job_breadcrumb = localStorage.getItem('active_job_breadcrumb');
  constructor( public modalCtrl: ModalController , public navCtrl: NavController, public navParams: NavParams, public companyProvider: CompanyProvider, public alertCtrl: AlertController, public toastCtrl: ToastController,public loadingCtrl: LoadingController, private formBuilder:FormBuilder) {
    this.dateTime = new Date().getTime();
    this.isBrowser = localStorage.getItem('isBrowser');
    this.reminder_one_month = '0';
    this.reminder_two_weeks = '0';
    this.reminder_one_week = '0';
    this.reminder_three_days = '0';
    this.reminder_one_day = '0';
    this.all_events = [];
    this.all_invitees = [];
    this.all_codeTypes = {
      'C' : 'Contract',
      'S' : 'Specification',
      'D' : 'Drawing',
      'O' : 'Other'
    };
    this.file_uploader_cats = [
      {
        name : 'Bid proposal',
        visible : false,
        required : false
      },
      {
        name : 'AIA Proposal',
        visible : false,
        required : false
      },
      {
        name : 'Supplementary Agreement',
        visible : false,
        required : false
      },
      {
        name : 'Bid breakdown',
        visible : false,
        required : false
      },
      {
        name : 'Trade license',
        visible : false,
        required : false
      },
      {
        name : 'Additional Trade License',
        visible : false,
        required : false
      },
      {
        name : 'Public Works License',
        visible : false,
        required : false
      },
      {
        name : 'State License',
        visible : false,
        required : false
      },
      {
        name : 'Insurance',
        visible : false,
        required : false
      },
      {
        name : 'Workers Comp Insurance',
        visible : false,
        required : false
      },
      {
        name : 'Umbrella Policy',
        visible : false,
        required : false
      },
      {
        name : 'Bid Bond',
        visible : false,
        required : false
      },
      {
        name : 'Bond',
        visible : false,
        required : false
      },
      {
        name : 'Misc.',
        visible : false,
        required : false
      },
      {
        name : 'Total Estimated Cost',
        visible : false,
        required : false
      }
    ];

    var current_date = new Date();
    this.timestamp = current_date.getTime();
      
    this.job_id = navParams.get('job_id');  
    this.userId = localStorage.getItem('userinfo');

    if(this.job_id == undefined)
    {
      var localJobId = localStorage.getItem('currentJobId');
      if(localJobId != '' && localJobId != undefined && localJobId != null){
        this.job_id = localJobId;
      }
      else{
        this.navCtrl.push('ManagejobPage',{
          is_direct : '0'
        });
      }
    }

    // this.job_id = job_id; 
    this.companyProvider.jobDetails(this.job_id).subscribe((jobdetails)=>{
      jobdetails = jobdetails[0];
      this.job_number = jobdetails.job_number;
      this.job_title = jobdetails.job_title;


      this.companyProvider.getTradesList(this.baseUrl).subscribe((all_trades)=>{
      // this.companyProvider.getIonIcons(this.baseUrl).subscribe((all_icons)=>{
      //     var icons = [];
      //     all_icons.forEach(function(icon){
      //       icons.push(icon.icons[0].name);
      //     });
      //     this.all_icons = icons;
      //     this.alls_icons = icons;
        this.all_trades = all_trades;
          this.companyProvider.lastTradeDetails(this.job_id).subscribe((tradedetails)=>{
            if(tradedetails != null)
            {
              this.pm_name = tradedetails.pm_name;
              this.pm_contact = tradedetails.pm_contact;
              this.site_address = tradedetails.site_address;
              this.site_city = tradedetails.site_city;
              this.site_state = tradedetails.site_state;
              this.site_zip = tradedetails.site_zip;
            }
        },
        err => {
            this.showTechnicalError();
        });
      },
      err => {
          this.showTechnicalError();
      });
    },
    err => {
        this.showTechnicalError();
    }); 

    var myDate = new Date();
    this.mnth = myDate.getMonth()+1;
    this.dte = myDate.getDate();
    this.mnth = (this.mnth+"").length > 1 ? this.mnth : "0"+this.mnth;
    this.dte = (this.dte+"").length > 1 ? this.dte : "0"+this.dte;
    var selectedDate =(myDate.getFullYear() +'-'+ this.mnth) +'-'+ this.dte;
    this.calendarDate = selectedDate;

    this.getAllYears();

    this.form = this.formBuilder.group({
      job_title: new FormControl({value: this.job_title, disabled: true}, []),
      job_number: new FormControl({value: this.job_number, disabled: true}, []),
      trade_name: ['', [Validators.required]],
      trade_index: ['', []],
      isOther: ['', []],
      trade_task: ['', []],
      trade_icon: ['', []],
      job_description: ['', []],
      pm_name: ['', []],
      pm_contact: ['', []],
      site_address: ['', []],
      site_city: ['', []],
      site_state: ['', []],
      site_zip: ['', []], 
      userId: ['', []],
      reminder_one_month: ['', []],
      reminder_two_weeks: ['', []],
      reminder_one_week: ['', []],
      reminder_three_days: ['', []],
      reminder_one_day: ['', []],
      curr_year: ['', []],
      visible: ['', []],
      required: ['', []],
      files_tab: ['', []],
      uploader_categories: ['',[]],
      required_uploads: ['',[]]
    });
    var APIURL = localStorage.getItem('APIURL');
    this.uploader  = new FileUploader({
      allowedMimeType: ['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','application/zip','application/octet-stream','text/csv','text/plain', 'text/html','application/vnd.ms-powerpoint','image/vnd.adobe.photoshop', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'video/mp4', 'video/x-msvideo', 'video/quicktime', 'video/x-ms-wmv', 'video/3gpp','application/x-photoshop','application/photoshop','application/psd','image/psd','application/x-zip-compressed','','image/hpgl','application/x-hgl','application/x-hgl','application/vnd.hp-HPGL','application/postscript','application/hgl','application/freelance','zz-application/zz-winassoc-hgl','zz-application/zz-winassoc-HGL','vector/x-hpgl2','image/x-plt','image/plt','application/vnd.hp-HPGL','application/plt','application/x-prn','application/dwf', 'application/x-dwf', 'drawing/x-dwf', 'image/vnd.dwf', 'image/x-dwf','image/tiff','application/acad','image/vnd.dwg','image/x-dwg','application/dxf' , 'application/x-autocad ', 'application/x-dxf' , 'drawing/x-dxf' , 'image/vnd.dxf',' image/x-autocad' , 'image/x-dxf' , 'zz-application/zz-winassoc-dxf','application/vnd.ms-project', 'application/msproj', 'application/x-msproject', 'application/x-ms-project', 'application/x-dos_ms_project', 'application/mpp', 'zz-application/zz-winassoc-mpp','application/x-rar-compressed','multipart/x-zip','application/x-zip','application/x-compress','application/x-compressed','audio/x-musepack','application/x-rar'],
      url: APIURL+'/tradeFilesUpload', 
      itemAlias: 'file',
      maxFileSize: 500*1024*1024
     });

        this.uploader.onBeforeUploadItem = (item) => {
            item.withCredentials = false;
        }

        this.uploader.onWhenAddingFileFailed = (check) => { 
          console.log(check)
              if(check.size > 500*1024*1024){
                this.filesize_error = '1';
              }
              else{
                this.filetype_error = '1';
              }
            }

        this.uploader.onCompleteItem = (item:any, response:any, status:any, headers:any) => { 
          var response = JSON.parse("[" + response + "]"); 
          item.name =  response[0].data.file_name; 
          this.all_files.push(item);
          //   if(response[0].status == '1')
          //   {
          //     console.log(response[0].data.file_name);
          //   }
        };

  }

  // ionViewDidLeave(){
  //   this.navCtrl.pop();
  // }

  form_submit_btn(){
    document.getElementById('form_submit_btn'+this.timestamp).click();
  }

  tradeSelected(index){
    if(index == ''){
      this.trade_icon = '';
    }
    else{
      if(this.all_trades[index].name != 'Others'){
        this.isOther = false;
        this.trade_name = this.all_trades[index].name;
      }
      else{
        this.isOther = true;
        this.trade_name = '';
      }
      this.trade_icon = this.all_trades[index].icon;
    }
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

  getAllYears(){
    var cur_year = new Date().getFullYear();
    this.curr_year = cur_year;
    var last_year = new Date().getFullYear() + 50;
    var i;
    var allYears = [];
    for(i=cur_year; i<=last_year; i++){
      allYears.push(i);
    }
    this.allYears = allYears; 
  }

  goPreviousMonth() {
      this.calendar.currentDate = new Date(this.calendar.currentDate.setMonth(this.calendar.currentDate.getMonth() - 1));
      this.curr_year = this.calendar.currentDate.getFullYear();
    }

    goNextMonth() {
      this.calendar.currentDate = new Date(this.calendar.currentDate.setMonth(this.calendar.currentDate.getMonth() + 1));
      this.curr_year = this.calendar.currentDate.getFullYear();
    }

    goYear(choosed_year) {
      this.calendar.currentDate = new Date(this.calendar.currentDate.setFullYear(choosed_year));
    }

  clickthisone(type)
  { 
    if(this.uploader.queue.length > 0)  
    {
      for(var i=0; i< this.uploader.queue.length; i++){
        if(this.uploader.queue[i]['codeType'] == '0')
        {
          this.uploader.queue[i]['codeType'] = type;
        }  
      }
    }
  }


   presentModal13(myEvent13) 
   {
    let modal = this.modalCtrl.create('SelectattachmentPage');
    modal.present({
      ev: myEvent13
    });
   }
  presentModal14(myEvent14) 
   {
    let modal = this.modalCtrl.create('AddeventPage',{
      current_date : this.calendarDate,
      isAdd : '1',
      all_events_name: this.all_events_name
    });
    modal.onDidDismiss(data => {
      if(data != undefined)
      {
        var selectedDate = data.start_date;
        this.calendar.currentDate = new Date(selectedDate);
        this.all_events.push(data);
        var my_events = [];
        var eventSource = [];
        var all_events_name = [];
        this.all_events.forEach(function(event){

          if(selectedDate == event.start_date)
          {
            my_events.push(event); 
          }
          all_events_name.push(event.event_tagline);
          eventSource.push({
             title: event.event_title,
             startTime: new Date(event.start_date.split('-')[0],(Number(event.start_date.split('-')[1]) - 1),(Number(event.start_date.split('-')[2]))),
             endTime: new Date(event.start_date.split('-')[0],(Number(event.start_date.split('-')[1]) - 1),(Number(event.start_date.split('-')[2]))),
             allDay:true,
             color: 'primary',
             message: event.event_description,
             random: event.random
           });

        });
        this.my_events = my_events;
        this.eventSource = eventSource;
        this.all_events_name = all_events_name;
      }
   });
    modal.present({
      ev: myEvent14
    });
    
}  

editEvent(id,event,indx){
  let modal = this.modalCtrl.create('AddeventPage', { event_id: id, isEdit : '1', eve : event, all_events_name: this.all_events_name });
      modal.onDidDismiss(data => {
        if(data != undefined)
        {
          if(id == null){
            this.my_events[indx] = data;
            var self = this;
            var count = 0;
              this.all_events.forEach(function(eve){
                if(event.random == eve.random){
                  self.all_events[count] = data;
                }
                else{
                  count = count + 1;
                }
              });
              let toast = this.toastCtrl.create({
                message: 'Event updated.',
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

removeFromQueue(file){
  this.all_files.splice(this.all_files.indexOf(file),1);
}

deleteFiles(file,index){
  this.all_files.splice(index,1);
}

filemanagerFiles(fileCode){
  let modal = this.modalCtrl.create('FilemanagerfilesPage',{
    reply_rfi : '1',
    show_file_code : '1',
    fileCode : fileCode
  });
   modal.onDidDismiss(data => {
    if(data != undefined && data != '')
        {       
         var filesArray = [];
         var dateTime = this.dateTime;
         data.forEach(function(single_file){
            var fileobj = {
              file_name : single_file.name,
              name : single_file.name,
              folder_path : localStorage.getItem('filemanager_file_path'),
              random : dateTime,
              codeType : localStorage.getItem('sal_file_code')
            }
            filesArray.push(fileobj);
          });

         if(this.all_files != undefined)
         {
            this.all_files = this.all_files.concat(filesArray);
         }
         else
         {
            this.all_files = filesArray;
         }
         this.companyProvider.addBidFiles(filesArray).subscribe((filesdata)=>{
           console.log('done'); 
         },
          err => {
              this.showTechnicalError('1');
          });
        }
   });
   modal.present();
}

jobFiles(fileCode){
  let modal = this.modalCtrl.create('JobfilesPage',{
    reply_rfi : '1',
    jobId : '0',
    show_file_code : '1',
    fileCode : fileCode
  });
   modal.onDidDismiss(data => {
    if(data != undefined && data != '')
        {       
         var filesArray = [];
         var dateTime = this.dateTime;
         var file_path,file_name;
         data.forEach(function(single_file){
            
            if(single_file.path == undefined)
            {
              file_path = 'directory/jobs_data';
              file_name = single_file.file_name;
            }
            else
            {
              file_path = single_file.path;
              file_name = single_file.name;
            }
            var fileobj = {
              file_name : file_name,
              name : file_name,
              folder_path : file_path,
              random : dateTime,
              codeType : localStorage.getItem('sal_file_code')
            }
            filesArray.push(fileobj);
          });

         if(this.all_files != undefined)
         {
            this.all_files = this.all_files.concat(filesArray);
         }
         else
         {
            this.all_files = filesArray;
         }
         this.companyProvider.addBidFiles(filesArray).subscribe((filesdata)=>{
           console.log('done'); 
         },
          err => {
              this.showTechnicalError('1');
          });
        }
   });
   modal.present();
}

deleteEvents(index){
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
            var event = this.my_events[index];
            this.my_events.splice(index,1);
            this.removeArray(this.all_events,event);
            var new_eventSource = [];
            var all_events_name = [];
            var self = this;
            this.eventSource.forEach(function(eve){
              if(event.random != eve.random){
                new_eventSource.push(eve);
                all_events_name.push(eve.event_tagline);
              }
              else{
                self.removeArray(self.all_events,eve);
              }
            });
            this.eventSource = new_eventSource;
            this.all_events_name = all_events_name;
          }
        }
      ]
    });
    confirm.present();
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

changeBidStatus(index,status)
{
  this.all_invitees[index].bid_status = status;
}

addContactInvites(myEvent14) 
{
  var userId = localStorage.getItem('userinfo'); 
  var already_arr = [];
    if(this.all_invitees.length > 0)
    {
      this.all_invitees.forEach(function(data){
        already_arr.push(data.invite_email);
      });
    }
  let modal = this.modalCtrl.create('ContactslistPage',{already : already_arr});
  modal.onDidDismiss(data => {
    if(data.length != undefined && data.length != 0)
    {
      var returnedArr = [];
      data.forEach(function(contact){
        var new_obj = {
            isMember : '1',
            userId : userId,
            inviteId : contact.userId, 
            invite_email : contact.email,
            status : '1',
            invite_name: '',
            invite_company: '',
            invite_phone: '',
            invite_title: '',
            bid_status: '1'
          }
        returnedArr.push(new_obj); 
      });
      this.all_invitees = this.all_invitees.concat(returnedArr);
    }
  });
  modal.present({
    ev: myEvent14
  });
}

addGroupInvites() 
{
  var userId = localStorage.getItem('userinfo'); 
  var already_arr = [];
    if(this.all_invitees.length > 0)
    {
      this.all_invitees.forEach(function(data){
        already_arr.push(data.invite_email);
      });
    }
  let modal = this.modalCtrl.create('GroupslistPage',{already : already_arr});
  modal.onDidDismiss(data => {
    if(data.length != undefined && data.length != 0)
    {
      var returnedArr = [];
      var returnedEmails = [];
      data.forEach(function(contact){
        if(contact.emails != '')
        {
          var counter = 0;
          contact.emails.forEach(function(email){
            var new_obj = {
              isMember : '1',
              userId : userId,
              inviteId : contact.userIds[counter], 
              invite_email : email,
              status : '1',
              invite_name: '',
              invite_company: '',
              invite_phone: '',
              invite_title: '',
              bid_status: '1'
            }
            counter = counter + 1;

            if(already_arr.indexOf(email) == -1 && returnedEmails.indexOf(email) == -1)
            {
              returnedArr.push(new_obj);
              returnedEmails.push(email);
            }
          })
        } 
      });
      this.all_invitees = this.all_invitees.concat(returnedArr);
    }
  });
  modal.present();
}

addExternalContacts() 
{
  var userId = localStorage.getItem('userinfo'); 
  var already_arr = [];
    if(this.all_invitees.length > 0)
    {
      this.all_invitees.forEach(function(data){
        already_arr.push(data.invite_email);
      });
    }
  let modal = this.modalCtrl.create('ContactslistPage',{already : already_arr, is_external : '1'});
  modal.onDidDismiss(data => {
    if(data.length != undefined && data.length != 0)
    {
      var returnedArr = [];
      data.forEach(function(contact){
        var new_obj = {
            isMember : '0',
            userId : userId,
            inviteId : '0', 
            invite_email : contact.email,
            status : '1',
            invite_name: '',
            invite_company: '',
            invite_phone: '',
            invite_title: '',
            bid_status: '1'
          }
        returnedArr.push(new_obj); 
      });
      this.all_invitees = this.all_invitees.concat(returnedArr);
    }
  });
  modal.present();
}

addContactManually()
  {
    var already_arr = [];
    if(this.all_invitees.length > 0)
    {
      this.all_invitees.forEach(function(data){
        already_arr.push(data.invite_email);
      });
    }
    let modal = this.modalCtrl.create('AddcontactPage',{trade_page:'1',already : already_arr});
      modal.onDidDismiss(data => {
        if(data != null && data != undefined && data != '')
        {
          this.all_invitees = this.all_invitees.concat(data);
          console.log(this.all_invitees)
        }
       });
    modal.present(); 
  }

deleteInvitees(index)
{
  this.all_invitees.splice(index,1);
}

addTrade(){ 
    for (let i in this.form.controls) {
      this.form.controls[i].markAsTouched();
    }
    if(this.form.valid){
      const loading = this.loadingCtrl.create({});
      loading.present();
      this.form.value.uploader_categories = this.file_uploader_cats;
      var required_uploads = [];
      this.form.value.uploader_categories.forEach(function(cat){
        if(cat.visible == true && cat.required == true){
          required_uploads.push(cat.name);
        }
      });
      this.form.value.required_uploads = required_uploads;
        this.companyProvider.addTrade(this.job_id,this.form.value).subscribe((formdata)=>{
        if(formdata.status == '1')
        {
          var current_trade_id = formdata.data._id;
          this.companyProvider.calendarEvents(this.job_id,current_trade_id,this.all_events).subscribe((formdata)=>{
              this.companyProvider.addInviteBidders(this.job_id,current_trade_id,this.all_invitees).subscribe((formdata)=>{
                // upload files 
                if(this.all_files.length > 0) 
                {
                  var filesArray = []; 
                  var file_type = '';
                  var images_types = ['jpg','png','jpeg','gif','bmp']; 
                  this.all_files.forEach(function(single_file){
                      if(images_types.indexOf(single_file.name.split('.').pop()) >= 0)
                      {
                        file_type = '0';
                      }
                      else
                      {
                        file_type = '1';
                      }
                      var fileobj = {
                        file_name : single_file.name.replace(" ","_"),
                        code : single_file.codeType,
                        status : '1',
                        type : file_type,
                        folder_path : (single_file.folder_path != '' && single_file.folder_path != null && single_file.folder_path != undefined) ? single_file.folder_path : '',
                        file_path : 'directory/jobs_data'
                      }
                      filesArray.push(fileobj);
                  });
                  this.companyProvider.addTradeFiles(this.job_id,current_trade_id,filesArray,'temp').subscribe((filesdata)=>{
                      loading.dismissAll()
                      let toast = this.toastCtrl.create({
                          message: 'Trade information has been saved successfully.',
                          duration: 3000,
                          position: 'top',
                          cssClass: 'success'
                         });
                         toast.present(); 
                         //this.navCtrl.pop();
                          this.navCtrl.push('EdittradePage', {  
                            job_id: this.job_id,
                            tradeId: current_trade_id
                          });
                      },
                      err => {
                          loading.dismissAll();
                          this.showTechnicalError('1');
                      });
                }
                else
                {
                  loading.dismissAll()
                  let toast = this.toastCtrl.create({
                      message: 'Trade information has been saved successfully.',
                      duration: 3000,
                      position: 'top',
                      cssClass: 'success'
                     });
                     toast.present(); 
                  // this.form.reset();
                      this.navCtrl.push('EdittradePage', {  
                        job_id: this.job_id,
                        tradeId: current_trade_id
                      });
                }
              },
              err => {
                  loading.dismissAll();
                  this.showTechnicalError('1');
              });  
          },
          err => {
              loading.dismissAll();
              this.showTechnicalError('1');
          });
          
        }
        else if(formdata.status == '2')
        {
          loading.dismissAll()
          let toast = this.toastCtrl.create({
              message: 'Trade Aready Exists.',
              duration: 3000,
              position: 'top',
              cssClass: 'danger'
             });
             toast.present(); 
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
    else
    {
      let toast = this.toastCtrl.create({
        message: 'Trade name is required.',
        duration: 3000,
        position: 'top',
        cssClass: 'danger'
       });
       toast.present();
       this.pet = 'basicdetail';
    }
  }
  


  // loadEvents() {
  //       this.eventSource = this.createRandomEvents();
  //   }

    onViewTitleChanged(title) {
        this.viewTitle = title;
    }

    onEventSelected(event) {
        console.log('Event selected:' + event.startTime + '-' + event.endTime + ',' + event.title);
    }

    changeMode(mode) {
        this.calendar.mode = mode;
    }

    today() {
        this.calendar.currentDate = new Date();
    }

    onTimeSelected(ev) {
        var myDate = ev.selectedTime;
        var mnth = myDate.getMonth()+1;
        var dte = myDate.getDate();
        mnth = (mnth+"").length > 1 ? mnth : "0"+mnth;
        dte = (dte+"").length > 1 ? dte : "0"+dte;
        var selectedDate =(myDate.getFullYear() +'-'+ mnth) +'-'+ dte;
        this.calendarDate = selectedDate;
        var my_events = [];
        this.all_events.forEach(function(event){

          if(selectedDate == event.start_date)
          {
            my_events.push(event); 
          }

        });
        this.my_events = my_events;

    }

    onCurrentDateChanged(event:Date) {
        var today = new Date();
        today.setHours(0, 0, 0, 0);
        event.setHours(0, 0, 0, 0);
        this.isToday = today.getTime() === event.getTime();
        if(event.getTime() < today.getTime())
        {
          this.add_disabled = true;
          let toast = this.toastCtrl.create({
            message: 'Please select future date to add event.',
            duration: 3000,
            position: 'top',
            cssClass: 'danger'
           });
           toast.present(); 
        }
        else
        {
          this.add_disabled = false;
        }
    }
    
    // createRandomEvents() { 
    //     var events = [];
    //     for (var i = 0; i < 10; i += 1) {
    //         var date = new Date();
    //         var eventType = Math.floor(Math.random() * 2);
    //         var startDay = Math.floor(Math.random() * 90) - 45;
    //         var endDay = Math.floor(Math.random() * 2) + startDay;
    //         var startTime;
    //         var endTime;
    //         if (eventType === 0) {
    //             startTime = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + startDay));
    //             if (endDay === startDay) {
    //                 endDay += 1;
    //             }
    //             endTime = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + endDay));
    //             events.push({
    //                 title: 'All Day - ' + i,
    //                 startTime: startTime,
    //                 endTime: endTime,
    //                 allDay: true
    //             });
    //         } else {
    //             var startMinute = Math.floor(Math.random() * 24 * 60);
    //             var endMinute = Math.floor(Math.random() * 180) + startMinute;
    //             startTime = new Date(date.getFullYear(), date.getMonth(), date.getDate() + startDay, 0, date.getMinutes() + startMinute);
    //             endTime = new Date(date.getFullYear(), date.getMonth(), date.getDate() + endDay, 0, date.getMinutes() + endMinute);
    //             events.push({
    //                 title: 'Event - ' + i,
    //                 startTime: startTime,
    //                 endTime: endTime,
    //                 allDay: false
    //             });
    //         }
    //     }
    //     console.log("=======");
    //     console.log(events);
    //     console.log("========");
    //     return events;
    // }

     root(){
        this.navCtrl.setRoot('DashboardPage');
      };
      
      goToJobs(){
        this.navCtrl.push('ManagejobPage',{
        is_direct : '0'
        });
      };

      backToPage()
      {
        this.navCtrl.push('TradePage',{
          job_id : this.job_id
        })
      }

      backToTradeDash()
      {
        this.navCtrl.push('TradeDashboardPage',{
          back : '1'
        });
      }

      getIcons(ev: any) { 
      this.icon_choosed = '0';
      this.all_icons=this.alls_icons;
        let val = ev.target.value;
        if (val && val.trim() != '') {
          this.all_icons = this.all_icons.filter((item) => {
            return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
          })
        }
      }

      // getTrades(ev: any) { 
      // this.trade_choosed = '0';
      // this.all_trades=this.alls_trades;
      //   let val = ev.target.value;
      //   if (val && val.trim() != '') {
      //     this.all_trades = this.all_trades.filter((item) => {
      //       return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
      //     })
      //   }
      // }

      chooseIcon(icon)
      {
        this.trade_icon = icon;
        this.icon_choosed = '1';
      }

      chooseTrade(trade)
      {
        this.trade_name = trade;
        this.trade_choosed = '1';
      }

      closeError(){
        this.filetype_error = '0';
      }
      closeErrorS(){
        this.filesize_error = '0';
      }

      next(){
        if(this.pet == 'basicdetail'){
          this.pet = 'invite';
        }
        else if(this.pet == 'invite'){
          this.pet = 'events';
        }
        else if(this.pet == 'events'){
          this.pet = 'reminder';
        }
      }

      prev(){
        if(this.pet == 'reminder'){
          this.pet = 'events';
        }
        else if(this.pet == 'invite'){
          this.pet = 'basicdetail';
        }
        else if(this.pet == 'events'){
          this.pet = 'invite';
        }
      }


}

