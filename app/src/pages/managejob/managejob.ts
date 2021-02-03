import { Component } from '@angular/core';
import { IonicPage, NavController, ModalController , ViewController, NavParams, AlertController,ToastController,LoadingController} from 'ionic-angular';
import { CompanyProvider } from '../../providers/company/company';

@IonicPage()
@Component({ 
  selector: 'page-managejob',
  templateUrl: 'managejob.html',
  providers: [CompanyProvider] 
})
export class ManagejobPage{
jobs:any;
all_jobs:any;
timestamp:any;
userId:string;
jobstree:any;
isAssociate:any;
file_path:any;
fixed_div_height:any;
toId:any;
companyId:any;
ses_companyId:any;
selected_jobs:any = [];
all_shared_jobs:any = [];
order: string = '_id';
reverse: boolean = true;
filter_by : string = '0';
filter_by_status : string = '-1';
isBrowser = localStorage.getItem('isBrowser');
  constructor(public modalCtrl: ModalController ,public viewCtrl: ViewController,  public navCtrl: NavController, public navParams: NavParams, public companyProvider: CompanyProvider, public alertCtrl: AlertController, public toastCtrl: ToastController,public loadingCtrl: LoadingController) {
	  var current_date = new Date();
    this.timestamp = current_date.getTime();
    this.userId = localStorage.getItem('userinfo');
    this.ses_companyId = localStorage.getItem('switched_comp');
    this.isAssociate = navParams.get('isAssociate');
    if(navParams.get('is_direct') == '0')
    {
      if(this.isAssociate == '1')
      {
        this.toId = navParams.get('toId');
        this.companyId = navParams.get('companyId');
        this.getAssociateJobs();
      }
      else
      {
        this.getJobs();
      }
    }
    else
    {
      const loading = this.loadingCtrl.create({});
      loading.present();
      this.companyProvider.getUserCurrentSubscription(this.userId).subscribe((subscription)=>{  
        if(subscription.amount == '0' && subscription.is_activated_license == '0')
        {
          let toast = this.toastCtrl.create({
              message: 'Access denied, Please upgrade your subscription or add license.',
              duration: 3000,
              position: 'top',
              cssClass: 'info'
             });
             toast.present(); 
             loading.dismissAll();
             this.navCtrl.setRoot('DashboardPage');
        }
        else
        {
          loading.dismissAll();
          if(this.isAssociate == '1')
          {
            this.toId = navParams.get('toId');
            this.companyId = navParams.get('companyId');
            this.getAssociateJobs();
          }
          else
          {
            this.getJobs();
          }
        }
      },
      err => {
          loading.dismissAll();
          this.showTechnicalError();
      });
    }
    if(localStorage.getItem('job_alert_popup_on_job') == '1'){
      let confirm = this.alertCtrl.create({
        title: '',
        message: 'Would you like to get job alerts on another secondary email?',
        buttons: [
          {
            text: 'No',
            handler: () => {
              localStorage.removeItem('job_alert_popup_on_job');
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

  ionViewDidLoad(){
    var fixed_div = document.getElementById("calc_height"+this.timestamp);
    if(fixed_div != null){
      this.fixed_div_height = fixed_div.offsetHeight;
      document.getElementById('custom_height'+this.timestamp).style.marginTop = this.fixed_div_height+'px';
    }
  }

  getJobs() {
    const loading = this.loadingCtrl.create({});
    loading.present();

    // this.companyProvider.getAllJobs(this.userId).subscribe((jobs)=>{
    this.companyProvider.myJobsList(this.userId,this.ses_companyId).subscribe((jobs)=>{
      loading.dismissAll();
      this.jobs=jobs;
      this.all_jobs=jobs;
      this.ionViewDidLoad();
    },
    err => {
        loading.dismissAll();
        this.showTechnicalError();
    });
  } 
  getAssociateJobs() {
    const loading = this.loadingCtrl.create({});
    loading.present();

    this.companyProvider.associateJobsList(this.toId,this.companyId).subscribe((jobs)=>{
      loading.dismissAll();
      this.jobs=jobs;
      this.all_jobs=jobs;
    },
    err => {
        loading.dismissAll();
        this.showTechnicalError();
    });
  } 

  // presentModal(myEvent11) {
  //   let modal = this.modalCtrl.create('AddjobPage');
  //   modal.onDidDismiss(data => { 
  //     if(data == '1'){
  //       this.getJobs();
  //     }
  //   });
  //   modal.present({
  //     ev: myEvent11
  //   });
  // }

  addJob(){
    this.navCtrl.push('AddjobPage');
  }

  openBidjobsPage(){
    this.navCtrl.push('bidjobs', {
      type: '0'
    });
  }

  openManageCompanyPage() {
  	this.navCtrl.push('CompaniesPage');
  }
  getItems(ev: any) {
      this.jobs=this.all_jobs;
      let val = ev.target.value;
        if (val && val.trim() != '') {
          this.jobs = this.jobs.filter((item) => {
            return (item.job_title.toLowerCase().indexOf(val.toLowerCase()) > -1);
          })
        }
  }

  deleteJob(jobId) {
    let confirm = this.alertCtrl.create({
      title: 'Are you sure?',
      message: 'It will delete all trades and other data associated with these jobs.',
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
            this.companyProvider.deleteJobs({jobId : jobId}).subscribe((deleted)=>{
              if(deleted.status == 1)
              {
                loading.dismissAll();
                let toast = this.toastCtrl.create({
                    message: 'Jobs Deleted.',
                    duration: 3000,
                    position: 'top',
                    cssClass: 'success'
                   });
                   toast.present(); 
                   this.selected_jobs = [];
                   this.getJobs();
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

  openClose(jobId,status) {
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
            this.companyProvider.openCloseJobs({jobId : jobId},status).subscribe((deleted)=>{
              if(deleted.status == 1)
              {
                loading.dismissAll();
                let toast = this.toastCtrl.create({
                    message: 'Jobs Updated Successfully.',
                    duration: 3000,
                    position: 'top',
                    cssClass: 'success'
                   });
                   toast.present(); 
                   this.selected_jobs = [];
                   this.getJobs();
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

  editJob(jobId) {
    this.navCtrl.push('TradePage', {
    job_id: jobId,
    only_view : '1'
  });
  }

  jobCalendar(jobId) {
    this.navCtrl.push('JobcalendarPage', {
    job_id: jobId
  });
  }

  tradeDashboard(jobId,job_title){
    localStorage.setItem('active_job_breadcrumb',job_title);
    this.navCtrl.push('TradeDashboardPage', {jobId : jobId});
  }

  editJobPage(myEvent11,job_id) {
    let modal = this.modalCtrl.create('EditjobPage', { job_id: job_id });
    modal.onDidDismiss(data => {
        if(data == '1')
        {
          this.getJobs();
        }
     });
    modal.present({
      ev: myEvent11
    });
  }

  root(){
    this.navCtrl.setRoot('DashboardPage');
  };

  insertToArray(event,jobId){
    if(event.target.checked == true)
    {
      this.selected_jobs.push(jobId);
    }
    else
    {
      this.removeArray(this.selected_jobs, jobId);
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

  deleteMultipleJobs(){
    if(this.selected_jobs.length > 0)
    {
       this.deleteJob(this.selected_jobs);
    }
    else
    {
      let toast = this.toastCtrl.create({
        message: 'Please Select Atleast One Job.',
        duration: 3000,
        position: 'top',
        cssClass: 'info'
       });
       toast.present(); 
    }
  }

  openCloseJobs(status){
    if(this.selected_jobs.length > 0)
    {
       this.openClose(this.selected_jobs,status);
    }
    else
    {
      let toast = this.toastCtrl.create({
        message: 'Please Select Atleast One Job.',
        duration: 3000,
        position: 'top',
        cssClass: 'info'
       });
       toast.present(); 
    }
  }

  shareJobs(jobId,job_number,job_title,companyId){
    var userName = localStorage.getItem('userName');
    var already = [];
    this.all_shared_jobs.forEach(function(share){
      already.push(share.user_email);
    })
    let modal = this.modalCtrl.create('ShareJobContactsPage',{
      already : already,
      companyId : companyId
    });
    modal.onDidDismiss(data => { 
      if(data != undefined && data != null)
      {
        if(data.length > 0)
        {
          const loading = this.loadingCtrl.create({});
          loading.present();
          var returnedArr = [];
            data.forEach(function(contact){
              var new_obj = {
                  fromId : localStorage.getItem('userinfo'),
                  jobId : jobId,
                  privilege : contact.privilege, 
                  userId : contact.userId,
                  to_email : contact.email,
                  to_name : contact.name,
                  from_user : userName,
                  job_number : job_number,
                  job_title : job_title,
                  companyId : companyId
                }
              returnedArr.push(new_obj); 
            });
            this.companyProvider.shareJobs(returnedArr).subscribe((shared)=>{
              if(shared.status == '1')
              {
                loading.dismissAll()
                let toast = this.toastCtrl.create({
                      message: 'Job shared successfully.',
                      duration: 3000,
                      position: 'top',
                      cssClass: 'success'
                   });
                   toast.present(); 
                   this.getJobs();
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
    });
    modal.present();
  }

  jobFilter(value,type){
    if(type == '1'){
      if(value == '0'){
        this.order = '_id';
        this.reverse = true;  
      }
      if(value == 'date_asc' || value == 'date_desc'){
        this.order = 'date_created';
        this.reverse = value == 'date_asc' ? false : true;
      }
      if(value == 'po_asc' || value == 'po_desc'){
        this.order = 'job_number';
        this.reverse = value == 'po_asc' ? false : true;
      }
      if(value == 'alpha_asc' || value == 'alpha_desc'){
        this.order = 'job_title';
        this.reverse = value == 'alpha_asc' ? false : true;
      }
    }

    if(type == 'status'){
      if(value == '-1'){
        this.jobs = this.all_jobs;
        this.order = '_id';
        this.reverse = true;
      }
      else{
        if(this.all_jobs != ''){
          var filterd_jobs = [];
          this.all_jobs.forEach(function(job){
            if(job.status == value){
              filterd_jobs.push(job);
            }
          });
          this.jobs = filterd_jobs;
        }
      }
    }
  }
  
} 