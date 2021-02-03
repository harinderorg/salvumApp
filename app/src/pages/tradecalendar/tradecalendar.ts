import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController,ToastController,LoadingController, ViewController } from 'ionic-angular';
import { CompanyProvider } from '../../providers/company/company';

@IonicPage()
@Component({
  selector: 'page-tradecalendar',
  templateUrl: 'tradecalendar.html',
  providers: [CompanyProvider] 
})
export class TradecalendarPage {
job_id: string;
trade_id: string;
eventSource:any = [];
viewTitle;
my_events:any;
currentDate:any;
all_events_name:any;
all_events:any;
isToday:boolean;
curr_year:any;
allYears:any;
add_disabled: boolean;
isBrowser = localStorage.getItem('isBrowser');
calendar = {
    mode: 'month',
    currentDate: new Date()
};
active_job_breadcrumb = localStorage.getItem('active_job_breadcrumb');
  constructor(public modalCtrl: ModalController, public navCtrl: NavController, public navParams: NavParams, public companyProvider: CompanyProvider, public alertCtrl: AlertController, public toastCtrl: ToastController,public loadingCtrl: LoadingController, private viewCtrl:ViewController) {
    var job_id = navParams.get('job_id'); 
  	var trade_id = navParams.get('trade_id'); 
    this.job_id = job_id; 
    this.trade_id = trade_id; 
    var todatDt = new Date();
    var eventMsg = '0';
    this.initializeCalendar(todatDt,eventMsg);
    this.getAllYears();
        
  }
  initializeCalendar(pickDate,eventMsg)
  {
  	this.companyProvider.getCalendarEvents(this.trade_id,'trades').subscribe((all_events)=>{
      this.all_events = all_events;
        var myDate = pickDate;
        var mnth = myDate.getMonth()+1;
        var dte = myDate.getDate();
        mnth = (mnth+"").length > 1 ? mnth : "0"+mnth;
        dte = (dte+"").length > 1 ? dte : "0"+dte;
        var selectedDate =(myDate.getFullYear() +'-'+ mnth) +'-'+ dte;
        this.currentDate = selectedDate;
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
             message: event.event_description
           });
        });

        this.my_events = my_events;
        this.eventSource = eventSource;
        this.all_events_name = all_events_name;
        if(eventMsg == '1')
        {
        	let toast = this.toastCtrl.create({
            message: 'Event Added.',
            duration: 3000,
            cssClass: 'success',
            position: 'top'
           });
           toast.present(); 
        }
        if(eventMsg == '2')
        {
        	let toast = this.toastCtrl.create({
            message: 'Event Deleted.',
            duration: 3000,
            cssClass: 'danger',
            position: 'top'
           });
           toast.present(); 
        }
        if(eventMsg == '3')
        {
        	let toast = this.toastCtrl.create({
            message: 'Event Updated.',
            duration: 3000,
            cssClass: 'success',
            position: 'top'
           });
           toast.present(); 
        }
    },
    err => {
        this.showTechnicalError('1');
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

  add_new_event(myEvent14) 
   {
    let modal = this.modalCtrl.create('AddeventPage', { current_date: this.currentDate, isAdd : '1', all_events_name: this.all_events_name });
    modal.onDidDismiss(data => {
      if(data != undefined)
      {
        const loading = this.loadingCtrl.create({});
        loading.present();
        var selectedDate = data.start_date;
        this.calendar.currentDate = new Date(selectedDate);

        this.companyProvider.addSingleCalendarEvent(this.job_id,this.trade_id,data).subscribe((formdata)=>{
        	var eventMsg = '1';
          loading.dismissAll();
        	this.initializeCalendar(this.calendar.currentDate,eventMsg);
        },
        err => {
            loading.dismissAll();
            this.showTechnicalError('1');
        });
      }
   });
    modal.present({
      ev: myEvent14
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
        this.currentDate = selectedDate;
        var my_events = [];
        if(this.all_events != '' && this.all_events != undefined)
        {
          this.all_events.forEach(function(event){

            if(selectedDate == event.start_date)
            {
              my_events.push(event); 
            }

          });
        }
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
            cssClass: 'danger',
            position: 'top'
           });
           toast.present(); 
        }
        else
        {
          this.add_disabled = false;
        }
    }
    deleteEvent(event_id)
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
	            this.companyProvider.deleteCalendarEvent(event_id).subscribe((deleted)=>{
	              if(deleted.status == 1)
	              {
	              	  loading.dismissAll();
	                  var eventMsg = '2';
        			  this.initializeCalendar(this.calendar.currentDate,eventMsg);
	              }
	              else
	              {
	                  loading.dismissAll()
	                    let toast = this.toastCtrl.create({
	                        message: 'Error, plz try later.',
	                        duration: 3000,
                          cssClass: 'danger',
                          position: 'top'
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
    editEvent(event,event_id) 
    {
    	let modal = this.modalCtrl.create('AddeventPage', { event_id: event_id, isEdit : '1', eve : event, all_events_name: this.all_events_name });
	    modal.onDidDismiss(data => {
	      if(data != undefined)
	      {
          const loading = this.loadingCtrl.create({});
          loading.present();
	        var selectedDate = data.start_date;
	        this.calendar.currentDate = new Date(selectedDate);

	        this.companyProvider.editCalendarEvent(event_id,data).subscribe((formdata)=>{
	        	var eventMsg = '3';
            loading.dismissAll();
	        	this.initializeCalendar(this.calendar.currentDate,eventMsg);
	        },
          err => {
              loading.dismissAll();
              this.showTechnicalError('1');
          });
	      }
	   });
	    modal.present();
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
        this.viewCtrl.dismiss();
      }

      backToTradeDash()
      {
        this.navCtrl.push('TradeDashboardPage',{
          back : '1'
        });
      }
}
