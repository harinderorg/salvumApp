import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-action-items',
  templateUrl: 'action-items.html',
})
export class ActionItemsPage {
action_items:any;
  constructor(public viewCtrl: ViewController,public navCtrl: NavController, public navParams: NavParams) {
  	this.action_items = navParams.get('action_items');
  }

  dismiss(){
	  this.viewCtrl.dismiss();
	}

}
