import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController,ToastController,LoadingController, MenuController, ViewController } from 'ionic-angular';
import { CompanyProvider } from '../../providers/company/company';

@IonicPage()
@Component({
  selector: 'page-trade-dashboard',
  templateUrl: 'trade-dashboard.html',
  providers: [CompanyProvider]
})
export class TradeDashboardPage {
  jobId:string;
  from_smail:any;
  userId:any;
	is_any_trade_posted:any = '0';
  total_contacts:string = '0';
  total_trades:string = '0';
  total_photos:string = '0';
  total_docs:string = '0';
  total_adendums:string = '0';
  total_bids:string = '0';
  total_downloads:string = '0';
  total_contracts:string = '0';
  total_transmittals:string = '0';
  total_smails:string = '0';
  total_emails:string = '0';
  total_rfis:string = '0';
  isBrowser = localStorage.getItem('isBrowser');
  active_job_breadcrumb = localStorage.getItem('active_job_breadcrumb');
  constructor(public modalCtrl: ModalController, public navCtrl: NavController, public navParams: NavParams, public companyProvider: CompanyProvider, public alertCtrl: AlertController, public toastCtrl: ToastController,public loadingCtrl: LoadingController, public menuCtrl: MenuController, public viewCtrl: ViewController ) {
	  this.menuCtrl.enable(true);
    this.jobId = navParams.get('jobId');
    if(this.jobId != undefined){
      if(this.jobId != localStorage.getItem('currentJobId')){
        localStorage.removeItem('saved_filter_list');
        localStorage.removeItem('saved_filter_trades');
        localStorage.removeItem('saved_filter_trade_names');
      }
    }
    this.from_smail = navParams.get('from_smail');
    if(navParams.get('job_title') != undefined){
      localStorage.setItem('active_job_breadcrumb',navParams.get('job_title'));
      this.active_job_breadcrumb = navParams.get('job_title');
    }
    if(navParams.get('back') == '1')
    {
      this.jobId = localStorage.getItem('currentJobId');
    }
    else
    {
      if(this.jobId == undefined)
      {
        var localJobId = localStorage.getItem('currentJobId');
        if(localJobId != '' && localJobId != undefined && localJobId != null){
          this.jobId = localJobId;
        }
        else{
          this.navCtrl.push('ManagejobPage',{
            is_direct : '0'
          });
        }
      }
      else
      {
        localStorage.setItem('currentJobId',this.jobId); 
      } 
    } 

  }

  ionViewDidEnter(){
    this.userId = localStorage.getItem('userinfo');
    this.loadStats();
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

  loadStats()
  {
    const loading = this.loadingCtrl.create({});
    loading.present();
    this.companyProvider.jobDashboard(this.jobId,this.userId).subscribe((dashboard)=>{
      loading.dismissAll();
      this.is_any_trade_posted = dashboard[0].is_any_trade_posted;
      this.total_contacts = dashboard[0].contacts;
      this.total_trades = dashboard[0].trades;
      this.total_photos = dashboard[0].photos;
      this.total_docs = dashboard[0].docs;
      this.total_adendums = dashboard[0].adendums;
      this.total_bids = dashboard[0].bids;
      this.total_downloads = dashboard[0].downloads; 
      this.total_contracts = dashboard[0].contracts; 
      this.total_transmittals = dashboard[0].transmittals; 
      this.total_smails = dashboard[0].smails; 
      this.total_emails = dashboard[0].emails; 
      this.total_rfis = dashboard[0].rfis; 

    },
    err => {
        loading.dismissAll();
        this.showTechnicalError();
    });
  }

  tradeContacts()
  {
    this.navCtrl.push('TradeContactsPage', {jobId : this.jobId});
  }

  goTotrades()
  {
    this.navCtrl.push('TradePage', {job_id : this.jobId});
  }

  goToAdendums()
  {
    this.navCtrl.push('AdendumPage', {jobId : this.jobId});
  }

  goToBids()
  {
    this.navCtrl.push('ViewbidPage', {jobId : this.jobId});
  }

  goToDownloads()
  {
    this.navCtrl.push('DownloadsPage', {jobId : this.jobId});
  }

  goToEmails()
  {
    this.navCtrl.push('RfiMailsPage', {jobId : this.jobId, emails : '1'});
  }

  goToSmails()
  {
    // this.navCtrl.push('SmailInboxPage', {jobId : this.jobId, job_smail : '1'});
    this.navCtrl.push('RfiMailsPage', {jobId : this.jobId, emails : '0'});
  }

  goToContracts()
  {
    this.navCtrl.push('ContractsPage', {jobId : this.jobId});
  }

  goToTransmittals()
  {
    this.navCtrl.push('TransmittalsPage', {jobId : this.jobId});
  }

  goToRFIs()
  {
    this.navCtrl.push('RfisPage', {jobId : this.jobId});
  }

  goToFiles(type)
  {
    this.navCtrl.push('JobphotosPage', {jobId : this.jobId, file_type : type});
  }

  root(){
    this.navCtrl.setRoot('DashboardPage');
  };
  
  goToJobs(){
    this.navCtrl.push('ManagejobPage',{
    is_direct : '0'
    });
  };

  backToSmail(){
    this.navCtrl.push('SmailInboxPage',{
      from_job : '1',
      jobId : this.jobId
    });
  }

}
