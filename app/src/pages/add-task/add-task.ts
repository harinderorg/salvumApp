import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-add-task',
  templateUrl: 'add-task.html',
})
export class AddTaskPage {
isAdd:any;
data:any;
task:any;
cost:any;
percent:any = '0';
days:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public toastCtrl: ToastController) {
  	this.isAdd = navParams.get('isAdd');
  	this.data = navParams.get('data');
  	if(this.data != undefined){
  		this.task = this.data.task;
  		this.cost = this.data.cost;
  		this.percent = this.data.percent;
  		this.days = this.data.days;
  	}
  }

  ionViewDidLoad() {
    
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  addTask(task,cost,percent,days){
  	if(task == undefined || task == null || task == ''){
  		let toast = this.toastCtrl.create({
	        message: 'Task is required',
	        duration: 1000,
	        position: 'top',
	        cssClass: 'danger'
        });
        toast.present();
  	}
  	else if(cost == undefined || cost == null || cost == ''){
  		let toast = this.toastCtrl.create({
	        message: 'Cost is required',
	        duration: 1000,
	        position: 'top',
	        cssClass: 'danger'
        });
        toast.present();
  	}
  	else if(percent == undefined || percent == null || percent == ''){
  		let toast = this.toastCtrl.create({
	        message: 'Cost is required',
	        duration: 1000,
	        position: 'top',
	        cssClass: 'danger'
        });
        toast.present();
  	}
  	else if(days == undefined || days == null || days == ''){
  		let toast = this.toastCtrl.create({
	        message: 'Days is required',
	        duration: 1000,
	        position: 'top',
	        cssClass: 'danger'
        });
        toast.present();
  	}
  	else{
  		var data = {
  			task : task,
  			cost : cost,
  			percent : percent,
  			days : days
  		}
  		this.viewCtrl.dismiss(data);
  	}
  }

  changeFormat(cost){
    this.cost = this.numberWithCommas(cost);
  }

  numberWithCommas(x) {
    if(x.indexOf('.') == -1){
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'.00';
    }
    else{
      x = x.split(',').join('');
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
  }

}
