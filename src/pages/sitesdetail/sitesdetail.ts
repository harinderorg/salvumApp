import { Component} from '@angular/core';
import { ToastController, IonicPage, NavController, ModalController, NavParams, AlertController} from 'ionic-angular';
import { Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/Rx';
import { ContactserviceProvider } from '../../providers/contactservice/contactservice';

@IonicPage()
@Component({
    selector: 'page-sitesdetail',
    templateUrl: 'sitesdetail.html',
    providers: [ContactserviceProvider]
})
export class SitesdetailPage {
    siteDetail: {};
    newSiteArr: Array < {} > ;
    toggoleShowHide: {}
    isBrowser: any;
    itemCompleted: Boolean = false;
    APIURL:any = localStorage.getItem('APIURL');
    constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public alertCtrl: AlertController, public http: Http, public toastCtrl: ToastController, public contactserviceProvider: ContactserviceProvider) {
        this.http = http;
        this.isBrowser = localStorage.getItem('isBrowser');
    }

    ionViewDidLoad() {
        let other = [];
        this.toggoleShowHide = true;
        if (this.navParams.data._id) {
            localStorage.setItem('siteDetail', JSON.stringify(this.navParams.data));
        }
        this.siteDetail = JSON.parse(localStorage.getItem('siteDetail'));
        other.push(this.siteDetail);
        this.newSiteArr = other;
    }
    presentModal3(myEvent3) {
        let modal = this.modalCtrl.create('AddwebsitePage');
        modal.present({
            ev: myEvent3
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

    itemClicked(value) {
        this.toggoleShowHide = !value;
    }

    recipts(siteId){
        this.navCtrl.push('SiteReciptsPage',{
          siteId : siteId,
          from_detail : '1'
        })
    }

    edit(data) {
	let modal = this.modalCtrl.create('EditsitePage');
        modal.onDidDismiss(callback =>{
        //  this.ngOnInit();'
        });
        modal.present({ 
          ev: data
        });
    };


    showConfirm(item) {
        let confirm = this.alertCtrl.create({
            message: 'Are you sure you want to delete this ?',
            buttons: [{
                    text: 'No',
                    handler: () => {
                        console.log('Disagree clicked');
                    }
                },
                {
                    text: 'Yes',
                    handler: () => {
                        let headers = new Headers({ 'Content-Type': 'application/json' });
                        let options = new RequestOptions({ headers: headers});

                        return this.http.delete(this.APIURL + "/websiteList/" +item._id, options)
                            .map(res => res.json())
                            .subscribe(data => {
                             let toast = this.toastCtrl.create({
                                message: 'Site has been deleted.',
                                duration: 3000
                              });
                              toast.present();
                              this.navCtrl.push('SitesPage', item)
                        },
                        err => {
                            this.showTechnicalError('1');
                        });
                    }
                }]
        });
        confirm.present();
    };

  wallet(){
    this.navCtrl.setRoot('WalletsPage');
  };

  root(){
    this.navCtrl.setRoot('DashboardPage');
  }

  site(){
    this.navCtrl.setRoot('SitesPage');
  }
}