import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-notes',
  templateUrl: 'notes.html',
})
export class NotesPage {
note:any;
bidId:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,public toastCtrl: ToastController) {
  	this.note = navParams.get('note');
  	this.bidId = navParams.get('bidId');
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad NotesPage');
  }

  dismiss(data=null) {
    this.viewCtrl.dismiss(data);
  }

  addNote(){
  	if(this.note != null && this.note != undefined && this.note != ''){
  		this.dismiss({
	  		note : this.note,
	  		bidId : this.bidId
	  	});
  	}
  	else{
  		let toast = this.toastCtrl.create({
            message: 'Please enter notes.',
            duration: 3000,
            position: 'top',
            cssClass: 'danger'
           });
		toast.present(); 
  	}	
  }


}
