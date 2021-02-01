import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-assignjob',
  templateUrl: 'assignjob.html',
})
export class AssignjobPage {
employees:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public toastCtrl: ToastController) {
    var employeeId = navParams.get('employeeId');
    this.employees = navParams.get('employees');
    if(this.employees != '')
    {
      var all_employees = [];
      this.employees.forEach(function(data){
        if(employeeId != data._id)
        {
          all_employees.push(data);
        }
      });
      this.employees = all_employees;
    }
    
  }

  submitResult(employeeId)
  {
    if(employeeId != undefined && employeeId != '')
    {
      this.viewCtrl.dismiss(employeeId);
    }
    else
    {
      let toast = this.toastCtrl.create({
          message: 'Please select employee.',
          duration: 3000,
          position: 'top',
          cssClass: 'danger'
         });
         toast.present(); 
    }
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
