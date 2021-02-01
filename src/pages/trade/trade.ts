import { Component} from '@angular/core';
import { IonicPage, NavController, NavParams  , ModalController, AlertController,ToastController,LoadingController, ViewController } from 'ionic-angular';
import { CompanyProvider } from '../../providers/company/company';

@IonicPage()
@Component({
  selector: 'page-trade',
  templateUrl: 'trade.html',
  providers: [CompanyProvider] 
})
export class TradePage {
alltrades:any;
all_trades:any;
timestamp:any;
job_id:string;
jobstree:any;
file_path:any;
only_view:any;
selected_trades:any = [];
isBrowser = localStorage.getItem('isBrowser');
active_job_breadcrumb = localStorage.getItem('active_job_breadcrumb');
  constructor(public modalCtrl: ModalController ,  public navCtrl: NavController, public navParams: NavParams, public companyProvider: CompanyProvider, public alertCtrl: AlertController, public toastCtrl: ToastController,public loadingCtrl: LoadingController,public viewCtrl: ViewController) {
    var current_date = new Date();
    this.timestamp = current_date.getTime();
    this.job_id = navParams.get('job_id'); 
    this.only_view = navParams.get('only_view'); 
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
  }

  ionViewDidEnter(){
    this.getTrades();
  }

  ionViewDidLoad(){
    this.caclHeight();
  }

  caclHeight(){
    var fixed_div = document.getElementById("calc_height_trades"+this.timestamp);
      if(fixed_div != null){
        var fixed_div_height = fixed_div.offsetHeight;
        document.getElementById('fixed_height_trades'+this.timestamp).style.marginTop = fixed_div_height+'px';
      }
  }

  getTrades()
  {
    const loading = this.loadingCtrl.create({});
      loading.present();
      this.companyProvider.allTrades(this.job_id).subscribe((alltrades)=>{
        this.alltrades = alltrades;
        this.all_trades = alltrades;
        loading.dismissAll();
      },
      err => {
          loading.dismissAll();
          this.showTechnicalError();
      });
  }
   editJobPage(myEvent11,job_id) 
   {
    let modal = this.modalCtrl.create('EditjobPage', { job_id: this.job_id });
    modal.onDidDismiss(data => { 
      this.getTrades();
    });
    modal.present({
      ev: myEvent11
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

addTradePage(job_id) {
    this.navCtrl.push('AddtradePage', {
    job_id: job_id
  });
  }
deleteTrade(tradeId) {
    let confirm = this.alertCtrl.create({
      title: 'Are you sure?',
      message: 'It will delete all data related to this trade.',
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
            this.companyProvider.deleteTrades({tradeId : tradeId}).subscribe((deleted)=>{
              if(deleted.status == 1)
              {
                loading.dismissAll()
                let toast = this.toastCtrl.create({
                    message: 'Trades deleted.',
                    duration: 3000,
                    position: 'top',
                    cssClass: 'success'
                   });
                   toast.present();
                   this.getTrades();
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
  getItems(ev: any) {
      this.alltrades = this.all_trades;
      let val = ev.target.value;

      if (val && val.trim() != '') {
        this.alltrades = this.alltrades.filter((item) => {
          return (item.trade_name.toLowerCase().indexOf(val.toLowerCase()) > -1);
        })
      }
  }
  tradeCalendar(tradeId) {
    this.navCtrl.push('TradecalendarPage', {
    job_id: this.job_id,
    trade_id: tradeId
  });
  }
  jobCalendar(jobId) {
    this.navCtrl.push('JobcalendarPage', {
    job_id: jobId,
    from: 'trade'
  });
  }

  insertToArray(event,jobId){
    if(event.target.checked == true)
    {
      this.selected_trades.push(jobId);
    }
    else
    {
      this.removeArray(this.selected_trades, jobId);
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

  deleteMultipleTrades()
  {
    if(this.selected_trades.length > 0)
    {
       this.deleteTrade(this.selected_trades);
    }
    else
    {
      let toast = this.toastCtrl.create({
        message: 'Please Select Atleast One Trade.',
        duration: 3000,
        position: 'top',
        cssClass: 'danger'
       });
       toast.present(); 
    }
  }

  EditTrade(tradeId)
  {
    this.navCtrl.push('EdittradePage', {tradeId : tradeId, job_id : this.job_id, isEdit : '1'})
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
    this.navCtrl.push('TradeDashboardPage',{
      jobId : this.job_id
    })
  }
}
