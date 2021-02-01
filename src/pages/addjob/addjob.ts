import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController,ViewController, NavParams, AlertController,ToastController,LoadingController, ModalController } from 'ionic-angular';
import { CompanyProvider } from '../../providers/company/company';
import * as CryptoJS from 'crypto-js';
// import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Validators } from '@angular/forms';

@IonicPage()
@Component({  
  selector: 'page-addjob',
  templateUrl: 'addjob.html',
  providers: [CompanyProvider]
})
export class AddjobPage implements OnInit{
timestamp:any;
job_number:any;
job_title:any;
fixed_div_height:any;
companies:any;
all_employees:any;
already:any = [];
// form: FormGroup;
step:any = '1';
isSkip : Boolean = false;
isLast : Boolean = false;
companyId: any = localStorage.getItem('switched_comp');
new_jobId:any;
userId:any;
cowerkers:any = [];
roles:any = [];
enable_level1:any;
enable_level2:any;
enable_level3:any;
enable_level4:any;
allowed_levels:any;
all_emps:any;
validators:any;
errorMessages:any;
all_contacts:any = [];
// all_roles:any = [];
 constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public companyProvider: CompanyProvider, public alertCtrl: AlertController, public toastCtrl: ToastController,public loadingCtrl: LoadingController, public modalCtrl: ModalController) {
    var current_date = new Date();
    this.timestamp = current_date.getTime();
    this.userId = localStorage.getItem('userinfo');
  	// this.form = this.formBuilder.group({
   //    job_number: ['', [Validators.required]],
   //    job_title: ['', [Validators.required]],
   //    company_id: ['', [Validators.required]]
   //  })
    this.validators = [Validators.required, Validators.pattern('[A-Za-z0-9._%+-]{3,}@[a-zA-Z]{3,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})')];
    this.errorMessages = {
      pattern : 'Please enter valid email address.'
    }
  }
   ngOnInit()
  	{
	    // var userId = localStorage.getItem('userinfo');
	    // this.companyProvider.userCompanyDetails(userId,this.companyId).subscribe((companies)=>{
	    //   this.companies=companies;
	    // },
     //  err => {
     //      this.showTechnicalError();
     //  });
      this.getExistingEmployees();
  	}

  ionViewDidLoad() {
    var fixed_div = document.getElementById("calc_height"+this.timestamp);
    if(fixed_div != null){
      this.fixed_div_height = fixed_div.offsetHeight;
      document.getElementById('custom_height'+this.timestamp).style.marginTop = this.fixed_div_height+'px';
    }
  }

  ionViewCanLeave(){
    $(".ng2-dropdown-menu").css('display','none');
    $(".ng2-dropdown-backdrop").remove();
  }

  dismiss(status = null) {
    this.viewCtrl.dismiss(status);
  }

  next(type){
    if(this.step == 1){
      if(this.job_number == undefined || this.job_number == null || this.job_number == ''){
        let toast = this.toastCtrl.create({
            message: 'Job/PO is required.',
            duration: 3000,
            position: 'top',
            cssClass: 'danger'
           });
          toast.present();
          return false;
      }
      else{
        this.step = Number(this.step) + 1;
        this.action(type);
      }
    }
    else if(this.step == 2){
      if(this.job_title == undefined || this.job_title == null || this.job_title == ''){
        let toast = this.toastCtrl.create({
            message: 'Job title is required.',
            duration: 3000,
            position: 'top',
            cssClass: 'danger'
           });
          toast.present();
          return false;
      }
      else{
        this.addJob(type);
        // this.step = Number(this.step) + 1;
        // this.action(type);
      }
    }
    else if(this.step == 3){
      if(type == '0'){
        this.step = Number(this.step) + 1;
        this.action(type);
      }
      else{
        if(this.cowerkers.length == 0){
          let toast = this.toastCtrl.create({
              message: 'Please select atleast one co-worker.',
              duration: 3000,
              position: 'top',
              cssClass: 'danger'
             });
            toast.present();
            return false;
        }
        else{
          this.addCoworkers(type);   
          // this.step = Number(this.step) + 1;
          // this.action(type); 
        }
      }
    }
    else if(this.step == 4){
      console.log(this.roles); 
      if(this.roles.length == 0){
        this.step = Number(this.step) + 1;
        this.action(type);
      }
      else{
          this.addRoleContacts(type);  
          // this.step = Number(this.step) + 1;
          // this.action(type);
      }
    }
    else{
      this.step = Number(this.step) + 1;
      this.action(type);
    }
    
  }

  finish(){
    this.next('1');
  }

  // prev(){
  //   this.step = Number(this.step) - 1;
  //   this.action();
  // }

  action(type){
    $(".job_steps").fadeOut("slow");
    var self = this;
    setTimeout(function(){
      $(".step"+self.step).fadeIn("slow");
      if(self.step == 3){
        self.isSkip = true;
      }
      if(self.step == 4){
        self.isLast = true;
      }
    },1000);
  }

  onCoworkerAdd(contact){
    this.cowerkers.push(contact);
  }

  removeCoworker(contact){
    this.removeArray(this.cowerkers,contact);
  }

  onRolesAdd(contact){
    contact.privilege = 0;
    this.roles.push(contact);
    console.log(this.roles)
  }

  removeRoles(contact){
    this.removeArray(this.roles,contact);
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

  getEmployees(){
    var All_contacts = [];
    this.allowed_levels = [];
    var levels_array = JSON.parse(localStorage.getItem('alllevel'));
    if(levels_array){
      levels_array.forEach((value) => {
        var decrypted = CryptoJS.AES.decrypt(value, this.userId);
        if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level1'){
          this.enable_level1  = 'false';
        }else if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level2'){
          this.enable_level2  = 'false';
        }else if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level3'){
          this.enable_level3  = 'false';
        }else if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level4'){
          this.enable_level4  = 'false';
        }else if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level0'){
          this.enable_level1 = 'true';
          this.enable_level2 = 'true';
          this.enable_level3 = 'true';
          this.enable_level4 = 'true';
        }
      });
    }

    if(this.enable_level1 == 'false') 
    {
      this.allowed_levels.push('1');
    }
    if(this.enable_level2 == 'false')
    {
      this.allowed_levels.push('2');
    }
    if(this.enable_level3 == 'false')
    {
      this.allowed_levels.push('3');
    }
    if(this.enable_level4 == 'false')
    {
      this.allowed_levels.push('4');
    }
    var self = this;
    var allowed_levels = this.allowed_levels;
    this.companyProvider.getContactList(this.userId).subscribe((allContacts)=>{
        allContacts.forEach(function(data){
          if(data.memberstatus == '2' && data.senderSetLevelStatus == '1' && data.recevierSetLevelStatus == '1') //data.amount > 0
          {
            var allow_level = '';
            if(data.senderId != self.userId)
              {
                allow_level = data.reciverSetLevel;
              }
              else
              {
                allow_level = data.senderSetLevel;
              }
            if(allowed_levels.indexOf(allow_level) >= 0)
            {
              data.privilege = '0';
              All_contacts.push(data);
            }
          }
        });
        // this.all_contacts = All_contacts;
        this.all_emps = All_contacts;
        console.log(this.all_emps)
        
        // if(this.already.length > 0)
        // {
        //   All_contacts = [];
        //   var already_added = this.already;
        //   this.all_contacts.forEach(function(value){
        //     if(already_added.indexOf(value.email) == -1)
        //     {
        //       All_contacts.push(value);
        //     }
        //   });
        //   this.all_contacts = All_contacts;
        // }
        // console.log(this.all_contacts)
      },
      err => {
          this.showTechnicalError();
      });
  }

  addJob(type){
    const loading = this.loadingCtrl.create({});
    loading.present();
    var userId = localStorage.getItem('userinfo');
    var data = {
      job_number : this.job_number,
      job_title : this.job_title,
      company_id : localStorage.getItem('switched_comp')
    }
      this.companyProvider.addJob(userId,data).subscribe((formdata)=>{
      if(formdata.status == '1')
      {
        loading.dismissAll()
        let toast = this.toastCtrl.create({
            message: 'Job added successfully.',
            duration: 3000,
            position: 'top',
            cssClass: 'success'
           });
          toast.present(); 
          this.new_jobId = formdata.data._id;
          this.step = Number(this.step) + 1;
          this.action(type);
      }
      else if(formdata.status == '2')
      {
        loading.dismissAll()
        let toast = this.toastCtrl.create({
            message: 'Job/PO number already exists.',
            duration: 3000,
            position: 'top',
            cssClass: 'danger'
           });
           toast.present(); 
           this.step = Number(this.step) - 1;
           this.action(type);
      }
      else
      {
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
  }

  addCoworkers(type){
    const loading = this.loadingCtrl.create({});
    loading.present();
    var coArr=[];
    this.cowerkers.forEach(function(contact){
      coArr.push({
        userId : contact.userId,
        privilege : contact.privilege,
        tradeId : [],
        unique_id : Math.floor(Math.random() * 100000)
      }); 
    });
    console.log(coArr);
    this.companyProvider.addCoworkers({coworkers : coArr, jobId : this.new_jobId}).subscribe((employee)=>{
        if(employee.status == '1')
        {
          loading.dismissAll()
          let toast = this.toastCtrl.create({
              message: 'Co-workers added successfully.',
              duration: 3000,
              position: 'top',
              cssClass: 'success'
           });
           toast.present(); 
           this.step = Number(this.step) + 1;
           this.action(type);
        }
        else
        {
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
  }

  // addCoworkers(type){
  //   const loading = this.loadingCtrl.create({});
  //   loading.present();
  //   var returnedArr = [];
  //   var userId = this.userId;
  //   var companyId = this.companyId;
  //   var to_userName = localStorage.getItem('userName');
  //   var baseUrl = localStorage.getItem('baseUrl');
  //     this.cowerkers.forEach(function(contact){
  //       var new_obj = {
  //           fromId : userId,
  //           toId : contact.userId, 
  //           companyId : companyId,
  //           email : contact.email,
  //           to_userName : to_userName,
  //           from_userName : contact.name,
  //           baseUrl : baseUrl,
  //           privilege : contact.privilege
  //         }
  //       returnedArr.push(new_obj); 
  //     });
  //     this.companyProvider.addAssociateEmployees(returnedArr).subscribe((employee)=>{
  //       if(employee.status == '1')
  //       {
  //         loading.dismissAll()
  //         let toast = this.toastCtrl.create({
  //             message: 'Co-workers added successfully.',
  //             duration: 3000,
  //             position: 'top',
  //             cssClass: 'success'
  //          });
  //          toast.present(); 
  //          this.step = Number(this.step) + 1;
  //          this.action(type);
  //       }
  //       else
  //       {
  //         loading.dismissAll()
  //         let toast = this.toastCtrl.create({
  //                   message: 'Error, plz try later.',
  //                   duration: 3000,
  //                   position: 'top',
  //                   cssClass: 'danger'
  //                });
  //                toast.present(); 
  //       }
  //   },
  //   err => {
  //       loading.dismissAll();
  //       this.showTechnicalError('1');
  //   });
  // }

  addExternalContacts(){
    var userId = localStorage.getItem('userinfo'); 
    var already_arr = [];
      if(this.roles.length > 0)
      {
        this.roles.forEach(function(data){
          already_arr.push(data.email);
        });
      }
    let modal = this.modalCtrl.create('ContactslistPage',{already : already_arr, is_external : '1'});
    modal.onDidDismiss(data => {
      if(data.length != undefined && data.length != 0)
      {
        var returnedArr = [];
        data.forEach(function(contact){
          var new_obj = {
              userId : userId,
              email : contact.email,
              value : contact.email,
              status : '0',
              isExternal : 1,
              privilege : 0
            }
          returnedArr.push(new_obj); 
        });
        this.roles = this.roles.concat(returnedArr);
        console.log(this.roles);
      }
    });
    modal.present();
  }

  addRoleContacts(type){
    const loading = this.loadingCtrl.create({});
    loading.present();
    var self = this;
    var returnedArr = [];
    this.roles.forEach(function(contact){
      var new_obj;
      if(contact.isExternal == 1){
        new_obj = {
          isMember : '0',
          userId : self.userId,
          inviteId : '0', 
          invite_email : contact.value,
          status : '0',
          privilege : contact.privilege,
          invite_name: '',
          invite_company: '',
          invite_phone: '',
          invite_title: '',
        }
      }
      else{
        new_obj = {
          isMember : contact.userId == undefined ? '0' : '1',
          userId : self.userId,
          inviteId : contact.userId == undefined ? '0' : contact.userId, 
          invite_email : contact.value,
          status : '0',
          privilege : contact.privilege == undefined ? '0' : contact.privilege,
          invite_name: '',
          invite_company: '',
          invite_phone: '',
          invite_title: ''
        }
      }
      returnedArr.push(new_obj); 
    });

    this.companyProvider.addInviteBidders(this.new_jobId, null, returnedArr).subscribe((contacts)=>{
        loading.dismissAll()
        let toast = this.toastCtrl.create({
            message: 'Job contacts added.',
            duration: 3000,
            position: 'top',
            cssClass: 'success'
           });
        toast.present(); 
        this.step = Number(this.step) + 1;
        this.action(type);
    },
    err => {
        this.showTechnicalError('1');
    });
  }

  getExistingEmployees(){
    const loading = this.loadingCtrl.create({}); 
    loading.present();
    var all_employees = [];
    var loginId = this.userId;
    this.companyProvider.getAllEmployees(this.companyId,this.userId).subscribe((employees)=>{
      this.all_employees=employees;
      
      if(this.all_employees != ''){
        this.all_employees.forEach(function(emp){
          if(emp.status == 1 && emp.fromId != emp.toId){
            var obj = {
              display : emp.employee_name,
              value : emp.employee_email,
              userId : (loginId == emp.fromId) ? emp.toId : emp.fromId,
              email : emp.employee_email,
              privilege : 0
            }
            
            all_employees.push(obj);
          }
        });
      }
      this.all_employees = all_employees;
      console.log(this.all_employees)
      loading.dismissAll();
      // this.all_employees.forEach(function(emp){
      //   already.push(emp.employee_email);
      // });
      // this.already = already;
      this.getEmployees();
    },
    err => {
        loading.dismissAll();
        this.showTechnicalError();
    });
  }

  goToTrade(){
    localStorage.setItem('is_wizard','1');
    localStorage.setItem('active_job_breadcrumb',this.job_title);
    localStorage.setItem('currentJobId',this.new_jobId);
    this.navCtrl.push('AddtradePage', {job_id : this.new_jobId});
  }

  // getAllRoleContacts(){
  //   // console.log(this.all_emps)
  //   // all_roles
  // }

  // addJob(){
  //   for (let i in this.form.controls) {
  //     this.form.controls[i].markAsTouched();
  //   }
  //   if(this.form.valid){
  //     const loading = this.loadingCtrl.create({});
  //     loading.present();
  //     var userId = localStorage.getItem('userinfo');
  //       this.companyProvider.addJob(userId,this.form.value).subscribe((formdata)=>{
  //       if(formdata.status == '1')
  //       {
  //         loading.dismissAll()
  //         let toast = this.toastCtrl.create({
  //             message: 'Job added successfully.',
  //             duration: 3000,
  //             position: 'top',
  //             cssClass: 'success'
  //            });
  //            toast.present(); 
  //         this.form.reset();
  //         this.dismiss('1'); 
  //       }
  //       else if(formdata.status == '2')
  //       {
  //         loading.dismissAll()
  //         let toast = this.toastCtrl.create({
  //             message: 'Job/PO number already exists.',
  //             duration: 3000,
  //             position: 'top',
  //             cssClass: 'danger'
  //            });
  //            toast.present(); 
  //       }
  //       else
  //       {
  //         loading.dismissAll()
  //         let toast = this.toastCtrl.create({
  //             message: 'Error, plz try later.',
  //             duration: 3000,
  //             position: 'top',
  //             cssClass: 'danger'
  //            });
  //            toast.present(); 
  //       }
      
  //     },
  //     err => {
  //         loading.dismissAll();
  //         this.showTechnicalError('1');
  //     });
  //   }
  // }

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

  jobPage(){
    this.navCtrl.push('ManagejobPage');
  }
}
