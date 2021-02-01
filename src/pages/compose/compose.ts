import { Component , ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, LoadingController, ViewController, MenuController, ToastController, AlertController, Events} from 'ionic-angular';
import { SmailserviceProvider } from '../../providers/smailservice/smailservice';
import { ContactserviceProvider } from '../../providers/contactservice/contactservice';
import { CompanyProvider } from '../../providers/company/company';
import { GroupserviceProvider } from '../../providers/groupservice/groupservice';
import * as CryptoJS from 'crypto-js'; 
import { SmailInboxPage } from '../smail-inbox/smail-inbox';
import * as $ from 'jquery';

@IonicPage() 
@Component({
  selector: 'page-compose', 
  templateUrl: 'compose.html',
  providers: [ContactserviceProvider, SmailserviceProvider, CompanyProvider, GroupserviceProvider]
}) 
export class ComposePage {
	@ViewChild("content") contentCtrl: NavController;
	pages: any;
	rootPage: ComposePage;
	data: any;
	public displayText:any; 
	userId: string;
	toId:any = [];
	ccId:string = '';
	bccId:string = '';
	subject: string = '';
	toUsers:any = [];
	override: Boolean = false;
	createdGroupLevel : string = '';
	editor_tab : string = 'format';
	level: any;
	openedLevel:any=[];
	ccCheckboxResult= [];
	testCheckboxResult = [];
	attacments = [];
	testCheckboxOpen: boolean;
	levelArray = [];
	forgetPwdModal = false;
	createdGroupId:any = null;
	create_grp_title : any = 'Create Group';
	p_groupname = '';
	p_grouplevel = 0;
	grouplevel = 0;
	groupname = '';
	directory: any;
	all_levels: any;
	baseUrl: any; 
	preState: any;
	allowed_levels: any  = [];
	selectedGroups:any;
	all_groups:any = [];
	groups:any = [];
	mailText: any;
	isJobChecked:Boolean = false;
	isGroupCreated:Boolean = false;
	file_path:any;
	showNodeStatic = null;
	showNodeChild = null;
	shownGroup = null;
	selectedFolder = 'folder';
	selectedLevel:any;
	foldername:any;
	folderName:any;
	prevId:any;
    cc:boolean = false;
    bccList: Boolean = false;
    bccCheckboxResult = [];
    alllevel:any;
    jobListingResult: any = [];
    trades: any = [];
    tradeContacts: any = [];
    allTrdCons: any = [];
    selectedTrade: any = '';
    selectedCompany:any;
    selectedJob:any = '';
    selectedType:any = '';
    isBrowser:any;
    mailDatas:any;
    desc: '';
    all_emails: any = [];
	constructor(public navCtrl: NavController, public navParams: NavParams,public groupprovider: GroupserviceProvider, public companyProvider: CompanyProvider, public viewCtrl: ViewController, public toastCtrl: ToastController, private menu: MenuController, public loadingCtrl: LoadingController, public ContactserviceProvider: ContactserviceProvider,private alertCtrl: AlertController, public smailserviceProvider: SmailserviceProvider, public modalCtrl: ModalController, public events:Events) {
		this.isBrowser = localStorage.getItem('isBrowser');
		this.menu.open('left');

		this.alllevel = JSON.parse(localStorage.getItem('alllevel'));
        var userId = localStorage.getItem('userinfo');
        this.baseUrl = localStorage.getItem('APIURL');
		this.userId  = localStorage.getItem('userinfo');
        var isLevelOpened = false;
        if (this.alllevel) {
            this.alllevel.forEach((value) => {
                var decrypted = CryptoJS.AES.decrypt(value, userId);
                if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level1' || decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level2' || decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level3' || decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level4') {
                    isLevelOpened = true;
                }
            });
        }

        if (!isLevelOpened) {
          let toast = this.toastCtrl.create({
            message: 'Please open level first.',
            duration: 3000,
            cssClass: 'danger',
            position: 'top'
          });
          toast.present();
          this.navCtrl.push('DashboardPage');
        }

		this.selectedGroups = this.navParams.get('data');
		
		if(this.selectedGroups == undefined){
			this.selectedGroups = '';
		}else{
			this.setLevelGroupsLoop();
		}
	
        this.all_levels = JSON.parse(localStorage.getItem('alllevel'));

	    if(this.all_levels){
	    	
	      	this.all_levels.forEach((value) => {
		        var decrypted = CryptoJS.AES.decrypt(value, userId);
		        var i;
		        if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level1'){
		          	this.openedLevel.push({'level': 1, 'name': 'level1'});
	          		this.levelArray = [{'level': 1, 'checked': true}];
					this.allowed_levels = [];
					for(i = 1; i <= 1; i++){
						this.allowed_levels.push('level'+i );
					}		
		        }else if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level2'){
		          	this.openedLevel.push({'level': 1, 'name': 'level1'});
	          		this.openedLevel.push({'level': 2, 'name': 'level2'});
	          		this.levelArray = [{'level': 1, 'checked': true},
								{'level': 2, 'checked': true}];
					this.allowed_levels = [];
					for(i = 1; i <= 2; i++){
						this.allowed_levels.push('level' + i);
					}
		        }else if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level3'){
		          	this.openedLevel.push({'level': 1, 'name': 'level1'});
		          	this.openedLevel.push({'level': 2, 'name': 'level2'});
		          	this.openedLevel.push({'level': 3, 'name': 'level3'});
		          	this.levelArray = [{'level': 1, 'checked': true},
								{'level': 2, 'checked': true},
								{'level': 3, 'checked': true}];
					this.allowed_levels = [];
					for(i = 1; i <= 3; i++){
						this.allowed_levels.push('level' + i);
					}
		        }else if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level4'){
		          	this.openedLevel.push({'level': 1, 'name': 'level1'});
		           	this.openedLevel.push({'level': 2, 'name': 'level2'});
		          	this.openedLevel.push({'level': 3, 'name': 'level3'});
		          	this.openedLevel.push({'level': 4, 'name': 'level4'});
		          	this.levelArray = [{'level': 1, 'checked': true},
								{'level': 2, 'checked': true},
								{'level': 3, 'checked': true},
								{'level': 4, 'checked': true}];
					this.allowed_levels = [];
					for(i = 1; i <= 4; i++){
						this.allowed_levels.push('level' + i );
					}
		        }else if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level0'){
		          	this.openedLevel = [];
		          	this.allowed_levels = [];
	          		this.levelArray = [{'level': 1, 'checked': false},
								{'level': 2, 'checked': false},
								{'level': 3, 'checked': false},
								{'level': 4, 'checked': false}];
		        }
		    });
	    }

	  	this.preState = localStorage.getItem('view');
  		this.companyProvider.getFolders(this.userId).subscribe((all_files)=>{
	  		if(all_files.data == null ){
	  			this.directory = [];
	  		}else{
	  			var myArray = all_files.data;
		     	for (var i = myArray.length - 1; i >= 0; --i) {
					if (this.allowed_levels.indexOf(myArray[i].name) == -1) {
				       myArray.splice(i,1);
				   }
				}
				this.directory = myArray;
	  		}
	    },
	    err => {
	        this.showTechnicalError();
	    });

	    events.subscribe('openLevel:changed', data => {  
	      this.locksClicked();
	    });
	};

	ionViewWillUnload() {
      this.events.unsubscribe('openLevel:changed');
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


	locksClicked(){
		this.baseUrl = localStorage.getItem('APIURL');
		this.userId  = localStorage.getItem('userinfo');
	
        this.all_levels = JSON.parse(localStorage.getItem('alllevel'));

	    if(this.all_levels){
	    	var userId  = localStorage.getItem('userinfo');
	      	this.all_levels.forEach((value) => {
		        var decrypted = CryptoJS.AES.decrypt(value, userId);
		        var i;
		        if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level1'){
		          	this.openedLevel.push({'level': 1, 'name': 'level1'});
	          		this.levelArray = [{'level': 1, 'checked': true}];
					this.allowed_levels = [];
					for(i = 1; i <= 1; i++){
						this.allowed_levels.push('level'+i );
					}		
		        }else if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level2'){
		          	this.openedLevel.push({'level': 1, 'name': 'level1'});
	          		this.openedLevel.push({'level': 2, 'name': 'level2'});
	          		this.levelArray = [{'level': 1, 'checked': true},
								{'level': 2, 'checked': true}];
					this.allowed_levels = [];
					for(i = 1; i <= 2; i++){
						this.allowed_levels.push('level' + i);
					}
		        }else if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level3'){
		          	this.openedLevel.push({'level': 1, 'name': 'level1'});
		          	this.openedLevel.push({'level': 2, 'name': 'level2'});
		          	this.openedLevel.push({'level': 3, 'name': 'level3'});
		          	this.levelArray = [{'level': 1, 'checked': true},
								{'level': 2, 'checked': true},
								{'level': 3, 'checked': true}];
					this.allowed_levels = [];
					for(i = 1; i <= 3; i++){
						this.allowed_levels.push('level' + i);
					}
		        }else if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level4'){
		          	this.openedLevel.push({'level': 1, 'name': 'level1'});
		           	this.openedLevel.push({'level': 2, 'name': 'level2'});
		          	this.openedLevel.push({'level': 3, 'name': 'level3'});
		          	this.openedLevel.push({'level': 4, 'name': 'level4'});
		          	this.levelArray = [{'level': 1, 'checked': true},
								{'level': 2, 'checked': true},
								{'level': 3, 'checked': true},
								{'level': 4, 'checked': true}];
					this.allowed_levels = [];
					for(i = 1; i <= 4; i++){
						this.allowed_levels.push('level' + i );
					}
		        }else if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level0'){
		          	this.openedLevel = [];
		          	this.allowed_levels = [];
	          		this.levelArray = [];
	          		//localStorage.setItem('selectedLevel', 0);
	          		localStorage.removeItem('selectedLevel');
		        }
		    });
	    }

	    this.companyProvider.getFolders(this.userId).subscribe((all_files)=>{
	  		if(all_files.data == null ){
	  			this.directory = [];
	  		}else{
	  			var myArray = all_files.data;
		     	for (var i = myArray.length - 1; i >= 0; --i) {
					if (this.allowed_levels.indexOf(myArray[i].name) == -1) {
				       myArray.splice(i,1);
				   }
				}
				this.directory = myArray;
	  		}
	    },
	    err => {
	        this.showTechnicalError();
	    });

	    this.getAllGroups();

	     const loading = this.loadingCtrl.create({});
	    loading.present();
	    // let headers = new Headers({ 'Content-Type': 'application/json' });
	    // let options = new RequestOptions({ headers: headers });

	    this.ContactserviceProvider.contactsList(this.userId).subscribe((data)=>{
	    	loading.dismissAll();
		    var finalArray = [];
		    var values = [];
		    var value;
		    var cunt = 0;
		    var i;
		    // Remove Duplicate Value
		    for(i = 0; i < data.length; i++) {
		        value = data[i];
		        if(value.senderSetLevel != 0 && value.reciverSetLevel != 0 && value.memberstatus == 2){
		        	if(finalArray.length > 0){
				        if(finalArray[cunt]._id.indexOf(value._id) === -1) {
					        finalArray.push(data[i]);
					        values.push(value);
					        cunt = cunt + 1;
				          }
				    }else{
				        finalArray.push(value);
				    }
		       	}
		    }

		    for (i = finalArray.length - 1; i >= 0; --i) {
		    	if(finalArray[i].senderId == this.userId){
		    		if (this.allowed_levels.indexOf('level'+finalArray[i].senderSetLevel) == -1) {
				       finalArray.splice(i,1);
				   }
		    	}else{
		    		if (this.allowed_levels.indexOf('level'+finalArray[i].reciverSetLevel) == -1) {
				       finalArray.splice(i,1);
				   }
		    	}	
			}
		    this.data = finalArray;

	    	//loop for unlocked contacts
			//if all levels are locked
			if(this.data.length == 0){
				this.testCheckboxResult = [];
				this.ccCheckboxResult = [];
				this.bccCheckboxResult = [];
			}else{
				//if levels are opened
				var isExist;
				var j;
				for(i=this.testCheckboxResult.length; i > 0; i--){
					isExist = false;
    				for(j=0; j < this.data.length; j++){
			    		if(this.testCheckboxResult[i-1].member_id == this.data[j].member_id){
			    			isExist = true;
			    		}
			    	}
			    	if(!isExist){

		    			this.testCheckboxResult.splice(i-1, 1);
			    	}
		    	}
		    	//cc contacts list
		    	for(i=this.ccCheckboxResult.length; i > 0; i--){
					isExist = false;
    				for(j=0; j < this.data.length; j++){
			    		if(this.ccCheckboxResult[i-1].member_id == this.data[j].member_id){
			    			isExist = true;
			    		}
			    	}
			    	if(!isExist){
		    			this.ccCheckboxResult.splice(i-1, 1);
			    	}
		    	}

		    	for(i=this.bccCheckboxResult.length; i > 0; i--){
					isExist = false;
    				for(j=0; j < this.data.length; j++){
			    		if(this.bccCheckboxResult[i-1].member_id == this.data[j].member_id){
			    			isExist = true;
			    		}
			    	}
			    	if(!isExist){
		    			this.bccCheckboxResult.splice(i-1, 1);
			    	}
		    	}
			}
		    if(this.data != ''){
		    	var self = this;
		    	this.all_emails = [];
		    	this.data.forEach(function(data){
		    		self.all_emails.push(data);
		    	})
		    }
		    
	    },
	    err => {
	        loading.dismissAll();
	        this.showTechnicalError();
	    });
	};

	editoToolbar(){
		if(this.editor_tab == 'format'){
			$('.cke_toolbar:nth-child(2)').show()
			$('.cke_toolbar:nth-child(7)').show()

			$('.cke_toolbar:nth-child(4)').hide()
			$('.cke_toolbar:nth-child(9)').hide()
			$('.cke_toolbar:nth-child(8)').hide()
			$('.cke_toolbar:nth-child(6)').hide()
			$('.cke_toolbar:nth-child(11)').hide()
			$('.cke_toolbar:nth-child(12)').hide()
		}
		if(this.editor_tab == 'insert'){
			$('.cke_toolbar:nth-child(4)').show()
			$('.cke_toolbar:nth-child(8)').show()
			$('.cke_toolbar:nth-child(9)').show()

			$('.cke_toolbar:nth-child(2)').hide()
			$('.cke_toolbar:nth-child(7)').hide()
			$('.cke_toolbar:nth-child(6)').hide()
			$('.cke_toolbar:nth-child(11)').hide()
			$('.cke_toolbar:nth-child(12)').hide()
		}
		if(this.editor_tab == 'styles'){
			$('.cke_toolbar:nth-child(6)').show()
			$('.cke_toolbar:nth-child(11)').show()
			$('.cke_toolbar:nth-child(12)').show()

			$('.cke_toolbar:nth-child(4)').hide()
			$('.cke_toolbar:nth-child(9)').hide()
			$('.cke_toolbar:nth-child(8)').hide()
			$('.cke_toolbar:nth-child(2)').hide()
			$('.cke_toolbar:nth-child(7)').hide()
		}
	}

	editorReady(){
		var self = this;
		setTimeout(function(){
			self.editoToolbar();
		},200);
		
	}

	ionViewDidLoad() { 	
	    this.pages = [
	    	{ title: 'Compose', component: 'ComposePage', icon: "md-create" },
	    	{ title: 'Inbox', component: 'SmailInboxPage', icon: "mail-outline" },
	    	{ title: 'Sent', component: 'SmailInboxPage', icon: "md-mail-open" }
	    ];

	   	// this.allowed_levels.push('level1');
	    // this.allowed_levels.push('level2');
	    this.getAllGroups();
	    const loading = this.loadingCtrl.create({});
	    loading.present();
	    // let headers = new Headers({ 'Content-Type': 'application/json' });
	    // let options = new RequestOptions({ headers: headers });

	    this.ContactserviceProvider.contactsList(this.userId).subscribe((data)=>{
	    	loading.dismissAll();
		    var finalArray = [];
		    var values = [];
		    var value;
		    var cunt = 0;
		    var i;
		    // Remove Duplicate Value
		    for(i = 0; i < data.length; i++) {
		        value = data[i];
		        if(value.senderSetLevel != 0 && value.reciverSetLevel != 0 && value.memberstatus == 2){
		        	if(finalArray.length > 0){
				        if(finalArray[cunt]._id.indexOf(value._id) === -1) {
					        finalArray.push(data[i]);
					        values.push(value);
					        cunt = cunt + 1;
				          }
				    }else{
				        finalArray.push(value);
				    }
		       	}
		    }

		    for (i = finalArray.length - 1; i >= 0; --i) {
		    	if(finalArray[i].senderId == this.userId){
		    		if (this.allowed_levels.indexOf('level'+finalArray[i].senderSetLevel) == -1) {
				       finalArray.splice(i,1);
				   }
		    	}else{
		    		if (this.allowed_levels.indexOf('level'+finalArray[i].reciverSetLevel) == -1) {
				       finalArray.splice(i,1);
				   }
		    	}	
			}
		    this.data = finalArray;
		    this.applyBidReply();
		    var self = this;
		    if(this.data != ''){
		    	this.all_emails = [];
		    	this.data.forEach(function(data){
		    		self.all_emails.push(data);
		    	})
		    }
	    },
	    err => {
	        loading.dismissAll();
	        this.showTechnicalError();
	    });
	};

	applyBidReply(){
		if(this.navParams.get('bid_reply') == '1'){
			this.checkBoxClicked(true);
			this.selectedJob = this.navParams.get('jobId');
			this.getTrades('',this.selectedJob,'','1');
		}
	}
	
	openPage(page){
	    // Reset the content nav to have just this page
	    // we wouldn't want the back button to show in this scenario
	    if(page.title == 'Inbox'){
	    	localStorage.setItem('view', 'Inbox');
	    	this.navCtrl.setRoot('SmailInboxPage');
	    }else if(page.title == 'Sent'){
	    	localStorage.setItem('view', 'Sent');
	    	this.navCtrl.setRoot('SmailInboxPage');
	    }
	    
  	};

  	toUserName(name){
	  	this.toId = name;
	  	// for(var j=0; j < name.length; j++){
	  	// 	for(var i=0; i < this.data.length; i++){
		  // 		if(this.data[i]._id == name[j]){
		  // 			this.data.splice(i, 1);
		  // 		}
		  // 	}
	  	// }
	};

	toCcName(name){
	  	this.ccId = name;
	};

	toBccName(name){
	  	this.bccId = name;
	};


	removeFile(index){
		const loading = this.loadingCtrl.create({});
	    loading.present();
		this.companyProvider.deleteDirectoryFiles('directory/smail_data/'+this.attacments[index]).subscribe((response)=>{
			loading.dismissAll();
			this.attacments.splice(index, 1);
		},
	    err => {
	        loading.dismissAll();
	        this.showTechnicalError('1');
	    });
	};

	sendSmail(){
		//if overridecheckbox clicked
		var usersArray = [], fromUser = [], string, i, j;
		//if user select the job button
		if(this.isJobChecked == true){

		}else{
			// if user does't select the job button
			//is group message, i.e. multiple contacts selected for email 
			var isGroupMessage = false;

			//if simple mail compose i.e. no group selected via contact form
			if(this.selectedGroups == ''){
				//is contact selected for to option
				if(this.testCheckboxResult.length > 0){
					//is multiple contact selected for to option
					if(this.testCheckboxResult.length > 1){
						isGroupMessage = true;
					//if single to user selected and cc selected or multiple
					}else if(this.testCheckboxResult.length > 0 && this.ccCheckboxResult.length > 0){
						isGroupMessage = true;
					}else{
						//if contact selected for cc option
						if(this.ccCheckboxResult.length > 0){
							//if multiple contacts selected for cc option
							if(this.ccCheckboxResult.length > 1){
								isGroupMessage = true;
							}
						}
					}
				}else{
					//if contact selected for cc option
					if(this.ccCheckboxResult.length > 0){
						//if multiple contacts selected for cc option
						if(this.ccCheckboxResult.length > 1){
							isGroupMessage = true;
						}
					}
				}
			}else{
				//if multiple groups or contacts are selected 
				if(this.selectedGroups.selectedGroups.length > 0){
					isGroupMessage = true;
				}else if(this.selectedGroups.selectedGroups.length > 1 || this.selectedGroups.selectedContacts.length > 1){
					isGroupMessage = true;
					//if single or multile group and contact selected
				}else if(this.selectedGroups.selectedGroups.length > 0 && this.selectedGroups.selectedContacts.length > 0){
					isGroupMessage = true;
				}
			}
			
			//console.log(this.selectedGroups.selectedGroups); 
			
			//if is group message
			if(isGroupMessage == true){
				//if group is created i.e. random group message
				if(this.isGroupCreated == true){

					if(this.subject == '' && this.desc == ''){
				  		let alert = this.alertCtrl.create({
						    title: 'Smail',
						    subTitle: 'Send this message without a subject or text in the body?',
						    buttons: [
						      	{
							        text: 'Cancel',
							        role: 'cancel',
							        handler: () => {
							          console.log('Cancel clicked');
							        }
						      	},
						      	{
							        text: 'OK',
							        handler: () => {
							          	//if message level not override
										// let alert = this.alertCtrl.create();
					    	// 			alert.setTitle('Select Message Level');
					    	// 			this.alllevel = JSON.parse(localStorage.getItem('alllevel'));
								  //       var userId = localStorage.getItem('userinfo');
								  //       var isLevelOpened = false;
							   //          this.alllevel.forEach((value) => {
							   //              console.log(value);
							   //              var decrypted = CryptoJS.AES.decrypt(value, userId);
							   //              if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level1'){
							   //              	alert.addInput({
										// 		    type: 'radio',
										// 		    label: 'Level 1',
										// 		    value: '1',
										// 	     	checked: false
										// 	    });
							   //              }else if( decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level2'){
							   //              	alert.addInput({
										// 		    type: 'radio',
										// 		    label: 'Level 2',
										// 		    value: '2',
										// 	     	checked: false
										// 	    });
							   //              } else if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level3'){
							   //              	alert.addInput({
										// 		    type: 'radio',
										// 		    label: 'Level 3',
										// 		    value: '3',
										// 	     	checked: false
										// 	    });
							   //              } else if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level4') {
							   //                  alert.addInput({
										// 		    type: 'radio',
										// 		    label: 'Level 4',
										// 		    value: '4',
										// 	     	checked: false
										// 	    });
							   //              }
							   //          });

									 //    alert.addButton('Cancel');

									    // alert.addButton({
									    //   	text: 'Okay',
									    //   	handler: data => {
										        if(this.createdGroupLevel){
										        	usersArray = [], fromUser = [];
														
													fromUser.push({'userId': localStorage.getItem('userinfo'), 'level': this.createdGroupLevel});
													
													if(this.selectedGroups == ''){
														for(i=0; i < this.testCheckboxResult.length; i++){
															
															usersArray.push({'userId': this.testCheckboxResult[i].userId, 'level': this.createdGroupLevel});
														}
														if(this.ccCheckboxResult.length > 0){
															for(i=0; i < this.ccCheckboxResult.length; i++){
																usersArray.push({'userId': this.ccCheckboxResult[i].userId, 'level': this.createdGroupLevel});
															}
														}
														
														if(this.bccCheckboxResult.length > 0){
															for(i=0; i < this.bccCheckboxResult.length; i++){
																usersArray.push({'userId': this.bccCheckboxResult[i].userId, 'level': this.createdGroupLevel});
															}
														}
														
													}else if(this.selectedGroups.selectedGroups.length > 0){
														for(i=0; i < this.selectedGroups.selectedGroups.length; i++){
															string = this.selectedGroups.selectedGroups[i].groupdata;
															string = string.split(',');
															for(j=0; j < string.length; j++){
																if(string[j] != ''){
																	usersArray.push({'userId': string[j], 'level': this.createdGroupLevel});
																}
															}
														}
													}

												  	var mailData = {
												  		'toId' : usersArray,
												  		'fromId': fromUser,
												  		'subject': this.subject,
												  		'message': this.desc,
												  		'attacment': this.attacments,
												  		'isReply': false,
												  		'mailId': null,
												  		'bcc': this.bccId,
												  		'cc': this.ccId,
												  		'override': true,
												  		'level': this.createdGroupLevel,
												  		'isGroupMsg': true,
												  		'read':false,
												  		'isForward': false,
												  		'jobId': null,
		  												'tradeId': null
												  	};
												  	
												  	if(usersArray.length == 0){
												  		let toast = this.toastCtrl.create({
													            message: 'Please specify at least one recipient.',
													            duration: 3000,
													            cssClass: 'danger',
            													position: 'top'
												           });
											           toast.present();
												  	}else{
												  		const loading = this.loadingCtrl.create({});
													    loading.present();
													    this.smailserviceProvider.sendSmail(mailData).subscribe((data)=>{
													      
													      	loading.dismissAll();
													      	let toast = this.toastCtrl.create({
													                    message: 'Mail has been sent successfully.',
													                    duration: 3000,
													                    cssClass: 'success',
            															position: 'top'
													                  });
													          	toast.present(); 
													          	localStorage.setItem('view', 'Sent');
				    											// this.navCtrl.setRoot(SmailPage);
													      	this.navCtrl.push('SmailInboxPage');
													    },
													    err => {
													        loading.dismissAll();
													        this.showTechnicalError('1');
													    });
												  	}
										        }
									    //   	}
									    // });

									    // alert.present().then(() => {
									    //   this.testCheckboxOpen = true;
									    // });
							          	
							        }
						      	}
						    ]
						});
					    alert.present();
			  		}else{
			  	
			  	// 		let alert = this.alertCtrl.create();
						// alert.setTitle('Select Message Level');
						// this.alllevel = JSON.parse(localStorage.getItem('alllevel'));
						// var userId = localStorage.getItem('userinfo');
						// var isLevelOpened = false;
						// this.alllevel.forEach((value) => {
						//     console.log(value);
						//     var decrypted = CryptoJS.AES.decrypt(value, userId);
						//     if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level1'){
						//     	alert.addInput({
						// 		    type: 'radio',
						// 		    label: 'Level 1',
						// 		    value: '1',
						// 	     	checked: false
						// 	    });
						//     }else if( decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level2'){
						//     	alert.addInput({
						// 		    type: 'radio',
						// 		    label: 'Level 2',
						// 		    value: '2',
						// 	     	checked: false
						// 	    });
						//     } else if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level3'){
						//     	alert.addInput({
						// 		    type: 'radio',
						// 		    label: 'Level 3',
						// 		    value: '3',
						// 	     	checked: false
						// 	    });
						//     } else if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level4') {
						//         alert.addInput({
						// 		    type: 'radio',
						// 		    label: 'Level 4',
						// 		    value: '4',
						// 	     	checked: false
						// 	    });
						//     }
						// });

						// alert.addButton('Cancel');

						// alert.addButton({
						//   	text: 'Okay',
						//   	handler: data => {
						        if(this.createdGroupLevel){
						        	usersArray = [], fromUser = [];
									fromUser.push({'userId': localStorage.getItem('userinfo'), 'level': this.createdGroupLevel});
									
									if(this.selectedGroups == ''){
										for(i=0; i < this.testCheckboxResult.length; i++){
											
											usersArray.push({'userId': this.testCheckboxResult[i].userId, 'level': this.createdGroupLevel});
										}
										if(this.ccCheckboxResult.length > 0){
											for(i=0; i < this.ccCheckboxResult.length; i++){
												usersArray.push({'userId': this.ccCheckboxResult[i].userId, 'level': this.createdGroupLevel});
											}
										}
										
										if(this.bccCheckboxResult.length > 0){
											for(i=0; i < this.bccCheckboxResult.length; i++){
												usersArray.push({'userId': this.bccCheckboxResult[i].userId, 'level': this.createdGroupLevel});
											}
										}
										
									}else if(this.selectedGroups.selectedGroups.length > 0){
										for(i=0; i < this.selectedGroups.selectedGroups.length; i++){
											string = this.selectedGroups.selectedGroups[i].groupdata;
											string = string.split(',');
											for(j=0; j < string.length; j++){
												if(string[j] != ''){
													usersArray.push({'userId': string[j], 'level': this.createdGroupLevel});
												}
											}
										}
									}

								  	var mailData = {
								  		'toId' : usersArray,
								  		'fromId': fromUser,
								  		'subject': this.subject,
								  		'message': this.desc,
								  		'attacment': this.attacments,
								  		'isReply': false,
								  		'mailId': null,
								  		'bcc': this.bccId,
								  		'cc': this.ccId,
								  		'override': true,
								  		'level': this.createdGroupLevel,
								  		'isGroupMsg': true,
								  		'read':false,
								  		'isForward': false,
								  		'jobId': null,
											'tradeId': null
								  	};
						
								  	if(usersArray.length == 0){
								  		let toast = this.toastCtrl.create({
									            message: 'Please specify at least one recipient.',
									            duration: 3000,
									            cssClass: 'danger',
												position: 'top'
								           });
							           toast.present();
								  	}else{
								  		const loading = this.loadingCtrl.create({});
									    loading.present();
									    this.smailserviceProvider.sendSmail(mailData).subscribe((data)=>{
									   
									      	loading.dismissAll();
									      	let toast = this.toastCtrl.create({
									                    message: 'Mail has been sent successfully.',
									                    duration: 3000,
									                    cssClass: 'success',
														position: 'top'
									                  });
									          	toast.present(); 
									          	localStorage.setItem('view', 'Sent');
												// this.navCtrl.setRoot(SmailPage);
									      	this.navCtrl.push('SmailInboxPage');
									    },
									    err => {
									        loading.dismissAll();
									        this.showTechnicalError('1');
									    });
								  	}
						        }
						//   	}
						// });

						// alert.present().then(() => {
						//   this.testCheckboxOpen = true;
						// });

			  		}
				}else{
					
					//if group is not created
					//if override selected i.e. message override
					if(this.override == true){
						if(this.level == undefined){
							let toast = this.toastCtrl.create({
					                    	message: 'Please select override level.',
					                    	duration: 3000,
					                    	cssClass: 'danger',
            								position: 'top'
					                  	});
					          			toast.present(); 
						}else{
							if(this.subject == '' && this.desc == ''){
						  		let alert = this.alertCtrl.create({
								    title: 'Smail',
								    subTitle: 'Send this message without a subject or text in the body?',
								    buttons: [
								      	{
									        text: 'Cancel',
									        role: 'cancel',
									        handler: () => {
									      
									        }
								      	},
								      	{
									        text: 'OK',
									        handler: () => {
									          	//if message level not override
												let alert = this.alertCtrl.create();
							    				alert.setTitle('Select Message Level');
							    				this.alllevel = JSON.parse(localStorage.getItem('alllevel'));
										        var userId = localStorage.getItem('userinfo');
										        // var isLevelOpened = false;
									            this.alllevel.forEach((value) => {
									                var decrypted = CryptoJS.AES.decrypt(value, userId);
									                if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level1'){
									                	alert.addInput({
														    type: 'radio',
														    label: 'Level 1',
														    value: '1',
													     	checked: false
													    });
									                }else if( decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level2'){
									                	alert.addInput({
														    type: 'radio',
														    label: 'Level 2',
														    value: '2',
													     	checked: false
													    });
									                } else if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level3'){
									                	alert.addInput({
														    type: 'radio',
														    label: 'Level 3',
														    value: '3',
													     	checked: false
													    });
									                } else if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level4') {
									                    alert.addInput({
														    type: 'radio',
														    label: 'Level 4',
														    value: '4',
													     	checked: false
													    });
									                }
									            });

											    alert.addButton('Cancel');

											    alert.addButton({
											      	text: 'Okay',
											      	handler: data => {
												        if(data){
												    
												        	usersArray = [], fromUser = [];
																
															fromUser.push({'userId': localStorage.getItem('userinfo'), 'level': data});
															
															if(this.selectedGroups == ''){
																for(i=0; i < this.testCheckboxResult.length; i++){
															
																	usersArray.push({'userId': this.testCheckboxResult[i].userId, 'level': data});
																}
																if(this.ccCheckboxResult.length > 0){
																	for(i=0; i < this.ccCheckboxResult.length; i++){
																		usersArray.push({'userId': this.ccCheckboxResult[i].userId, 'level': data});
																	}
																}
																
																if(this.bccCheckboxResult.length > 0){
																	for(i=0; i < this.bccCheckboxResult.length; i++){
																		usersArray.push({'userId': this.bccCheckboxResult[i].userId, 'level': data});
																	}
																}
																
															}else if(this.selectedGroups.selectedGroups.length > 0){
																for(i=0; i < this.selectedGroups.selectedGroups.length; i++){
																	string = this.selectedGroups.selectedGroups[i].groupdata;
																	string = string.split(',');
																	for(j=0; j < string.length; j++){
																		if(string[j] != ''){
																			usersArray.push({'userId': string[j], 'level': data});
																		}
																	}
																}
															}

														  	var mailData = {
														  		'toId' : usersArray,
														  		'fromId': fromUser,
														  		'subject': this.subject,
														  		'message': this.desc,
														  		'attacment': this.attacments,
														  		'isReply': false,
														  		'mailId': null,
														  		'bcc': this.bccId,
														  		'cc': this.ccId,
														  		'override': true,
														  		'level': data,
														  		'isGroupMsg': true,
														  		'read':false,
														  		'isForward': false,
														  		'jobId': null,
		  														'tradeId': null
														  	};
														  	
														  	if(usersArray.length == 0){
														  		let toast = this.toastCtrl.create({
															            message: 'Please specify at least one recipient.',
															            duration: 3000,
															            cssClass: 'danger',
            															position: 'top'
														           });
													           toast.present();
														  	}else{
														  		const loading = this.loadingCtrl.create({});
															    loading.present();
															    this.smailserviceProvider.sendSmail(mailData).subscribe((data)=>{
															     
															      	loading.dismissAll();
															      	let toast = this.toastCtrl.create({
															                    message: 'Mail has been sent successfully.',
															                    duration: 3000,
															                    cssClass: 'danger',
            																	position: 'top'
															                  });
															          	toast.present(); 
															          	localStorage.setItem('view', 'Sent');
						    											// this.navCtrl.setRoot(SmailPage);
															      	this.navCtrl.push('SmailInboxPage');
															    },
															    err => {
															        loading.dismissAll();
															        this.showTechnicalError('1');
															    });
														  	}
												        }
											      	}
											    });

											    alert.present().then(() => {
											      this.testCheckboxOpen = true;
											    });
									          	
									        }
								      	}
								    ]
								});
							    alert.present();
					  		}else{
					  			
					        	var data = this.level;
					        	usersArray = [], fromUser = [];
								
								fromUser.push({'userId': localStorage.getItem('userinfo'), 'level': data});
								
								if(this.selectedGroups == ''){
									for(i=0; i < this.testCheckboxResult.length; i++){
										
										usersArray.push({'userId': this.testCheckboxResult[i].userId, 'level': data});
									}
									if(this.ccCheckboxResult.length > 0){
										for(i=0; i < this.ccCheckboxResult.length; i++){
											usersArray.push({'userId': this.ccCheckboxResult[i].userId, 'level': data});
										}
									}
									
									if(this.bccCheckboxResult.length > 0){
										for(i=0; i < this.bccCheckboxResult.length; i++){
											usersArray.push({'userId': this.bccCheckboxResult[i].userId, 'level': data});
										}
									}
									
								}else if(this.selectedGroups.selectedGroups.length > 0){
									for(i=0; i < this.selectedGroups.selectedGroups.length; i++){
										string = this.selectedGroups.selectedGroups[i].groupdata;
										string = string.split(',');
										for(j=0; j < string.length; j++){
											if(string[j] != ''){
												usersArray.push({'userId': string[j], 'level': data});
											}
										}
									}
								}

							  	this.mailDatas = {
							  		'toId' : usersArray,
							  		'fromId': fromUser,
							  		'subject': this.subject,
							  		'message': this.desc,
							  		'attacment': this.attacments,
							  		'isReply': false,
							  		'mailId': null,
							  		'bcc': this.bccId,
							  		'cc': this.ccId,
							  		'override': true,
							  		'level': data,
							  		'isGroupMsg': true,
							  		'read':false,
							  		'isForward': false,
							  		'jobId': null,
		  							'tradeId': null
							  	};
							
							  	if(usersArray.length == 0){
							  		let toast = this.toastCtrl.create({
								            message: 'Please specify at least one recipient.',
								            duration: 3000,
								            cssClass: 'danger',
            								position: 'top'
							           });
						           toast.present();
							  	}else{
							  		const loading = this.loadingCtrl.create({});
								    loading.present();
								    this.smailserviceProvider.sendSmail(this.mailDatas).subscribe((data)=>{
								   
								      	loading.dismissAll();
								      	let toast = this.toastCtrl.create({
								                    message: 'Mail has been sent successfully.',
								                    duration: 3000,
								                    cssClass: 'success',
            										position: 'top'
								                  });
								          	toast.present(); 
								          	localStorage.setItem('view', 'Sent');
											// this.navCtrl.setRoot(SmailPage);
								      	this.navCtrl.push('SmailInboxPage');
								    },
								    err => {
								        loading.dismissAll();
								        this.showTechnicalError('1');
								    });
							  	}
				        	}	 
				        }
					}else{ 
						// not override
						
						if(this.subject ==  '' && this.desc == ''){
					  		let alert = this.alertCtrl.create({
							    title: 'Smail',
							    subTitle: 'Send this message without a subject or text in the body?',
							    buttons: [
							      	{
								        text: 'Cancel',
								        role: 'cancel',
								        handler: () => {
								         
								        }
							      	},
							      	{
								        text: 'OK',
								        handler: () => {
								          	//if message level not override
											let alert = this.alertCtrl.create();
						    				alert.setTitle('5Select Message Level');
						    				this.alllevel = JSON.parse(localStorage.getItem('alllevel'));
									        var userId = localStorage.getItem('userinfo');
									        // var isLevelOpened = false;
								            this.alllevel.forEach((value) => {
								            
								                var decrypted = CryptoJS.AES.decrypt(value, userId);
								                if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level1'){
								                	alert.addInput({
													    type: 'radio',
													    label: 'Level 1',
													    value: '1',
												     	checked: false
												    });
								                }else if( decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level2'){
								                	alert.addInput({
													    type: 'radio',
													    label: 'Level 2',
													    value: '2',
												     	checked: false
												    });
								                } else if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level3'){
								                	alert.addInput({
													    type: 'radio',
													    label: 'Level 3',
													    value: '3',
												     	checked: false
												    });
								                } else if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level4') {
								                    alert.addInput({
													    type: 'radio',
													    label: 'Level 4',
													    value: '4',
												     	checked: false
												    });
								                }
								            });

										    alert.addButton('Cancel');

										    alert.addButton({
										      	text: 'Okay',
										      	handler: data => {
											        if(data){
											        	
											        	usersArray = [], fromUser = [];
														
														fromUser.push({'userId': localStorage.getItem('userinfo'), 'level': data});
														
														if(this.selectedGroups == ''){
															for(i=0; i < this.testCheckboxResult.length; i++){
															
																usersArray.push({'userId': this.testCheckboxResult[i].userId, 'level': data});
															}
															if(this.ccCheckboxResult.length > 0){
																for(i=0; i < this.ccCheckboxResult.length; i++){
																	usersArray.push({'userId': this.ccCheckboxResult[i].userId, 'level': data});
																}
															}
															
															if(this.bccCheckboxResult.length > 0){
																for(i=0; i < this.bccCheckboxResult.length; i++){
																	usersArray.push({'userId': this.bccCheckboxResult[i].userId, 'level': data});
																}
															}
															
														}else if(this.selectedGroups.selectedGroups.length > 0){
															for(i=0; i < this.selectedGroups.selectedGroups.length; i++){
																var string = this.selectedGroups.selectedGroups[i].groupdata;
																string = string.split(',');
																for(j=0; j < string.length; j++){
																	if(string[j] != ''){
																		usersArray.push({'userId': string[j], 'level': data});
																	}
																}
															}
														}

													  	var mailData = {
													  		'toId' : usersArray,
													  		'fromId': fromUser,
													  		'subject': this.subject,
													  		'message': this.desc,
													  		'attacment': this.attacments,
													  		'isReply': false,
													  		'mailId': null,
													  		'bcc': this.bccId,
													  		'cc': this.ccId,
													  		'override': true,
													  		'level': data,
													  		'isGroupMsg': true,
													  		'read':false,
													  		'isForward': false,
													  		'jobId': null,
		  													'tradeId': null
													  	};
													
													  	if(usersArray.length == 0){
													  		let toast = this.toastCtrl.create({
														            message: 'Please specify at least one recipient.',
														            duration: 3000,
														            cssClass: 'success',
            														position: 'top'
													           });
												           toast.present();
													  	}else{
													  		const loading = this.loadingCtrl.create({});
														    loading.present();
														    this.smailserviceProvider.sendSmail(mailData).subscribe((data)=>{
														      
														      	loading.dismissAll();
														      	let toast = this.toastCtrl.create({
														                    message: 'Mail has been sent successfully.',
														                    duration: 3000,
														                    cssClass: 'success',
            																position: 'top'
														                  });
														          	toast.present(); 
														          	localStorage.setItem('view', 'Sent');
					    											// this.navCtrl.setRoot(SmailPage);
														      	this.navCtrl.push('SmailInboxPage');
														    },
														    err => {
														        loading.dismissAll();
														        this.showTechnicalError('1');
														    });
													  	}
											        }
										      	}
										    });

										    alert.present().then(() => {
										      this.testCheckboxOpen = true;
										    });
								          	
								        }
							      	}
							    ]
							});
						    alert.present();
				  		}else{
				  			if(this.override == false && this.testCheckboxResult.length > 1 && this.isJobChecked == false && this.level != '' && this.level != undefined){
				  				this.conditionalSend(this.level);
				  			}
				  			else{
				  			if(this.level != '' && this.level != undefined && this.level != null){
				  				this.conditionalSend(this.level);
				  			}
				  			else{
				  			let alert = this.alertCtrl.create();
		    				alert.setTitle('Select Message Level');
		    				this.alllevel = JSON.parse(localStorage.getItem('alllevel'));
					        var userId = localStorage.getItem('userinfo');
					        // var isLevelOpened = false;
				            this.alllevel.forEach((value) => {
				        
				                var decrypted = CryptoJS.AES.decrypt(value, userId);
				                if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level1'){
				                	alert.addInput({
									    type: 'radio',
									    label: 'Level 1',
									    value: '1',
								     	checked: false
								    });
				                }else if( decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level2'){
				                	alert.addInput({
									    type: 'radio',
									    label: 'Level 2',
									    value: '2',
								     	checked: false
								    });
				                } else if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level3'){
				                	alert.addInput({
									    type: 'radio',
									    label: 'Level 3',
									    value: '3',
								     	checked: false
								    });
				                } else if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level4') {
				                    alert.addInput({
									    type: 'radio',
									    label: 'Level 4',
									    value: '4',
								     	checked: false
								    });
				                }
				            });

						    alert.addButton('Cancel');

						    alert.addButton({
						      	text: 'Okay',
						      	handler: data => {
							        if(data){
										this.conditionalSend(data);
							        }
						      	}
						    });

						    alert.present().then(() => {
						      this.testCheckboxOpen = true;
						    });
						    }
						   }
				  		}
					}
				}
			}else{
				
				//if only one contact selected for email sent
				var fromLevel = '';
                var toLevel = '';
				usersArray = [], fromUser = [];
				var ccArray = [], bccArray = [];
				
				for (i = 0; i < this.testCheckboxResult.length; i++) {
					for (j = 0; j < this.data.length; j++) {
						if(this.testCheckboxResult[i].userId == this.data[j].userId){
							if(this.data[j].senderId != localStorage.getItem('userinfo'))
			                {
			                  fromLevel = this.data[j].reciverSetLevel;
			                  toLevel = this.data[j].senderSetLevel;
			                }
			                else
			                {
			                  fromLevel = this.data[j].senderSetLevel;
			                  toLevel = this.data[j].reciverSetLevel;
			                }
							if(this.override == true && this.data[j].force == true){
								usersArray.push({'userId': this.data[j].userId, 'level': toLevel});
								fromUser.push({'userId': localStorage.getItem('userinfo'), 'level':  fromLevel});
							}else if(this.override == true  && this.data[j].force == false){
								usersArray.push({'userId': this.data[j].userId, 'level': this.level});
								fromUser.push({'userId': localStorage.getItem('userinfo'), 'level':  fromLevel});
							}else if(this.override == false  && this.data[j].force == true){
								usersArray.push({'userId': this.data[j].userId, 'level': toLevel});
								fromUser.push({'userId': localStorage.getItem('userinfo'), 'level':  fromLevel});
							}else{
								usersArray.push({'userId': this.data[j].userId, 'level': toLevel});
								fromUser.push({'userId': localStorage.getItem('userinfo'), 'level':  fromLevel});
							}
							
						}
					}
				}

				for (i = 0; i < this.ccCheckboxResult.length; i++) {
					for (j = 0; j < this.data.length; j++) {
						if(this.ccCheckboxResult[i].userId == this.data[j].userId){
							if(this.data[j].senderId != localStorage.getItem('userinfo'))
			                {
			                  fromLevel = this.data[j].reciverSetLevel;
			                  toLevel = this.data[j].senderSetLevel;
			                }
			                else
			                {
			                  fromLevel = this.data[j].senderSetLevel;
			                  toLevel = this.data[j].reciverSetLevel;
			                }
							if(this.override == true && this.data[j].force == true){
								ccArray.push({'userId': this.data[j].userId, 'level': toLevel});
								fromUser.push({'userId': localStorage.getItem('userinfo'), 'level':  fromLevel});
							}else if(this.override == true  && this.data[j].force == false){
								ccArray.push({'userId': this.data[j].userId, 'level': this.level});
								fromUser.push({'userId': localStorage.getItem('userinfo'), 'level':  fromLevel});
							}else if(this.override == false  && this.data[j].force == true){
								ccArray.push({'userId': this.data[j].userId, 'level': toLevel});
								fromUser.push({'userId': localStorage.getItem('userinfo'), 'level':  fromLevel});
							}else{
								ccArray.push({'userId': this.data[j].userId, 'level': toLevel});
								fromUser.push({'userId': localStorage.getItem('userinfo'), 'level':  fromLevel});
							}
							
						}
					}
				}


				for (i = 0; i < this.bccCheckboxResult.length; i++) {
					for (j = 0; j < this.data.length; j++) {
						if(this.bccCheckboxResult[i].userId == this.data[j].userId){
							if(this.data[j].senderId != localStorage.getItem('userinfo'))
			                {
			                  fromLevel = this.data[j].reciverSetLevel;
			                  toLevel = this.data[j].senderSetLevel;
			                }
			                else
			                {
			                  fromLevel = this.data[j].senderSetLevel;
			                  toLevel = this.data[j].reciverSetLevel;
			                }
							if(this.override == true && this.data[j].force == true){
								bccArray.push({'userId': this.data[j].userId, 'level': toLevel});
								fromUser.push({'userId': localStorage.getItem('userinfo'), 'level':  fromLevel});
							}else if(this.override == true  && this.data[j].force == false){
								bccArray.push({'userId': this.data[j].userId, 'level': this.level});
								fromUser.push({'userId': localStorage.getItem('userinfo'), 'level':  fromLevel});
							}else if(this.override == false  && this.data[j].force == true){
								bccArray.push({'userId': this.data[j].userId, 'level': toLevel});
								fromUser.push({'userId': localStorage.getItem('userinfo'), 'level':  fromLevel});
							}else{
								bccArray.push({'userId': this.data[j].userId, 'level': toLevel});
								fromUser.push({'userId': localStorage.getItem('userinfo'), 'level':  fromLevel});
							}
							
						}
					}
				}

				if(this.selectedGroups != ''){
					for (i = 0; i < this.selectedGroups.selectedContacts.length; i++) {
						for (j = 0; j < this.data.length; j++) {
							if(this.selectedGroups.selectedContacts[i].userId == this.data[j].userId){
								if(this.data[j].senderId != localStorage.getItem('userinfo'))
				                {
				                  fromLevel = this.data[j].reciverSetLevel;
				                  toLevel = this.data[j].senderSetLevel;
				                }
				                else
				                {
				                  fromLevel = this.data[j].senderSetLevel;
				                  toLevel = this.data[j].reciverSetLevel;
				                }
								if(this.override == true && this.data[j].force == true){
									usersArray.push({'userId': this.data[j].userId, 'level': toLevel});
									fromUser.push({'userId': localStorage.getItem('userinfo'), 'level':  fromLevel});
								}else if(this.override == true  && this.data[j].force == false){
									usersArray.push({'userId': this.data[j].userId, 'level': this.level});
									fromUser.push({'userId': localStorage.getItem('userinfo'), 'level':  fromLevel});
								}else if(this.override == false  && this.data[j].force == true){
									usersArray.push({'userId': this.data[j].userId, 'level': toLevel});
									fromUser.push({'userId': localStorage.getItem('userinfo'), 'level':  fromLevel});
								}else{
									usersArray.push({'userId': this.data[j].userId, 'level': toLevel});
									fromUser.push({'userId': localStorage.getItem('userinfo'), 'level':  fromLevel});
								}
								
							}
						}
					}
				}
				

				if(this.testCheckboxResult.length == 1){
					usersArray = usersArray;
				}else if(this.ccCheckboxResult.length == 1 && this.testCheckboxResult.length == 0){
					usersArray = ccArray;
					ccArray = [];
				}else if(this.bccCheckboxResult.length == 1 && this.ccCheckboxResult.length == 0 && this.testCheckboxResult.length == 0){
					usersArray = bccArray;
					bccArray = [];
				}

				
			  	var maildata = {
			  		'toId' : usersArray,
			  		'fromId': fromUser,
			  		'subject': this.subject,
			  		'message': this.desc,
			  		'attacment': this.attacments,
			  		'isReply': false,
			  		'mailId': null,
			  		'bcc': bccArray,
			  		'cc': ccArray,
			  		'override': this.override,
			  		'level': this.level,
			  		'isGroupMsg': false,
			  		'read':false,
			  		'isForward': false,
			  		'jobId': null,
		  			'tradeId': null
			  	};
			  	this.mailText = maildata;
			  	
			  	if(usersArray.length == 0){
			  		let toast = this.toastCtrl.create({
				            message: 'Please specify at least one recipient.',
				            duration: 3000,
				            cssClass: 'danger',
            				position: 'top'
			           });
		           toast.present();
			  	}else if(this.subject == '' && this.desc == ''){
			  		let alert = this.alertCtrl.create({
						    title: 'Smail',
						    subTitle: 'Send this message without a subject or text in the body?',
						    buttons: [
						      	{
							        text: 'Cancel',
							        role: 'cancel',
							        handler: () => {
							          
							        }
						      	},
						      	{
							        text: 'OK',
							        handler: () => {
							          	
							          	const loading = this.loadingCtrl.create({});
									    loading.present();
									    
									    this.smailserviceProvider.sendSmail(this.mailText).subscribe((data)=>{
									      	
									      	loading.dismissAll();
									      	let toast = this.toastCtrl.create({
									                    message: 'Mail has been sent successfully.',
									                    duration: 3000,
									                    cssClass: 'success',
            											position: 'top'
									                  });
									          	toast.present(); 
									        localStorage.setItem('view', 'Sent');
									        this.navCtrl.push('SmailInboxPage'); 
									    },
									    err => {
									        loading.dismissAll();
									        this.showTechnicalError('1');
									    });
							        }
						      	}
						    ]
						});
					    alert.present();
			  	}else{
			  		const loading = this.loadingCtrl.create({});
				    loading.present();
				    this.smailserviceProvider.sendSmail(this.mailText).subscribe((data)=>{
				      	
				      	loading.dismissAll();
				      	let toast = this.toastCtrl.create({
				                    message: 'Mail has been sent successfully.',
				                    duration: 3000,
				                    cssClass: 'success',
            						position: 'top'
				                  });
				          	toast.present(); 
				        localStorage.setItem('view', 'Sent');
				        this.navCtrl.push('SmailInboxPage');
				    },
				    err => {
				        loading.dismissAll();
				        this.showTechnicalError('1');
				    });
			  	}
			}
		}
		
  	};

  	conditionalSend(data){
  		var usersArray = [], fromUser = [],i,j;							
		fromUser.push({'userId': localStorage.getItem('userinfo'), 'level': data});
		
		if(this.selectedGroups == ''){
			for(i=0; i < this.testCheckboxResult.length; i++){
				
				usersArray.push({'userId': this.testCheckboxResult[i].userId, 'level': data});
			}
			if(this.ccCheckboxResult.length > 0){
				for(i=0; i < this.ccCheckboxResult.length; i++){
					usersArray.push({'userId': this.ccCheckboxResult[i].userId, 'level': data});
				}
			}
			
			if(this.bccCheckboxResult.length > 0){
				for(i=0; i < this.bccCheckboxResult.length; i++){
					usersArray.push({'userId': this.bccCheckboxResult[i].userId, 'level': data});
				}
			}
			
		}else if(this.selectedGroups.selectedGroups.length > 0){
			for(i=0; i < this.selectedGroups.selectedGroups.length; i++){
				var string = this.selectedGroups.selectedGroups[i].groupdata;
				string = string.split(',');
				for(j=0; j < string.length; j++){
					if(string[j] != ''){
						usersArray.push({'userId': string[j], 'level': data});
					}
				}
			}
		}

	  	var mailData = {
	  		'toId' : usersArray,
	  		'fromId': fromUser,
	  		'subject': this.subject,
	  		'message': this.desc,
	  		'attacment': this.attacments,
	  		'isReply': false,
	  		'mailId': null,
	  		'bcc': this.bccId,
	  		'cc': this.ccId,
	  		'override': true,
	  		'level': data,
	  		'isGroupMsg': true,
	  		'read':false,
	  		'isForward': false,
	  		'jobId': null,
				'tradeId': null
	  	};
	  	
	  	if(usersArray.length == 0){
	  		let toast = this.toastCtrl.create({
		            message: 'Please specify at least one recipient.',
		            duration: 3000,
		            cssClass: 'danger',
					position: 'top'
	           });
           toast.present();
	  	}else{
	  		const loading = this.loadingCtrl.create({});
		    loading.present();
		    this.smailserviceProvider.sendSmail(mailData).subscribe((data)=>{
		    
		      	loading.dismissAll();
		      	let toast = this.toastCtrl.create({
                    message: 'Mail has been sent successfully.',
                    duration: 3000,
                    cssClass: 'success',
					position: 'top'
                  });
	          	toast.present(); 
	          	localStorage.setItem('view', 'Sent');
					// this.navCtrl.setRoot(SmailPage);
		      	this.navCtrl.push('SmailInboxPage');
		    },
		    err => {
		        loading.dismissAll();
		        this.showTechnicalError('1');
		    });
	  	}
  	}

  	discardSmail(){
  		//console.log('test')
  		this.toId = [];
  		this.testCheckboxResult = [];
  		this.bccId = '';
  		this.ccId = '';
  		this.subject = '';
  		this.desc = '';
  		this.ccCheckboxResult = [];
  		this.bccCheckboxResult = [];
  		this.attacments = [];
  		this.level = '';
  		this.selectedTrade = '';
  		this.selectedJob = '';
  		//console.log(this.toId)
  	};

  	attachfiles(){
  		let modal = this.modalCtrl.create('SmailFileUploadPage');
  		modal.onDidDismiss(data => {
  			for(var i=0; i < data.length; i++){
  				this.attacments.push(data[i]);
  			}
  			
  		});
  		modal.present();
  	};

  	doCheckbox() {
  		if(this.isJobChecked == true && this.selectedJob == ''){
  			let toast = this.toastCtrl.create({
                message: 'Please select job.',
                duration: 3000,
                cssClass: 'danger',
				position: 'top'
              });
          	toast.present(); 
  		}
  		else{
  			let alert = this.alertCtrl.create();
	    alert.setTitle('Select Contact');
	    var i,j,k,m;
    	if(this.testCheckboxResult.length == 0){
    		for(i=0; i < this.data.length; i++){
	    		//contact validation based on db conditions
	    		if(this.data[i].memberstatus == 2 && this.data[i].senderSetLevel != 0 && this.data[i].reciverSetLevel != 0){
	    			//if cc contacts selected 
	    			
    				var isContactExist = false;
    				for(k=0; k < this.ccCheckboxResult.length; k++){
    					if(this.data[i].userId == this.ccCheckboxResult[k].userId){
    						isContactExist = true;
    					}
    				}
    				if(isContactExist == false){
    					for(m=0; m < this.bccCheckboxResult.length; m++){
	    					if(this.data[i].userId == this.bccCheckboxResult[m].userId){
	    						isContactExist = true;
	    					}
	    				}

	    				if(!isContactExist){
    						alert.addInput({
							    type: 'checkbox',
							    label: this.data[i].name,
							    value: this.data[i],
						     	checked: false
						    });
    					}
    				}	
	    			
	    		}	
	    	}
    	}else{
    		for(i=0; i < this.data.length; i++){
    			var isUserExist = false;
	    		for(j=0; j < this.testCheckboxResult.length; j++){
		    		if(this.data[i].userId == this.testCheckboxResult[j].userId){
		    			if(this.data[i].memberstatus == 2 && this.data[i].senderSetLevel != 0 && this.data[i].reciverSetLevel != 0){
						    isUserExist = true;
		    			}
		    		}
		    	}
		    	
		    	if(isUserExist){
		    		alert.addInput({
					    type: 'checkbox',
					    label: this.data[i].name,
					    value: this.data[i],
				     	checked: true
				    });
			    }else{
			    	var bccContact = this.bccCheckboxResult;
			    	if(this.ccCheckboxResult.length > 0){
			    		for(j=0; j < this.ccCheckboxResult.length; j++){
				    		if(this.data[i].userId == this.ccCheckboxResult[j].userId){
				    			if(this.data[i].memberstatus == 2 && this.data[i].senderSetLevel != 0 && this.data[i].reciverSetLevel != 0){
								    isUserExist = true;
				    			}
				    		}
				    	}
			    		if(!isUserExist){
			    			for(m=0; m < bccContact.length; m++){
					    		if(this.data[i].userId == bccContact[m].userId){
					    			if(this.data[i].memberstatus == 2 && this.data[i].senderSetLevel != 0 && this.data[i].reciverSetLevel != 0){
					    				isUserExist = true;
					    			}
					    		}
					    	}

					    	if(!isUserExist){
					    		alert.addInput({
								    type: 'checkbox',
								    label: this.data[i].name,
								    value: this.data[i],
							     	checked: false
						    	});
					    	}
				    	}	
			    	}else{
			    		alert.addInput({
						    type: 'checkbox',
						    label: this.data[i].name,
						    value: this.data[i],
					     	checked: false
					    });
				    }	
		    	
	    		}
	    	}
	    }

	    alert.addButton('Cancel');

	    alert.addButton({
	      	text: 'Okay',
	      	handler: data => {

		        this.testCheckboxOpen = false;
		        this.testCheckboxResult = data;
		        if(this.testCheckboxResult.length > 0){
		        	var self = this;
		        	this.testCheckboxResult.forEach(function(email){
		        		self.removeFromEmails(email);
		        	})
		        }

		        if(this.ccCheckboxResult.length == 0 && this.bccCheckboxResult.length == 0 && this.testCheckboxResult.length == 1){
		        	if(this.testCheckboxResult[0].senderId == this.userId){
		        		this.level = this.testCheckboxResult[0].senderSetLevel;
		        	}else{
		        		this.level = this.testCheckboxResult[0].reciverSetLevel;
		        	}
		        	
		        }
		        if(this.override == false && (this.testCheckboxResult.length > 1 || this.ccCheckboxResult.length > 1 || this.bccCheckboxResult.length > 1 || (this.testCheckboxResult.length > 0 && this.ccCheckboxResult.length > 0) || (this.testCheckboxResult.length > 0 && this.bccCheckboxResult.length > 0) || (this.ccCheckboxResult.length > 0 && this.bccCheckboxResult.length > 0)) && this.isJobChecked == false){
		        	this.setLevelLoop();
		        }
	      	}
	    });

	    alert.present().then(() => {
	      this.testCheckboxOpen = true;
	    });
  		}
  	};

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

	onJobContactAdd(event){
		this.testCheckboxResult.push(event);
	}

	onIndividualAdd(event){
		this.selectedGroups.selectedContacts.push(event);
		this.setLevelGroupsLoop();
	}

	onGroupAdd(event){
		this.selectedGroups.selectedGroups.push(event);
		this.setLevelGroupsLoop();
	}

	onContactAdd(event){
		this.testCheckboxResult.push(event);
		this.removeFromEmails(event);
		this.setLevelAfterDelete();
	}

	onCcAdd(event){
		this.ccCheckboxResult.push(event);
		this.removeFromEmails(event);
		this.setLevelAfterDelete();
	}

	onBccAdd(event){
		this.bccCheckboxResult.push(event);
		this.removeFromEmails(event);
		this.setLevelAfterDelete();
	}

	removeFromEmails(contact){
		for(var i = 0; i < this.all_emails.length; i++){
  			if(contact.userId == this.all_emails[i].userId){
  				this.all_emails.splice(i, 1);
  			}
  		}
	}

  	removeJobContact(contact){
  		this.removeArray(this.testCheckboxResult,contact);
  		// this.tradeContacts.push(contact);
  	};

  	removeGroup(contact){
  		this.removeArray(this.selectedGroups.selectedGroups,contact);
  		this.setLevelGroupsLoop();
  	};

  	removeIndividual(contact){
  		this.removeArray(this.selectedGroups.selectedContacts,contact);
  		this.setLevelGroupsLoop();
  	};

  	removeContact(contact){
  		this.removeArray(this.testCheckboxResult,contact);
  		this.all_emails.push(contact);
  		this.setLevelAfterDelete();
  	};

  	removeCcContact(contact){
  		this.removeArray(this.ccCheckboxResult,contact);
  		this.all_emails.push(contact);
  		this.setLevelAfterDelete();
  	};

  	removeBccContact(contact){
  		this.removeArray(this.bccCheckboxResult,contact);
  		this.all_emails.push(contact);
  		this.setLevelAfterDelete();
  	};

  	setLevelAfterDelete(){
  		if(this.ccCheckboxResult.length == 0 && this.bccCheckboxResult.length == 0 && this.testCheckboxResult.length == 1){
			if(this.testCheckboxResult[0].senderId == this.userId){
				this.level = this.testCheckboxResult[0].senderSetLevel;
			}else{
				this.level = this.testCheckboxResult[0].reciverSetLevel;
			}
			
		}

		if(this.ccCheckboxResult.length == 1 && this.bccCheckboxResult.length == 0 && this.testCheckboxResult.length == 0){
			if(this.ccCheckboxResult[0].senderId == this.userId){
				this.level = this.ccCheckboxResult[0].senderSetLevel;
			}else{
				this.level = this.ccCheckboxResult[0].reciverSetLevel;
			}
		}

		if(this.ccCheckboxResult.length == 1 && this.bccCheckboxResult.length == 0 && this.testCheckboxResult.length == 0){
			if(this.bccCheckboxResult[0].senderId == this.userId){
				this.level = this.bccCheckboxResult[0].senderSetLevel;
			}else{
				this.level = this.bccCheckboxResult[0].reciverSetLevel;
			}
		}

		this.setLevelLoop();
  	}

  	setLevelLoop(){
  		var n_level = '',all_level = [], self = this;
    	if(this.testCheckboxResult.length > 0){
        	this.testCheckboxResult.forEach(function(data){
        		if(data.senderId == self.userId){
	        		n_level = data.senderSetLevel;
	        	}else{
	        		n_level = data.reciverSetLevel;
	        	}
	        	if(all_level.indexOf(n_level) == -1){
	        		all_level.push(n_level);
	        	}
        	});
    	}
    	if(this.ccCheckboxResult.length > 0){
        	this.ccCheckboxResult.forEach(function(data){
        		if(data.senderId == self.userId){
	        		n_level = data.senderSetLevel;
	        	}else{
	        		n_level = data.reciverSetLevel;
	        	}
	        	if(all_level.indexOf(n_level) == -1){
	        		all_level.push(n_level);
	        	}
        	});
    	}
    	if(this.bccCheckboxResult.length > 0){
        	this.bccCheckboxResult.forEach(function(data){
        		if(data.senderId == self.userId){
	        		n_level = data.senderSetLevel;
	        	}else{
	        		n_level = data.reciverSetLevel;
	        	}
	        	if(all_level.indexOf(n_level) == -1){
	        		all_level.push(n_level);
	        	}
        	});
    	}
    	if(all_level.length == 1){
    		this.level = all_level[0];
    	}
    	else{
    		this.level = '';
    	}
  	}

  	setLevelGroupsLoop(){
  		var n_level = '',all_level = [], self = this;
    	if(this.selectedGroups.selectedGroups.length > 0){
        	this.selectedGroups.selectedGroups.forEach(function(data){
	        	n_level = data.userLevel;
	        	if(all_level.indexOf(n_level) == -1){
	        		all_level.push(n_level);
	        	}
        	});
    	}
    	if(this.selectedGroups.selectedContacts.length > 0){
        	this.selectedGroups.selectedContacts.forEach(function(data){
        		if(data.senderId == self.userId){
	        		n_level = data.senderSetLevel;
	        	}else{
	        		n_level = data.reciverSetLevel;
	        	}
	        	if(all_level.indexOf(n_level) == -1){
	        		all_level.push(n_level);
	        	}
        	});
    	}

    	if(all_level.length == 1){
    		this.level = all_level[0];
    	}
    	else{
    		this.level = '';
    	}
  	}

  	ccCheckbox(){
  		let alert = this.alertCtrl.create();
	    alert.setTitle('Select Contact');
   		var isUserExist;
    		for(var i=0; i < this.data.length; i++){
    			
	    		isUserExist = false;
	    		//check user exist in cc list
	    		if(this.ccCheckboxResult.length > 0){
	    			for(var j=0; j < this.ccCheckboxResult.length; j++){
			    		if(this.data[i].userId == this.ccCheckboxResult[j].userId){
			    			if(this.data[i].memberstatus == 2 && this.data[i].senderSetLevel != 0 && this.data[i].reciverSetLevel != 0){
			    				isUserExist = true;
			    			}
			    		}
			    	}
	    		}
	    		
		    	if(isUserExist){
    				alert.addInput({
					    type: 'checkbox',
					    label: this.data[i].name,
					    value: this.data[i],
				     	checked: true
				    });
		    	}else{
		    		//check user exist in to list
		    		isUserExist = false;
		    		if(this.testCheckboxResult.length > 0){
		    			for(var k=0; k < this.testCheckboxResult.length; k++){
				    		if(this.data[i].userId == this.testCheckboxResult[k].userId){
				    			if(this.data[i].memberstatus == 2 && this.data[i].senderSetLevel != 0 && this.data[i].reciverSetLevel != 0){
				    				isUserExist = true;
				    			}
				    		}
				    	}
		    		}
		    		
			    	if(!isUserExist){
			    		if(this.bccCheckboxResult.length > 0){
			    			for(var m=0; m < this.bccCheckboxResult.length; m++){
					    		if(this.data[i].userId == this.bccCheckboxResult[m].userId){
					    			if(this.data[i].memberstatus == 2 && this.data[i].senderSetLevel != 0 && this.data[i].reciverSetLevel != 0){
					    				isUserExist = true;
					    			}
					    		}
					    	}
			    		}
			    		
				    	if(!isUserExist){
				    		alert.addInput({
							    type: 'checkbox',
							    label: this.data[i].name,
							    value: this.data[i],
						     	checked: false
						    });
				    	}
			    	}
		    	}
		    }
    	// }
	    

	    alert.addButton('Cancel');

	    alert.addButton({
	      	text: 'Okay',
	      	handler: data => {
		        
		        //this.testCheckboxOpen = false;
		        this.ccCheckboxResult = data;
		        if(this.ccCheckboxResult.length > 0){
		        	var self = this;
		        	this.ccCheckboxResult.forEach(function(email){
		        		self.removeFromEmails(email);
		        	})
		        }
		        if(this.ccCheckboxResult.length == 1 && this.bccCheckboxResult.length == 0 && this.testCheckboxResult.length == 0){
		        	if(this.ccCheckboxResult[0].senderId == this.userId){
		        		this.level = this.ccCheckboxResult[0].senderSetLevel;
		        	}else{
		        		this.level = this.ccCheckboxResult[0].reciverSetLevel;
		        	}
		        }

		        if(this.override == false && (this.testCheckboxResult.length > 1 || this.ccCheckboxResult.length > 1 || this.bccCheckboxResult.length > 1 || (this.testCheckboxResult.length > 0 && this.ccCheckboxResult.length > 0) || (this.testCheckboxResult.length > 0 && this.bccCheckboxResult.length > 0) || (this.ccCheckboxResult.length > 0 && this.bccCheckboxResult.length > 0)) && this.isJobChecked == false){
		        	this.setLevelLoop();
		        }
	      	}
	    });

	    alert.present().then(() => {
	      this.testCheckboxOpen = true;
	    });
  	};


  	bccCheckbox(){
  		let alert = this.alertCtrl.create();
	    alert.setTitle('Select Contact');
	    var isUserExist;
    		for(var i=0; i < this.data.length; i++){
	    		isUserExist = false;
	    		//check user exist in cc list
	    		for(var m=0; m < this.bccCheckboxResult.length; m++){
		    		if(this.data[i].userId == this.bccCheckboxResult[m].userId){
		    			if(this.data[i].memberstatus == 2 && this.data[i].senderSetLevel != 0 && this.data[i].reciverSetLevel != 0){
		    				isUserExist = true;
		    			}
		    		}
		    	}
		    	if(isUserExist){
		    		alert.addInput({
					    type: 'checkbox',
					    label: this.data[i].name,
					    value: this.data[i],
				     	checked: true
				    });
		    	}else{
		    		for(var j=0; j < this.ccCheckboxResult.length; j++){
			    		if(this.data[i].userId == this.ccCheckboxResult[j].userId){
			    			if(this.data[i].memberstatus == 2 && this.data[i].senderSetLevel != 0 && this.data[i].reciverSetLevel != 0){
			    				isUserExist = true;
			    			}
			    		}
			    	}
			    	if(!isUserExist){
			    		//check user exist in to list
			    		isUserExist = false;
			    		for(var k=0; k < this.testCheckboxResult.length; k++){
				    		if(this.data[i].userId == this.testCheckboxResult[k].userId){
				    			if(this.data[i].memberstatus == 2 && this.data[i].senderSetLevel != 0 && this.data[i].reciverSetLevel != 0){
				    				isUserExist = true;
				    			}
				    		}
				    	}
				    	if(!isUserExist){
				    		alert.addInput({
							    type: 'checkbox',
							    label: this.data[i].name,
							    value: this.data[i],
						     	checked: false
						    });
				    	}
			    	}
		    	}
		    }
    	// }
	    

	    alert.addButton('Cancel');

	    alert.addButton({
	      	text: 'Okay',
	      	handler: data => {
		        
		      //  this.testCheckboxOpen = false;
		        this.bccCheckboxResult = data;
		        if(this.bccCheckboxResult.length > 0){
		        	var self = this;
		        	this.bccCheckboxResult.forEach(function(email){
		        		self.removeFromEmails(email);
		        	})
		        }

		        if(this.ccCheckboxResult.length == 1 && this.bccCheckboxResult.length == 0 && this.testCheckboxResult.length == 0){
		        	if(this.bccCheckboxResult[0].senderId == this.userId){
		        		this.level = this.bccCheckboxResult[0].senderSetLevel;
		        	}else{
		        		this.level = this.bccCheckboxResult[0].reciverSetLevel;
		        	}
		        }

		        if(this.override == false && (this.testCheckboxResult.length > 1 || this.ccCheckboxResult.length > 1 || this.bccCheckboxResult.length > 1 || (this.testCheckboxResult.length > 0 && this.ccCheckboxResult.length > 0) || (this.testCheckboxResult.length > 0 && this.bccCheckboxResult.length > 0) || (this.ccCheckboxResult.length > 0 && this.bccCheckboxResult.length > 0)) && this.isJobChecked == false){
		        	this.setLevelLoop();
		        }
	      	}
	    }); 

	    alert.present().then(() => {
	      this.testCheckboxOpen = true;
	    });
  	};

  	filterLevel(value){
  		var i;
		if(this.levelArray[value].checked == true){
			this.levelArray[value].checked = false;
			for(i =0; i< this.allowed_levels.length; i++){
				if(this.allowed_levels[i] == 'level'+this.levelArray[value].level){
					this.allowed_levels.splice(i, 1);
					this.companyProvider.getFolders(this.userId).subscribe((all_files)=>{
				     	//this.directory = all_files.data;
				     	var myArray = all_files.data;
				     	for (i = myArray.length - 1; i >= 0; --i) {
							if (this.allowed_levels.indexOf(myArray[i].name) == -1) {
						       myArray.splice(i,1);
						   }
						}
						this.directory = myArray;
						
					});
				}
			}
		}else{
			this.levelArray[value].checked = true;
			this.allowed_levels.push('level' + this.levelArray[value].level);

			this.companyProvider.getFolders(this.userId).subscribe((all_files)=>{
		     	//this.directory = all_files.data;
		     	var myArray = all_files.data;
		     	for (i = myArray.length - 1; i >= 0; --i) {
					if (this.allowed_levels.indexOf(myArray[i].name) == -1) {
				       myArray.splice(i,1);
				   }
				}
				this.directory = myArray;
			},
		    err => {
		        this.showTechnicalError();
		    });
		} 
		
	};

	presentPromptGroup() {
		if(this.isGroupCreated == true)
		{
			this.create_grp_title = 'Update Group';
			this.groupname = this.p_groupname;
			this.grouplevel = this.p_grouplevel;
		}
		this.forgetPwdModal = true;

	  // let alert = this.alertCtrl.create({
	  //   title: 'Create Group',
	  //   inputs: [
	  //     {
	  //       name: 'Name',
	  //       placeholder: 'name'
	  //     },
	  //     {
	  //       name: 'level',
	  //       placeholder: 'level',
	  //       type: 'text'
	  //     }
	  //   ],
	  //   buttons: [
	  //     {
	  //       text: 'Cancel',
	  //       role: 'cancel',
	  //       handler: data => {
	  //         console.log('Cancel clicked');
	  //       }
	  //     },
	  //     {
	  //       text: 'Save',
	  //       handler: data => {
	  //       	var groupdata = [], groupUsers = '', obj = {};
	  //         // if (!(data.name && data.level))) {
	  //           // logged in!
	  //           if(this.selectedGroups == ''){
	  //           	if(this.testCheckboxResult.length > 0){
		 //            	for(var i = 0; i < this.testCheckboxResult.length; i++){
		 //            		groupdata.push(this.testCheckboxResult[i].userId);
		 //            	}
		 //            }

		 //            if(this.ccCheckboxResult.length > 0){
		 //            	for(var i = 0; i < this.ccCheckboxResult.length; i++){
		 //            		groupdata.push(this.ccCheckboxResult[i].userId);
		 //            	}
		 //            }

		 //            if(this.bccCheckboxResult.length > 0){
		 //            	for(var i = 0; i < this.bccCheckboxResult.length; i++){
		 //            		groupdata.push(this.bccCheckboxResult[i].userId);
		 //            	}
		 //            }

		 //            for(var i = 0; i < groupdata.length; i++){
	  //           		groupUsers = groupUsers + groupdata[i] + ',';
	  //           	}
		            
		 //           obj = {
		 //            	groupdata: groupUsers,
		 //            	userId: this.userId,
		 //            	userLevel: data.level,
		 //            	name: data.Name
		 //            };
	 
		 //            this.groupprovider.addGroup(obj).subscribe((response)=>{
			// 	     	console.log(response);
			// 	     	if(response.status == 0){
			// 	     		let toast = this.toastCtrl.create({
			// 		            message: 'Group name already exist.',
			// 		            duration: 3000,
			// 		            cssClass: 'danger',
   //          					position: 'top'
			// 	            });
			//            		toast.present();
			// 	     	}else{
			// 	     		this.isGroupCreated = true;
			// 	     		let toast = this.toastCtrl.create({
			// 		            message: 'Group created successfull.',
			// 		            duration: 3000,
			// 		            cssClass: 'success',
   //          					position: 'top'
			// 	            });
			//            		toast.present();
			// 	     	}
				     	
			// 		});
	  //           }else{
	  //           	if(this.selectedGroups.selectedGroups.length > 0){
	  //           		for(var i=0; i < this.selectedGroups.selectedGroups.length; i++){
	  //           			if(i == 0 && i == (this.selectedGroups.selectedGroups.length - 1)){
	  //           				groupUsers = this.selectedGroups.selectedGroups[i].groupdata;
	  //           			}else if (i == 0 && i < (this.selectedGroups.selectedGroups.length - 1)){
	  //           				groupUsers = this.selectedGroups.selectedGroups[i].groupdata + ',';
	  //           			}else if(i !== 0 && i == (this.selectedGroups.selectedGroups.length - 1)){
	  //           				groupUsers = groupUsers + this.selectedGroups.selectedGroups[i].groupdata;
	  //           			}else{
	  //           				groupUsers = groupUsers + this.selectedGroups.selectedGroups[i].groupdata;
	  //           			}
	  //           		}

	  //           		//if individual contacts are selected
	  //           		if(this.selectedGroups.selectedContacts.length > 0){
		 //            		for(var i=0; i < this.selectedGroups.selectedContacts.length; i++){
		 //            			if(i == 0 && i == (this.selectedGroups.selectedContacts.length - 1)){
		 //            				groupUsers = groupUsers + ',' +  this.selectedGroups.selectedContacts[i].userId;
		 //            			}else if (i == 0 && i < (this.selectedGroups.selectedContacts.length - 1)){
		 //            				groupUsers = groupUsers + ',' +  this.selectedGroups.selectedContacts[i].userId + ',';
		 //            			}else if(i !== 0 && i == (this.selectedGroups.selectedContacts.length - 1)){
		 //            				groupUsers = groupUsers + this.selectedGroups.selectedContacts[i].userId;
		 //            			}else{
		 //            				groupUsers = groupUsers + this.selectedGroups.selectedContacts[i].userId;
		 //            			}
		 //            		}
		 //            	}

		 //            	obj = {
			//             	groupdata: groupUsers,
			//             	userId: this.userId,
			//             	userLevel: data.level,
			//             	name: data.Name
			//             };
		 
			//             this.groupprovider.addGroup(obj).subscribe((response)=>{
			// 		     	console.log(response);
			// 		     	if(response.status == 0){
			// 		     		let toast = this.toastCtrl.create({
			// 			            message: 'Group name already exist.',
			// 			            duration: 3000,
			// 			            cssClass: 'danger',
   //          						position: 'top'
			// 		            });
			// 	           		toast.present();
			// 		     	}else{
			// 		     		this.isGroupCreated = true;
			// 		     		let toast = this.toastCtrl.create({
			// 			            message: 'Group created successfull.',
			// 			            duration: 3000,
			// 			            cssClass: 'success',
   //          						position: 'top'
			// 		            });
			// 	           		toast.present();
			// 		     	}
					     	
			// 			});

	  //           	}else{
	  //           		//if only individual contacts are selected
	  //           		if(this.selectedGroups.selectedContacts.length > 0){
		 //            		for(var i=0; i < this.selectedGroups.selectedContacts.length; i++){
		 //            			if(i == 0 && i == (this.selectedGroups.selectedContacts.length - 1)){
		 //            				groupUsers = this.selectedGroups.selectedContacts[i].userId;
		 //            			}else if (i == 0 && i < (this.selectedGroups.selectedContacts.length - 1)){
		 //            				groupUsers = this.selectedGroups.selectedContacts[i].userId + ',';
		 //            			}else if(i !== 0 && i == (this.selectedGroups.selectedContacts.length - 1)){
		 //            				groupUsers = groupUsers + this.selectedGroups.selectedContacts[i].userId;
		 //            			}else{
		 //            				groupUsers = groupUsers + this.selectedGroups.selectedContacts[i].userId;
		 //            			}
		 //            		}
		 //            	}
	  //           	}

	  //   			obj = {
		 //            	groupdata: groupUsers,
		 //            	userId: this.userId,
		 //            	userLevel: data.level,
		 //            	name: data.Name
		 //            };
	 
		 //            this.groupprovider.addGroup(obj).subscribe((response)=>{
			// 	     	console.log(response);
			// 	     	if(response.status == 0){
			// 	     		let toast = this.toastCtrl.create({
			// 		            message: 'Group name already exist.',
			// 		            duration: 3000,
			// 		            cssClass: 'danger',
   //          					position: 'top'
			// 	            });
			//            		toast.present();
			// 	     	}else{
			// 	     		this.isGroupCreated = true;
			// 	     		let toast = this.toastCtrl.create({
			// 		            message: 'Group created successfull.',
			// 		            duration: 3000,
			// 		            cssClass: 'success',
   //          					position: 'top'
			// 	            });
			//            		toast.present();
			// 	     	}
				     	
			// 		});
	  //           }
	  //       }
	  //     }
	  //   ]
	  // });

	 // alert.present();
	};

	dismissPwdModal()
	{
		this.forgetPwdModal = false;
		this.groupname = '';
		this.grouplevel = 0;
	}

	getLevel(value){
		this.grouplevel = value;
	};

	validateGroup(name, level){
		var success_msg = this.isGroupCreated == true ? 'Group updated successfully.' : 'Group created successfully.';
		var groupdata = [], groupUsers = '', obj = {};
		if(name == '' || name == undefined){
			let toast = this.toastCtrl.create({
	            message: 'Please enter group name.',
	            duration: 3000,
	            cssClass: 'danger',
				position: 'top'
            });
       		toast.present();
		}else if(level == 0){
			let toast = this.toastCtrl.create({
	            message: 'Please select group level.',
	            duration: 3000,
	            cssClass: 'danger',
				position: 'top'
            });
       		toast.present();
		}else{
			var i;
			if(this.selectedGroups == ''){
	        	if(this.testCheckboxResult.length > 0){
	            	for(i = 0; i < this.testCheckboxResult.length; i++){
	            		groupdata.push(this.testCheckboxResult[i].userId);
	            	}
	            }

	            if(this.ccCheckboxResult.length > 0){
	            	for(i = 0; i < this.ccCheckboxResult.length; i++){
	            		groupdata.push(this.ccCheckboxResult[i].userId);
	            	}
	            }

	            if(this.bccCheckboxResult.length > 0){
	            	for(i = 0; i < this.bccCheckboxResult.length; i++){
	            		groupdata.push(this.bccCheckboxResult[i].userId);
	            	}
	            }

	            for(i = 0; i < groupdata.length; i++){
	        		groupUsers = groupUsers + groupdata[i] + ',';
	        	}
	            
	           obj = {
	            	groupdata: groupUsers,
	            	userId: this.userId,
	            	userLevel: level,
	            	name: name,
	            	is_edit: this.isGroupCreated,
	            	createdGroupId: this.createdGroupId
	            };
	            

	            this.groupprovider.addGroup(obj).subscribe((response)=>{
			     	
			     	if(response.status == 0){
			     		
			     		let toast = this.toastCtrl.create({
				            message: 'Group name already exist.',
				            duration: 3000,
				            cssClass: 'danger',
	    					position: 'top'
			            });
		           		toast.present();
			     	}else{
			     		this.createdGroupId = response.data._id;
			     		this.forgetPwdModal = false;
			     		this.isGroupCreated = true;
			     		this.createdGroupLevel = level;
			     		this.p_groupname = this.groupname;
			     		this.p_grouplevel = this.grouplevel;
			     		this.groupname = '';
						this.grouplevel = 0;
			     		let toast = this.toastCtrl.create({
				            message: success_msg,
				            duration: 3000,
				            cssClass: 'success',
	    					position: 'top'
			            });
		           		toast.present();
			     	}
			     	
				},
			    err => {
			        this.showTechnicalError('1');
			    });
	        }else{
	        	if(this.selectedGroups.selectedGroups.length > 0){
	        		for(i=0; i < this.selectedGroups.selectedGroups.length; i++){
	        			if(i == 0 && i == (this.selectedGroups.selectedGroups.length - 1)){
	        				groupUsers = this.selectedGroups.selectedGroups[i].groupdata;
	        			}else if (i == 0 && i < (this.selectedGroups.selectedGroups.length - 1)){
	        				groupUsers = this.selectedGroups.selectedGroups[i].groupdata + ',';
	        			}else if(i !== 0 && i == (this.selectedGroups.selectedGroups.length - 1)){
	        				groupUsers = groupUsers + this.selectedGroups.selectedGroups[i].groupdata;
	        			}else{
	        				groupUsers = groupUsers + this.selectedGroups.selectedGroups[i].groupdata;
	        			}
	        		}

	        		//if individual contacts are selected
	        		if(this.selectedGroups.selectedContacts.length > 0){
	            		for(i=0; i < this.selectedGroups.selectedContacts.length; i++){
	            			if(i == 0 && i == (this.selectedGroups.selectedContacts.length - 1)){
	            				groupUsers = groupUsers + ',' +  this.selectedGroups.selectedContacts[i].userId;
	            			}else if (i == 0 && i < (this.selectedGroups.selectedContacts.length - 1)){
	            				groupUsers = groupUsers + ',' +  this.selectedGroups.selectedContacts[i].userId + ',';
	            			}else if(i !== 0 && i == (this.selectedGroups.selectedContacts.length - 1)){
	            				groupUsers = groupUsers + this.selectedGroups.selectedContacts[i].userId;
	            			}else{
	            				groupUsers = groupUsers + this.selectedGroups.selectedContacts[i].userId;
	            			}
	            		}
	            	}

	            	obj = {
		            	groupdata: groupUsers,
		            	userId: this.userId,
		            	userLevel: level,
		            	name: name,
		            	is_edit: this.isGroupCreated,
		            	createdGroupId: this.createdGroupId
		            };
	 
		            this.groupprovider.addGroup(obj).subscribe((response)=>{
				     	
				     	if(response.status == 0){
				     		let toast = this.toastCtrl.create({
					            message: 'Group name already exist.',
					            duration: 3000,
					            cssClass: 'danger',
	    						position: 'top'
				            });
			           		toast.present();
				     	}else{
				     		this.createdGroupId = response.data._id;
				     		this.forgetPwdModal = false;
				     		this.isGroupCreated = true;
				     		this.createdGroupLevel = level;
				     		this.p_groupname = this.groupname;
			     			this.p_grouplevel = this.grouplevel;
				     		this.groupname = '';
							this.grouplevel = 0;
				     		let toast = this.toastCtrl.create({
					            message: success_msg,
					            duration: 3000,
					            cssClass: 'success',
	    						position: 'top'
				            });
			           		toast.present();
				     	}
				     	
					},
				    err => {
				        this.showTechnicalError('1');
				    });

	        	}else{
	        		//if only individual contacts are selected
	        		if(this.selectedGroups.selectedContacts.length > 0){
	            		for(i=0; i < this.selectedGroups.selectedContacts.length; i++){
	            			if(i == 0 && i == (this.selectedGroups.selectedContacts.length - 1)){
	            				groupUsers = this.selectedGroups.selectedContacts[i].userId;
	            			}else if (i == 0 && i < (this.selectedGroups.selectedContacts.length - 1)){
	            				groupUsers = this.selectedGroups.selectedContacts[i].userId + ',';
	            			}else if(i !== 0 && i == (this.selectedGroups.selectedContacts.length - 1)){
	            				groupUsers = groupUsers + this.selectedGroups.selectedContacts[i].userId;
	            			}else{
	            				groupUsers = groupUsers + this.selectedGroups.selectedContacts[i].userId;
	            			}
	            		}
	            	}
	        	}

				obj = {
	            	groupdata: groupUsers,
	            	userId: this.userId,
	            	userLevel: level,
	            	name: name,
	            	is_edit: this.isGroupCreated,
	            	createdGroupId: this.createdGroupId
	            };

	            this.groupprovider.addGroup(obj).subscribe((response)=>{
			     	
			     	if(response.status == 0){
			     		let toast = this.toastCtrl.create({
				            message: 'Group name already exist.',
				            duration: 3000,
				            cssClass: 'danger',
	    					position: 'top'
			            });
		           		toast.present();
			     	}else{
			     		this.createdGroupId = response.data._id;
			     		this.forgetPwdModal = false;
			     		this.isGroupCreated = true;
			     		this.createdGroupLevel = level;
			     		this.p_groupname = this.groupname;
			     		this.p_grouplevel = this.grouplevel;
			     		this.groupname = '';
						this.grouplevel = 0;
			     		let toast = this.toastCtrl.create({
				            message: success_msg,
				            duration: 3000,
				            cssClass: 'success',
	    					position: 'top'
			            });
		           		toast.present();
			     	}
			     	
				},
			    err => {
			        this.showTechnicalError('1');
			    });
	        }
		}
		
	};

	getAllGroups(){
		this.all_groups = [];
		this.groupprovider.getGroupData(this.userId).subscribe(response => {
			for(var i=0; i < response.length; i++){
		      	if(this.allowed_levels.indexOf("level"+response[i].userLevel) >= 0){
		      		response[i].display = response[i].name;
		      		response[i].value = response[i].name;
					this.all_groups.push(response[i]);
				}
			}
		},
	    err => {
	        this.showTechnicalError();
	    });
	}

	groupListing(){
	  var response = this.all_groups;
      let alert = this.alertCtrl.create();
      alert.setTitle('Select Group');
      for(var i=0; i < response.length; i++){
      	if(this.allowed_levels.indexOf("level"+response[i].userLevel) >= 0){
	      	var isExist = false;
	      	for(var j=0; j < this.selectedGroups.selectedGroups.length; j++){
	      		if(response[i]._id == this.selectedGroups.selectedGroups[j]._id){
	      			isExist = true;
	      		}
	      	}

	      	if(isExist == true){
	      		alert.addInput({
			        type: 'checkbox',
			        label: response[i].name,
			        value: response[i],
			        checked: true
		        });
	      	}else{
	      		alert.addInput({
			        type: 'checkbox',
			        label: response[i].name,
			        value: response[i],
			        checked: false
		        });	
	      	}
	        
	      	}
  		}

      alert.addButton('Cancel');

      alert.addButton({
        text: 'Okay',
        handler: data => {
          
          this.testCheckboxOpen = false;
          this.groups = data;
          this.selectedGroups.selectedGroups = data;

          if(this.selectedGroups.selectedGroups.length == 1 && this.selectedGroups.selectedContacts.length == 0){
          	this.level = this.selectedGroups.selectedGroups[0].userLevel;
          }

          if(this.selectedGroups.selectedGroups.length == 0 && this.selectedGroups.selectedContacts.length == 1){
          	if(this.selectedGroups.selectedContacts[0].senderId == this.userId){
	        	this.level = this.selectedGroups.selectedContacts[0].senderSetLevel;
        	}else{
        		this.level = this.selectedGroups.selectedContacts[0].reciverSetLevel;
        	}
          }

          if((this.selectedGroups.selectedGroups.length == 1 && this.selectedGroups.selectedContacts.length == 1) || this.selectedGroups.selectedGroups.length > 1|| this.selectedGroups.selectedContacts.length > 1){
          	this.setLevelGroupsLoop();
          }
        }
      });

      alert.present().then(() => {
        this.testCheckboxOpen = true;
      });

	};

	toIndividuals() {
	    let alert = this.alertCtrl.create();
	    alert.setTitle('Select Contact');
		
	    for(var i=0; i < this.data.length; i++){
	    	//if to contact not selected yet 

	    	if(this.selectedGroups.selectedContacts.length == 0){
	    		
	    		//contact validation vbbased on db conditions
	    		if(this.data[i].memberstatus == 2 && this.data[i].senderSetLevel != 0 && this.data[i].reciverSetLevel != 0){
	    			//if cc contacts selected 
					alert.addInput({
					    type: 'checkbox',
					    label: this.data[i].name,
					    value: this.data[i],
				     	checked: false
				    });
    			}
	    	}else{
	    		
	    		var isExist = false;
	    		for(var j=0; j < this.selectedGroups.selectedContacts.length; j++){
	    			
		    		if(this.data[i].userId == this.selectedGroups.selectedContacts[j].userId){
		    			if(this.data[i].memberstatus == 2 && this.data[i].senderSetLevel != 0 && this.data[i].reciverSetLevel != 0){
		    				isExist = true;
		    			}
		    		}
		    	}
		    	
		    	if(isExist == true){
    				alert.addInput({
					    type: 'checkbox',
					    label: this.data[i].name,
					    value: this.data[i],
				     	checked: true
				    });
    			}else{
    				alert.addInput({
					    type: 'checkbox',
					    label: this.data[i].name,
					    value: this.data[i],
				     	checked: false
				    });
    			}
	    	}
	    }

	    alert.addButton('Cancel');

	    alert.addButton({
	      	text: 'Okay',
	      	handler: data => {
		       
		        this.testCheckboxOpen = false;
		        this.selectedGroups.selectedContacts = data;

				if(this.selectedGroups.selectedGroups.length == 1 && this.selectedGroups.selectedContacts.length == 0){
					this.level = this.selectedGroups.selectedGroups[0].userLevel;
				}

				if(this.selectedGroups.selectedGroups.length == 0 && this.selectedGroups.selectedContacts.length == 1){
		          	if(this.selectedGroups.selectedContacts[0].senderId == this.userId){
			        	this.level = this.selectedGroups.selectedContacts[0].senderSetLevel;
		        	}else{
		        		this.level = this.selectedGroups.selectedContacts[0].reciverSetLevel;
	        	}
	          }

				if((this.selectedGroups.selectedGroups.length == 1 && this.selectedGroups.selectedContacts.length == 1) || this.selectedGroups.selectedGroups.length > 1|| this.selectedGroups.selectedContacts.length > 1){
					this.setLevelGroupsLoop();
				}
	      	}
	    });

	    alert.present().then(() => {
	      this.testCheckboxOpen = true;
	    });
  	};

  	removeIndividualContact(contact){
  		
  		for(var i = 0; i < this.selectedGroups.selectedContacts.length; i++){
  			if(contact.userId == this.selectedGroups.selectedContacts[i].userId){
  				this.selectedGroups.selectedContacts.splice(i, 1);
  			}
  		}

  		if(this.selectedGroups.selectedGroups.length == 1 && this.selectedGroups.selectedContacts.length == 0){
          	this.level = this.selectedGroups.selectedGroups[0].userLevel;
        }

		if(this.selectedGroups.selectedGroups.length == 0 && this.selectedGroups.selectedContacts.length == 1){
			if(this.selectedGroups.selectedContacts[0].senderId == this.userId){
			this.level = this.selectedGroups.selectedContacts[0].senderSetLevel;
			}else{
				this.level = this.selectedGroups.selectedContacts[0].reciverSetLevel;
			}
		}
		this.setLevelGroupsLoop();
  	};

  	removeGroupsContact(contact){
  		for(var i = 0; i < this.selectedGroups.selectedGroups.length; i++){
  			if(contact._id == this.selectedGroups.selectedGroups[i]._id){
  				this.selectedGroups.selectedGroups.splice(i, 1);
  			}
  		}
  		if(this.selectedGroups.selectedGroups.length == 1 && this.selectedGroups.selectedContacts.length == 0){
          	this.level = this.selectedGroups.selectedGroups[0].userLevel;
        }

		if(this.selectedGroups.selectedGroups.length == 0 && this.selectedGroups.selectedContacts.length == 1){
			if(this.selectedGroups.selectedContacts[0].senderId == this.userId){
			this.level = this.selectedGroups.selectedContacts[0].senderSetLevel;
			}else{
				this.level = this.selectedGroups.selectedContacts[0].reciverSetLevel;
			}
		}
		this.setLevelGroupsLoop();
  	};

  	goToContacts(){
  		this.navCtrl.push('ContactsPage',{
  			selected_contacts : this.selectedGroups.selectedContacts,
  			selected_groups : this.selectedGroups.selectedGroups
  		});
  	};

  	checkBoxClicked(isChecked){
  		this.testCheckboxResult = [];
  		this.isJobChecked = isChecked;
  		if(isChecked == true){
  			if(this.navParams.get('filters') != undefined){
  				var filters = this.navParams.get('filters');
  				this.selectedJob = filters.jobId;
  				this.getTrades('',this.selectedJob,'','');
  			}
  			this.level = 1;
  			this.jobListingModal();
  			this.cc = false;
  			this.bccList = false;
  		}
  	};

  	presentPrompt() {

  		this.file_path = localStorage.getItem('smail_path');
		// var folder_path = this.file_path.split('smail/')[1];	  	
	  	if(!this.file_path) {
	  		let toast = this.toastCtrl.create({
		        message: 'Please select level to add folder.',
		        duration: 3000,
		        cssClass: 'danger',
            	position: 'top'
		       });
		       toast.present(); 
	  	}else{
		  	let alert = this.alertCtrl.create({
			    title: 'Create Folder',
			    inputs: [
			        {
			        	name: 'name',
			        	placeholder: 'name'
			        }
			    ],
			    buttons: [
			      {
			        text: 'Cancel',
			        role: 'cancel',
			        handler: data => {
			          
			        }
			      },
			      {
			        text: 'Save',
			        handler: data => {
			        	
			          if (data.name != undefined && data.name != '') {

			          	this.file_path = localStorage.getItem('smail_path');
					  	// var folder_path = this.file_path.split('smail/')[1];
					  	
					  	if(!this.file_path) 
					  	{
					  		let toast = this.toastCtrl.create({
						        message: 'Please select level to add folder.',
						        duration: 3000,
						        cssClass: 'danger',
            					position: 'top'
						       });
						       toast.present(); 
					  	}
					  	else
					  	{
				            const loading = this.loadingCtrl.create({});
			    			loading.present();
				            this.companyProvider.createFolder(this.userId,{name:data.name, level: localStorage.getItem('smail_path'), userId: this.userId}).subscribe((formdata)=>{
				            
				            	
				            if(formdata.status == 1)
				              {
				                 
		                       	const loading = this.loadingCtrl.create({});
					            loading.present();
						      	this.companyProvider.getFolders(this.userId).subscribe((all_files)=>{
					                this.directory = all_files.data;

					                loading.dismissAll();
				                	let toast = this.toastCtrl.create({
				                        message: 'Folder Added.',
				                        duration: 3000,
				                        cssClass: 'success',
            							position: 'top'
				                       });
				                       toast.present(); 
					            });
				              }
				              else if(formdata.status == 2)
				              {
				                  loading.dismissAll()
				                    let toast = this.toastCtrl.create({
				                        message: 'Folder name already exists.',
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
			          } else {
			            let toast = this.toastCtrl.create({
						        message: 'Please add folder name.',
						        duration: 3000,
						        cssClass: 'danger',
            					position: 'top'
						       });
						       toast.present();
			            //return false;
			          }
			        }
			      }
			    ]
			  });
		  	alert.present();
		}
	};

	presentConfirm() {
		this.file_path = localStorage.getItem('current_smail_path');
        if (!this.file_path && this.file_path == null) {
            let toast = this.toastCtrl.create({
                message: 'Please select folder to delete.',
                duration: 3000,
                position: 'top',
                cssClass: 'danger'
            });
            toast.present();
        }
	  	else{
	  		let alert = this.alertCtrl.create({
		    title: 'Delete Folder',
		    message: 'Do you want to delete this folder?',
		    buttons: [
		      {
		        text: 'Cancel',
		        role: 'cancel',
		        handler: () => {
		          
		        }
		      },
		      {
		        text: 'Yes',
		        handler: () => {
		        	this.file_path = localStorage.getItem('current_smail_path');
				  	
				  	if(!this.file_path)
				  	{
				  		let toast = this.toastCtrl.create({
					        message: 'Please select folder to delete.',
					        duration: 3000,
					        cssClass: 'danger',
            				position: 'top'
					       });
					       toast.present(); 
				  	}
				  	else
				  	{
			          	const loading = this.loadingCtrl.create({});
			            loading.present();
			            this.companyProvider.deleteFolder({'folderId':this.file_path}).subscribe((deleted)=>{
			              if(deleted.status == 1)
			              {
			              	this.companyProvider.getFolders(this.userId).subscribe((all_files)=>{
						      	this.directory = all_files.data;
						    });
			                  
		                    loading.dismissAll()
		                    let toast = this.toastCtrl.create({
		                        message: 'Folder deleted.',
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
		        }
		      }
		    ]
		});
		alert.present();
	  	}
	};

	//NODE CLICK FUNCTION: If the node is a child (it has the component property) 
	clickNode(node) {
		
		localStorage.setItem('node', node.name);
		localStorage.setItem('view', 'folder');
		this.navCtrl.push('SmailInboxPage',{
			from_compose : '1'
		});
	};

	//FUNCTION TO CHANGE THE NODE WHICH IS ACTUALLY EXPANDED.
	showChild(node){
	    if (this.isSelected(node)) {
	      //The node is actually expanded --> contract node and don't show childs
	      this.shownGroup = null;
	    } else {
	      //The node is actually contacted --> expand node and show childs
	      this.shownGroup = node;
	      localStorage.setItem('smail_path', node.name);
	      
	      this.selectedFolder = 'folder';
	      this.selectedLevel = node.name;
	      //this.inboxData();
	    }
	};

	//FUNCTION TO KNOW IF A FOLDER NODE HAVE TO BE EXPANDED OR CONTRATED
	isSelected(node){
	      return this.shownGroup === node;
	};

	enableCc(){
		this.cc = true;
	};

	enableBcc(){
		this.bccList = true;
	};

	getValueOpton(value){
		
	};

	root(){
		this.navCtrl.setRoot('DashboardPage');
	};

	jobListingModal(){
		this.companyProvider.getAllJobs(this.userId).subscribe((data)=>{
	   	 	this.jobListingResult = data;
	   	 	if(this.navParams.get('filters') == undefined){
	   	 		this.selectedTrade = '';
	   	 	}
		},
	    err => {
	        this.showTechnicalError();
	    });
	}

	getTrades(event, jobId, index,is_selected = null){
		var i;
		if(is_selected == '1'){
			this.companyProvider.getAllJobs(this.userId).subscribe((data)=>{
		   	 	this.jobListingResult = data;
		   	 	this.selectedTrade = '';
					for(i=0; i < this.jobListingResult.length; i++){
						if(this.jobListingResult[i]._id == jobId){
							this.selectedCompany = this.jobListingResult[i].company_name;
						}
					}
			
					this.companyProvider.allTrades(jobId).subscribe((data)=>{
				   	 	this.trades = data;
				   	 	if(is_selected == '1'){
				   	 		if(Array.isArray(this.navParams.get('tradeId'))){
				   	 			this.selectedTrade = this.navParams.get('tradeId')[0];
				   	 		}
				   	 		else{
				   	 			this.selectedTrade = this.navParams.get('tradeId');
				   	 		}
				   	 		this.getTradeContacts(this.selectedTrade,'1');
				   	 	}
					});
			},
		    err => {
		        this.showTechnicalError();
		    });
		}
		else{
				for(i=0; i < this.jobListingResult.length; i++){
					if(this.jobListingResult[i]._id == jobId){
						this.selectedCompany = this.jobListingResult[i].company_name;
					}
				}
		
				this.companyProvider.allTrades(jobId).subscribe((data)=>{
			   	 	this.trades = data;
			   	 	if(is_selected == '1'){
			   	 		this.selectedTrade = this.navParams.get('tradeId');
			   	 		this.getTradeContacts(this.selectedTrade);
			   	 	}
			   	 	if(this.navParams.get('filters') != undefined){
		  				var filters = this.navParams.get('filters');		
		  				this.selectedTrade = filters.tradeId;
		  				this.selectedType = filters.jobType;
		  			}
				},
			    err => {
			        this.showTechnicalError();
			    });
		}
	}

	getTradeContacts(tradeId,is_selected = null){
		this.testCheckboxResult = [];
		tradeId = tradeId == '' ? null : tradeId;
		if(Array.isArray(tradeId)){
			tradeId = tradeId[0];
		}

		this.companyProvider.tradeInvities(tradeId).subscribe((data)=>{
			this.companyProvider.jobCoworkers(this.selectedJob).subscribe((coworkers)=>{
				var all_coworkers = [];
				if(coworkers.length > 0){
					coworkers.forEach(function(co_worker){
						if(co_worker.tradeId.indexOf(tradeId) >= 0){
							all_coworkers.push(co_worker);
						}
					})
				}
				var isUserExist = false, isCoExist = false, tradeContactss= [];
				for(var i=0; i < this.all_emails.length; i++){
					isUserExist = false;
					for(var j=0; j < data.length; j++){
						if(data[j].invite_email == this.all_emails[i].email){
							isUserExist = true;
						}
					}
					for(var y=0; y < all_coworkers.length; y++){
						if(all_coworkers[y].invite_email == this.all_emails[i].email){
							isCoExist = true;
						}
					}
					if(isUserExist == true || isCoExist == true){
						this.all_emails[i].display = this.all_emails[i].name;
						this.all_emails[i].value = this.all_emails[i].email;
						tradeContactss.push(this.all_emails[i]);
						if(is_selected == '1'){
							if(this.all_emails[i]['userId'] == this.navParams.get('userId')){
								this.testCheckboxResult.push(this.all_emails[i]);
							}
				   	 	}
					}
				}

		   	 	this.tradeContacts = tradeContactss; 	 	
		   	 	this.allTrdCons = tradeContactss; 	 	
		   	},
		    err => {
		        this.showTechnicalError();
		    });
		},
	    err => {
	        this.showTechnicalError();
	    });	
	}

	selectTradeContact(){
		let alert = this.alertCtrl.create();
	    alert.setTitle('Select Contact');
	    var i;
    	//if to contact not selected yet 
    	if(this.testCheckboxResult.length == 0){
    		for(i=0; i < this.allTrdCons.length; i++){
	    		//contact validation based on db conditions
	    		if(this.allTrdCons[i].memberstatus == 2 && this.allTrdCons[i].senderSetLevel != 0 && this.data[i].reciverSetLevel != 0){
	    			//if cc contacts selected 
					alert.addInput({
					    type: 'checkbox',
					    // label: this.tradeContacts[i].name + ' (' + this.selectedCompany + ')',
					    label: this.allTrdCons[i].name,
					    value: this.allTrdCons[i],
				     	checked: false
				    });
				}		
	    	}
    	}else{
			var isUserExist = false;
			if(this.allTrdCons.length == this.testCheckboxResult.length){
				for(i=0; i < this.allTrdCons.length; i++){
					alert.addInput({
					    type: 'checkbox',
					    label: this.allTrdCons[i].name,
					    value: this.allTrdCons[i],
				     	checked: true
				    });
				}
			}
			else{
				for(i=0; i < this.allTrdCons.length; i++){
	    			isUserExist = false;
	    			for(var j=0; j < this.testCheckboxResult.length; j++){
	    				if(this.testCheckboxResult[j].email == this.allTrdCons[i].email){
			    			if(this.allTrdCons[i].memberstatus == 2 && this.allTrdCons[i].senderSetLevel != 0 && this.data[i].reciverSetLevel != 0){
							    isUserExist = true;
			    			}
			    		}
			    		if(isUserExist){
				    		alert.addInput({
							    type: 'checkbox',
							    // label: this.tradeContacts[i].name + ' (' + this.selectedCompany + ')',
							    label: this.allTrdCons[i].name,
							    value: this.allTrdCons[i],
						     	checked: true
						    });
					    }else{
				    		alert.addInput({
							    type: 'checkbox',
							    // label: this.tradeContacts[i].name + ' (' + this.selectedCompany + ')',
							    label: this.allTrdCons[i].name,
							    value: this.allTrdCons[i],
						     	checked: false
					    	});
			    		}
	    			}
		    		
		    	}
			}
    		
	    }

	    alert.addButton('Cancel');

	    alert.addButton({
	      	text: 'Okay',
	      	handler: data => {

		        this.testCheckboxOpen = false;
		        
		        if(data == undefined || data == null || data ==''){
		        	data = [];
		        }
		        this.testCheckboxResult = data;

		        if(this.testCheckboxResult.length == 1 && this.ccCheckboxResult.length && this.bccCheckboxResult.length){
		        	if(this.testCheckboxResult[0].senderId == this.userId){
		        		this.level = this.testCheckboxResult[0].senderSetLevel;
		        	}else{
		        		this.level = this.testCheckboxResult[0].reciverSetLevel;
		        	}
		        }
		       // if(this.isJobChecked == true)
	      	}
	    });

	    alert.present().then(() => {
	      this.testCheckboxOpen = true;
	    });
	}

	sendJobSmail(){
		//if only one contact selected for email sent
		var usersArray = [], fromUser = [];
		for (var i = 0; i < this.testCheckboxResult.length; i++) {
			for (var j = 0; j < this.data.length; j++) {
				if(this.testCheckboxResult[i].userId == this.data[j].userId){
					if(this.override == true && this.data[j].force == true){
						usersArray.push({'userId': this.data[j].userId, 'level': this.data[j].level});
						fromUser.push({'userId': localStorage.getItem('userinfo'), 'level':  this.data[j].senderSetLevel});
					}else if(this.override == true  && this.data[j].force == false){
						usersArray.push({'userId': this.data[j].userId, 'level': this.level});
						fromUser.push({'userId': localStorage.getItem('userinfo'), 'level':  this.data[j].senderSetLevel});
					}else{
						usersArray.push({'userId': this.data[j].userId, 'level': this.data[j].level});
						fromUser.push({'userId': localStorage.getItem('userinfo'), 'level':  this.data[j].senderSetLevel});
					}
					
				}
			}
		}


		
	  	var maildata = {
	  		'toId' : usersArray,
	  		'fromId': fromUser,
	  		'subject': this.subject,
	  		'message': this.desc,
	  		'attacment': this.attacments,
	  		'isReply': false,
	  		'mailId': null,
	  		'bcc': [],
	  		'cc': [],
	  		'override': this.override,
	  		'level': this.level,
	  		'isGroupMsg': false,
	  		'read':false,
	  		'isForward': false,
	  		'jobId': this.selectedJob,
	  		'jobType': this.selectedType,
  			'tradeId': this.selectedTrade
	  	};
	  	this.mailText = maildata;
	  	
	  	if(usersArray.length == 0){
	  		let toast = this.toastCtrl.create({
		            message: 'Please specify at least one recipient.',
		            duration: 3000,
		            cssClass: 'danger',
            		position: 'top'
	           });
           toast.present();
	  	}else if(this.subject == ''){
	  		let toast = this.toastCtrl.create({
		            message: 'Please input subject.',
		            duration: 3000,
		            cssClass: 'danger',
            		position: 'top'
	           });
           toast.present();
	  	}else{
	  		const loading = this.loadingCtrl.create({});
		    loading.present();
		    this.smailserviceProvider.sendSmail(this.mailText).subscribe((data)=>{
		      	
		      	loading.dismissAll();
		      	let toast = this.toastCtrl.create({
		                    message: 'Mail has been sent successfully.',
		                    duration: 3000,
		                    cssClass: 'success',
            				position: 'top'
		                  });
		          	toast.present(); 
		        localStorage.setItem('view', 'Sent');
		        this.navCtrl.push('SmailInboxPage',{
		        	after_job_smail : '1',
		        	jobId : this.selectedJob,
		        	tradeId : this.selectedTrade,
		        	jobType : this.selectedType
		        });
		      	//this.navCtrl.push(SmailPage);
		    },
		    err => {
		        loading.dismissAll();
		        this.showTechnicalError('1');
		    });
	  	}
	}
  isParaActive:boolean = false;
  isBtnActive:boolean = false;
 
  //ToggleClass function functionality
  toggleClass(){
      this.isParaActive = !this.isParaActive;
      this.isBtnActive = !this.isBtnActive;
  };

  inboxPage(){
  	localStorage.setItem('view', 'Inbox');
  	this.navCtrl.setRoot('SmailInboxPage');
  }

  myInboxPage(){
  	localStorage.setItem('view', 'Inbox');
  	this.navCtrl.setRoot(SmailInboxPage);
  }
} 