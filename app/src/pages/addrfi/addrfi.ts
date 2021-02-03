import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController, LoadingController, ModalController } from 'ionic-angular';
import { CompanyProvider } from '../../providers/company/company';

@IonicPage()
@Component({
  selector: 'page-addrfi',
  templateUrl: 'addrfi.html',
  providers: [CompanyProvider]
})
export class AddrfiPage {
userId:any;
jobId:any;
filterTradeId:any;
allsusers:any;
alltrades:any;
files:any;
alluserIds:any;
allusers:any = [];
dateTime:any;
active_job_breadcrumb = localStorage.getItem('active_job_breadcrumb');
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public companyProvider: CompanyProvider, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public modalCtrl: ModalController) {
		this.userId = localStorage.getItem('userinfo');
		this.jobId = navParams.get('jobId');
    if(this.jobId == undefined){
      this.jobId = localStorage.getItem('add_rfis_jobId');
    }
    else{
      localStorage.setItem('add_rfis_jobId',this.jobId);
    }
		this.filterTradeId = localStorage.getItem('filterTradeId');
    if(this.filterTradeId == null || this.filterTradeId == undefined || this.filterTradeId == ''){
      this.filterTradeId = '0';
    }
    this.dateTime = new Date().getTime();

		this.companyProvider.allTrades(this.jobId).subscribe((alltrades)=>{
			this.alltrades = alltrades;
			this.companyProvider.jobUsers(this.jobId).subscribe((allusers)=>{
				this.allsusers = allusers;
				this.sortUsers();
			},
      err => {
          this.showTechnicalError();
      });
		},
    err => {
        this.showTechnicalError();
    });
  }

  sortUsers(){
  	this.allusers = [];
  	var self = this;
  	if(this.filterTradeId != 0){
  		if(this.allsusers != ''){
  			this.allsusers.forEach(function(user){
  				if(user.tradeId == self.filterTradeId){
  					self.allusers.push(user);
  				}
  			});
  		}
  	}
  	else{
  		this.alluserIds = [];
  		if(this.allsusers != ''){
  			this.allsusers.forEach(function(user){
  				if(self.alluserIds.indexOf(user._id) == -1){
  					self.allusers.push(user);
  					self.alluserIds.push(user._id);
  				}
  			});
  		}
  	}
  }

  changeTrade(tradeId){  	
  	var self = this;
  	if(tradeId != '' && tradeId != undefined){
  		this.allusers = [];
  		if(this.allsusers != ''){
  			this.allsusers.forEach(function(user){
  				if(user.tradeId == tradeId){
  					self.allusers.push(user);
  				}
  			});
  		}
  	}
  }

  addManualRfi(question,tradeId,user_id)
  {
    if(question == '' || question == undefined )
    {
      let toast = this.toastCtrl.create({
          message: 'Please enter question.',
          duration: 3000,
          position:'top',
          cssClass: 'danger'
         });
         toast.present(); 
    }
    else
    {
      if(this.filterTradeId == '0')
      {
        if(tradeId == undefined || tradeId == '')
        {
          let toast = this.toastCtrl.create({
            message: 'Please select trade.',
            duration: 3000,
            position:'top',
            cssClass: 'danger'
           });
           toast.present(); 
           return false;
        }
        if(user_id == '' || user_id == undefined){
      		let toast = this.toastCtrl.create({
	            message: 'Please select user.',
	            duration: 3000,
	            position:'top',
	            cssClass: 'danger'
            });
            toast.present(); 
      		return false;
      	}
      }
      else
      {
      	if(user_id == '' || user_id == undefined){
      		let toast = this.toastCtrl.create({
	            message: 'Please select user.',
	            duration: 3000,
	            position:'top',
	            cssClass: 'danger'
            });
            toast.present(); 
      		return false;
      	}
        tradeId = localStorage.getItem('filterTradeId');
      }
      this.addRFI(question,tradeId,user_id);
    }
  }

  addRFI(question,tradeId,user_id){
  	const loading = this.loadingCtrl.create({});
  	loading.present();
    var all_files = [];
    var bid_files = [];
    if(this.files != undefined)
      {
        if(this.files.length > 0)
        {
          this.files.forEach(function(file){
            all_files.push(file.name);
          });
          bid_files = all_files;
        }
      }
  	this.companyProvider.manualRFI({question: question, tradeId: tradeId, inviteId: user_id,question_files:bid_files}).subscribe((rfis)=>{
  		loading.dismissAll() 
  	    if(rfis.status == '1'){
  	        this.viewCtrl.dismiss('1');
  	    }
  	    else{
  	      	this.viewCtrl.dismiss('0');
  	    }
  	  },
      err => {
          loading.dismissAll();
          this.showTechnicalError();
      });
  }

  dismiss(){
  	this.viewCtrl.dismiss();
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

  filemanagerFiles(){
    let modal = this.modalCtrl.create('FilemanagerfilesPage',{
      reply_rfi : '1'
    });
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
                this.showTechnicalError('1');
            });
          }
     });
     modal.present();
  }

  jobFiles(){
    let modal = this.modalCtrl.create('JobfilesPage',{
      reply_rfi : '1',
      jobId : '0'
    });
     modal.onDidDismiss(data => {
      if(data != undefined && data != '')
          {       
           var filesArray = [];
           var dateTime = this.dateTime;
           var file_path,file_name;
           data.forEach(function(single_file){
              
              if(single_file.path == undefined)
              {
                file_path = 'directory/jobs_data';
                file_name = single_file.file_name;
              }
              else
              {
                file_path = single_file.path;
                file_name = single_file.name;
              }
              var fileobj = {
                file_name : file_name,
                name : dateTime+'____'+file_name,
                folder_path : file_path,
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
                this.showTechnicalError('1');
            });
          }
     });
     modal.present();
  }

  // addFilesJobs(isShared){
  //   this.file_path = localStorage.getItem('current_file_path');

  //   let modal = this.modalCtrl.create('JobfilesPage',{
  //     isShared : isShared,
  //     jobId : '0'
  //   });
  //     modal.onDidDismiss(data => {
  //       if(data != '' && data != undefined && data != null){
  //         var onLevel = '1';
  //         var toLevel = localStorage.getItem('clicked_whichLevel');
  //         if(isShared == '1' && this.file_path == 'nopath'){
  //           onLevel = localStorage.getItem('file_upload_level');
  //           toLevel = onLevel;
  //         }  
  //         const loading = this.loadingCtrl.create({});
  //         loading.present();
  //         var self = this;
  //         var counter = 0;
  //         var file_item,file_name;;
  //         data.forEach(function(single){
  //           if(single.path == undefined)
  //           {
  //             file_item = 'directory/jobs_data/'+single.file_name;
  //             file_name = single.file_name;
  //           }
  //           else
  //           {
  //             file_item = single.path;
  //             file_name = single.name;
  //           }
  //           var obj = {
  //             isShared : isShared,
  //             current_file_path : file_item,
  //             file_name : file_name,
  //             folder_path : self.file_path,
  //             userId : self.userId,
  //             show_add_folder : self.show_add_folder,
  //             onLevel: onLevel,
  //             toId: localStorage.getItem('clicked_user_id'),
  //             toLevel: toLevel,
  //             from_user: localStorage.getItem('userName'),
  //             clicked_fid: localStorage.getItem('clicked_fid')
  //           }
  //           self.companyProvider.dirFileUploadSmail(self.userId,obj).subscribe((result)=>{
  //             counter = counter + 1;
  //             if(data.length == counter){
  //               loading.dismissAll();
  //               let toast = self.toastCtrl.create({
  //                   message: 'Files added successfully.',
  //                   position: 'top',
  //                   duration: 3000,
  //                   cssClass: 'success'
  //                  });
  //               toast.present(); 
  //               if(isShared == '1')
  //                 {
  //                   var type;
  //                   if(localStorage.getItem('shared_user_clicked') == '1')
  //                   {
  //                     type = localStorage.getItem('folder_type');
  //                     var username = localStorage.getItem('clicked_user_name');
  //                     var userId = localStorage.getItem('clicked_user_id');
  //                     var clicked_whichLevel = localStorage.getItem('clicked_whichLevel');
  //                     self.clickSharedFoldersUsers(userId,'1','0','0',username,type,clicked_whichLevel);
  //                   }
  //                   else if(localStorage.getItem('shared_user_clicked') == '2')
  //                   {
  //                     type = localStorage.getItem('folder_type');
  //                     var shared_folder_path = localStorage.getItem('current_file_path');
  //                     var c_shared_folder_name = localStorage.getItem('c_shared_folder_name');
  //                     self.callSharedFolders(shared_folder_path,c_shared_folder_name,type);
  //                   }
  //                   else if(localStorage.getItem('shared_user_clicked') == '3')
  //                   {
  //                     self.fetchRelatedFiles();
  //                   }
  //                   else
  //                   {
  //                     self.getSharedFolders();
  //                   }
  //                 }
  //                 else
  //                 {
  //                   self.fetchRelatedFiles();
  //                 }
  //             }
  //           },
  //           err => {
  //               loading.dismissAll();
  //               this.showTechnicalError('1');
  //           });
  //         });
  //       }
        
  //    });
  //     modal.present();
  // }

  uploadFiles()
  {
    let modal = this.modalCtrl.create('UploadfilePage', {dateTime : this.dateTime, bid_upload : '1'});
     modal.onDidDismiss(data => {
      if(data != undefined || data != '')
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

             if(this.files != undefined)
             {
                this.files = this.files.concat(filesArray);
             }
             else
             {
                this.files = filesArray;
             }
            }
      }
      });
     modal.present();
  }

  removeFile(index){
    this.files.splice(index,1);
  }

  root(){
      this.navCtrl.setRoot('DashboardPage');
    };
    
  goToJobs(){
      this.navCtrl.push('ManagejobPage',{
      is_direct : '0'
      });
    };

  backToTradeDash()
      {
        this.navCtrl.push('TradeDashboardPage',{
          back : '1'
        });
      }

}
