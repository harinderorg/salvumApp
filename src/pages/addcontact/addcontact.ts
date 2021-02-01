import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController,ToastController,LoadingController, MenuController, ViewController} from 'ionic-angular';
import { CompanyProvider } from '../../providers/company/company';


@IonicPage()
@Component({
  selector: 'page-addcontact', 
  templateUrl: 'addcontact.html',
  providers: [CompanyProvider]
})
export class AddcontactPage { 
userId : any;
jobId : any;
already : any;
trade_page : any;
alltrades : any;
filterTradeId : any;
invite_name : any;
invite_email : any; 
invite_title : any;
invite_company : any;
isMember : any;
isEdit : any;
tradeId : any;
contactId : any;
coworkerId : any;
show_privilege : any;
invite_phone : any = '';
privilege : any = '0';
isCoworker : any = '0';
unique_id : any = '0';
isMultiple : any;
  constructor(public modalCtrl: ModalController, public navCtrl: NavController, public navParams: NavParams, public companyProvider: CompanyProvider, public alertCtrl: AlertController, public toastCtrl: ToastController,public loadingCtrl: LoadingController, public menuCtrl: MenuController,public viewCtrl: ViewController) {

  		this.userId = localStorage.getItem('userinfo');
      this.jobId = navParams.get('jobId');
      this.trade_page = navParams.get('trade_page');
      this.isEdit = navParams.get('isEdit');
  		this.isMultiple = navParams.get('isMultiple');
      if(this.isEdit == 1){
        var contact = navParams.get('data');
        this.invite_name = contact.invite_name;
        this.invite_email = contact.invite_email;
        this.invite_title = contact.invite_title;
        this.privilege = contact.privilege;
        this.invite_company = contact.invite_company;
        this.invite_phone = contact.invite_phone;
        this.tradeId = contact.tradeId;
        this.isMember = contact.isMember;
        this.contactId = contact._id;
        this.coworkerId = contact.inviteId;
        this.isCoworker = contact.isCoworker;
        this.unique_id = contact.unique_id;
      }
      if(this.trade_page == '1')
      {
        this.filterTradeId = '1';
        this.already = navParams.get('already');
        this.show_privilege = '0';
      }
      else
      {
        this.filterTradeId = localStorage.getItem('filterTradeId');
        if(this.filterTradeId == null || this.filterTradeId == undefined || this.filterTradeId == ''){
          this.filterTradeId = '0';
        }
      }

      this.companyProvider.allTrades(this.jobId).subscribe((alltrades)=>{
        this.alltrades = alltrades;
      },
      err => {
          this.showTechnicalError();
      });
  }

  addContactEvent(invite_name,invite_email,invite_title,invite_company,invite_phone,tradeId,privilege)
  {
    if(invite_name == '' || invite_name == undefined || invite_name == null)
    {
      let toast = this.toastCtrl.create({
          message: 'Please enter name.',
          duration: 3000,
          cssClass: 'danger',
          position: 'top'
         });
         toast.present(); 
    }
    else if(invite_email == undefined || invite_email == '' || invite_email == null)
    {
      let toast = this.toastCtrl.create({
          message: 'Please enter email.',
          duration: 3000,
          cssClass: 'danger',
          position: 'top'
         });
         toast.present(); 
    }
    else
    {
      if(this.filterTradeId == '0')
      {
        if(tradeId == undefined || tradeId == '' || tradeId == null || tradeId == 'null')
        {
          let toast = this.toastCtrl.create({
            message: 'Please select trade.',
            duration: 3000,
            cssClass: 'danger',
            position: 'top'
           });
           toast.present(); 
           return false;
        }
      }
      else
      {
        tradeId = localStorage.getItem('filterTradeId');
      }
      var contactArray = {
        isMember: '0',
          userId: this.userId,
          inviteId: '0',
          status: '0',
          invite_email: invite_email,
          invite_name: invite_name,
          invite_company: invite_company,
          invite_phone: invite_phone,
          invite_title: invite_title,
          privilege: privilege,
          isEdit: this.isEdit,
          contactId: this.contactId,
          tradeId: tradeId,
          is_multi: '1'
      };
      // console.log('tradeId')
      // console.log(tradeId)
      // console.log('tradeId')
      const loading = this.loadingCtrl.create({});
      loading.present();
      this.companyProvider.postData('addInviteBiddersManually/'+this.jobId+'/'+0,contactArray).subscribe((contacts)=>{
        loading.dismissAll() 
            if(contacts.status == '1')
            {
                this.viewCtrl.dismiss('1');
            }
            else if(contacts.status == '0')
            {
              let toast = this.toastCtrl.create({
                message: 'Contact already added.',
                duration: 3000,
                cssClass: 'danger',
                position: 'top'
               });
               toast.present();
            }
            else 
            {
              this.viewCtrl.dismiss('0');
            }
          },
          err => {
              loading.dismissAll();
              this.showTechnicalError('1');
          });
    }
  }

  addContactTrade(invite_name,invite_email,invite_title,invite_company,invite_phone,privilege)
  {
    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
  	if(invite_name == '' || invite_name == undefined || invite_name == null)
    {
      let toast = this.toastCtrl.create({
          message: 'Please enter name.',
          duration: 3000,
          cssClass: 'danger',
          position: 'top'
         });
         toast.present(); 
    }
    else if(invite_email == undefined || invite_email == '' || invite_email == null)
    {
      let toast = this.toastCtrl.create({
          message: 'Please enter email.',
          duration: 3000,
          cssClass: 'danger',
          position: 'top'
         });
         toast.present(); 
    }
    else if(reg.test(invite_email) == false)
  	{
  		let toast = this.toastCtrl.create({
          message: 'Please enter valid email address.',
          duration: 3000,
          cssClass: 'danger',
          position: 'top'
         });
         toast.present(); 
  	}
  	else
  	{
      if(this.already.indexOf(invite_email) >= 0)
      {
        let toast = this.toastCtrl.create({
          message: 'Contact already added.',
          duration: 3000,
          cssClass: 'danger',
          position: 'top'
         });
         toast.present(); 
         return false;
      }
  		var contactArray = {
  			  _id : null,
          isMember: '0',
	        userId: this.userId,
	        inviteId: '0',
	        status: '1',
	        invite_email: invite_email,
	        invite_name: invite_name,
	        invite_company: invite_company,
	        invite_phone: invite_phone,
          invite_title: invite_title,
	        privilege: privilege,
          bid_status: '1'
  		};
      this.viewCtrl.dismiss(contactArray);
  		
  	}
  }

  editContactTrade(privilege,tradeId){
    if(privilege == undefined || privilege == null || privilege == ''){
      let toast = this.toastCtrl.create({
          message: 'Privilege is required.',
          duration: 3000,
          cssClass: 'danger',
          position: 'top'
         });
         toast.present();
    }
    else if(tradeId == undefined || tradeId == null || tradeId == '' || tradeId == 'null'){
      let toast = this.toastCtrl.create({
          message: 'Please select trade.',
          duration: 3000,
          cssClass: 'danger',
          position: 'top'
         });
         toast.present();
    }
    else{
      var contactArray = {
          invite_email: this.invite_email,
          invite_name: this.invite_name,
          invite_company: this.invite_company,
          invite_phone: this.invite_phone,
          invite_title: this.invite_title,
          privilege: privilege,
          isEdit: this.isEdit,
          contactId: this.contactId,
          tradeId: tradeId,
          is_multi : '1'
      };
      const loading = this.loadingCtrl.create({});
      loading.present();
      if(this.isCoworker == '1'){
        this.companyProvider.editCoworkers({jobId:this.jobId,tradeId:tradeId,privilege:privilege,unique_id:this.unique_id}).subscribe((contacts)=>{
          loading.dismissAll() 
            if(contacts.status == '1'){
              this.viewCtrl.dismiss('1');
            }
            else{
              let toast = this.toastCtrl.create({
                message: 'Error,Plz try later.',
                duration: 3000,
                cssClass: 'danger',
                position: 'top'
               });
               toast.present(); 
            }
        });
      }
      else{
        this.companyProvider.postData('addInviteBiddersManually/'+this.jobId+'/'+0,contactArray).subscribe((contacts)=>{
          loading.dismissAll() 
            if(contacts.status == '1'){
              this.viewCtrl.dismiss('1');
            }
            else{
              let toast = this.toastCtrl.create({
                message: 'Error,Plz try later.',
                duration: 3000,
                cssClass: 'danger',
                position: 'top'
               });
               toast.present(); 
            }
        });
      }
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

  dismiss()
  {
  	this.viewCtrl.dismiss();
  }

}
