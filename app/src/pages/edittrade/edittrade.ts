import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams  , ModalController, AlertController,ToastController,LoadingController, ViewController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CompanyProvider } from '../../providers/company/company';
import { FileUploader } from 'ng2-file-upload';

@IonicPage()
@Component({
  selector: 'page-edittrade',
  templateUrl: 'edittrade.html',
  providers: [CompanyProvider, FormBuilder] 
})
export class EdittradePage { 
public uploader: FileUploader;
uploaderOptions: any;
public hasBaseDropZoneOver:boolean = false;
  pet: string = "basicdetail";
  isAndroid: boolean = false;
  tradedetails : any;
  from_bids : any;
  jobdetails : any;
  job_number : string;
  job_number1 : string;
  job_title1 : string; 
  job_title : string; 
  trade_icon:string;
  icon_choosed : string = '1';
  filetype_error: any = '0'; 
  filesize_error: any = '0';
  job_id : string; 
  tradeId : string; 
  files_tab : string = 'local';
  // all_icons: any = [];
  // alls_icons: any = [];
  add_disabled: boolean;
  isOther: boolean;
  all_trades:any;
  form: FormGroup;
  all_invitees : any;
  timestamp : any;
  all_events : any;
  all_events_name : any;
  my_events : any;
  all_files : any;
  all_sel_files : any [];
  events : any;
  baseUrl : any;
  all_codeTypes : any;
  showPost : boolean;
  images_types : any;
  reminder_one_month: string;
  reminder_two_weeks: string;
  reminder_one_week: string;
  reminder_three_days: string;
  reminder_one_day: string;
  trade_name: string;
  trade_index: any;
  trade_task: string;
  job_description: string;
  pm_name: string;
  pm_contact: string;
  site_address: string;
  site_city: string;
  site_state: string;
  site_zip: string;
  calendarDate: any = null;
  dte:any;
  mnth:any;
  dateTime:any;
  curr_year:any;
  allYears:any;
  file_uploader_cats : any;
  eventSource : any;
  viewTitle;
  isToday:boolean;
  calendar = {
    mode: 'month',
    currentDate: new Date()
  };
  isBrowser = localStorage.getItem('isBrowser');
  active_job_breadcrumb = localStorage.getItem('active_job_breadcrumb');

  constructor( public modalCtrl: ModalController , public navCtrl: NavController, public navParams: NavParams, public companyProvider: CompanyProvider, public alertCtrl: AlertController, public toastCtrl: ToastController,public loadingCtrl: LoadingController, private formBuilder:FormBuilder, private viewCtrl:ViewController) {    
    
    this.job_id = navParams.get('job_id'); 
    this.tradeId = navParams.get('tradeId'); 
    this.from_bids = navParams.get('from_bids'); 

    var current_date = new Date();
    this.timestamp = current_date.getTime();
    this.dateTime = new Date().getTime();
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
    if(this.tradeId == undefined){
      // this.backToPage();
      this.tradeId = localStorage.getItem('sel_trade_edit_id');
    }
    else{
      localStorage.setItem('sel_trade_edit_id',this.tradeId);
    }
    this.baseUrl = localStorage.getItem('baseUrl');
    this.showPost = true;
    this.all_codeTypes = {
      'C' : 'Contract',
      'S' : 'Specification',
      'D' : 'Drawing',
      'O' : 'Other'
    };

    // get job details
    this.companyProvider.jobDetails(this.job_id).subscribe((jobdetails)=>{
      jobdetails = jobdetails[0];
      this.job_number = jobdetails.job_number;
      this.job_number1 = jobdetails.job_number;
      this.job_title = jobdetails.job_title;
      this.job_title1 = jobdetails.job_title;
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

    // if(navParams.get('isEdit') == '1')
    // {
    //   this.showPost = false;
    // }

    
    this.form = this.formBuilder.group({
        job_title1: new FormControl({value: this.job_title, disabled: true}, []),
        job_title: ['', []], 
        job_number1: new FormControl({value: this.job_number, disabled: true}, []),
        job_number: ['', []],
        trade_index: ['', []],
        isOther: ['', []],
        trade_name: ['', [Validators.required]],
        trade_task: ['', [Validators.required]],
        trade_icon: ['', [Validators.required]],
        job_description: ['', [Validators.required]],
        pm_name: ['', [Validators.required]],
        pm_contact: ['', [Validators.required]],
        site_address: ['', [Validators.required]],
        site_city: ['', [Validators.required]],
        site_state: ['', [Validators.required]],
        site_zip: ['', [Validators.required]], 
        reminder_one_month: ['', []],
        reminder_two_weeks: ['', []],
        reminder_one_week: ['', []],
        reminder_three_days: ['', []],
        reminder_one_day: ['', []],
        baseUrl: ['', []],
        curr_year: ['', []],
        visible: ['', []],
        required: ['', []],
        files_tab: ['', []],
        uploader_categories: ['',[]],
        required_uploads: ['',[]]
      });
    this.initialize();
    // this.form.valueChanges.subscribe(() => {
    //    console.log('working.....')
    //  });

    var APIURL = localStorage.getItem('APIURL');
    this.uploader  = new FileUploader({
      url: APIURL+'/editTradeFilesUpload/'+this.job_id+'/'+this.tradeId, 
      allowedMimeType: ['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','application/zip','application/octet-stream','text/csv','text/plain', 'text/html','application/vnd.ms-powerpoint','image/vnd.adobe.photoshop', 'video/mp4', 'video/x-msvideo', 'video/quicktime', 'video/x-ms-wmv', 'video/3gpp','application/vnd.openxmlformats-officedocument.presentationml.presentation','application/x-photoshop','application/photoshop','application/psd','image/psd','application/x-zip-compressed','','image/hpgl','application/x-hgl','application/x-hgl','application/vnd.hp-HPGL','application/postscript','application/hgl','application/freelance','zz-application/zz-winassoc-hgl','zz-application/zz-winassoc-HGL','vector/x-hpgl2','image/x-plt','image/plt','application/vnd.hp-HPGL','application/plt','application/x-prn','application/dwf', 'application/x-dwf', 'drawing/x-dwf', 'image/vnd.dwf', 'image/x-dwf','image/tiff','application/acad','image/vnd.dwg','image/x-dwg','application/dxf' , 'application/x-autocad ', 'application/x-dxf' , 'drawing/x-dxf' , 'image/vnd.dxf',' image/x-autocad' , 'image/x-dxf' , 'zz-application/zz-winassoc-dxf','application/vnd.ms-project', 'application/msproj', 'application/x-msproject', 'application/x-ms-project', 'application/x-dos_ms_project', 'application/mpp', 'zz-application/zz-winassoc-mpp','application/x-rar-compressed','multipart/x-zip','application/x-zip','application/x-compress','application/x-compressed','audio/x-musepack','application/x-rar'],
      itemAlias: 'file',
      maxFileSize: 500*1024*1024
     });
       
      this.uploader.onBuildItemForm = (item, form) => {
        form.append('codeType', item.codeType);
      };

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
        this.getTradeFiles();    
        let toast = this.toastCtrl.create({
        message: 'File Uploaded.',
        duration: 1000,
        position: 'top',
        cssClass: 'success'
        });
        toast.present();            
      };

  }

  closeErrorS(){
    this.filesize_error = '0';
  }

  tradeSelected(index){
    if(index == '' && index != 0){
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

  submit_edit_frm(){
    document.getElementById('submit_edit_frm'+this.timestamp).click();
  }

  initialize()
  {
    const loading = this.loadingCtrl.create({});
      loading.present(); 
      // get trade details
      this.companyProvider.tradeDetails(this.tradeId).subscribe((tradedetails)=>{
        this.trade_name = tradedetails.trade_name;
        this.isOther = tradedetails.isOther;
        this.trade_task = tradedetails.trade_task;
        this.trade_icon = tradedetails.trade_icon;
        this.job_description = tradedetails.job_description;
        this.pm_name = tradedetails.pm_name;
        this.pm_contact = tradedetails.pm_contact;
        this.site_address = tradedetails.site_address;
        this.site_city = tradedetails.site_city;
        this.site_state = tradedetails.site_state;
        this.site_zip = tradedetails.site_zip;
        this.reminder_one_month = tradedetails.reminder_one_month;
        this.reminder_two_weeks = tradedetails.reminder_two_weeks;
        this.reminder_one_week = tradedetails.reminder_one_week;
        this.reminder_three_days = tradedetails.reminder_three_days;
        this.reminder_one_day = tradedetails.reminder_one_day;
        this.file_uploader_cats = tradedetails.uploader_categories;
        
      // load all icons
      this.companyProvider.getTradesList(this.baseUrl).subscribe((all_trades)=>{
            // var icons = [];
            // all_icons.forEach(function(icon){
            //   icons.push(icon.icons[0].name);
            // });
            // this.all_icons = icons;
            // this.alls_icons = icons;
            this.all_trades = all_trades;
            if(this.isOther == true){
              this.trade_index = this.all_trades.length - 1;
              this.tradeSelected(this.all_trades.length - 1);
              this.trade_name = tradedetails.trade_name;
            }
            else{
              var count = 0;
              var self = this;
              this.all_trades.forEach(function(icon){
                if(icon.name == self.trade_name){
                  self.trade_index = count;
                  self.tradeSelected(count);
                  count = count + 1;
                }
                else{
                  count = count + 1;
                }
              })
            }
        },
      err => {
          this.showTechnicalError();
      });
      },
      err => {
          loading.dismissAll();
          this.showTechnicalError();
      });
      // get calendar events
      this.companyProvider.getCalendarEvents(this.tradeId,'trades').subscribe((tradeEvents)=>{
        this.all_events = tradeEvents;
        var calendarDate = this.calendarDate;
        var my_events = [];
        var eventSource = [];
        var eventNames = [];
        if(this.all_events != '')
        {
          this.all_events.forEach(function(event){

            if(calendarDate == event.start_date)
            {
              my_events.push(event); 
            }
            eventSource.push({
               title: event.event_title,
               startTime: new Date(event.start_date.split('-')[0],(Number(event.start_date.split('-')[1]) - 1),(Number(event.start_date.split('-')[2]) )),
               endTime: new Date(event.start_date.split('-')[0],(Number(event.start_date.split('-')[1]) - 1),(Number(event.start_date.split('-')[2]))),
               allDay:true,
               color: 'primary',
               message: event.event_description
             });
            eventNames.push(event.event_tagline);
          });

          this.my_events = my_events;
          this.eventSource = eventSource;
          this.all_events_name = eventNames;
        }
      },
      err => {
          this.showTechnicalError();
      });
      // get invited contacts
      this.companyProvider.tradeInvities(this.tradeId).subscribe((tradeInvities)=>{
        this.all_invitees = tradeInvities;
      },
      err => {
          this.showTechnicalError();
      });
      // get trade files
      this.companyProvider.getTradeFiles(this.tradeId).subscribe((tradeFiles)=>{
        this.all_files = tradeFiles;
        loading.dismissAll();
      },
      err => {
          loading.dismissAll();
          this.showTechnicalError();
      });
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
          this.showPost = false;
        }  
      }
    }
  }

  getTradeFiles()
  {
    // get trade files
    this.companyProvider.getTradeFiles(this.tradeId).subscribe((tradeFiles)=>{
      this.all_files = tradeFiles;
    },
    err => {
        this.showTechnicalError();
    });
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
           this.all_sel_files = filesArray;
           this.companyProvider.addBidFiles(filesArray).subscribe((filesdata)=>{
             console.log('done'); 
             this.uploadFilesInTrade();
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

           this.all_sel_files = filesArray;
           this.companyProvider.addBidFiles(filesArray).subscribe((filesdata)=>{
             this.uploadFilesInTrade();
           },
            err => {
                this.showTechnicalError('1');
            });
          }
     });
     modal.present();
  }

  uploadFilesInTrade(){
    var filesArray = []; 
    var file_type = '';
    var images_types = ['jpg','png','jpeg','gif','bmp']; 
    this.all_sel_files.forEach(function(single_file){
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
          folder_path : single_file.folder_path,
          file_path : 'directory/jobs_data'
        }
        filesArray.push(fileobj);
    });
    this.companyProvider.addTradeFiles(this.job_id,this.tradeId,filesArray,'temp').subscribe((filesdata)=>{
      this.all_sel_files = [];
      this.getTradeFiles();    
    });
  }

  addEvents(myEvent14) 
   {
    let modal = this.modalCtrl.create('AddeventPage',{
      current_date : this.calendarDate,
      isAdd : '1',
      all_events_name: this.all_events_name
    });
    modal.onDidDismiss(data => {
      if(data != undefined)
      {
        this.showPost = false;
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
  let modal = this.modalCtrl.create('ContactslistPage', {already : already_arr});
  modal.onDidDismiss(data => {
    if(data != null)
    {
      if(data.length != undefined && data.length != 0)
      {
        this.showPost = false;
        var returnedArr = [];
        data.forEach(function(contact){
          var new_obj = {
              _id : null,
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
          this.showPost = false;
          this.all_invitees = this.all_invitees.concat(data);
        }
       });
    modal.present(); 
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
          else{
            const loading = this.loadingCtrl.create({});
            loading.present();
            var selectedDate = data.start_date;
            this.calendar.currentDate = new Date(selectedDate);

            this.companyProvider.editCalendarEvent(id,data).subscribe((formdata)=>{
              loading.dismissAll();
              this.my_events[indx] = data;
              this.my_events[indx]._id = id;
              var self = this;
              var count = 0;
                this.all_events.forEach(function(eve){
                  if(event.random == eve.random){
                    self.all_events[count] = data;
                    self.all_events[count]._id = id;
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

deleteEvents(id,event,indx)
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
            if(id == null)
            {
              this.removeArray(this.all_events, event);
              this.removeArray(this.all_events_name, event.event_tagline);
              this.my_events.splice(indx,1);
              var new_eventSource = [];
              var self = this;
              this.eventSource.forEach(function(eve){
                if(event.random != eve.random){
                  new_eventSource.push(eve);
                }
                else{
                  self.removeArray(self.all_events,eve);
                }
              });
              this.eventSource = new_eventSource;
              let toast = this.toastCtrl.create({
                message: 'Event removed.',
                duration: 3000,
                position : 'top',
                cssClass: 'success'
               });
               toast.present(); 
            }
            else
            {
              const loading = this.loadingCtrl.create({});
              loading.present();
              this.companyProvider.deleteCalendarEvent(id).subscribe((deleted)=>{
                if(deleted.status == 1)
                {
                  loading.dismissAll()
                  this.removeArray(this.all_events, event);
                  this.removeArray(this.all_events_name, event.event_tagline);
                  this.my_events.splice(indx,1);
                  var new_eventSource = [];
                  var self = this;
                  this.eventSource.forEach(function(eve){
                    if(event.random != eve.random){
                      new_eventSource.push(eve);
                    }
                    else{
                      self.removeArray(self.all_events,eve);
                    }
                  });
                  this.eventSource = new_eventSource;
                  let toast = this.toastCtrl.create({
                      message: 'Event removed.',
                      duration: 3000,
                      position : 'top',
                      cssClass: 'success'
                     });
                     toast.present(); 
                }
                else
                {
                  loading.dismissAll()
                  let toast = this.toastCtrl.create({
                      message: 'Error, plz try later.',
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

deleteInvitees(index,id)
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
            if(id == null)
            {
              this.all_invitees.splice(index,1);
              let toast = this.toastCtrl.create({
                message: 'Contact removed.',
                duration: 3000,
                position : 'top',
                cssClass: 'success'
               });
               toast.present(); 
            }
            else
            {
              const loading = this.loadingCtrl.create({});
              loading.present();
              this.companyProvider.deleteBidders(id).subscribe((deleted)=>{
                if(deleted.status == 1)
                {
                      loading.dismissAll()
                      this.all_invitees.splice(index,1);
                      let toast = this.toastCtrl.create({
                          message: 'Contact removed.',
                          duration: 3000,
                          position : 'top',
                          cssClass: 'success'
                         });
                         toast.present(); 
                }
                else
                {
                    loading.dismissAll()
                      let toast = this.toastCtrl.create({
                          message: 'Error, plz try later.',
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
        }
      ]
    });
    confirm.present();
}

changeBidStatus(index,id,status)
{
  if(id == null)
  {
    this.all_invitees[index].bid_status = status;
    let toast = this.toastCtrl.create({
      message: 'Contact updated.',
      duration: 3000,
      position : 'top',
      cssClass: 'success'
     });
     toast.present(); 
  }
  else
  {
    const loading = this.loadingCtrl.create({});
    loading.present();
    this.companyProvider.updateBidStatus(id,status).subscribe((updated)=>{
      if(updated.status == 1)
      {
            loading.dismissAll()
            this.all_invitees[index].bid_status = status;
            let toast = this.toastCtrl.create({
                message: 'Contact updated.',
                duration: 3000,
                position : 'top',
                cssClass: 'success'
               });
               toast.present(); 
      }
      else
      {
          loading.dismissAll()
            let toast = this.toastCtrl.create({
                message: 'Error, plz try later.',
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

deleteFiles(index,id)
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
            if(id == null)
            {
              this.all_files.splice(index,1);
              let toast = this.toastCtrl.create({
                message: 'File removed.',
                duration: 3000,
                position : 'top',
                cssClass: 'success'
               });
               toast.present(); 
            }
            else
            {
              const loading = this.loadingCtrl.create({});
              loading.present();
              this.companyProvider.deleteTradeFiles(id).subscribe((deleted)=>{
                if(deleted.status == 1)
                {
                  loading.dismissAll()
                  this.all_files.splice(index,1);
                  let toast = this.toastCtrl.create({
                      message: 'File removed.',
                      duration: 3000,
                      position : 'top',
                      cssClass: 'success'
                     });
                     toast.present(); 
                }
                else
                {
                  loading.dismissAll()
                    let toast = this.toastCtrl.create({
                        message: 'Error, plz try later.',
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
        }
      ]
    });
    confirm.present();
}

saveTrade()
{
  this.callEditTrade('0');
}

editTrade(isPosted = '1'){ 
    for (let i in this.form.controls) {
      this.form.controls[i].markAsTouched();
    }
    if(this.form.valid){
      if(this.all_invitees.length == 0){
        let toast = this.toastCtrl.create({
          message: 'Please assign atleast one bidder to post a job.',
          duration: 3000,
          position: 'top',
          cssClass: 'danger'
         });
        toast.present();
      }
      else{
        this.callEditTrade(isPosted);
      }
    }
    else
    {
      let toast = this.toastCtrl.create({
        message: 'Please fill all the required fields.',
        duration: 3000,
        position: 'top',
        cssClass: 'danger'
       });
       toast.present();
    }
  }

  callEditTrade(isPosted)
  {
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
      this.companyProvider.editTrade(this.job_id,this.tradeId,isPosted,this.form.value).subscribe((formdata)=>{
      if(formdata.status == '1')
      {
        this.showPost = true;
        var toastMsg = isPosted == '1' ? 'Trade information posted successfully.' : 'Trade information saved successfully.';
        var current_trade_id = this.tradeId;
        this.companyProvider.updateCalendarEvent(this.job_id,current_trade_id,this.all_events).subscribe((formdata)=>{
            this.companyProvider.editInviteBidders(this.job_id,current_trade_id,this.all_invitees).subscribe((formdata)=>{
              loading.dismissAll()
                let toast = this.toastCtrl.create({
                    message: toastMsg,
                    duration: 3000,
                    position: 'top',
                    cssClass: 'success'
                   });
                   toast.present(); 
                   if(isPosted == '1')
                   {
                    // job notification
                    this.companyProvider.jobNotifications(current_trade_id,this.form.value).subscribe((notis)=>{
                        if(localStorage.getItem('is_wizard') == '1'){
                          let confirm = this.alertCtrl.create({
                            title: 'Would you like to add another trade?',
                            message: '',
                            buttons: [
                              {
                                text: 'No',
                                handler: () => {
                                  localStorage.setItem('is_wizard','0');
                                  this.navCtrl.push('TradePage', {  
                                    job_id: this.job_id
                                  });
                                }
                              },
                              {
                                text: 'Yes',
                                handler: () => {
                                  this.navCtrl.push('AddtradePage', {job_id : this.job_id});
                                }
                              }
                            ]
                          });
                          confirm.present();
                        }
                        else{
                          this.navCtrl.push('TradePage', {  
                            job_id: this.job_id
                          });
                        }
                    });
                   }
                   else
                   {
                      this.initialize();
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
            message: 'Trade already exists.',
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
    deleteTrade(tradeId) {
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
            this.companyProvider.deleteTrades(tradeId).subscribe((deleted)=>{
              if(deleted.status == 1)
              {
                  loading.dismissAll()
                  let toast = this.toastCtrl.create({
                      message: 'Trade deleted.',
                      duration: 3000,
                      position: 'top',
                      cssClass: 'success'
                     });
                     toast.present();
                     this.viewCtrl.dismiss();
                   
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
        this.navCtrl.push('TradePage', {
          job_id: this.job_id
        });
      }

      backToBids()
      {
        this.navCtrl.push('ViewbidPage', {
          job_id: this.job_id
        });
      }

      backToTradeDash()
      {
        this.navCtrl.push('TradeDashboardPage',{
          back : '1'
        });
      }
      closeBtn()
      {
        if(localStorage.getItem('is_wizard') == '1'){
          let confirm = this.alertCtrl.create({
            title: 'Would you like to add another trade?',
            message: '',
            buttons: [
              {
                text: 'No',
                handler: () => {
                  localStorage.setItem('is_wizard','0');
                  this.navCtrl.push('TradePage', {
                    job_id: this.job_id
                  });
                }
              },
              {
                text: 'Yes',
                handler: () => {
                  this.navCtrl.push('AddtradePage', {job_id : this.job_id});
                }
              }
            ]
          });
          confirm.present();
        }
        else{
          this.navCtrl.push('TradePage', {
            job_id: this.job_id
          });
        }
      }
      formChanged()
      {
        this.showPost = false;
      }
      // getIcons(ev: any) { 
      // this.icon_choosed = '0';
      // this.all_icons=this.alls_icons;
      //   let val = ev.target.value;
      //   if (val && val.trim() != '') {
      //     this.all_icons = this.all_icons.filter((item) => {
      //       return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
      //     })
      //   }
      // }
      chooseIcon(icon)
      {
        this.trade_icon = icon;
        this.icon_choosed = '1';
      }

      closeError(){
        this.filetype_error = '0';
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

      isVisible(event,index){
        this.showPost = false;
        if(event.checked == true){
          this.file_uploader_cats[index].visible = true;
        }
        else{
          this.file_uploader_cats[index].visible = false;
        }
      }

      isRequired(event,index){
        this.showPost = false;
        if(event.checked == true){
          this.file_uploader_cats[index].required = true;
        }
        else{
          this.file_uploader_cats[index].required = false;
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
    
}

