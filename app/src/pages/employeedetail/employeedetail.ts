import { Component } from '@angular/core';
import { IonicPage, NavController, ModalController, NavParams, AlertController,ToastController,LoadingController, ViewController } from 'ionic-angular';
import { CompanyProvider } from '../../providers/company/company';

@IonicPage()
@Component({
  selector: 'page-employeedetail',
  templateUrl: 'employeedetail.html',
  providers: [CompanyProvider]
})
export class EmployeedetailPage {
employee_detail:any;
APIURL:any;
all_employees:any;
new_privilege:any;
userId:any;
assocJobs:any = [];
isBrowser = localStorage.getItem('isBrowser');
hide_this:boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public companyProvider: CompanyProvider, public alertCtrl: AlertController, public toastCtrl: ToastController,public loadingCtrl: LoadingController,public viewCtrl: ViewController) {
    this.employee_detail = navParams.get('employeeDetail');
    this.APIURL = localStorage.getItem('APIURL');
    this.userId = localStorage.getItem('userinfo');
    this.getAssocJobs();
  }

  getAssocJobs()
  {
    const loading = this.loadingCtrl.create({});
    loading.present();
    this.companyProvider.associateJobsList(this.employee_detail.toId,this.employee_detail.companyId).subscribe((jobs)=>{
      loading.dismissAll();
      this.assocJobs = jobs;
      if(jobs != '')
      {
        const loading = this.loadingCtrl.create({}); 
        loading.present();
        this.companyProvider.getAllEmployees(this.employee_detail.companyId,this.userId).subscribe((employees)=>{
          this.all_employees=employees;
          loading.dismissAll();
        },
        err => {
            loading.dismissAll();
            this.showTechnicalError();
        });
      }
    },
    err => {
        loading.dismissAll();
        this.showTechnicalError();
    });
  }

  clickPrivilege(privilege)
  {
    this.hide_this = true;
    this.new_privilege = privilege;
  }
  cancelPrivilege()
  {
    this.hide_this = false; 
  }

  viewJobs()
  {
    this.navCtrl.push('ManagejobPage',{
      toId : this.employee_detail.toId,
      isAssociate: '1',
      is_direct : '0',
      companyId: this.employee_detail.companyId
    })
  }

  privilegeChanged(employeeId,privilege)
  {
    const loading = this.loadingCtrl.create({});
    loading.present();
      this.companyProvider.changePrivilegeEmployee(employeeId,privilege).subscribe((updated)=>{
        if(updated.status == 1)
        {
            loading.dismissAll();
            let toast = this.toastCtrl.create({
                message: 'Privilege updated successfully.',
                duration: 3000,
                cssClass: 'success',
                position: 'top'
               });
               toast.present();
               this.employee_detail.privilege = privilege;
               this.cancelPrivilege();
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

  deleteEmployees(employeeId)
  {
    if(this.assocJobs != '')
    {
      let toast = this.toastCtrl.create({
        message: 'Sorry! you cant remove this employee before assigning his jobs to other employee.',
        duration: 3000,
        position: 'top',
        cssClass: 'danger'
       });
       toast.present(); 
    }
    else
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
              this.companyProvider.deleteEmployees(employeeId).subscribe((deleted)=>{
                if(deleted.status == 1)
                {
                    loading.dismissAll();
                    let toast = this.toastCtrl.create({
                        message: 'Employee deleted.',
                        duration: 3000,
                        cssClass: 'success',
                        position: 'top'
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
  }

  assignJobs() {
    let modal = this.modalCtrl.create('AssignjobPage',{
      employees : this.all_employees,
      employeeId : this.employee_detail._id
    });
    modal.onDidDismiss(data => { 
      if(data != undefined && data != null)
      {
        const loading = this.loadingCtrl.create({});
        loading.present();
          this.companyProvider.assignJobAnother(this.employee_detail.toId,this.employee_detail.companyId,data).subscribe((employee)=>{
            if(employee.status == '1')
            {
              loading.dismissAll()
              let toast = this.toastCtrl.create({
                  message: 'Jobs assigned successfully.',
                  duration: 3000,
                  position: 'top',
                  cssClass: 'success'
               });
               toast.present(); 
               this.getAssocJobs();
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
  goToComps(){
    this.navCtrl.push('CompaniesPage');
  };
  backToPage()
  {
    this.viewCtrl.dismiss();
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
