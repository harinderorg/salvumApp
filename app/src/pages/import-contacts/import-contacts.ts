import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ViewController } from 'ionic-angular';
import { CompanyProvider } from '../../providers/company/company';

@IonicPage()
@Component({
  selector: 'page-import-contacts',
  templateUrl: 'import-contacts.html',
  providers: [CompanyProvider]
})
export class ImportContactsPage {
all_contacts:any = [];
APITYPE:any;
constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController,public companyProvider: CompanyProvider,public viewCtrl: ViewController) {
	this.APITYPE = navParams.get('APITYPE');
	this.all_contacts = navParams.get('result_data');
  }

  dismiss()
  {
  	this.viewCtrl.dismiss();
  }


}


  