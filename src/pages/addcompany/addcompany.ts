import { Component } from '@angular/core';
import { IonicPage,NavController,ModalController,ViewController, NavParams,LoadingController,ToastController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CompanyProvider } from '../../providers/company/company';
@IonicPage()
@Component({
  selector: 'page-addcompany',
  templateUrl: 'addcompany.html',
  providers: [CompanyProvider,FormBuilder]
})
export class AddcompanyPage {
form: FormGroup;
PageType: string;
id: string;
company_name: string;
address: string;
 constructor(public navCtrl: NavController, public modalCtrl: ModalController,public viewCtrl: ViewController, public navParams: NavParams, private formBuilder:FormBuilder, public toastCtrl: ToastController,public loadingCtrl: LoadingController, public companyProvider: CompanyProvider) {
  this.PageType = localStorage.getItem("companyPageType");
  if(this.PageType == 'edit')
  {
    this.form = this.formBuilder.group({
      id: ['', [Validators.required]],
      company_name: ['', [Validators.required]],
      address: ['', [Validators.required]]
    })
    this.id = localStorage.getItem("companyId");
    this.company_name = localStorage.getItem("companyName");
    this.address = localStorage.getItem("companyAddress");
  }
  else
  {
    this.form = this.formBuilder.group({
      company_name: ['', [Validators.required]],
      address: ['', [Validators.required]]
    })
  }
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad AddcompanyPage');
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

  dismiss(status = null) {
    this.viewCtrl.dismiss(status);
  }
  
  addCompany(){
    for (let i in this.form.controls) {
      this.form.controls[i].markAsTouched();
    }
    if(this.form.valid){
      const loading = this.loadingCtrl.create({});
      loading.present();
      var userId = localStorage.getItem('userinfo');
      if(this.PageType == 'add')
      {
        this.companyProvider.addCompany(userId,this.form.value).subscribe((formdata)=>{
        if(formdata.status == '1')
        {
          loading.dismissAll()
          let toast = this.toastCtrl.create({
              message: 'Company added successfully.',
              duration: 3000,
              cssClass: 'success',
              position: 'top'
             });
             toast.present(); 
          this.form.reset();
          this.dismiss('1');
        }
        else if(formdata.status == '2')
        {
          loading.dismissAll()
          let toast = this.toastCtrl.create({
              message: 'Company already exists.',
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
      else
      {
        this.companyProvider.editCompany(this.form.value).subscribe((formdata)=>{
        if(formdata.status == '1')
        {
          loading.dismissAll()
          let toast = this.toastCtrl.create({
              message: 'Company updated successfully.',
              duration: 3000,
              cssClass: 'success',
              position: 'top'
             });
             toast.present(); 
          this.form.reset();
          this.dismiss('1');
        }
        else if(formdata.status == '2')
        {
          loading.dismissAll()
          let toast = this.toastCtrl.create({
              message: 'Company already exists.',
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
  }
}
