import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams , AlertController,ToastController,LoadingController } from 'ionic-angular';
import { CompanyProvider } from '../../providers/company/company';

@IonicPage({
  name: 'bidjobs',
  segment: 'bidjobs/:type',
})                                                                                                        
@Component({
  selector: 'page-bidjobs',
  templateUrl: 'bidjobs.html',
  providers: [CompanyProvider] 
})
export class BidjobsPage {
all_invitations : any;
all_awarded : any;
this_all_invitations : any;
this_all_awarded : any;
pageType : any;
userId : string;
timestamp:any;
isBrowser:any;                                                                                            
pre_search:any;
post_search:any;
constructor(public navCtrl: NavController, public navParams: NavParams, public companyProvider: CompanyProvider, public alertCtrl: AlertController, public toastCtrl: ToastController,public loadingCtrl: LoadingController) {
  this.isBrowser = localStorage.getItem('isBrowser');
	this.userId = localStorage.getItem('userinfo');
  var type = navParams.get('type');
  if(type == '1'){
    if(this.userId != undefined && this.userId != null && this.userId != ''){
      this.emailAlert();
    }
    else{
      localStorage.setItem('redirect_after','bidjobs');                                                     
      localStorage.setItem('redirect_id','1');
      let toast = this.toastCtrl.create({
          message: 'Please login to access this page.',
          duration: 3000,
          position: 'top',
          cssClass: 'info'
         });
         toast.present();
    }
    this.pageType = '2';
  }
  else{
    this.pageType = '1';
  }
  var current_date = new Date();
  this.timestamp = current_date.getTime();
  this.getMyBids();
}

getMyBids(){
  const loading = this.loadingCtrl.create({});
  loading.present();
  this.companyProvider.fetchBidJobs(this.userId).subscribe((alljobs)=>{ 
    loading.dismissAll();
    if(alljobs.length > 0)
    {
      var Invitations = [];
      var Awarded = [];
      alljobs.forEach(function(data){
        if(data.isPosted == '1')
        {
          if(data.isAwarded == '1')
          {
            Awarded.push(data);
          }
          else
          {
            Invitations.push(data);
          }
        }
      });
      this.this_all_invitations = Invitations;
      this.all_invitations = Invitations;
      this.this_all_awarded = Awarded;
      this.all_awarded = Awarded;
      console.log(this.all_invitations)
    }
    else
    {
      this.all_invitations = [];
      this.this_all_invitations = [];
      this.all_awarded = [];
      this.this_all_awarded = [];
    }
  },
  err => {
      loading.dismissAll();
      this.showTechnicalError();
  });
}

emailAlert(){
  let confirm = this.alertCtrl.create({
      title: '',
      message: 'Would you like to get job alerts on another secondary email?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            // no clicked
          }
        },
        {
          text: 'Yes',
          handler: () => {
            localStorage.setItem('job_alert_popup','1');
            this.navCtrl.push('ProfilePage');
          }
        }
      ]
    });
    confirm.present();
}

deleteBids(id){
  let confirm = this.alertCtrl.create({
    title: '',
    message: 'Are you sure you want to remove this bid?',
    buttons: [
      {
        text: 'No',
        handler: () => {
          // no clicked
        }
      },
      {
        text: 'Yes',
        handler: () => {
          const loading = this.loadingCtrl.create({});
          loading.present();
          this.companyProvider.removeBids({id:id}).subscribe((result)=>{ 
            loading.dismissAll();
            if(result.status == 1){
              let toast = this.toastCtrl.create({
                message: 'Bid removed successfully.',
                duration: 3000,
                position: 'top',
                cssClass: 'success'
               });
               toast.present();
               this.getMyBids();
            }
            else{
              let toast = this.toastCtrl.create({
                message: 'Error,Plz try later.',
                duration: 3000,
                position: 'top',
                cssClass: 'danger'
               });
               toast.present();
            }
          },
          err => {
              loading.dismissAll();
              this.showTechnicalError();
          });
        }
      }
    ]
  });
  confirm.present();
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
    this.caclHeight();
  }

  caclHeight(){
    var fixed_div = document.getElementById("calc_height_bidjobs"+this.timestamp);
      if(fixed_div != null){
        var fixed_div_height = fixed_div.offsetHeight;
        document.getElementById('fixed_height_bidjobs'+this.timestamp).style.marginTop = fixed_div_height+'px';
      }
  }

getInvitations()
{
  this.pageType = '1';
}

getAwared()
{
  this.pageType = '2';
}

openBiddetailPage(bidJobId,bid_status)
{
this.navCtrl.push('bidding-page', {
bidJobId: bidJobId,
status: bid_status,
});
}
searchInvitations(ev: any) {
      this.all_invitations=this.this_all_invitations
      let val = this.pre_search;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.all_invitations = this.all_invitations.filter((item) => {
          return (item.job_name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }

  }

searchAwarded(ev: any) {
      this.all_awarded=this.this_all_awarded;
      let val = this.post_search;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.all_awarded = this.all_awarded.filter((item) => {
          return (item.job_name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }

  }
  root(){
    this.navCtrl.setRoot('DashboardPage');
  };
  
 }
