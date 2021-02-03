import { Component } from '@angular/core';
import { IonicPage, NavController, ModalController, NavParams, AlertController,ToastController,LoadingController } from 'ionic-angular';
import { CompanyProvider } from '../../providers/company/company';

@IonicPage()
@Component({
  selector: 'page-employee',
  templateUrl: 'employee.html',
  providers: [CompanyProvider]
})
export class EmployeePage {
employees:any;
all_employees:any;
userId:any;
APIURL:any;
companyId:any;
all_members:any = [];
isBrowser = localStorage.getItem('isBrowser');
 constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public companyProvider: CompanyProvider, public alertCtrl: AlertController, public toastCtrl: ToastController,public loadingCtrl: LoadingController) {
   	this.userId = localStorage.getItem('userinfo');
   	this.APIURL = localStorage.getItem('APIURL');
   	this.companyId = navParams.get('companyId');
  }

  ionViewDidEnter(){
  	this.getEmployees();
  }

  getEmployees(){
  	const loading = this.loadingCtrl.create({}); 
    loading.present();
    this.companyProvider.getAllEmployees(this.companyId,this.userId).subscribe((employees)=>{
      this.employees=employees;
      this.all_employees=employees;
      loading.dismissAll()
    },
    err => {
        loading.dismissAll();
        this.showTechnicalError();
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

  setTiming(employeeId,timing){
    let modal = this.modalCtrl.create('TimingPage',{
      employeeId : employeeId,
      timing : timing
    });
    modal.onDidDismiss(data => { 
      if(data == '1'){
        let toast = this.toastCtrl.create({
            message: 'Timing updated successfully.',
            duration: 3000,
            position: 'top',
            cssClass: 'success'
         });
         toast.present(); 
         this.getEmployees();
      }
    });
    modal.present();
  }

  addEmploy(){
  	var userId = this.userId;
  	var companyId = this.companyId;
  	var to_userName = localStorage.getItem('userName');
  	var baseUrl = localStorage.getItem('baseUrl');
  	var already = [];
  	this.all_employees.forEach(function(emp){
  		already.push(emp.employee_email);
  	})
  	let modal = this.modalCtrl.create('PaidContactsPage',{
  		already : already
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
			            fromId : userId,
			            toId : contact.userId, 
			            companyId : companyId,
			            email : contact.email,
			            to_userName : to_userName,
			            from_userName : contact.name,
			            baseUrl : baseUrl
			          }
			        returnedArr.push(new_obj); 
			      });
			      this.companyProvider.addAssociateEmployees(returnedArr).subscribe((employee)=>{
				      if(employee.status == '1')
				      {
				      	loading.dismissAll()
				      	let toast = this.toastCtrl.create({
                    message: 'Employees added successfully.',
                    duration: 3000,
                    position: 'top',
                    cssClass: 'success'
                 });
                 toast.present(); 
                 this.getEmployees();
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

  viewEmployees(employeeDetail){
  	this.navCtrl.push('EmployeedetailPage',{
  		employeeDetail : employeeDetail
  	});
  }

  deleteEmployees(employeeId){
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
                  this.getEmployees();
                  let toast = this.toastCtrl.create({
                      message: 'Employee deleted.',
                      duration: 3000,
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
      this.employees=this.all_employees
      let val = ev.target.value;
      if (val && val.trim() != '') {
        this.employees = this.employees.filter((item) => {
          return (item.employee_name.toLowerCase().indexOf(val.toLowerCase()) > -1);
        })
      }
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
  
}
