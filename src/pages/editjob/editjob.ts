import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,ViewController, AlertController,ToastController,LoadingController } from 'ionic-angular';
import { CompanyProvider } from '../../providers/company/company';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-editjob',
  templateUrl: 'editjob.html',
  providers: [CompanyProvider, FormBuilder]
})
export class EditjobPage {
job_id : string;
job_number : string;
job_title : string;
companyId : string;
status : string;
companies : any;
privileges : any;
sharedUsers : any;
form: FormGroup;
ses_companyId: any = localStorage.getItem('switched_comp');
  constructor(public navCtrl: NavController, public navParams: NavParams , public viewCtrl: ViewController, public companyProvider: CompanyProvider, public alertCtrl: AlertController, public toastCtrl: ToastController,public loadingCtrl: LoadingController, private formBuilder:FormBuilder) {

  	var userId = localStorage.getItem('userinfo');
    const loading = this.loadingCtrl.create({});
    loading.present();
    this.companyProvider.userCompanyDetails(userId,this.ses_companyId).subscribe((companies)=>{
      this.companies=companies;
    },
    err => {
        loading.dismissAll();
        this.showTechnicalError();
    });

  	var job_id = navParams.get('job_id'); 
  	this.job_id = job_id;

    this.companyProvider.jobDetails(this.job_id).subscribe((jobdetails)=>{
      jobdetails = jobdetails[0];
      this.job_number = jobdetails.job_number;
      this.job_title = jobdetails.job_title;
      this.companyId = jobdetails.companyId;
      this.status = jobdetails.status;
      this.privileges = jobdetails.privileges;
      this.sharedUsers = jobdetails.sharedArr;
      loading.dismissAll();
    },
    err => {
        loading.dismissAll();
        this.showTechnicalError();
    });

    this.form = this.formBuilder.group({
      job_number: ['', [Validators.required]],
      job_title: ['', [Validators.required]],
      companyId: ['', [Validators.required]],
      status: ['', [Validators.required]]
    });

  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad EditjobPage');
  }
 dismiss() {
    this.viewCtrl.dismiss();
  }
  editJob(){
    for (let i in this.form.controls) {
      this.form.controls[i].markAsTouched();
    }
    if(this.form.valid){
      const loading = this.loadingCtrl.create({});
      loading.present();
        this.companyProvider.editJob(this.job_id,this.form.value).subscribe((formdata)=>{
        if(formdata.status == '1')
        {
          loading.dismissAll()
          let toast = this.toastCtrl.create({
              message: 'Job updated successfully.',
              duration: 3000,
              cssClass: 'success',
              position: 'top'
             });
             toast.present(); 
          this.form.reset();
          this.viewCtrl.dismiss('1');
        }
        else if(formdata.status == '2')
        {
          loading.dismissAll()
          let toast = this.toastCtrl.create({
              message: 'Job/PO number already exists.',
              duration: 3000,
              cssClass: 'danger',
              position: 'top'
             });
             toast.present(); 
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

  changeSharedPrivileges(userId,priv)
  {
    const loading = this.loadingCtrl.create({});
      loading.present();
        this.companyProvider.changeSharedPrivileges(this.job_id,userId,priv).subscribe((formdata)=>{
        if(formdata.status == '1')
        {
          loading.dismissAll()
          let toast = this.toastCtrl.create({
              message: 'Information updated successfully.',
              duration: 3000,
              cssClass: 'success',
              position: 'top'
             });
             toast.present(); 
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
