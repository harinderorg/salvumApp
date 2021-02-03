import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams , ViewController, AlertController,ToastController,LoadingController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CompanyProvider } from '../../providers/company/company';

@IonicPage()
@Component({
  selector: 'page-addevent',
  templateUrl: 'addevent.html',
  providers: [CompanyProvider, FormBuilder] 
})
export class AddeventPage {
form: FormGroup;
start_date: any;
event_tagline: any;
event_time: any;
tradeId: any;
event_title: any;
event_description: any;
main_page_title: any;
min_date: any;
max_date: any;
all_events_name: any;
trades: any;
isTrade: any;
all_events: any;
  constructor(public navCtrl: NavController, public navParams: NavParams , public viewCtrl: ViewController, public companyProvider: CompanyProvider, public alertCtrl: AlertController, public toastCtrl: ToastController,public loadingCtrl: LoadingController, private formBuilder:FormBuilder) {
    var token;
    this.all_events_name = navParams.get('all_events_name');
    if(navParams.get('isTrade') == '1'){
      this.isTrade = '1';
      this.trades = navParams.get('trades');
      this.all_events = navParams.get('all_events');
      
    }
    if(this.all_events_name == '' || this.all_events_name == null || this.all_events_name == undefined){
      this.all_events_name = [];
    }
  		if(navParams.get('event_id') != undefined)
  		{ 
  			this.main_page_title = 'Edit Event';
  			var event_id = navParams.get('event_id');
        const loading = this.loadingCtrl.create({});
        loading.present();
  			this.companyProvider.CalendarDetails(event_id).subscribe((eventdetail)=>{
          loading.dismissAll();
  				this.start_date = eventdetail.data.start_date;
  				this.event_tagline = eventdetail.data.event_tagline;
  				this.event_time = eventdetail.data.event_time;
          this.tradeId = eventdetail.data.tradeId;
  				this.event_title = eventdetail.data.event_title;
  				this.event_description = eventdetail.data.event_description;
          // token = eve.random;
          this.all_events_name.splice( this.all_events_name.indexOf(this.event_tagline), 1 );
          if(navParams.get('isTrade') == '1'){
            this.get_events_names();
          }
  			},
          err => {
              loading.dismissAll();
              this.showTechnicalError();
          });
  		}
  		else
  		{
  			this.main_page_title = 'Add Event';
  			this.start_date = navParams.get('current_date');
        if(navParams.get('isEdit') == '1'){
          this.main_page_title = 'Add Event';
          var eve = navParams.get('eve');
          this.start_date = eve.start_date;
          this.tradeId = eve.tradeId;
          this.event_tagline = eve.event_tagline;
          this.event_time = eve.event_time;
          this.event_title = eve.event_title;
          this.event_description = eve.event_description;
          token = eve.random; 
        }
  		}

      if(navParams.get('isAdd') == '1'){
        token = Math.floor(Math.random() * 100000);
      }

      this.min_date = this.getToday();
      this.max_date = this.getFullYear() + 30;
  		
      if(this.isTrade == '1'){
        this.form = this.formBuilder.group({
          _id: [null, []],
          start_date: ['', [Validators.required]],
          event_tagline: ['', [Validators.required]],
          event_time: ['', [Validators.required]],
          event_title: ['', [Validators.required]],
          event_description: ['', [Validators.required]],
          tradeId: ['', [Validators.required]],
          random: [token, []]
        });
      }
      else{
        this.form = this.formBuilder.group({
          _id: [null, []],
          start_date: ['', [Validators.required]],
          event_tagline: ['', [Validators.required]],
          event_time: ['', [Validators.required]],
          event_title: ['', [Validators.required]],
          event_description: ['', [Validators.required]],
          random: [token, []]
        });
      }
	  	
  }

  get_events_names(){
    var tradeId = this.tradeId;
    if(this.all_events != ''){
      var all_events_name = [];
      this.all_events.forEach(function(eve){
        if(eve.tradeId == tradeId){
          all_events_name.push(eve.event_tagline);
        }
      });
      this.all_events_name = all_events_name;
      if(this.navParams.get('event_id') != undefined){
        this.all_events_name.splice(this.all_events_name.indexOf(this.event_tagline), 1 );
      }
      console.log(this.all_events_name)
    } 
  }

  getToday(){
   var today,dd,mm = '';
   today = new Date();
   dd = today.getDate();
   mm = today.getMonth()+1; //January is 0!

  var yyyy = today.getFullYear();
  if(dd < '10'){
      dd='0'+dd;
  } 
  if(mm < '10'){
      mm='0'+mm;
  } 
  return today = yyyy+'-'+mm+'-'+dd;
  }

  getFullYear(){
    var today,year = '';
    today = new Date();
    year = today.getFullYear();
    return year; 
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

  dismiss()
  {
  	this.viewCtrl.dismiss();
  }
  addCalendarEvent(){ 
    for (let i in this.form.controls) {
      this.form.controls[i].markAsTouched();
    }
    if(this.form.valid){
      console.log(this.all_events_name)
      if(this.form.value.event_tagline == 'Bid Deadline') {
        if(this.all_events_name.indexOf(this.form.value.event_tagline) >= 0){
          let toast = this.toastCtrl.create({
            message: 'You can add only one bid deadline for this trade.',
            duration: 3000,
            position: 'top',
            cssClass: 'danger'
          });
          toast.present();
        }
        else{
          this.viewCtrl.dismiss(this.form.value);
        }
      }
      else{
        this.viewCtrl.dismiss(this.form.value);
      }
    }
  }
}
