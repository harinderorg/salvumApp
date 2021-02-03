import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController,ToastController,LoadingController, ViewController } from 'ionic-angular';
import { CompanyProvider } from '../../providers/company/company';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';

@IonicPage()
@Component({
  selector: 'page-jobphotos',
  templateUrl: 'jobphotos.html',
  providers: [CompanyProvider]
})
export class JobphotosPage {
sorted_photos : any;
fileType : any;
all_photos : any;
jobId : any;
file_types : any;
APIURL : any;
folders : any;
related_files : any;
breadcrums : any;
downloaded_href : any = '#';
isBrowser = localStorage.getItem('isBrowser');
baseUrl = localStorage.getItem('baseUrl');
userId = localStorage.getItem('userinfo');
timestamp:any;
has_thumbs:any;
is_video:any;
active_job_breadcrumb = localStorage.getItem('active_job_breadcrumb');
trades:any = [];
trade_ids:any = [];
tradeTypes:any = [];
tradesType_names:any = [];
filter_trades:any = [];
filter_trade_names:any = [];
filter_list:any = [];
nav_filter:any = 'default';
order_default:any = 'trade_name';
order_default_p:any = false;
order_advanced:any = 'trade_task';
order_advanced_p:any = false;
sort_icon:Boolean = true;
  constructor(private transfer: FileTransfer, private file: File,public modalCtrl: ModalController, public navCtrl: NavController, public navParams: NavParams, public companyProvider: CompanyProvider, public alertCtrl: AlertController, public toastCtrl: ToastController,public loadingCtrl: LoadingController , public viewCtrl: ViewController) {
	  this.APIURL = localStorage.getItem('APIURL');
	  this.jobId = navParams.get('jobId');
	  var current_date = new Date();
      this.timestamp = current_date.getTime();
      this.has_thumbs = ['png','jpg','jpeg','gif','mp4','mov','wmv','3gp','avi'];
      this.is_video = ['mp4','mov','wmv','3gp','avi'];
	  if(this.jobId == undefined)
		{
		var localJobId = localStorage.getItem('currentJobId');
		if(localJobId != '' && localJobId != undefined && localJobId != null){
		  this.jobId = localJobId;
		}
		else{
		  this.navCtrl.push('ManagejobPage',{
		    is_direct : '0'
		  });
		}
	  }
	  this.fileType = navParams.get('file_type');
	  if(this.fileType == undefined){
	  	this.fileType = localStorage.getItem('job_files_type');
	  }
	  localStorage.setItem('job_files_type',this.fileType);
	  this.file_types = ['txt','docx','mp3','mp4','php','ppt','pptx','psd','xls','xlsx','zip','doc','odt','png','jpg','jpeg','gif','pdf','csv']; 
	  this.getFiles();
  }

  ionViewDidLoad(){ 
  	this.caclHeight();
  	if(JSON.parse(localStorage.getItem('saved_filter_list')) != null && JSON.parse(localStorage.getItem('saved_filter_list')) != undefined){
  		this.filter_list = JSON.parse(localStorage.getItem('saved_filter_list'));
  		this.filter_trades = JSON.parse(localStorage.getItem('saved_filter_trades'));
  		this.filter_trade_names = JSON.parse(localStorage.getItem('saved_filter_trade_names'));
  	}
  }

  scroll(direction){
  	var cond;
  	if(direction == 'right'){
  		cond = { scrollLeft: "+=200px" };
  	}
  	else{
  		cond = { scrollLeft: "-=200px" };
  	}
  	$('.drop-scroll').animate(cond, "slow");
  }

  saveFilters(filter_list,filter_trades,filter_trade_names){
  	localStorage.setItem('saved_filter_list',JSON.stringify(filter_list));
  	localStorage.setItem('saved_filter_trades',JSON.stringify(filter_trades));
  	localStorage.setItem('saved_filter_trade_names',JSON.stringify(filter_trade_names));
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

  caclHeight(){
		var fixed_div = document.getElementById("calc_height_photos"+this.timestamp);
	    if(fixed_div != null){
	      var fixed_div_height = fixed_div.offsetHeight;
	      document.getElementById('fixed_height_photos'+this.timestamp).style.marginTop = fixed_div_height+'px';
	    }
	}

getFiles()
  {
  	this.trades = [];
	this.trade_ids = [];
	this.tradeTypes = [];
	this.tradesType_names = [];
  	var self = this,index;
  	this.folders = '0';
  	localStorage.setItem('files_folder_path','directory/jobs_data');
  	this.getBreadCrums();
  	const loading = this.loadingCtrl.create({});
    loading.present(); 
  	this.companyProvider.getJobFiles(this.jobId,this.fileType,this.userId).subscribe((photos)=>{
  		loading.dismissAll()
	  	this.all_photos = photos;
	  	this.sorted_photos = photos; 
	  	if(this.all_photos != ''){
	  		this.all_photos.forEach(function(data){
	  			if(self.trade_ids.indexOf(data.tradeId) >= 0){
	  				index = self.trade_ids.indexOf(data.tradeId);
	  				self.trades[index]['total'] = self.trades[index]['total'] + 1;
	  			}
	  			else{
	  				self.trades.push({
	  					tradeId : data.tradeId,
	  					trade_name : data.trade_name,
	  					trade_icon : data.trade_icon,
	  					trade_task : data.trade_task,
	  					total : 1
	  				});
	  				self.trade_ids.push(data.tradeId);
	  			}

	  			if(self.tradesType_names.indexOf(data.trade_name) >= 0){
	  				index = self.tradesType_names.indexOf(data.trade_name);
	  				self.tradeTypes[index]['total'] = self.tradeTypes[index]['total'] + 1;
	  			}
	  			else{
	  				self.tradeTypes.push({
	  					tradeId : 0,
	  					trade_name : data.trade_name,
	  					trade_icon : data.trade_icon,
	  					trade_task : 'All '+data.trade_name,
	  					total : 1
	  				});
	  				self.tradesType_names.push(data.trade_name);
	  			}
	  		});
	  	}
	  	this.filterTrades();
	  },
	    err => {
	        loading.dismissAll();
	        this.showTechnicalError();
	    });
  }

  addFilter(trade){
  	if(trade.tradeId == 0){
  		if(this.filter_trade_names.indexOf(trade.trade_name) == -1){
  			this.filter_trade_names.push(trade.trade_name);
  			this.filter_list.push(trade);
  		}
  		else{
  			this.filter_trade_names.splice(this.filter_trade_names.indexOf(trade.trade_name),1);
  			this.removeArray(this.filter_list,trade);
  		}
  	}
  	else{
  		if(this.filter_trades.indexOf(trade.tradeId) == -1){
		  	this.filter_trades.push(trade.tradeId);
		  	this.filter_list.push(trade);
	  	}
	  	else{
	  		this.filter_trades.splice(this.filter_trades.indexOf(trade.tradeId),1);
	  		this.removeArray(this.filter_list,trade);
	  	}
  	}
  	this.filterTrades();
  	if(this.filter_trades.length == 0 && this.filter_trade_names.length == 0){
  		this.sorted_photos = this.all_photos;
  	}
  	this.saveFilters(this.filter_list,this.filter_trades,this.filter_trade_names);
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

  filterTrades(){
  	if(this.filter_trades.length > 0 || this.filter_trade_names.length > 0){
  		var self = this;
	  	this.sorted_photos = [];
		this.all_photos.forEach(function(data){
			if(self.filter_trades.indexOf(data.tradeId) >= 0)
			{
				self.sorted_photos.push(data);
			}
			else{
				if(self.filter_trade_names.indexOf(data.trade_name) >= 0){
					self.sorted_photos.push(data);
				}
			}
		});
  	} 
  }

  cancelFilter(trade,index){
  	if(trade.tradeId == 0){
  		this.filter_trade_names.splice(this.filter_trade_names.indexOf(trade.trade_name),1);
  	}
  	else{
  		this.filter_trades.splice(this.filter_trades.indexOf(trade.tradeId),1);
  	}
  	this.filter_list.splice(index,1);
	this.filterTrades();
  	if(this.filter_trades.length == 0 && this.filter_trade_names.length == 0){
  		this.sorted_photos = this.all_photos;
  	}
  	this.saveFilters(this.filter_list,this.filter_trades,this.filter_trade_names);
  }

  onDropdownShow(){
  	$(".shadow").show();
  }

  closeDropDown(){
  	if($(".ng2-dropdown-menu").hasClass("ng2-dropdown-menu--open") == true){
  		$(".ng2-dropdown-button").click();
  	}
  	$(".shadow").hide();
  }

  cancelAllFilters(type){
  	if(type == 'd'){
  		this.filter_trade_names = [];
  		this.removeAllFilters(type);
  	}
  	else{
  		this.filter_trades = [];
  		this.removeAllFilters(type);
  	}
  	this.filterTrades();
  	if(this.filter_trades.length == 0 && this.filter_trade_names.length == 0){
  		this.sorted_photos = this.all_photos;
  	}
  	this.saveFilters(this.filter_list,this.filter_trades,this.filter_trade_names);
  }

  removeAllFilters(type){
  	if(this.filter_list.length > 0){
  		var count = 0,all_filters = [];
  		this.filter_list.forEach(function(trade){
  			if(type == 'd'){
  				if(trade.tradeId != 0){
  					all_filters.push(trade);
  				}
  			}
  			if(type == 'a'){
  				if(trade.tradeId == 0){
  					all_filters.push(trade);
  				}
  			}
  			count = count + 1;
  		}); 
  		this.filter_list = all_filters;
  	}
  }

  sortTrades(type){
  	if(type == 'a'){
  		this.sort_icon = true;
  		this.order_default = 'trade_name';
  		this.order_advanced = 'trade_task';
  		this.sortOrder();
  	}
  	if(type == 'n'){
  		this.sort_icon = false;
  		this.order_default = 'total';
  		this.order_advanced = 'total';
  		this.sortOrder();
  	}
  }

  sortOrder(){
  	if(this.order_default_p == false){
		this.order_default_p = true;
	}
	else{
		this.order_default_p = false;
	}
	if(this.order_advanced_p == false){
		this.order_advanced_p = true;
	}
	else{
		this.order_advanced_p = false;
	}
  }

	downloadAndroid(url,name) {
	  let toast = this.toastCtrl.create({
	    message: 'Start downloading....',
	    duration: 3000,
	    position:'top',
	    cssClass: 'success'
	   });
	  toast.present();
	  const fileTransfer: FileTransferObject = this.transfer.create();
	  fileTransfer.download(url, this.file.externalRootDirectory + name.split('____').pop()).then((entry) => {
	    let toast = this.toastCtrl.create({
	        message: 'File downloaded.',
	        duration: 3000,
	        position:'top',
	        cssClass: 'success'
	       });
		toast.present(); 
	  }, (error) => {
	    let toast = this.toastCtrl.create({
	        message: 'Error',
	        duration: 3000,
	        position:'top',
	        cssClass: 'danger'
	       });
		toast.present(); 
	  });
	}

  uploadFile()
  {
  	let modal = this.modalCtrl.create('UploadfilePage', { file_type : this.fileType, page_type : '1', jobId : this.jobId });
  	 modal.onDidDismiss(data => {
  	 	if(data.length > 0)
	        {
	        const loading = this.loadingCtrl.create({});
    		loading.present(); 
	          var filesArray = [];
	          var file_type = '';
	          var images_types = ['jpg','png','jpeg','gif','bmp']; 
	          data.forEach(function(single_file){
	            if(images_types.indexOf(single_file._file.name.split('.').pop().toLowerCase()) >= 0)
	            {
	              file_type = '0';
	            }
	            else
	            {
	              file_type = '1';
	            }
	            var fileobj = {
	              file_name : single_file._file.name,
	              status : '0',
	              type : file_type,
	              file_path : localStorage.getItem('files_folder_path')
	            }
	            filesArray.push(fileobj);
	          });
	          this.companyProvider.addTradeFiles(this.jobId,localStorage.getItem('filt_TradeId'),filesArray,'temp').subscribe((filesdata)=>{
	              loading.dismissAll()
	              let toast = this.toastCtrl.create({
	                  message: 'Files added successfully.',
	                  duration: 3000
	                 });
	                 toast.present(); 
	                 if(this.folders == '1')
	                 {
	                 	this.getRelatedFiles();
	                 }
	                 else
	                 {
	                 	this.getFiles();
	                 }
	              },
				    err => {
				        loading.dismissAll();
				        this.showTechnicalError('1');
				    });
	        }
  	 });
  	 modal.present();
  } 

  // smailFiles()
  // {
  // 	let modal = this.modalCtrl.create('SmailfilesPage', { file_type : this.fileType });
  // 	 modal.onDidDismiss(data => {
  // 	 	if(data != undefined && data != '')
	 //        {      	
	 //        const loading = this.loadingCtrl.create({});
  //   		loading.present(); 
  //   		console.log(data)
	 //          var filesArray = [];
	 //          var file_type = '';
	 //          var images_types = ['jpg','png','jpeg','gif','bmp']; 
	 //          data.forEach(function(single_file){
	 //            if(images_types.indexOf(single_file.name.split('.').pop()) >= 0)
	 //            {
	 //              file_type = '0';
	 //            }
	 //            else
	 //            {
	 //              file_type = '1';
	 //            }
	 //            var fileobj = {
	 //              file_name : single_file.name,
	 //              status : '0',
	 //              type : file_type
	 //            }
	 //            filesArray.push(fileobj);
	 //          });
	 //          this.companyProvider.addTradeFiles(this.jobId,'0',filesArray,'smail').subscribe((filesdata)=>{
	 //              loading.dismissAll()
	 //              let toast = this.toastCtrl.create({
	 //                  message: 'Files added successfully.',
	 //                  duration: 3000
	 //                 });
	 //                 toast.present(); 
	 //                 this.getFiles();
	 //              });
	 //        }
  // 	 });
  // 	 modal.present();
  // }

  filemanagerFiles()
  {
  	let modal = this.modalCtrl.create('FilemanagerfilesPage', { file_type : this.fileType, jobId : this.jobId });
  	 modal.onDidDismiss(data => {
  	 	if(data != undefined && data != '')
	        {      	
	        const loading = this.loadingCtrl.create({});
    		loading.present(); 
	          var filesArray = [];
	          var file_type = '';
	          var images_types = ['jpg','png','jpeg','gif','bmp']; 
	          data.forEach(function(single_file){
	            if(images_types.indexOf(single_file.name.split('.').pop().toLowerCase()) >= 0)
	            {
	              file_type = '0';
	            }
	            else
	            {
	              file_type = '1';
	            }
	            var fileobj = {
	              file_name : single_file.name,
	              status : '0',
	              type : file_type,
	              folder_path : localStorage.getItem('filemanager_file_path'),
	              file_path : localStorage.getItem('files_folder_path')
	            }
	            filesArray.push(fileobj);
	          });

	          this.companyProvider.addTradeFiles(this.jobId,localStorage.getItem('filt_TradeId'),filesArray,'smail').subscribe((filesdata)=>{
	              loading.dismissAll()
	              let toast = this.toastCtrl.create({
	                  message: 'Files added successfully.',
	                  duration: 3000
	                 });
	                 toast.present(); 
	                 if(this.folders == '1')
	                 {
	                 	this.getRelatedFiles();
	                 }
	                 else
	                 {
	                 	this.getFiles();
	                 }
	              },
				    err => {
				        loading.dismissAll();
				        this.showTechnicalError('1');
				    });
	        }
  	 });
  	 modal.present();
  }
// clickTrade()
// {
// 	var filterTradeId = localStorage.getItem('filterTradeId');
// 	var previousId = localStorage.getItem('previousId');
// 	if(filterTradeId == '0')
// 	{
// 		this.sorted_photos = this.all_photos;
// 		localStorage.setItem('previousId',filterTradeId);
// 		return false;
// 	}
// 	if(filterTradeId != previousId)
// 	{
// 		this.sorted_photos = [];
// 		var sortedArray = [];
// 		localStorage.setItem('previousId',filterTradeId);
// 		this.all_photos.forEach(function(photo){
// 			if(photo.tradeId == filterTradeId)
// 			{
// 				sortedArray.push(photo);
// 			}
// 		});
// 		this.sorted_photos = sortedArray;
// 	}
// }

  downloadFile()
  {
  	let toast = this.toastCtrl.create({
        message: 'Start downloading...',
        duration: 2000,
        position: 'top',
        cssClass: 'success'
       });
       toast.present(); 
  }

  downloadFolder(folder_path)
  {
  	const loading = this.loadingCtrl.create({});
    loading.present();
    this.companyProvider.downloadFolders(folder_path).subscribe((downloaded)=>{
      if(downloaded.status == 1)
      {
        loading.dismissAll();
        this.downloaded_href = this.APIURL+'/salvum/'+downloaded.data.path;
        console.log(this.downloaded_href)
        let toast = this.toastCtrl.create({
            message: 'Start downloading...',
            position: 'top',
            duration: 2000,
            cssClass: 'success'
           });
           toast.present(); 
           setTimeout(function(){ document.getElementById('download_zip_files').click(); }, 1000);
      } 
      else
      {
        loading.dismissAll();
        let toast = this.toastCtrl.create({
            message: 'Error, plz try later.',
            position: 'top',
            duration: 3000,
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

  addFolder()
  {
  	let modal = this.modalCtrl.create('AddfolderPage', { file_type : this.fileType, job_files : '1', jobId : this.jobId });
  	 modal.onDidDismiss(data => {
  	 	if(data != undefined && data != '')
	        {  
	        	if(data == '1')
	        	{
	        		let toast = this.toastCtrl.create({
	                  message: 'Folder added successfully.',
	                  duration: 3000
	                 });
	                 toast.present(); 
	                 if(this.folders == '1')
	                 {
	                 	this.getRelatedFiles();
	                 }
	                 else
	                 {
	                 	this.getFiles();
	                 }
	        	}
	        	else
	        	{
	        		let toast = this.toastCtrl.create({
	                  message: 'Error while adding folder, plz try later.',
	                  duration: 3000
	                 });
	                 toast.present(); 
	        	}
	        }
	    });
  	 modal.present();
  }

  clickFolder(file_name,tradeId)
  {
  	if(file_name.search('____') == -1)
  	{
  		this.folders = '1';
  		localStorage.setItem('filterTradeId',tradeId);
  		localStorage.setItem('files_folder_path','directory/jobs_data/'+file_name);
  		this.getRelatedFiles();
  	}
  }

  openIt(filePath,fileType)
  {
  	if(fileType == 'directory')
  	{
  		localStorage.setItem('files_folder_path',filePath);
  		this.getRelatedFiles();
  	}
  }

  clickBreadcrumb(clicked_bread)
  {
  	var current_path = localStorage.getItem('files_folder_path');
  	if(current_path.search(clicked_bread) >= 0)
    {
        var file_path = current_path.split(clicked_bread)[0];
        file_path = file_path+clicked_bread;
        localStorage.setItem('files_folder_path',file_path);
        this.getRelatedFiles();
    }
  }

  getRelatedFiles()
  {
  	const loading = this.loadingCtrl.create({});
    loading.present(); 
    this.getBreadCrums();
  	this.companyProvider.getDirectoryFiles(localStorage.getItem('files_folder_path')).subscribe((related_files)=>{
    	if(related_files.data != null)
    	{
        	this.related_files = related_files.data.children; 
    	}
    	else
    	{
    		this.related_files = [];
    	}
    	loading.dismissAll();
    },
    err => {
        loading.dismissAll();
        this.showTechnicalError();
    });
  }

  getBreadCrums()
  {
    var file_path = localStorage.getItem('files_folder_path');
      var breadcrums = [];
      file_path.split('/').forEach(function(bread){
        breadcrums.push(bread);
      });
      this.breadcrums = breadcrums;
  }

  root(){
    this.navCtrl.setRoot('DashboardPage');
  };
  
  goToJobs(){
    this.navCtrl.push('ManagejobPage',{
    is_direct : '0'
    });
  };

  backToPage()
  {
    this.navCtrl.push('TradeDashboardPage',{
		jobId : this.jobId
	})
  }

}
