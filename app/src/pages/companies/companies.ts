import { Component } from '@angular/core';
import { IonicPage, NavController, ModalController, NavParams, AlertController,ToastController,LoadingController } from 'ionic-angular'
import { CompanyProvider } from '../../providers/company/company';

@IonicPage()
@Component({
  selector: 'page-companies',
  templateUrl: 'companies.html',
  providers: [CompanyProvider]
})
export class CompaniesPage {
companies:any;
all_companies:any;
isBrowser:any;
userId:any;
companyId:any;
is_access:any;
constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public companyProvider: CompanyProvider, public alertCtrl: AlertController, public toastCtrl: ToastController,public loadingCtrl: LoadingController) {
    this.isBrowser = localStorage.getItem('isBrowser');
    this.userId = localStorage.getItem('userinfo');
    this.companyId = localStorage.getItem('switched_comp');
  }
  ionViewDidEnter()
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
      else{
        this.getCompanies();
      }
    },
    err => {
        loading.dismissAll();
        this.showTechnicalError();
    });
    
  }
  
  getCompanies() {
    const loading = this.loadingCtrl.create({}); 
    loading.present();
    var userId = localStorage.getItem('userinfo');
    this.companyProvider.getActivatedLicenses(userId).subscribe((result)=>{
      if(result.all_license_users.indexOf(userId) >= 0)
      {
        this.is_access = '1';
        // this.companyProvider.userCompaniesList(userId).subscribe((companies)=>{
        //   this.companies=companies;
        //   this.all_companies=companies;
        //   loading.dismissAll()
        // })

        this.companyProvider.userCompanyDetails(userId,this.companyId).subscribe((companies)=>{
          this.companies=companies;
          this.all_companies=companies;
          loading.dismissAll()
        },
        err => {
            loading.dismissAll();
            this.showTechnicalError();
        });
      }
      else{
        loading.dismissAll()
        this.is_access = '0';
      }
    },
    err => {
        loading.dismissAll();
        this.showTechnicalError();
    });
  }
   presentModal5(myEvent5) {
    localStorage.setItem("companyPageType","add");
    localStorage.removeItem("companyId");
    localStorage.removeItem("companyName");
    localStorage.removeItem("companyAddress");
    let modal = this.modalCtrl.create('AddcompanyPage');
    modal.onDidDismiss(data => { 
      if(data == '1'){
        this.getCompanies();
      }
    });
    modal.present({ 
      ev: myEvent5
    });
  }

  editCompanyModal(myEvent5,cid,cname,caddress) {
    localStorage.setItem("companyPageType","edit");
    localStorage.setItem("companyId",cid);
    localStorage.setItem("companyName",cname);
    localStorage.setItem("companyAddress",caddress);
    let modal = this.modalCtrl.create('AddcompanyPage');
    modal.onDidDismiss(data => { 
      if(data == '1'){
        this.getCompanies();
      }
    });
    modal.present({ 
      ev: myEvent5
    });
  }
  openEmployeePage(companyId)
  {
  	this.navCtrl.push('EmployeePage',{
      companyId : companyId
    });
  }

   deleteCompany(companyId) {
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
            this.companyProvider.deleteCompany(companyId).subscribe((deleted)=>{
              if(deleted.status == '1')
              {
                  loading.dismissAll();
                  this.getCompanies();
                  let toast = this.toastCtrl.create({
                      message: 'Company Deleted.',
                      duration: 3000,
                      position: 'top',
                      cssClass: 'success'
                     });
                     toast.present();
              }
              else if(deleted.status == '3')
              {
                  loading.dismissAll()
                    let toast = this.toastCtrl.create({
                        message: 'Sorry! you cant remove this company before deleting associative employees.',
                        duration: 3000,
                        position: 'top',
                        cssClass: 'danger'
                       });
                       toast.present(); 
              }
              else if(deleted.status == '4')
              {
                  loading.dismissAll()
                    let toast = this.toastCtrl.create({
                        message: 'Sorry! you cant remove this company before deleting its jobs.',
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
        }
      ]
    });
    confirm.present();
  }
    getItems(ev: any) {
      this.companies=this.all_companies;
      let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.companies = this.companies.filter((item) => {
        return (item.company_name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
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

  root(){
    this.navCtrl.setRoot('DashboardPage');
  };
  
  goToJobs(){
    this.navCtrl.push('ManagejobPage',{
      is_direct : '0'
    });
  };
}
