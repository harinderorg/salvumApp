import { Component } from '@angular/core';
import { IonicPage, NavController, ModalController , NavParams, AlertController,ToastController,LoadingController} from 'ionic-angular';
import { CompanyProvider } from '../../providers/company/company';
import { reorderArray } from 'ionic-angular';
@IonicPage()
@Component({
  selector: 'page-submitbid',
  templateUrl: 'submitbid.html',
  providers: [CompanyProvider]
})
export class SubmitbidPage {
jobId:string;
tradeId:string;
userId:string;
bidJobId:string;
invite_email:any;
bid_status:string;
files:any;
bid_breakdown_files:any = [];
dateTime:any;
trade:any;
applied_bids:any;
bid_comments:any;
bid_breakdown_tasks:any = [];
bid_breakdown_manual:any;
bid_total_price:any = '0';
bid_breakdown_type:any = '1';
total_estimated_cost:any = '';
uploader_categories:any = [];
submitted_categories:any = [];
submitted_categories_vals:any = [];
isBrowser = localStorage.getItem('isBrowser'); 
bid_job_name = localStorage.getItem('bid_job_name');
loading:any; 
final_val:any; 
constructor(public navCtrl: NavController,public modalCtrl: ModalController,public navParams: NavParams, public companyProvider: CompanyProvider, public alertCtrl: AlertController, public toastCtrl: ToastController,public loadingCtrl: LoadingController) {
      this.jobId = navParams.get('jobId');
      this.tradeId = navParams.get('tradeId');
      this.bid_status = navParams.get('bid_status');
      this.bidJobId = navParams.get('bidJobId');
      this.invite_email = navParams.get('invite_email');
      this.userId = localStorage.getItem('userinfo');
      if(this.jobId == undefined){
        this.jobId = localStorage.getItem('sb_jobId');
        this.tradeId = localStorage.getItem('sb_tradeId');
        this.bid_status = localStorage.getItem('sb_bid_status');
        this.bidJobId = localStorage.getItem('sb_bidJobId');
        this.invite_email = localStorage.getItem('sb_invite_email');
      }
      else{
        localStorage.setItem('sb_jobId',this.jobId);
        localStorage.setItem('sb_tradeId',this.tradeId);
        localStorage.setItem('sb_bid_status',this.bid_status);
        localStorage.setItem('sb_bidJobId',this.bidJobId);
        localStorage.setItem('sb_invite_email',this.invite_email);
      }
      localStorage.setItem('filterTradeId','1');
      this.dateTime = new Date().getTime();
      if(this.tradeId != undefined){
        this.getTradeDetails();
        this.getAppliedBids();
      }
  }

  getTradeDetails(){
    const loading = this.loadingCtrl.create({});
    loading.present();
    var self = this;
    this.companyProvider.tradeDetails(this.tradeId).subscribe((tradedetails)=>{
      this.trade = tradedetails;
      if(tradedetails.uploader_categories != '' && tradedetails.uploader_categories != undefined){
          tradedetails.uploader_categories.forEach(function(data){
            if(data.visible == true){
              self.uploader_categories.push(data);
            }
          });
          // getTempBids
          this.companyProvider.getTempBids(this.bidJobId,this.userId).subscribe((tempBids)=>{
              loading.dismissAll();
              if(tempBids != null){
                this.bid_comments = tempBids.data.bid_comments;
                this.files = tempBids.data.files;
                this.bid_breakdown_type = tempBids.data.bid_breakdown_type;
                this.bid_breakdown_files= tempBids.data.bid_breakdown_files;
                this.bid_breakdown_manual= tempBids.data.bid_breakdown_manual;
                this.bid_total_price= tempBids.data.bid_total_price;
                this.bid_breakdown_tasks= tempBids.data.bid_breakdown_tasks;
                this.total_estimated_cost= tempBids.data.total_estimated_cost;
                this.submitted_categories_vals=tempBids.data.submitted_categories_vals;
                this.submitted_categories=tempBids.data.submitted_categories;
              }
          },
          err => {
              loading.dismissAll();
              this.showTechnicalError('1');
          });
        }
        else{
        	 loading.dismissAll();
        }
    },
    err => {
        loading.dismissAll();
        this.showTechnicalError('1');
    });
  }

  getAppliedBids(){
    this.companyProvider.getAppliedBids(this.tradeId,this.bidJobId).subscribe((applied_bids)=>{
      this.applied_bids = applied_bids.length;
    });
  }

  createBidBreakdown(){
    let modal = this.modalCtrl.create('AddTaskPage', {isAdd:'1'});
     modal.onDidDismiss(data => {
      if(data != undefined && data != '' && data != null){
        this.bid_breakdown_tasks.push(data);
        this.calcBreakdownPrice();
      }
     });
     modal.present();
  }

  delTask(index){
    this.bid_breakdown_tasks.splice(index,1);
    this.calcBreakdownPrice();
  }

  editTask(index,data){
    let modal = this.modalCtrl.create('AddTaskPage', {isAdd:'0',data:data});
     modal.onDidDismiss(data => {
      if(data != undefined && data != '' && data != null){
        this.bid_breakdown_tasks[index] = data;
        this.calcBreakdownPrice();
      }
     });
     modal.present();
  }

  calcPercent(cost,total_cost){
    return ((cost.split(',').join('')/total_cost)*100).toFixed(2);
  }

  calcBreakdownPrice(){
    if(this.bid_breakdown_tasks.length == 0){
      this.bid_total_price = 0;
    }
    else{
      this.bid_total_price = 0;
      var self = this;
      this.bid_breakdown_tasks.forEach(function(data){
        self.bid_total_price = Number(self.bid_total_price) + Number(data.cost.split(',').join(''));
      });
      this.calcPercentAll();
    }
  }

  calcPercentAll(){
    var self = this;
    var count = 0;
    this.bid_breakdown_tasks.forEach(function(data){
      self.bid_breakdown_tasks[count]['percent'] = self.calcPercent(data.cost,self.bid_total_price);
      count = count + 1;
    });
  }

  reorderItems(indexes) {
    this.bid_breakdown_tasks = reorderArray(this.bid_breakdown_tasks, indexes);
  }

  typeChecked(value,index,cat){
    this.uploader_categories[index]['type'] = value;
    if(this.submitted_categories.indexOf(cat.name) >= 0){
      var index = this.submitted_categories.indexOf(cat.name);
      this.submitted_categories_vals[index]['type'] = value;
      this.submitted_categories_vals[index]['cat'] = cat.name;
    }
    else{
      this.submitted_categories.push(cat.name);
      this.submitted_categories_vals.push({type : value, cat : cat.name, success : false });
    }

    var new_index = this.submitted_categories.indexOf(cat.name);
    if(value == 0){
      var files = this.submitted_categories_vals[new_index]['files'];
      if(files && files.length > 0){
        this.submitted_categories_vals[new_index]['success'] = true;
      }
      else{
        this.submitted_categories_vals[new_index]['success'] = false;
      }
    }
    else{
      var summary = this.submitted_categories_vals[new_index]['summary'];
      if(summary != '' && summary != null && summary != undefined){
        this.submitted_categories_vals[new_index]['success'] = true;
      }
      else{
        this.submitted_categories_vals[new_index]['success'] = false;
      }
    }
    
    console.log(this.submitted_categories_vals)
  }

  summaryChanged(event,cat){
    console.log(event)
    if(cat.name == 'Total Estimated Cost'){
      this.final_val = this.changeFormat(event);
    }
    else{
      this.final_val = event.value;
    }
    console.log(this.final_val)
    if(this.submitted_categories.indexOf(cat.name) >= 0){
      var index = this.submitted_categories.indexOf(cat.name);
      this.submitted_categories_vals[index]['summary'] = this.final_val;
      this.submitted_categories_vals[index]['cat'] = cat.name;
    }
    else{
      this.submitted_categories.push(cat.name);
      this.submitted_categories_vals.push({summary : this.final_val, cat : cat.name, success : false });
    }

    var new_index = this.submitted_categories.indexOf(cat.name);
    if(this.final_val != '' && this.final_val != null && this.final_val != undefined){
      this.submitted_categories_vals[new_index]['success'] = true;
    }
    else{
      this.submitted_categories_vals[new_index]['success'] = false;
    }

    console.log(this.submitted_categories_vals)
  }

  removeBidFile(index){
    this.bid_breakdown_files.splice(index,1);
  }

  removeCatFiles(index,catname){
    var cat_index = this.submitted_categories.indexOf(catname);
    this.submitted_categories_vals[cat_index]['files'].splice(index,1);
    if(this.submitted_categories_vals[cat_index]['files'].length == 0){
      this.submitted_categories_vals[index]['success'] = false;
    }
  }

  saveDraft(isSilent = false){
    var bid_breakdown = {
      bid_comments : this.bid_comments,
      files : this.files,
      bid_breakdown_type : this.bid_breakdown_type,
      bid_breakdown_files: this.bid_breakdown_files,
      bid_breakdown_manual: this.bid_breakdown_manual,
      bid_total_price: this.bid_total_price,
      bid_breakdown_tasks: this.bid_breakdown_tasks,
      total_estimated_cost: this.total_estimated_cost,
      submitted_categories_vals: this.submitted_categories_vals,
      submitted_categories: this.submitted_categories
    };
    if(isSilent == false){
      this.loading = this.loadingCtrl.create({});
      this.loading.present();
    }
    // addTempBids
    this.companyProvider.addTempBids({bidId : this.bidJobId,userId : this.userId,bid_breakdown : bid_breakdown}).subscribe((addBids)=>{
        if(isSilent == false){
          this.loading.dismissAll();
          let toast = this.toastCtrl.create({
              message: 'Bid saved to draft.',
              duration: 3000,
              position: 'top',
              cssClass: 'success'
             });
             toast.present();
        }
    },
    err => {
        if(isSilent == false){
          this.loading.dismissAll();
          this.showTechnicalError('1');
        }
    });
  }

  submitBid(bid_comments,first_name,last_name,company_name){
    var bid_breakdown = {
      bid_breakdown_type : this.bid_breakdown_type,
      bid_breakdown_files: this.bid_breakdown_files,
      bid_breakdown_manual: this.bid_breakdown_manual,
      bid_total_price: this.bid_total_price,
      bid_breakdown_tasks: this.bid_breakdown_tasks,
      total_estimated_cost: this.total_estimated_cost,
      submitted_categories_vals: this.submitted_categories_vals
    };
    
    if(bid_comments !== undefined && bid_comments != '')
    {
      if(this.userId == null || this.userId == undefined || this.userId == '')
      {
        if(first_name == '' || first_name == undefined)
        {
          let toast = this.toastCtrl.create({
            message: 'Please enter first name.',
            duration: 3000,
            position: 'top',
            cssClass: 'danger'
           });
           toast.present(); 
           return false;
        }
        if(last_name == '' || last_name == undefined)
        {
          let toast = this.toastCtrl.create({
            message: 'Please enter last name.',
            duration: 3000,
            cssClass: 'danger',
            position: 'top'
           });
           toast.present(); 
           return false;
        }
        if(company_name == '' || company_name == undefined)
        {
          let toast = this.toastCtrl.create({
            message: 'Please enter company name.',
            duration: 3000,
            cssClass: 'danger',
            position: 'top'
           });
           toast.present(); 
           return false;
        }
      }
      const loading = this.loadingCtrl.create({});
        loading.present();
        var all_files = [];
        var bid_files = null;
        if(this.files != undefined)
        {
          if(this.files.length > 0)
          {
            this.files.forEach(function(file){
              all_files.push(file.name);
            });
            bid_files = JSON.stringify(all_files);
          }
        }
        this.saveDraft(true);
        this.companyProvider.submitBids(this.jobId,this.tradeId,this.userId,this.bid_status,bid_comments,bid_files,this.bidJobId,first_name,last_name,company_name,this.invite_email,'1',bid_breakdown).subscribe((formdata)=>{
          if(formdata.status == 1)
          {
              loading.dismissAll()
              let toast = this.toastCtrl.create({
                  message: 'Bid has been submitted successfully.',
                  duration: 3000,
                  cssClass: 'success',
                  position: 'top'
                 });
                 toast.present(); 
                 this.navCtrl.push('bidding-page', {
                    bidJobId:this.bidJobId,
                    status: '5'
                  });
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
      let toast = this.toastCtrl.create({
        message: 'Please enter your comments.',
        duration: 3000,
        position: 'top',
        cssClass: 'danger'
       });
       toast.present(); 
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

  filemanagerFiles()
  {
    let modal = this.modalCtrl.create('FilemanagerfilesPage');
     modal.onDidDismiss(data => {
      if(data != undefined && data != '')
          {       
           var filesArray = [];
           var dateTime = this.dateTime;
           data.forEach(function(single_file){
              var fileobj = {
                file_name : single_file.name,
                name : dateTime+'____'+single_file.name,
                folder_path : localStorage.getItem('filemanager_file_path'),
                random : dateTime
              }
              filesArray.push(fileobj);
            });

           if(this.files != undefined)
           {
              this.files = this.files.concat(filesArray);
           }
           else
           {
              this.files = filesArray;
           }
           this.companyProvider.addBidFiles(filesArray).subscribe((filesdata)=>{
             console.log('done'); 
           },
          err => {
              this.showTechnicalError();
          });
          }
     });
     modal.present();
  }

  uploadFiles(type,catname=null)
  {
    let modal = this.modalCtrl.create('UploadfilePage', {dateTime : this.dateTime, bid_upload : '1'});
     modal.onDidDismiss(data => {
      if(data != undefined && data != '')
      {
        if(data.length > 0)
            {     
             var filesArray = [];
             var dateTime = this.dateTime;
             data.forEach(function(single_file){
              if(single_file.isUploaded == true)
              {
                var fileobj = {
                    file_name : single_file._file.name,
                    name : dateTime+'____'+single_file._file.name,
                    random : dateTime
                  }
                  filesArray.push(fileobj);
              }
              });

             if(type == 'breakdown'){
                if(this.bid_breakdown_files.length > 0){
                    this.bid_breakdown_files = this.bid_breakdown_files.concat(filesArray);
                }
                else{
                    this.bid_breakdown_files = filesArray;
                }
             }
             else if(type == 'other'){
              if(this.submitted_categories.indexOf(catname) >= 0){
                var index = this.submitted_categories.indexOf(catname);
                if(this.submitted_categories_vals[index]['files'] != '' && this.submitted_categories_vals[index]['files'] != null && this.submitted_categories_vals[index]['files'] != undefined){
                    this.submitted_categories_vals[index]['files'] = this.submitted_categories_vals[index]['files'].concat(filesArray);
                  }
                  else{
                    this.submitted_categories_vals[index]['files'] = filesArray;
                    this.submitted_categories_vals[index]['cat'] = catname;
                    this.submitted_categories_vals[index]['type'] = '0';
                  }
              }
              else{
                this.submitted_categories.push(catname);
                this.submitted_categories_vals.push({files : filesArray, cat : catname, success : false, type : '0' });
              }
                var new_index = this.submitted_categories.indexOf(catname);
                if(filesArray.length > 0){
                  this.submitted_categories_vals[new_index]['success'] = true;
                }
             }
             else{
                if(this.files != undefined){
                    this.files = this.files.concat(filesArray);
                }
                else{
                    this.files = filesArray;
                }
             }
            }
        }
     });
     modal.present();
  }

  changeFormat(val){
    return this.total_estimated_cost = this.numberWithCommas(val);
  }

  numberWithCommas(x) {
    if(x.indexOf('.') == -1 && x != undefined && x != '' && x != null){
      x = x.split(',').join('');
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'.00';
    }
    else{
      x = x.split(',').join('');
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
  }

  removeFile(index)
  {
    this.files.splice(index,1);
  }
  backBtn()
  {
    this.navCtrl.push('bidding-page', {
      bidJobId: this.bidJobId,
      status: this.bid_status,
    });
  }
  root(){
    this.navCtrl.setRoot('DashboardPage');
  };
  goToBids(){
    this.navCtrl.push('bidjobs', {
      type: '0'
    });
  };

}
