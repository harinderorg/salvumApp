import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, ViewController } from 'ionic-angular';
import { CompanyProvider } from '../../providers/company/company';

@IonicPage()
@Component({
  selector: 'page-add-coworkers',
  templateUrl: 'add-coworkers.html',
  providers: [CompanyProvider]
})
export class AddCoworkersPage {
all_employees:any;
companyId: any = localStorage.getItem('switched_comp');
userId: any = localStorage.getItem('userinfo');
selected_contacts:any = [];
jobId:any;
already:any;
alltrades:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController,public loadingCtrl: LoadingController, public companyProvider: CompanyProvider, public viewCtrl: ViewController) {
  	this.jobId = navParams.get('jobId');
  	this.already = navParams.get('already');
  	console.log(this.already)
  }

  ionViewDidLoad() {
   	this.getExistingEmployees();
   	this.getAllTrades();
  }

  getAllTrades(){
	this.companyProvider.allTrades(this.jobId).subscribe((alltrades)=>{
	    this.alltrades = alltrades;
	},
	err => {
		this.alltrades = [];
	    this.showTechnicalError();
	});
  }

  getExistingEmployees(){
  	var self = this;
    const loading = this.loadingCtrl.create({}); 
    loading.present();
    var all_employees = [];
    var loginId = this.userId;
    this.companyProvider.getAllEmployees(this.companyId,this.userId).subscribe((employees)=>{
      this.all_employees=employees;
      
      if(this.all_employees != ''){
        this.all_employees.forEach(function(emp){
          if(emp.status == 1 && emp.fromId != emp.toId){
          	var userId = (loginId == emp.fromId) ? emp.toId : emp.fromId;
	          	if(self.already.indexOf(userId) == -1){
	          		var obj = {
		              name : emp.employee_name,
		              userId : userId,
		              email : emp.employee_email,
		              privilege : 0
		            }
		            all_employees.push(obj);
	          	}
          	}
        });
      }
      this.all_employees = all_employees;
      console.log(this.all_employees)
      loading.dismissAll();
    },
    err => {
        loading.dismissAll();
        this.showTechnicalError();
    });
  }

    addCoworkers(tradeId){
    	// if(tradeId == '' || tradeId == undefined || tradeId == null){
    	// 	let toast = this.toastCtrl.create({
     //            message: 'Please select trade',
     //            duration: 3000,
     //            position: 'top',
     //            cssClass: 'danger'
     //        });
     //        toast.present();
    	// }
    	// else{
		    const loading = this.loadingCtrl.create({});
		    loading.present();
		    var coArr=[];
		    this.selected_contacts.forEach(function(contact){
		    	// tradeId.forEach(function(trade_id){
		    		coArr.push({
				        userId : contact.userId,
				        privilege : contact.privilege,
				        tradeId : (tradeId == '' || tradeId == undefined || tradeId == null) ? 0 : tradeId,
				        unique_id : Math.floor(Math.random() * 100000)
				    }); 
		    	// });
		    });
		    console.log(coArr);

		    this.companyProvider.addCoworkers({coworkers : coArr, jobId : this.jobId}).subscribe((employee)=>{
		        if(employee.status == '1'){
		          loading.dismissAll()
		          let toast = this.toastCtrl.create({
		              message: 'Co-workers added successfully.',
		              duration: 3000,
		              position: 'top',
		              cssClass: 'success'
		           });
		           toast.present(); 
		           this.dismiss('1');
		        }
		        else{
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
		// }
  	}

    insertContactToArray(event,contact){
  		if(event.checked == true){
  			this.selected_contacts.push(contact);
  		}
  		else{
  			this.removeArray(this.selected_contacts, contact);
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

	dismiss(data = null){
		this.viewCtrl.dismiss(data);
	}

}
