import {Component, ViewChild} from '@angular/core';
import {IonicPage, App, NavController, NavParams, ModalController, LoadingController, AlertController, ToastController,Events, Content} from 'ionic-angular';
import { SmailserviceProvider} from '../../providers/smailservice/smailservice';
import { DatePipe } from '@angular/common';
import { CompanyProvider} from '../../providers/company/company';
import { MemberserviceProvider} from '../../providers/memberservice/memberservice';
import { ContactserviceProvider} from '../../providers/contactservice/contactservice';
import { GroupserviceProvider} from '../../providers/groupservice/groupservice';
import * as CryptoJS from 'crypto-js';
import { DragulaService } from 'ng2-dragula/ng2-dragula';
import * as $ from 'jquery';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
let _uniqueId = 0;

@IonicPage()
@Component({
    selector: 'page-smail-inbox',
    templateUrl: 'smail-inbox.html',
    providers: [SmailserviceProvider, DatePipe, CompanyProvider, MemberserviceProvider, ContactserviceProvider, GroupserviceProvider]
})

export class SmailInboxPage {
    @ViewChild(Content) content : Content;
    @ViewChild('scroll') scroll: any;
    userId: string;
    items: any;
    pages: any;
    date: any;
    notis_data: any;
    public displayText:any; 
    baseUrl: String;
    editor_tab : string = 'format';
    baseUrl_main: any = localStorage.getItem('baseUrl');
    openedLevel: any = [];
    User: any;
    levelArray: any;
    directory: any;
    filterValues: any;
    all_directory: any;
    selectedGroups: any = [];
    file_path: any;
    filterStorages: any;
    all_levels: any;
    timestamp: any;
    details: any = '';
    reply: String = '';
    data: any = [];
    subject: String;
    to: any = [];
    mails: any = [];
    toId: any = [];
    bccId: any = [];
    ccId: any = [];
    replyMail: any = [];
    smailData: any = [];
    frd_mailData: any = [];
    preState: String;
    which_level: any;
    testCheckboxOpen: boolean;
    testCheckboxResult = [];
    ccCheckboxResult = [];
    allowed_levels = [];
    isBrowser: any;
    selectedLevel: any = '';
    selectedFolder: any = '';
    has_loaded: any = '0';
    is_folder_sel: any = '0';
    is_main: any;
    shownGroup: any = [];
    showNodeChild: any;
    showNodeStatic: any;
    selected_trade_icon: any = null;
    selectedNode: any;
    enable_level1:any;
    enable_level2:any;
    enable_level3:any;
    enable_level4:any;
    opened_levels:any;
    shown_levels:any;
    bread_level: any = '';
    bread_folder: any = '';
    bread_level_node: any = [];
    bread_folder_node: any = [];
    bread_static: any = '';
    groups:any = [];
    Node: any = {};
    prevId: any = null;
    drag_mailId: any = null;
    folderId: any;
    foldername: String;
    thread: boolean = false;
    reverse: boolean = true;
    action: String = '';
    f1: boolean = true;
    f2: boolean = true;
    f3: boolean = true;
    f4: boolean = true;
    attacments: any = [];
    deleteSmails: any = [];
    q1: any = [];
    q2: any = [];
    oldValue: any;
    level: any;
    bccCheckboxResult: any = [];
    override: Boolean = false;
    isGroupCreated: Boolean = false;
    alllevel: any;
    allemails = [];
    term: string;
    readFilterData: any = [];
    jobFilterData: any = [];
    searchFilterData: any = [];
    isSearchFilterActive: boolean = false;
    isReadFilterActive: boolean = false;
    isJobFilterActive: boolean = false;
    jobListingResult: any = [];
    jobIndexResult: any = [];
    showSmailThumb:Boolean = false;
    trades: any = [];
    selectedTrade = '';
    selectedType = '';
    selectedFolderId = '';
    selecetedFolderNode: any;
    selectedFirst:any = 0;
    selectedSecond:any = 0;
    selectedthird:any = 0;
    selectedForth:any = 0;
    fn_counter:any = 0;
    selectedJob:any;
    print_array:any;
    gaming:any;
    desc :any;
    dragObj :any;
    searchTerm :any = '';
    uniqueBagId: string = 'dragula-bag-' + _uniqueId++;
    constructor(private transfer: FileTransfer, private file: File,public events: Events, public navCtrl: NavController, public memberserviceProvider: MemberserviceProvider, public ContactServiceProvider: ContactserviceProvider, public companyProvider: CompanyProvider, public navParams: NavParams, public modalCtrl: ModalController, public loadingCtrl: LoadingController, public smailserviceProvider: SmailserviceProvider, public App: App, public datepipe: DatePipe, private alertCtrl: AlertController, public toastCtrl: ToastController, public groupprovider: GroupserviceProvider, private dragulaService: DragulaService) {
        this.timestamp = new Date().getTime();
        if(navParams.get('from_compose') == '1')
        {
            this.reverse = false;
        }
        localStorage.removeItem('smail_path');
        this.alllevel = JSON.parse(localStorage.getItem('alllevel'));
        var userId = localStorage.getItem('userinfo');
        var isLevelOpened = false;
        if (this.alllevel) {
            this.alllevel.forEach((value) => {
                // console.log(value);
                var decrypted = CryptoJS.AES.decrypt(value, userId);
                if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level1' || decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level2' || decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level3' || decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level4') {
                    isLevelOpened = true;
                }
            });
        }

        // if (!isLevelOpened) {
        //     if (localStorage.getItem('openedLevel') == '0') {
        //         this.allowed_levels = [];
        //         this.allowed_levels.push('level' + 0);
        //         this.openedLevel = [];
        //     }else{
        //         let toast = this.toastCtrl.create({
        //             message: 'Please open level first.',
        //             duration: 3000
        //         });
        //         toast.present();
        //         this.navCtrl.push(DashboardPage);
        //     }
        // }



        this.baseUrl = localStorage.getItem('APIURL');
        this.userId = localStorage.getItem('userinfo');
        this.all_levels = JSON.parse(localStorage.getItem('alllevel'));
        this.openedLevel = [];
        this.allowed_levels = [];
        this.levelArray = [];
        var i;
        if (this.all_levels && this.all_levels.length > 0) {
            this.all_levels.forEach((value) => {
                // console.log(value);
                this.allowed_levels = [];
                var decrypted = CryptoJS.AES.decrypt(value, userId);

                if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level1') {
                    this.openedLevel = [{
                        'level': 1,
                        'checked': true
                    }];
                    this.levelArray = [{
                        'level': 1,
                        'checked': true
                    }];
                    this.allowed_levels = [];
                    for (i = 1; i <= 1; i++) {
                        this.allowed_levels.push('level' + i);
                    }
                    this.selectedFirst = 1;
                } else if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level2') {
                    this.openedLevel = [{
                            'level': 1,
                            'checked': true,
                            'model': 'f1'
                        },
                        {
                            'level': 2,
                            'checked': true,
                            'model': 'f2'
                        }
                    ];

                    this.levelArray = [{
                            'level': 1,
                            'checked': true,
                            'model': 'f1'
                        },
                        {
                            'level': 2,
                            'checked': true,
                            'model': 'f2'
                        }
                    ];
                    this.allowed_levels = [];
                    for (i = 1; i <= 2; i++) {
                        this.allowed_levels.push('level' + i);
                    }
                    this.selectedSecond = 2;
                } else if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level3') {
                    this.openedLevel = [{
                            'level': 1,
                            'checked': true,
                            'model': 'f1'
                        },
                        {
                            'level': 2,
                            'checked': true,
                            'model': 'f2'
                        },
                        {
                            'level': 3,
                            'checked': true,
                            'model': 'f3'
                        }
                    ];
                    this.levelArray = [{
                            'level': 1,
                            'checked': true,
                            'model': 'f1'
                        },
                        {
                            'level': 2,
                            'checked': true,
                            'model': 'f2'
                        },
                        {
                            'level': 3,
                            'checked': true,
                            'model': 'f3'
                        }
                    ];
                    this.selectedthird = 3;
                    this.allowed_levels = [];
                    for (i = 1; i <= 3; i++) {
                        this.allowed_levels.push('level' + i);
                    }
                } else if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level4') {
                    this.openedLevel = [{
                            'level': 1,
                            'checked': true,
                            'model': 'f1'
                        },
                        {
                            'level': 2,
                            'checked': true,
                            'model': 'f2'
                        },
                        {
                            'level': 3,
                            'checked': true,
                            'model': 'f3'
                        },
                        {
                            'level': 4,
                            'checked': true,
                            'model': 'f4'
                        }
                    ];
                    this.levelArray = [{
                            'level': 1,
                            'checked': true,
                            'model': 'f1'
                        },
                        {
                            'level': 2,
                            'checked': true,
                            'model': 'f2'
                        },
                        {
                            'level': 3,
                            'checked': true,
                            'model': 'f3'
                        },
                        {
                            'level': 4,
                            'checked': true,
                            'model': 'f4'
                        }
                    ];
                    this.selectedForth = 4;
                    this.allowed_levels = [];
                    for (i = 1; i <= 4; i++) {
                        this.allowed_levels.push('level' + i);
                    }
                } else if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level0') {
                    this.openedLevel = [];
                    this.allowed_levels = [];
                    this.levelArray = [];
                }
            });
            this.allowed_levels.push('level' + 0);
        } else {
            this.levelArray = [];
        }

        this.getDirectory();

        // drag drop code start here
        this.dragulaService.setOptions(this.uniqueBagId, { 
          revertOnSpill: true,
        });

        this.dragulaService.drag.subscribe((value) => {
            this.fn_counter = '1';
            var node = value[2].id.split('##');
            this.dragObj = {
                name : node[1],
                userId : node[2],
                _id : node[3]
            }
        });

        this.dragulaService.drop.subscribe((value) => {
            this.fn_counter = '0';
            var drop_node = value[2].id.split('##');
            this.dragObj.level = drop_node[0];
            this.fireDragDrop();
        });

        events.subscribe('openLevel:changed', data => {  
          this.locksClicked(); 
        }); 
    };

    ionViewWillUnload() {
      this.events.unsubscribe('openLevel:changed');
    }

    mouseOverDrop(event,name){
        if(this.fn_counter == '1'){
            this.dragObj.level = name
            this.fireDragDrop();
        }
    }

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

    tradesFilter(){
        let modal = this.modalCtrl.create('TradeslistPage',
            {jobId: this.selectedJob,selected_trade:this.selectedTrade},
            {cssClass : 'trade_list_smail'});
        modal.onDidDismiss(tradeId => {
        if(tradeId != undefined && tradeId != null && tradeId != ''){
            this.selectedTrade = tradeId;
            this.selected_trade_icon = this.trades[tradeId].trade_icon;
            this.searchFn(this.searchTerm, this.selectedJob, this.gaming, tradeId, false, this.selectedType);
            } 
        });
        modal.present();
    }

    printAll(smail){
        if(smail.child.length == 0){
            this.printOne(smail.thread,'all');
        }
        else{
            var newArr = smail.thread.concat(smail.child)
            this.printOne(newArr,'all');
        }
    }

    printOne(smail,type = null){
        this.print_array = [];
        if(type == 'all'){ 
            this.print_array = smail;
        }
        else{
            this.print_array.push(smail);
        }
        var printContent = '<img class="logo-desktop" height="50px" text-center src="'+this.baseUrl_main+'/assets/images/logo-black.png">';
        var count = 0;
        var self = this;
        this.print_array.forEach(function(print){
            var toList = '';
            print.toArray.forEach(function(to){
                toList += to.name+'<'+to.email+'>, ';
            });
            printContent += '<p>From: '+print.name+' <'+print.email+'></p><p>To: '+toList+'</p><p>Subject:'+print.subject+'</p><p>'+print.message+'</p><hr>';
            count = count + 1;
            if(count == self.print_array.length){
                self.printFinal(printContent);
            }
        });
    }

    printFinal(printContent){
        const WindowPrt = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
        WindowPrt.document.write(printContent);
        WindowPrt.document.close();
        WindowPrt.focus();
        setTimeout(function() {
            WindowPrt.print();
            WindowPrt.close();
        }, 250);
    }

    fireDragDrop(){
        if(this.isBrowser == 'true'){
            this.fn_counter = '0';
            const loading = this.loadingCtrl.create({});
            loading.present();
            this.companyProvider.updateFolder(this.dragObj).subscribe((result) => {
                loading.dismissAll();
                if(result.status == '1'){
                    let toast = this.toastCtrl.create({
                        message: 'Folder drag & droped successfully.',
                        duration: 3000,
                        position: 'top',
                        cssClass: 'success'
                    });
                    toast.present();
                    this.getDirectory();
                }
                else if(result.status == '2'){
                    let toast = this.toastCtrl.create({
                        message: 'Folder already exists.',
                        duration: 3000,
                        position: 'top',
                        cssClass: 'danger'
                    });
                    toast.present();
                    this.getDirectory();
                    this.reverse = true;
                }
                else {
                    let toast = this.toastCtrl.create({
                        message: 'Error, plz try later.',
                        duration: 3000,
                        position: 'top',
                        cssClass: 'danger'
                    });
                    toast.present();
                    this.getDirectory();
                }
            },
            err => {
                loading.dismissAll();
                this.showTechnicalError('1');
            });
        }
    }

    ionViewDidLoad() {
        var i;
        this.isBrowser = localStorage.getItem('isBrowser');
        this.pages = [{
                title: 'Compose',
                component: 'ComposePage',
                icon: "md-create"
            },
            {
                title: 'Inbox',
                component: 'SmailInboxPage',
                icon: "mail-outline"
            },
            {
                title: 'Sent',
                component: 'SmailInboxPage',
                icon: "md-mail-open"
            }
        ];

        
        // get groups
        // this.groupprovider.getGroupData(this.userId).subscribe((group_data)=>{
        //     this.selectedGroups =  group_data;
        // });

        //get last component name
        // var val = this.navCtrl.last();
        this.preState = localStorage.getItem('view');
        if (this.preState == '' || this.preState == undefined || this.preState == null) {
            this.preState = 'Inbox';
            localStorage.setItem('view', 'Inbox');
            
        }

        if (this.preState == 'Inbox') {
            this.inboxData('ee');
            this.filterJobSmails();
        } else if (this.preState == 'folder') {
            this.companyProvider.getFolders(this.userId).subscribe((all_files) => {
                if (all_files.data == null) {
                    this.directory = [];
                    this.filterJobSmails();
                } else {
                    var myArray = all_files.data;
                    for (i = myArray.length - 1; i >= 0; --i) {
                        if (this.allowed_levels.indexOf(myArray[i].name) == -1) {
                            myArray.splice(i, 1);
                        }
                    }
                    this.directory = myArray;
                    var node = localStorage.getItem('node');
                    for (i = 0; i < this.directory.length; i++) {
                        if (this.directory[i].name == node) {
                            this.preState = null;
                            this.showNodeStatic = null;
                            this.showNodeChild = null;
                            localStorage.removeItem('current_smail_path');
                            // console.log(this.directory[i])
                            //NODE IS A FOLDER --> expand childs
                            //this.shownGroup = this.directory[i];
                            localStorage.setItem('smail_path', this.directory[i].name);

                            this.selectedFolder = 'folder';
                            this.selectedLevel = this.directory[i].name;
                            this.inboxData('ee');
                            
                        }
                    }
                    this.filterJobSmails();
                }
            },
            err => {
                this.showTechnicalError();
            });
        } else {
           this.sentMailsData('ee');
           this.filterJobSmails(); 
        }
        this.has_loaded = '1';
        this.getOpenLevels();
    };

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

    filterJobSmails(){
      if(this.navParams.get('job_smail') == '1'){
         this.selectedJob = this.navParams.get('jobId');
         this.preState = 'Sent';
         this.searchFn(this.searchTerm, this.selectedJob, this.gaming, this.selectedTrade, true, this.selectedType);
      }
    }

    resetFilters(){
        this.searchTerm = '';
        this.selectedJob = '';
        this.gaming = '';
        this.selectedTrade = '';
        this.selectedType = '';
        this.searchFn(this.searchTerm, this.selectedJob, this.gaming, this.selectedTrade, true, this.selectedType, true);
    }

    goToJobs(){
       this.navCtrl.push('TradeDashboardPage',{
            jobId : this.selectedJob,
            from_smail : '1',
            job_title: this.jobIndexResult[this.selectedJob]
        }); 
    }

    goToJob(){
        if(this.filterValues.jobId != '' && this.filterValues.tradeId != ''){
            if(this.filterValues.jobType != ''){
                if(this.filterValues.jobType == 'rfi'){
                    this.navCtrl.push('RfisPage',{
                        jobId : this.filterValues.jobId,
                        from_smail : '1'
                    });
                }
                else if(this.filterValues.jobType == 'addendum'){
                   this.navCtrl.push('AdendumPage',{
                        jobId : this.filterValues.jobId,
                        from_smail : '1'
                    }); 
                }
                else{
                    this.navCtrl.push('TradeDashboardPage',{
                        jobId : this.filterValues.jobId,
                        from_smail : '1',
                        job_title: this.jobIndexResult[this.selectedJob]
                    }); 
                }
            }
            else{

            }
        }
        else if(this.filterValues.jobId != '' && this.filterValues.tradeId == ''){
            this.navCtrl.push('TradeDashboardPage',{
                jobId : this.filterValues.jobId,
                from_smail : '1'
            }); 
        }
    }

    getDirectory(){
        this.has_loaded = '0';
        var i,ntype;
        this.companyProvider.getFolders(this.userId).subscribe((all_files) => {
            // console.log(all_files)
            this.directory =[];
            if (all_files.data == null) {
                this.directory = [];
                if (localStorage.getItem('openedLevel') != 'null') {
                    if (localStorage.getItem('openedLevel') == '0') {
                        this.allowed_levels = [];
                        this.allowed_levels.push('level' + 0);
                        for (i = 0; i < this.openedLevel.length; i++) {
                            this.openedLevel[i].checked = false;
                        }
                    } else if(localStorage.getItem('openedLevel') == 'all'){
                        // this.allowed_levels = [];
                        // for (var i = 0; i < this.openedLevel.length; i++) {
                            
                                
                        //         this.allowed_levels.push('level' + this.openedLevel[i].level);
                        //         this.openedLevel[i].checked = true;
                             
                        // }
                    }else {
                        for (i = 0; i < this.openedLevel.length; i++) {
                            if (this.openedLevel[i].level == localStorage.getItem('openedLevel')) {
                                this.allowed_levels = [];
                                this.allowed_levels.push('level' + this.openedLevel[i].level);
                                this.openedLevel[i].checked = true;
                            } else {
                                this.openedLevel[i].checked = false;
                            }
                        }
                    }
                    if(localStorage.getItem('openedLevel') == '0') {
                        ntype = 'notify';
                    }else{
                        ntype = 'smail';
                    }
                   
                }
            } else {
                this.directory = [];
                var myArray = all_files.data;
                for (i = myArray.length - 1; i >= 0; --i) {
                    this.alllevel = JSON.parse(localStorage.getItem('alllevel'));
                    var userId = localStorage.getItem('userinfo');
                    // var isLevelOpened = false;
                    if (this.alllevel) {
                        this.alllevel.forEach((value) => {
                            // console.log(value);
                            var decrypted = CryptoJS.AES.decrypt(value, userId);
                            if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == myArray[i].name) {
                                this.directory.push(myArray[i])
                            }
                        });
                    }
                    
                }
                
                if (localStorage.getItem('openedLevel') != 'null') {
                    if (localStorage.getItem('openedLevel') == '0') {
                        this.allowed_levels = [];
                        this.allowed_levels.push('level' + 0);
                        for (i = 0; i < this.openedLevel.length; i++) {
                            this.openedLevel[i].checked = false;
                        }
                        // console.log(this.directory)
                    } else if(localStorage.getItem('openedLevel') == 'all'){
                        // this.allowed_levels = [];
                        // for (var i = 0; i < this.openedLevel.length; i++) {
                            
                                
                        //         this.allowed_levels.push('level' + this.openedLevel[i].level);
                        //         this.openedLevel[i].checked = true;
                             
                        // }
                    }else {
                        for (i = 0; i < this.openedLevel.length; i++) {
                            if (this.openedLevel[i].level == localStorage.getItem('openedLevel')) {
                                this.allowed_levels = [];
                                this.allowed_levels.push('level' + this.openedLevel[i].level);
                                this.openedLevel[i].checked = true;
                            } else {
                                this.openedLevel[i].checked = false;
                            }
                        }
                    }

                    if(localStorage.getItem('openedLevel') == '0') {
                        ntype = 'notify';
                    }else{
                        ntype = 'smail';
                    }
                   
                }
            }
            this.all_directory = this.directory;
            //console.log(this.directory)

            // console.log('localStorage.getItem(');
            // console.log(localStorage.getItem('openedLevel'))
            

            this.preState = localStorage.getItem('view');
            

            this.companyProvider.getAllJobs(this.userId).subscribe((data) => {
                // console.log(data)
                this.jobListingResult = data;
                if(data != ''){
                    var jobIndexResult = [];
                    data.forEach(function(job){
                        jobIndexResult[job._id] = job.job_title;
                    });
                    this.jobIndexResult = jobIndexResult;
                }
                // this.companyProvider.allTrades(this.jobListingResult[0]._id).subscribe((data)=>{
                //     console.log(data)
                //     this.trades = data;
                // });
            },
            err => {
                this.showTechnicalError();
            });
        },
        err => {
            this.showTechnicalError();
        });
        this.has_loaded = '1';
    }

    getOpenLevels()
      {
        this.opened_levels = [];
        var levels_array = JSON.parse(localStorage.getItem('alllevel'));
        if(levels_array){
          levels_array.forEach((value) => {
            var decrypted = CryptoJS.AES.decrypt(value, this.userId);
            if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level0'){
              this.enable_level1 = 'true';
              this.enable_level2 = 'true';
              this.enable_level3 = 'true';
              this.enable_level4 = 'true';
            }
            if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level1'){
              this.enable_level1  = 'false';
              this.enable_level2 = 'true';
              this.enable_level3 = 'true';
              this.enable_level4 = 'true';
            } if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level2'){
              this.enable_level1  = 'false';
              this.enable_level2  = 'false';
              this.enable_level3 = 'true';
              this.enable_level4 = 'true';
            } if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level3'){
              this.enable_level1  = 'false';
              this.enable_level2  = 'false';
              this.enable_level3  = 'false';
              this.enable_level4 = 'true';
            } if(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level4'){
              this.enable_level1  = 'false';
              this.enable_level2  = 'false';
              this.enable_level3  = 'false';
              this.enable_level4  = 'false';
            } 
          });
        }

        if(this.enable_level1 == 'false') 
        {
          this.opened_levels.push('level1');
        }
        if(this.enable_level2 == 'false')
        {
          this.opened_levels.push('level2');
        }
        if(this.enable_level3 == 'false')
        {
          this.opened_levels.push('level3');
        }
        if(this.enable_level4 == 'false')
        {
          this.opened_levels.push('level4');
        }
        this.shown_levels = this.opened_levels;

      }

    inboxData(value,type = null) {
        this.preState = 'Inbox';
        var i,myArray,level_array;
        if(type == null)
        {
            this.bread_level = '';
            this.bread_folder = '';
            this.bread_static = '';  
            this.is_main = '1';   
            this.is_folder_sel = '0';       
        }
        if(type == '1')
        {
            this.is_main = '0';  
            this.is_folder_sel = '1';         
        }
        this.has_loaded = '0';
        // this.selectedJob = '';
        // this.selectedTrade = '';
        // this.searchTerm = '';
        // this.gaming = '';
        this.filterStorages = {
            jobId : this.selectedJob,
            tradeId : this.selectedTrade,
            searchTerm : this.searchTerm,
            status : this.gaming,
            jobType : this.selectedType
        }
        this.details = '';
        this.items = [];
        const loading = this.loadingCtrl.create({});
        loading.present();
        this.userId = localStorage.getItem('userinfo');
        this.smailserviceProvider.inbox(this.userId).subscribe((data) => {
            this.has_loaded = '1';
            if (data.length > 0) {
                if(this.selectedFolder == ''){
                    myArray = data;
                    for (i = myArray.length - 1; i >= 0; --i) {

                        if (myArray[i].isGroupMsg == true) {
                            if (this.allowed_levels.indexOf('level' + myArray[i].level) == -1) {
                                myArray.splice(i, 1);
                            }
                        } else if (myArray[i].isForce == true) {
                            if (myArray[i].fromId[0].userId == this.userId) {
                                if (this.allowed_levels.indexOf('level' + myArray[i].senderLevel) == -1) {
                                    myArray.splice(i, 1);
                                }
                            } else {
                                if (this.allowed_levels.indexOf('level' + myArray[i].receiverLevel) == -1) {
                                    myArray.splice(i, 1);
                                }
                            }

                        } else if (myArray[i].isOverride == true) {
                            if (myArray[i].fromId[0].userId == this.userId) {
                                if (this.allowed_levels.indexOf('level' + myArray[i].level) == -1) {
                                    myArray.splice(i, 1);
                                }
                            } else {
                                if (this.allowed_levels.indexOf('level' + myArray[i].receiverLevel) == -1) {
                                    myArray.splice(i, 1);
                                }
                            }
                        }else {
                            if (myArray[i].fromId[0].userId == this.userId) {
                                if (this.allowed_levels.indexOf('level' + myArray[i].senderLevel) == -1) {
                                    myArray.splice(i, 1);
                                }
                            } else {
                                if (this.allowed_levels.indexOf('level' + myArray[i].receiverLevel) == -1) {
                                    myArray.splice(i, 1);
                                }
                               
                            }
                        }

                    }

                    for (i = myArray.length - 1; i >= 0; i--) {
                        if (myArray[i].mailId == null && myArray[i].isReply == true && myArray[i].mails.length == 0) {
                            myArray.splice(i, 1);
                        }
                    }
                    loading.dismissAll();
                    this.items = myArray;
                    this.allemails = myArray;

                    this.getFilterStorages();

                      if(this.navParams.get('from_job') == '1'){
                         this.selectedJob = this.navParams.get('jobId');
                         this.companyProvider.allTrades(this.selectedJob).subscribe((data)=>{
                                this.trades = data;
                                this.searchFn(this.searchTerm, this.selectedJob, this.gaming, this.selectedTrade, true, this.selectedType,true);
                            },
                            err => {
                                this.showTechnicalError();
                            });
                      }

                      if(this.navParams.get('notis') == '32'){
                        this.notis_data = {
                            _id : this.navParams.get('_id'),
                            read : false
                        }
                        this.openInvitationMail(this.notis_data);
                      }

                    // if(this.items.length > 0){
                    // var all_mails = [];
                    // this.items.forEach(function(data){
                    //     if(data.folder == undefined){
                    //         all_mails.push(data);
                    //     }
                    // });
                    // this.items = all_mails;
                    // this.allemails = all_mails;
                    // }
                    
                }else{
                    //here updatign conditions based on level n folder selection
                    if(this.selectedLevel == 'level1' || this.selectedLevel == 'level2' || this.selectedLevel == 'level3' || this.selectedLevel == 'level4'){
                        myArray = data;
                        level_array = [];
                        if(value != 'filter'){
                            
                            level_array.push(this.selectedLevel);
                        }
                            // level_array.push(this.selectedLevel);

                        for (i = myArray.length - 1; i >= 0; --i) {
                            // console.log(myArray[i].mails.length)
                            if (myArray[i].isGroupMsg == true) {
                                if (level_array.indexOf(this.selectedLevel) == -1) {
                                    myArray.splice(i, 1);
                                }
                            } else if (myArray[i].isForce == true) {
                                if (myArray[i].fromId[0].userId == this.userId) {
                                    if (level_array.indexOf('level' + myArray[i].senderLevel) == -1 && this.selectedLevel ==  myArray[i].senderLevel) {
                                        myArray.splice(i, 1);
                                    }
                                } else {
                                    if (level_array.indexOf('level' + myArray[i].receiverLevel) == -1) {
                                        myArray.splice(i, 1);
                                    }
                                }

                            } else if (myArray[i].isOverride == true) {
                                if (myArray[i].fromId[0].userId == this.userId) {
                                    if (level_array.indexOf('level' + myArray[i].level) == -1) {
                                        myArray.splice(i, 1);
                                    }
                                } else {
                                    if (level_array.indexOf('level' + myArray[i].receiverLevel) == -1) {
                                        myArray.splice(i, 1);
                                    }
                                }
                            } else {
                                if (myArray[i].fromId[0].userId == this.userId) {
                                    if (level_array.indexOf('level' + myArray[i].senderLevel) == -1) {
                                        myArray.splice(i, 1);
                                    }
                                } else {
                                    if (level_array.indexOf('level' + myArray[i].receiverLevel) == -1) {
                                        myArray.splice(i, 1);
                                    }
                                }
                            }
                        }

                        for (i = myArray.length - 1; i >= 0; i--) {
                            if (myArray[i].mailId == null && myArray[i].isReply == true && myArray[i].mails.length == 0) {
                                myArray.splice(i, 1);
                            }
                        }
                        this.items = myArray;
                        this.allemails = myArray;
                        this.getFilterStorages();
                        loading.dismissAll();
                    }else{
                        if(value != 'filter'){
                            if(this.selectedFolderId != ''){
                                myArray = data;
                                level_array = [];
                                // var folderId = this.selecetedFolderNode;
                                    if(value != 'filter'){
                                
                                        level_array.push(this.selectedLevel);
                                    }
                                    this.items = myArray;
                                    this.allemails = myArray;
                                    var folder_mails = [];
                                    var self = this;
                                    // console.log(myArray)
                                    if(myArray.length > 0){
                                        myArray.forEach(function(data){
                                            if (self.selecetedFolderNode._id == data.folderId) {
                                                // folder_mails.push(data);
                                                // console.log(data)

                                                // if (data.fromId[0].userId == self.userId) {
                                                //     if (level_array.indexOf('level' + data.senderLevel) == -1 && this.selectedLevel ==  data.senderLevel) {
                                                //         // do nothing
                                                //     }
                                                //     else{
                                                //       folder_mails.push(data);  
                                                //     }
                                                // } else {
                                                //     if (level_array.indexOf('level' + data.receiverLevel) == -1) {
                                                //         // do nothing
                                                //     }
                                                //     else{
                                                //       folder_mails.push(data);  
                                                //     }
                                                // }
                                                if(data.mailId != null && data.isGroupMsg == false){
                                                    folder_mails.push(data);  
                                                }
                                            }
                                        });
                                        loading.dismissAll(); 
                                        this.items = folder_mails;
                                        this.allemails = folder_mails;
                                        this.getFilterStorages();
                                    }

                                    // console.log(this.items);
                                // for (var i = myArray.length - 1; i >= 0; --i) {
                                //     // console.log(myArray[i].mails.length)
                                //     if (myArray[i].isGroupMsg == true) {
                                //         if (level_array.indexOf(this.selectedLevel) == -1) {
                                //             myArray.splice(i, 1);
                                //         }
                                //     } else if (myArray[i].isForce == true) {
                                //         if (myArray[i].fromId[0].userId == this.userId) {
                                //             if (level_array.indexOf('level' + myArray[i].senderLevel) == -1 && this.selectedLevel ==  myArray[i].senderLevel) {
                                //                 myArray.splice(i, 1);
                                //             }
                                //         } else {
                                //             if (level_array.indexOf('level' + myArray[i].receiverLevel) == -1) {
                                //                 myArray.splice(i, 1);
                                //             }
                                //         }

                                //     } else if (myArray[i].isOverride == true) {
                                //         if (myArray[i].fromId[0].userId == this.userId) {
                                //             if (level_array.indexOf('level' + myArray[i].level) == -1) {
                                //                 myArray.splice(i, 1);
                                //             }
                                //         } else {
                                //             if (level_array.indexOf('level' + myArray[i].receiverLevel) == -1) {
                                //                 myArray.splice(i, 1);
                                //             }
                                //         }
                                //     } else {
                                //         if (myArray[i].fromId[0].userId == this.userId) {
                                //             if (level_array.indexOf('level' + myArray[i].senderLevel) == -1) {
                                //                 myArray.splice(i, 1);
                                //             }
                                //         } else {
                                //             if (level_array.indexOf('level' + myArray[i].receiverLevel) == -1) {
                                //                 myArray.splice(i, 1);
                                //             }
                                //         }
                                //     }
                                // }
                                // console.log(myArray)

                                // for (var i = myArray.length - 1; i >= 0; i--) {
                                //     if (myArray[i].mailId == null && myArray[i].isReply == true && myArray[i].mails.length == 0) {
                                //         myArray.splice(i, 1);
                                //     }
                                // }
                                // console.log(myArray)
                                // for(var i = myArray.length - 1; i >= 0; i--){
                                //     if(!myArray[i].folder){
                                //         myArray.splice(i, 1);
                                //     }else if(myArray[i].folder != folderId.name){
                                //         myArray.splice(i, 1);
                                //     }
                                // }


                                // this.items = myArray;
                                // this.allemails = myArray;
                                
                            }
                        }else{
                            loading.dismissAll();
                            this.details = '';
                            this.items = [];
                        }
                    }

                    this.details = '';
                    this.thread = false;

                    if (this.term && this.term.trim() != '' && this.term.trim() != undefined) {
                        this.items = this.items.filter((item) => {
                            var temp = item.toArray.filter((contact) => {
                                return (contact.email.toLowerCase().indexOf(this.term.toLowerCase()) > -1)
                            });

                            if (item.subject.toLowerCase().indexOf(this.term.toLowerCase()) > -1) {
                                return item;
                            } else {
                                if (item.name.toLowerCase().indexOf(this.term.toLowerCase()) > -1) {
                                    return item;
                                } else {
                                    if (temp.length > 0) {
                                        return temp;
                                    }
                                }
                            }
                        });
                    }
                    if (this.gaming != undefined && this.gaming != '') {

                        this.items = this.items.filter((item) => {
                            if (this.gaming == 1) {
                                return (item.read == true);
                            } else {
                                return (item.read == false);
                            }
                        });
                    }

                    if (this.selectedJob != '') {
                        this.items = this.items.filter((item) => {
                            return (item.jobId == this.selectedJob);
                        });
                    }
                    // console.log(this.items)
                    if (this.selectedTrade != '' ) {
                        this.items = this.items.filter((item) => {
                            return (item.tradeId == this.selectedTrade);
                        });
                    }
                    
                }
            } else {
                loading.dismissAll();
                this.details = '';
                this.items = [];
            }
        },
        err => {
            loading.dismissAll();
            this.showTechnicalError();
        });
    };

    sentMailsData(value,type = null) {
        var i,myArray,level_array;
    this.preState = 'Sent'; 
        if(type == null)
        {
            this.bread_level = '';
            this.bread_folder = '';
            this.bread_static = '';
            this.is_main = '1'; 
            this.is_folder_sel = '0';     
        }
        if(type == '1')
        {
            this.is_main = '0'; 
            this.is_folder_sel = '1';            
        }
        this.has_loaded = '0';
        // this.selectedJob = '';
        //this.selectedTrade = '';
        // this.searchTerm = '';
        // this.gaming = '';
        this.filterStorages = {
            jobId : this.selectedJob,
            tradeId : this.selectedTrade,
            searchTerm : this.searchTerm,
            status : this.gaming,
            jobType : this.selectedType
        }
        this.details = '';
        this.items = [];
        const loading = this.loadingCtrl.create({});
        loading.present();
        this.userId = localStorage.getItem('userinfo');
        this.smailserviceProvider.sendList(this.userId).subscribe((data) => {
            this.has_loaded = '1';
            if(data.length > 0){
                if(this.selectedFolder == ''){
                    myArray = data;
                    for (i = myArray.length - 1; i >= 0; --i) {
                        // console.log(myArray[i].fromId[0].userId)
                        // console.log(this.userId)
                        if (myArray[i].isGroupMsg == true) {
                            if (this.allowed_levels.indexOf('level' + myArray[i].level) == -1) {
                                myArray.splice(i, 1);
                            }
                        } else if (myArray[i].isForce == true) {
                            if (myArray[i].fromId[0].userId == this.userId) {
                                if (this.allowed_levels.indexOf('level' + myArray[i].senderLevel) == -1) {
                                    myArray.splice(i, 1);
                                }
                            } else {
                                if (this.allowed_levels.indexOf('level' + myArray[i].receiverLevel) == -1) {
                                    myArray.splice(i, 1);
                                }
                            }

                        } else if (myArray[i].isOverride == true) {
                            if (myArray[i].fromId[0].userId == this.userId) {
                                if (this.allowed_levels.indexOf('level' + myArray[i].level) == -1) {
                                    myArray.splice(i, 1);
                                }
                            } else {
                                if (this.allowed_levels.indexOf('level' + myArray[i].receiverLevel) == -1) {
                                    myArray.splice(i, 1);
                                }
                            }
                        } else {
                            if (myArray[i].fromId[0].userId == this.userId) {
                                if (this.allowed_levels.indexOf('level' + myArray[i].senderLevel) == -1) {
                                    myArray.splice(i, 1);
                                }
                            } else {
                                if (this.allowed_levels.indexOf('level' + myArray[i].receiverLevel) == -1) {
                                    myArray.splice(i, 1);
                                }
                            }
                        }

                    }
                    for (i = myArray.length - 1; i >= 0; i--) {
                        if (myArray[i].mailId != null && myArray[i].isReply == false && myArray[i].mails.length == 0 && myArray[i].subject != 'Friend Request') {
                            myArray.splice(i, 1);
                        }
                    }
                    loading.dismissAll();
                    this.items = myArray;
                    this.allemails = myArray;
                    this.getFilterStorages();
                    if(this.navParams.get('after_job_smail') == '1'){
                         this.selectedJob = this.navParams.get('jobId');
                         this.companyProvider.allTrades(this.selectedJob).subscribe((data)=>{
                                this.trades = data;
                                this.selectedTrade = this.navParams.get('tradeId');
                                this.selectedType = this.navParams.get('jobType');
                                this.filterValues = {
                                    jobId : this.selectedJob,
                                    tradeId : this.selectedTrade,
                                    jobType : this.selectedType
                                }
                                this.searchFn(this.searchTerm, this.selectedJob, this.gaming, this.selectedTrade, true, this.selectedType,true);
                            },
                            err => {
                                this.showTechnicalError();
                            });
                         // $("#go_to_reset").show();
                         document.getElementById('go_to_reset'+this.timestamp).style.display = 'inline-block';
                      }
                      if(this.navParams.get('from_job') == '1'){
                         this.selectedJob = this.navParams.get('jobId');
                         this.companyProvider.allTrades(this.selectedJob).subscribe((data)=>{
                                this.trades = data;
                                this.searchFn(this.searchTerm, this.selectedJob, this.gaming, this.selectedTrade, true, this.selectedType,true);
                            },
                            err => {
                                this.showTechnicalError();
                            });
                      }
                    this.details = '';
                    
                }else{
                    if(this.selectedLevel == 'level1' || this.selectedLevel == 'level2' || this.selectedLevel == 'level3' || this.selectedLevel == 'level4'){
                        myArray = data;
                        level_array = [];
                        if(value != 'filter'){

                            level_array.push(this.selectedLevel);
                        }

                        for (i = myArray.length - 1; i >= 0; --i) {
                            // console.log(myArray[i].mails.length)
                            if (myArray[i].isGroupMsg == true) {
                                if (level_array.indexOf(this.selectedLevel) == -1) {
                                    myArray.splice(i, 1);
                                }
                            } else if (myArray[i].isForce == true) {
                                if (myArray[i].fromId[0].userId == this.userId) {
                                    if (level_array.indexOf('level' + myArray[i].senderLevel) == -1 && this.selectedLevel ==  myArray[i].senderLevel) {
                                        myArray.splice(i, 1);
                                    }
                                } else {
                                    if (level_array.indexOf('level' + myArray[i].receiverLevel) == -1) {
                                        myArray.splice(i, 1);
                                    }
                                }

                            } else if (myArray[i].isOverride == true) {
                                if (myArray[i].fromId[0].userId == this.userId) {
                                    if (level_array.indexOf('level' + myArray[i].level) == -1) {
                                        myArray.splice(i, 1);
                                    }
                                } else {
                                    if (level_array.indexOf('level' + myArray[i].receiverLevel) == -1) {
                                        myArray.splice(i, 1);
                                    }
                                }
                            } else {
                                if (myArray[i].fromId[0].userId == this.userId) {
                                    if (level_array.indexOf('level' + myArray[i].senderLevel) == -1) {
                                        myArray.splice(i, 1);
                                    }
                                } else {
                                    if (level_array.indexOf('level' + myArray[i].receiverLevel) == -1) {
                                        myArray.splice(i, 1);
                                    }
                                }
                            }
                        }

                        for (i = myArray.length - 1; i >= 0; i--) {
                            if (myArray[i].mailId == null && myArray[i].isReply == true && myArray[i].mails.length == 0 && myArray[i].subject != 'Friend Request') {
                                myArray.splice(i, 1);
                            }
                        }
                        loading.dismissAll();
                        this.items = myArray;
                        this.allemails = myArray;
                        this.getFilterStorages();
                        
                    }else{
                        if(value != 'filter'){
                            if(this.selectedFolderId != ''){
                                myArray = data;
                                level_array = [];
                                var folderId = this.selecetedFolderNode;
                                
                                    level_array.push(folderId.level);

                                // for (var i = myArray.length - 1; i >= 0; --i) {
                                //     // console.log(myArray[i].mails.length)
                                //     if (myArray[i].isGroupMsg == true) {
                                //         if (level_array.indexOf(this.selectedLevel) == -1) {
                                //             myArray.splice(i, 1);
                                //         }
                                //     } else if (myArray[i].isForce == true) {
                                //         if (myArray[i].fromId[0].userId == this.userId) {
                                //             if (level_array.indexOf('level' + myArray[i].senderLevel) == -1 && this.selectedLevel ==  myArray[i].senderLevel) {
                                //                 myArray.splice(i, 1);
                                //             }
                                //         } else {
                                //             if (level_array.indexOf('level' + myArray[i].receiverLevel) == -1) {
                                //                 myArray.splice(i, 1);
                                //             }
                                //         }

                                //     } else if (myArray[i].isOverride == true) {
                                //         if (myArray[i].fromId[0].userId == this.userId) {
                                //             if (level_array.indexOf('level' + myArray[i].level) == -1) {
                                //                 myArray.splice(i, 1);
                                //             }
                                //         } else {
                                //             if (level_array.indexOf('level' + myArray[i].receiverLevel) == -1) {
                                //                 myArray.splice(i, 1);
                                //             }
                                //         }
                                //     } else {
                                //         if (myArray[i].fromId[0].userId == this.userId) {
                                //             if (level_array.indexOf('level' + myArray[i].senderLevel) == -1) {
                                //                 myArray.splice(i, 1);
                                //             }
                                //         } else {
                                //             if (level_array.indexOf('level' + myArray[i].receiverLevel) == -1) {
                                //                 myArray.splice(i, 1);
                                //             }
                                //         }
                                //     }
                                // }

                                // for (var i = myArray.length - 1; i >= 0; i--) {
                                //     if (myArray[i].mailId != null && myArray[i].isReply == true && myArray[i].mails.length == 0 && myArray[i].subject != 'Friend Request') {
                                //         myArray.splice(i, 1);
                                //     }
                                // }

                                // for(var i = myArray.length - 1; i >= 0; i--){
                                //     if(!myArray[i].folder){
                                //         myArray.splice(i, 1);
                                //     }else if(myArray[i].folder != folderId.name){
                                //         myArray.splice(i, 1);
                                //     }
                                // }
                                this.items = myArray;
                                this.allemails = myArray;
                                var folder_mails = [];
                                    var self = this;
                                    if(myArray.length > 0){
                                        myArray.forEach(function(data){
                                            if (self.selecetedFolderNode._id == data.folderId) {
                                                if(data.mailId == null && data.isGroupMsg == false){
                                                    folder_mails.push(data);  
                                                }
                                            }
                                        });
                                        this.items = folder_mails;
                                        this.allemails = folder_mails;
                                        loading.dismissAll(); 
                                    }
                                this.getFilterStorages();
                                
                            }
                        }else{
                            loading.dismissAll();
                            this.details = '';
                            this.items = [];
                        }
                        
                    }

                    this.details = '';
                    this.thread = false;
                    if (this.term && this.term.trim() != '' && this.term.trim() != undefined) {
                        this.items = this.items.filter((item) => {
                            var temp = item.toArray.filter((contact) => {
                                return (contact.email.toLowerCase().indexOf(this.term.toLowerCase()) > -1)
                            });

                            if (item.subject.toLowerCase().indexOf(this.term.toLowerCase()) > -1) {
                                return item;
                            } else {
                                if (item.name.toLowerCase().indexOf(this.term.toLowerCase()) > -1) {
                                    return item;
                                } else {
                                    if (temp.length > 0) {
                                        return temp;
                                    }
                                }
                            }
                        });
                    }
                    if (this.gaming != undefined && this.gaming != '') {

                        this.items = this.items.filter((item) => {
                            if (this.gaming == 1) {
                                return (item.read == true);
                            } else {
                                return (item.read == false);
                            }
                        });
                    }

                    if (this.selectedJob != '') {
                        this.items = this.items.filter((item) => {
                            return (item.jobId == this.selectedJob);
                        });
                    }
                    // console.log(this.items)
                    if (this.selectedTrade != '' ) {
                        this.items = this.items.filter((item) => {
                            return (item.tradeId == this.selectedTrade);
                        });
                    }

                    // if(this.selectedJob != ''){
                    //     this.selectedTrade = '';
                    //     this.companyProvider.allTrades(this.selectedJob).subscribe((data)=>{
                    //         console.log(data)
                    //         this.trades = data;
                    //     });
                    // }


                    if (this.items.length > 0) {
                       // this.openSmaildetailPage(this.items[0], 0);
                    } else {
                        this.details = '';
                    }
                }
            }else {
                loading.dismissAll();
                this.details = '';
                this.items = [];
            }
            
        },
        err => {
            loading.dismissAll();
            this.showTechnicalError();
        });
    };

    getFilterStorages(){
        if(this.filterStorages.jobId != '' && this.filterStorages.jobId != undefined){
         this.selectedJob = this.filterStorages.jobId;
         this.companyProvider.allTrades(this.selectedJob).subscribe((data)=>{
                this.trades = data;
                this.selectedTrade = this.filterStorages.tradeId;
                this.gaming = this.filterStorages.status;
                this.selectedType = this.filterStorages.jobType;
                this.searchFn(this.searchTerm, this.selectedJob, this.gaming, this.selectedTrade, true, this.selectedType,true);
            },
            err => {
                this.showTechnicalError();
            });
      }
    }

    filterList(isChecked, value) {
        this.details = '';
        this.thread = false;
        localStorage.setItem('openedLevel', null);
        // console.log(isChecked)
        if (isChecked == true) {
             this.allowed_levels.push('level' + value);
            if (localStorage.getItem('view') == "Inbox") {
                this.inboxData('ee');
            } else {
                this.sentMailsData('ee');
            }
        } else {
            for (var i = this.allowed_levels.length; i > 0; i--) {
                if (this.allowed_levels[i - 1] == 'level' + value) {
                    this.allowed_levels.splice(i - 1, 1);
                }
            }

            var testValue = 'level' + value;
            if (localStorage.getItem('view') == "Inbox") {
                if(this.selectedFolder != '' && this.selectedLevel == testValue || this.selectedFolder != '' && this.selecetedFolderNode.level == testValue){
                    this.items = [];
                }else if(this.selectedFolder == ''){
                  this.inboxData('ee');
                }
               
            } else {
                if(this.selectedFolder != '' && this.selectedLevel == testValue || this.selectedFolder != '' && this.selecetedFolderNode.level == testValue){
                    this.items = [];
                }else if(this.selectedFolder == ''){
                    this.sentMailsData('ee');
                }
                
            }
        }
    };

    reload() {
        if (localStorage.getItem('view') == "Inbox") {
            this.preState = 'Inbox';
            this.selectedFolder = '';
            this.inboxData('ee');
        } else {
            this.preState = 'Sent';
            this.selectedFolder = '';
            this.sentMailsData('ee');
        }
    };

    openSmaildetailPage(data, index) {
        if(data.unconnected == '1' && data.fromId[0].userId != this.userId){
            let confirm = this.alertCtrl.create({
              title: '',
              message: 'There is an unconnected person on this message thread. Do you wish to continue?',
              buttons: [
                {
                  text: 'Yes',
                  handler: () => {
                    const loading = this.loadingCtrl.create({});
                    loading.present();
                    this.smailserviceProvider.updateUnconnect({id : data._id}).subscribe((updated)=>{
                        loading.dismissAll();
                      this.allemails[index].unconnected = '0';
                      this.callDetailsFn(data, index);
                    },
                    err => {
                        loading.dismissAll();
                        this.showTechnicalError('1');
                    });
                  }
                },
                {
                  text: 'No',
                  handler: () => {
                    var loginId = this.userId;
                    var new_toId = [];
                    var unc_ids = [];
                    var latest_toId = [];
                    data.toArray.forEach(function(single){
                        if(single.userId == loginId || single.on_level != 'level5'){
                            new_toId.push({level : single.level,userId : single.userId});
                        }
                        else{
                            unc_ids.push(single.userId);
                        }
                        if(single.userId != loginId){
                            latest_toId.push({level : single.level,userId : single.userId});
                        }
                    });
                    const loading = this.loadingCtrl.create({});
                    loading.present();
                    this.smailserviceProvider.removeUnconnect({id : data._id,mailId : data.mailId, new_toId: new_toId, latest_toId: latest_toId, loginId: loginId, unc_ids: unc_ids, isReply: data.isReply, fromId: data.fromId[0].userId}).subscribe((updated)=>{
                        loading.dismissAll();
                    if(updated.user_name != null){
                        if(this.opened_levels.indexOf(updated.snd_level) >= 0 || updated.snd_level == 'level5'){
                            this.allemails[index].name = updated.user_name;
                            this.allemails[index].snd_level = updated.snd_level;
                        }
                        else{
                            this.allemails[index].name = updated.snd_level+" contact update";
                        }
                        
                    }
                    $('.unc'+index).hide();
                    this.allemails[index].unconnected = '0';
                    this.callDetailsFn(data, index);
                    },
                    err => {
                        loading.dismissAll();
                        this.showTechnicalError('1');
                    });
                  }
                }
              ]
            });
            confirm.present();
        }
        else{
            this.callDetailsFn(data, index);
        }
    };

    openInvitationMail(data){
       this.thread = false;
        this.action = '';
        var details = data;
        this.attacments = []; 
        this.showSmailThumb = true;
        this.baseUrl = localStorage.getItem('APIURL');
        this.preState = localStorage.getItem('view');
        if (details.read == false && this.preState == 'Inbox') {
            this.smailserviceProvider.readsmail(details._id,details.mailId,details.userId).subscribe((data) => {
                this.events.publish('read_mail:changed', 0);
            },
            err => {
                this.showTechnicalError('1');
            });
        }

        this.smailserviceProvider.reply(this.userId, details._id).subscribe((mailsData) => {
            localStorage.setItem('mailData', JSON.stringify(mailsData));

            this.replyMail = JSON.parse(localStorage.getItem('mailData'));
            this.details = mailsData; 
        },
        err => {
            this.showTechnicalError();
        });
    }

    callDetailsFn(data, index){
        this.thread = false;
        this.action = '';
        var details = data;
        this.attacments = [];
        if(data.toArray.length == 1){
            if(data.toArray[0].senderId == data.anotherUserId && data.toArray[0].senderThumb == 'Show'){
                this.showSmailThumb = true;
            }else if(data.toArray[0].senderId != data.anotherUserId && data.toArray[0].receiverThumb == 'Show'){
                this.showSmailThumb = true;
            }
        }
        this.testCheckboxResult = [];
        this.baseUrl = localStorage.getItem('APIURL');
        this.preState = localStorage.getItem('view');
        const loading = this.loadingCtrl.create({});
        loading.present();
        this.userId = localStorage.getItem('userinfo');

        if (details.read == false && this.preState == 'Inbox') {
            var level_num = details.isGroupMsg == true ? details.level : details.receiverLevel;
            this.items[index].read = true;
            this.smailserviceProvider.readsmail(details._id,details.mailId,details.userId).subscribe((data) => {
                this.events.publish('read_mail:changed', level_num);
            },
            err => {
                this.showTechnicalError();
            });
        }

        var id = null; 
        if (details.mailId == null) {
            id = details._id;
        } else {
            id = details.mailId;
        }

        this.smailserviceProvider.reply(this.userId, id).subscribe((mailsData) => {
            localStorage.setItem('mailData', JSON.stringify(mailsData));

            this.replyMail = JSON.parse(localStorage.getItem('mailData'));
            this.details = mailsData;

            this.ContactServiceProvider.contactsList(this.userId).subscribe((data) => {
                loading.dismissAll()
                var finalArray = [];
                var value;
                var cunt = 0;
                var i;
                // Remove Duplicate Value
                for (i = 0; i < data.length; i++) {
                    value = data[i];
                    // console.log(value);
                    if (finalArray.length > 0) {
                        if (finalArray[cunt]._id.indexOf(value._id) === -1) {
                            finalArray.push(value);
                            // console.log(finalArray);
                            cunt = cunt + 1;
                        }
                    } else {
                        finalArray.push(value);
                    }
                }
                //allowed_levels
                this.data = finalArray;

                if(this.selectedFirst != 1){
                    for(i = Number(this.data.length - 1); i >= 0; i--){
                      if(this.data[i].senderId == this.userId){
                        if(this.data[i].senderSetLevel == 1){
                          this.data.splice(i, 1);
                        }
                      }else{
                        if(this.data[i].reciverSetLevel == 1){
                          this.data.splice(i, 1);
                        }
                      }
                    }
                  }

                  if(this.selectedSecond != 2){
                    for(i = Number(this.data.length - 1); i >= 0; i--){
                      if(this.data[i].senderId == this.userId){
                        if(this.data[i].senderSetLevel == 2){
                          this.data.splice(i, 1);
                        }
                      }else{
                        if(this.data[i].reciverSetLevel == 2){
                          this.data.splice(i, 1);
                        }
                      }
                    }
                  }

                  if(this.selectedthird != 3){
                    for(i = Number(this.data.length - 1); i >= 0; i--){
                      if(this.data[i].senderId == this.userId){
                        if(this.data[i].senderSetLevel == 3){
                          this.data.splice(i, 1);
                        }
                      }else{
                        if(this.data[i].reciverSetLevel == 3){
                          this.data.splice(i, 1);
                        }
                      }
                    }
                  }

                  if(this.selectedForth != 4){
                    for(i = Number(this.data.length - 1); i >= 0; i--){
                      if(this.data[i].senderId == this.userId){
                        if(this.data[i].senderSetLevel == 4){
                          this.data.splice(i, 1);
                        }
                      }else{
                        if(this.data[i].reciverSetLevel == 4){
                          this.data.splice(i, 1);
                        }
                      }
                    }
                  }

            },
            err => {
                loading.dismissAll();
                this.showTechnicalError();
            });
        },
        err => {
            loading.dismissAll();
            this.showTechnicalError('1');
        });
        this.userId = localStorage.getItem('userinfo');
    }

    createThread(action) {
        if (action == 'fwd') {
            this.subject = 'fwd:' + this.details.thread[0].subject;
            // console.log(document.getElementsByTagName('rich-text'))
            // document.getElementsByTagName('rich-text')[0].textContent =  this.details.thread[0].message;
            this.testCheckboxResult = [];
            this.selectedGroups = [];
            var all_threads = this.details.thread[0].mails;
            this.desc = all_threads.slice(-1).pop().message;
        } 
        else {
            var i;
            this.selectedGroups = [];
            this.replyMail = JSON.parse(localStorage.getItem('mailData'));
            var mailsData = JSON.parse(localStorage.getItem('mailData')),
                receipts;
                this.desc = '';
            //if email have child emails
            if (mailsData.child.length > 0) {
                receipts = mailsData.child[mailsData.child.length - 1].toArray;

                for (i = 0; i < receipts.length; i++) {
                    if (receipts[i].userId == this.userId) {
                        receipts.splice(i, 1);
                    }
                }

                if (mailsData.child[mailsData.child.length - 1].fromId[0].userId != this.userId) {
                    receipts.push(mailsData.child[mailsData.child.length - 1].fromId[0]);
                }

            } else {
                //if single email
                receipts = mailsData.thread[0].toArray;
                for (i = 0; i < receipts.length; i++) {
                    if (receipts[i].userId == this.userId) {
                        receipts.splice(i, 1);
                    }
                }
                // console.log(mailsData.thread[0].fromId)
                if (mailsData.thread[0].fromId[0].userId != this.userId) {
                    receipts.push(mailsData.thread[0].fromId[0]);
                }

                //localStorage.setItem('receipts', receipts);
            }

            var data = receipts;
            var dict;
            //console.log(data)
            for (i = 0; i < data.length; i++) {
                // console.log(data[i].userId)
                for (var j = 0; j < this.data.length; j++) {
                    // console.log(this.data[j].userId)
                    if (data[i].userId == this.data[j].userId && data[i].userId != this.userId) {
                        dict = {
                            level: data[i].level,
                            userId: data[i].userId,
                            name: this.data[j].name
                        };
                        data[i] = this.data[j];
                    } else if (data[i].userId == this.userId) {
                        var username = localStorage.getItem('userName');
                        dict = {
                            level: data[i].level,
                            userId: data[i].userId,
                            name: this.data[j].name
                        };
                        data[i] = dict;
                        data[i].name = username;
                    }
                }
            }
            this.testCheckboxResult = data;

            if (this.testCheckboxResult.length == 1) {
                if (this.userId == this.testCheckboxResult[0].senderId) {
                    this.level = this.testCheckboxResult[0].senderSetLevel;
                } else {
                    this.level = this.testCheckboxResult[0].reciverSetLevel;
                }
            }
        }
        this.action = action;
        this.thread = true;
        // setTimeout(function(){ 
        //     var scrollElement = document.getElementById('scroll_down');
        //     scrollElement.scrollIntoView();
        // }, 500);
    };

    openLevel(value) {
        const loading = this.loadingCtrl.create({});
        loading.present();
        this.userId = localStorage.getItem('userinfo');
        this.smailserviceProvider.level_based(this.userId, value).subscribe((data) => {
            loading.dismissAll();
            // console.log(data);
            this.items = data;
        });
    };

    openPage(page) {
        // console.log(page);
        this.thread = false;
        this.deleteSmails = [];
        //this.shownGroup = [];
        this.showNodeStatic = null;
        this.showNodeChild = null;
        this.selectedNode = '';
        localStorage.setItem('openedLevel', null);
        localStorage.removeItem('smail_path');
        // Reset the content nav to have just this page
        // we wouldn't want the back button to show in this scenario
        if (page.title == "Compose") {
            this.filterStorages = {
                jobId : this.selectedJob,
                tradeId : this.selectedTrade,
                searchTerm : this.searchTerm,
                status : this.gaming,
                jobType : this.selectedType
            }
            this.navCtrl.setRoot(page.component,{
                filters : this.filterStorages
            });
        } else if (page.title == "Inbox") {
            localStorage.setItem('view', 'Inbox');
            this.preState = 'Inbox';
            this.selectedFolder = '';
            this.inboxData('ee');
        } else {
            localStorage.setItem('view', 'Sent');
            this.preState = 'Sent';
            this.selectedFolder = '';
            this.sentMailsData('ee');
        }

    };

    presentPrompt() {
        this.file_path = localStorage.getItem('smail_path');
        // console.log(this.file_path)
        // var folder_path = this.file_path.split('smail/')[1];     
        if (!this.file_path) {
            let toast = this.toastCtrl.create({
                message: 'Please select level to add folder.',
                duration: 3000,
                position: 'top',
                cssClass: 'info'
            });
            toast.present();
        } else {
            let modal = this.modalCtrl.create('AddfolderPage',{
              is_smail_folder : '1'
            });

             modal.onDidDismiss(data => { 
              if(data == '1') 
              {
                let toast = this.toastCtrl.create({
                  message: 'Folder added.',
                  position: 'top',
                  duration: 3000,
                  cssClass: 'success'
                 });
                 toast.present(); 
              }
              this.getLevelsDirectory('1');
           });
            modal.present(); 

            // let alert = this.alertCtrl.create({
            //     title: 'Create Folder',
            //     inputs: [{
            //         name: 'name',
            //         placeholder: 'Folder Name'
            //     }],
            //     buttons: [{
            //             text: 'Cancel',
            //             handler: data => {
            //                 // console.log('Cancel clicked');
            //             }
            //         },
            //         {
            //             text: 'Save',
            //             handler: data => {

            //                 if (data.name != undefined && data.name != '') {
            //                     //var navigation = alert.dismiss();
            //                     this.file_path = localStorage.getItem('smail_path');
            //                     // var folder_path = this.file_path.split('smail/')[1];

            //                     if (!this.file_path) {
            //                         let toast = this.toastCtrl.create({
            //                             message: 'Please select level to add folder.',
            //                             duration: 3000,
            //                             position: 'top',
            //                             cssClass: 'info'
            //                         });
            //                         toast.present();
            //                         return false;
            //                     } else {
            //                         const loading = this.loadingCtrl.create({});
            //                         loading.present();
            //                         var test = this.companyProvider.createFolder(this.userId, {
            //                             name: data.name,
            //                             level: localStorage.getItem('smail_path'),
            //                             userId: this.userId
            //                         }).subscribe((formdata) => {
            //                             if (formdata.status == 1) {
            //                                 const loading = this.loadingCtrl.create({});
            //                                 loading.present();
            //                                 this.companyProvider.getFolders(this.userId).subscribe((all_files) => {
            //                                     loading.dismissAll();
            //                                     var myArray = all_files.data;
            //                                     for (var i = myArray.length - 1; i >= 0; --i) {
            //                                         if (this.allowed_levels.indexOf(myArray[i].name) == -1) {
            //                                             myArray.splice(i, 1);
            //                                         }
            //                                     }
            //                                     this.directory = myArray;
            //                                     var node = localStorage.getItem('node');
            //                                     for (var i = 0; i < this.directory.length; i++) {
            //                                         if (this.directory[i].name == node) {
            //                                             this.preState = null;
            //                                             this.showNodeStatic = null;
            //                                             this.showNodeChild = null;
            //                                             localStorage.removeItem('current_smail_path');
            //                                             // console.log(this.directory[i])
            //                                             //NODE IS A FOLDER --> expand childs
            //                                             this.shownGroup = this.directory[i];
            //                                             localStorage.setItem('smail_path', this.directory[i].name);

            //                                             this.selectedFolder = 'folder';
            //                                             this.selectedLevel = this.directory[i].name;

            //                                             this.inboxData('ee');
            //                                         }
            //                                     }

            //                                     let toast = this.toastCtrl.create({
            //                                         message: 'Folder Added.',
            //                                         duration: 3000,
            //                                         position: 'top',
            //                                         cssClass: 'success'
            //                                     });
            //                                     toast.present();
            //                                 });
            //                             } else if (formdata.status == 2) {
            //                                 loading.dismissAll()
            //                                 let toast = this.toastCtrl.create({
            //                                     message: 'Folder name already exists.',
            //                                     duration: 3000,
            //                                     position: 'top',
            //                                     cssClass: 'danger'
            //                                 });
            //                                 toast.present();
            //                                 return false;
            //                             } else {
            //                                 loading.dismissAll()
            //                                 let toast = this.toastCtrl.create({
            //                                     message: 'Error, plz try later.',
            //                                     duration: 3000,
            //                                     position: 'danger',
            //                                     cssClass: 'info'
            //                                 });
            //                                 toast.present();
            //                                 return false;
            //                             }
            //                         });
            //                     }
            //                 } else {

            //                     let toast = this.toastCtrl.create({
            //                         message: 'Please add folder name.',
            //                         duration: 3000,
            //                         position: 'top',
            //                         cssClass: 'danger'
            //                     });
            //                     toast.present();
            //                     return false;
            //                 }
            //             }
            //         }
            //     ],
            //     enableBackdropDismiss: false,
            // });
            // //    let alert = this.alertCtrl.create({
            // alert.present();
        }
    };


    presentConfirm() {
        this.file_path = localStorage.getItem('current_smail_path');
        console.log(this.file_path)
        if (!this.file_path && this.file_path == null) {
            let toast = this.toastCtrl.create({
                message: 'Please select folder to delete.',
                duration: 3000,
                position: 'top',
                cssClass: 'danger'
            });
            toast.present();
        }
        else
        {
            let alert = this.alertCtrl.create({
            title: 'Delete Folder',
            message: 'Do you want to delete this folder?',
            buttons: [{
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                        // console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Yes',
                    handler: () => {
                        this.file_path = localStorage.getItem('current_smail_path');

                        if (!this.file_path) {
                            let toast = this.toastCtrl.create({
                                message: 'Please select folder to delete.',
                                duration: 3000,
                                position: 'top',
                                cssClass: 'danger'
                            });
                            toast.present();
                        } else {
                            const loading = this.loadingCtrl.create({});
                            loading.present();
                            this.companyProvider.deleteFolder({
                                'folderId': this.file_path
                            }).subscribe((deleted) => {
                                if (deleted.status == 1) {
                                    // this.companyProvider.getFolders(this.userId).subscribe((all_files) => {
                                    //     var myArray = all_files.data;
                                    //     for (var i = myArray.length - 1; i >= 0; --i) {
                                    //         if (this.allowed_levels.indexOf(myArray[i].name) == -1) {
                                    //             myArray.splice(i, 1);
                                    //         }
                                    //     }
                                    //     this.directory = myArray;
                                    //     var node = localStorage.getItem('node');
                                    //     for (var i = 0; i < this.directory.length; i++) {
                                    //         if (this.directory[i].name == node) {
                                    //             this.preState = null;
                                    //             this.showNodeStatic = null;
                                    //             this.showNodeChild = null;
                                    //             localStorage.removeItem('current_smail_path');
                                    //             // console.log(this.directory[i])
                                    //             //NODE IS A FOLDER --> expand childs
                                    //             //this.shownGroup = this.directory[i];
                                    //             localStorage.setItem('smail_path', this.directory[i].name);

                                    //             this.selectedFolder = 'folder';
                                    //             this.selectedLevel = this.directory[i].name;
                                    //             this.inboxData('ee');
                                    //         }
                                    //     }
                                    // });

                                    this.getLevelsDirectory('1');

                                    loading.dismissAll()
                                    let toast = this.toastCtrl.create({
                                        message: 'Folder deleted.',
                                        duration: 3000,
                                        position: 'top',
                                        cssClass: 'success'
                                    });
                                    toast.present();
                                } else {
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
                    }
                }
            ]
        });
        alert.present();
        }
    };

    reorderItems(indexes) {
        // console.log(indexes)
        let element = this.pages[indexes.from];
        this.pages.splice(indexes.from, 1);
        this.pages.splice(indexes.to, 0, element);
    };

    filterLevel(event,level_number) {
        // console.log(event)
        this.details = '';
        this.thread = false;
        // this.directory = [];
        // if (this.levelArray[value].checked == true) {
        //     this.levelArray[value].checked = false;
        //     for (var i = 0; i < this.allowed_levels.length; i++) {
        //         if (this.allowed_levels[i] == 'level' + this.levelArray[value].level) {
        //             this.allowed_levels.splice(i, 1);
        //         }
        //     }
        //     const loading = this.loadingCtrl.create({});
        //     loading.present();
        //     this.companyProvider.getFolders(this.userId).subscribe((all_files) => {
        //         //this.directory = all_files.data;
        //         this.directory = [];
        //         loading.dismissAll();
        //         var myArray = all_files.data;
        //         for (var i = myArray.length - 1; i >= 0; --i) {
        //             this.alllevel = JSON.parse(localStorage.getItem('alllevel'));
        //             var userId = localStorage.getItem('userinfo');
        //             var isLevelOpened = false;
        //             if (this.alllevel) {
        //                 this.alllevel.forEach((value) => {
        //                     console.log(value);
        //                     var decrypted = CryptoJS.AES.decrypt(value, userId);
        //                     console.log(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0])
        //                     if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == myArray[i].name && decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] != 'level' + this.levelArray[value].level) {
        //                         this.directory.push(myArray[i])
        //                     }
        //                 });
        //             }
        //         }
        //         //this.directory = myArray;
        //         console.log(this.directory);
        //         return;
        //     });
        // } else {
        //     this.levelArray[value].checked = true;
        //     this.allowed_levels.push('level' + this.levelArray[value].level);
        //     const loading = this.loadingCtrl.create({});
        //     loading.present();
        //     this.companyProvider.getFolders(this.userId).subscribe((all_files) => {
        //         //this.directory = all_files.data;
        //         loading.dismissAll();
        //         var myArray = all_files.data;
        //         for (var i = myArray.length - 1; i >= 0; --i) {
        //             this.alllevel = JSON.parse(localStorage.getItem('alllevel'));
        //             var userId = localStorage.getItem('userinfo');
        //             var isLevelOpened = false;
        //             if (this.alllevel) {
        //                 this.alllevel.forEach((value) => {
        //                     console.log(value);
        //                     var decrypted = CryptoJS.AES.decrypt(value, userId);
        //                     if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == myArray[i].name) {
        //                         this.directory.push(myArray[i])
        //                     }
        //                 });
        //             }
        //         }
        //         return;
        //         //this.directory = myArray;
        //     });
        // }

        if(event.checked == true)
        {
            this.shown_levels.push(level_number);
        }
        else
        {
            this.removeArray(this.shown_levels, level_number);
        }  

        this.getLevelsDirectory();
        //this.directory = this.all_directory;
        // if(event.checked == true){
        //     // this.levelArray[value].checked = false;
        //     for(var i =0; i< this.allowed_levels.length; i++){
        //         if(this.allowed_levels[i] == 'level'+this.levelArray[value].level){
        //             this.allowed_levels.splice(i, 1);
        //                 //this.directory = all_files.data;
        //                 var myArray = this.directory;
        //                 for (var i = myArray.length - 1; i >= 0; --i) {
        //                     if (this.allowed_levels.indexOf(myArray[i].name) == -1) {
        //                        myArray.splice(i,1);
        //                    }
        //                 }
        //                 this.directory = myArray;
        //         }
        //     }
        // }else{
        //     // this.levelArray[value].checked = true;
        //     this.allowed_levels.push('level' + this.levelArray[value].level);
        //         var myArray = this.directory;
        //         for (var i = myArray.length - 1; i >= 0; --i) {
        //             if (this.allowed_levels.indexOf(myArray[i].name) == -1) {
        //                myArray.splice(i,1);
        //            }
        //         }
        //         this.directory = myArray;
        // } 
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

    getLevelsDirectory(folder = null){
        this.companyProvider.getFolders(this.userId).subscribe((all_files) => {
        var myArray = all_files.data;
            for (var i = myArray.length - 1; i >= 0; --i) {
                if (this.shown_levels.indexOf(myArray[i].name) == -1) {
                    myArray.splice(i,1);
                }
            }
            this.directory = myArray;
            this.reverse = false;
            // if(folder == '1')
            // {
            //     var level = localStorage.getItem('smail_path');
            //     // document.getElementById('click_'+level).click();
            //     this.clickNode({name : level, children : []})
            // }
        },
        err => {
            this.showTechnicalError();
        });
        
    }

    sendReply() {
        this.toId = [];
        var usersArray = [],
            fromUser = [];
        for (var i = 0; i < this.testCheckboxResult.length; i++) {
            for (var j = 0; j < this.data.length; j++) {
                if (this.testCheckboxResult[i].userId == this.data[j].userId) {
                    // if(this.override == true && this.data[j].force == true){
                    usersArray.push({
                        'userId': this.data[j].userId,
                        'level': this.data[j].level
                    });
                    fromUser.push({
                        'userId': localStorage.getItem('userinfo'),
                        'level': this.data[j].senderSetLevel
                    });
                    // }else if(this.override == true  && this.data[j].force == false){
                    //  usersArray.push({'userId': this.data[j].userId, 'level': this.level});
                    //  fromUser.push({'userId': localStorage.getItem('userinfo'), 'level':  this.data[j].senderSetLevel});
                    // }else{
                    //  usersArray.push({'userId': this.data[j].userId, 'level': this.data[j].level});
                    //  fromUser.push({'userId': localStorage.getItem('userinfo'), 'level':  this.data[j].senderSetLevel});
                    // }

                }
            }
        }

        // console.log(usersArray);
        var id = null;
        if (this.details.thread[0].mailId == null) {
            id = this.details.thread[0]._id;
        } else {
            id = this.details.thread[0].mailId;
        }
        var mailData = {
            'toId': usersArray,
            'fromId': fromUser,
            'subject': this.details.thread[0].subject,
            'message': this.desc,
            'attacment': this.attacments,
            'isReply': true,
            'mailId': id,
            'bcc': this.bccId,
            'cc': this.ccId,
            'override': this.details.thread[0].isOverride,
            'level': this.details.thread[0].level,
            'isForward': false,
            'jobId': null,
            'tradeId': null
        };
        //console.log(mailData);
        if (usersArray.length == 0) {
            let toast = this.toastCtrl.create({
                message: 'Please specify at least one recipient.',
                duration: 3000,
                position: 'top',
                cssClass: 'danger'
            });
            toast.present();
        } else if (this.desc == '') {
            let alert = this.alertCtrl.create({
                title: 'Smail',
                subTitle: 'Send this message without text in the body?',
                buttons: [{
                        text: 'Cancel',
                        role: 'cancel',
                        handler: () => {
                            // console.log('Cancel clicked');
                        }
                    },
                    {
                        text: 'OK',
                        handler: () => {
                            // console.log('Buy clicked');
                            const loading = this.loadingCtrl.create({});
                            loading.present();
                            this.smailserviceProvider.sendSmail(mailData).subscribe((data) => {
                                // console.log(data);
                                loading.dismissAll();
                                let toast = this.toastCtrl.create({
                                    message: 'Mail has been sent successfully.',
                                    duration: 3000,
                                    position: 'top',
                                    cssClass: 'success'
                                });
                                toast.present();
                                this.thread = false;
                                this.getReplyMailData(id);
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
        } else {
            const loading = this.loadingCtrl.create({});
            loading.present();
            this.smailserviceProvider.sendSmail(mailData).subscribe((data) => {
                // console.log(data);
                loading.dismissAll();
                let toast = this.toastCtrl.create({
                    message: 'Mail has been sent successfully.',
                    duration: 3000,
                    position: 'success',
                    cssClass: 'info'
                });
                toast.present();
                this.thread = false;
                this.getReplyMailData(id);
            },
            err => {
                loading.dismissAll();
                this.showTechnicalError('1');
            });
        }

    };

    getReplyMailData(id) {
        this.smailserviceProvider.reply(this.userId, id).subscribe((mailsData) => {

            // console.log(mailsData);
            // console.log('reply')
            localStorage.setItem('mailData', JSON.stringify(mailsData));

            this.replyMail = JSON.parse(localStorage.getItem('mailData'));
            this.details = mailsData;
        },
        err => {
            this.showTechnicalError();
        });
    };


    sendSmail(subject = null) {
        var i,j,usersArray,fromUser,ccArray,all_recipients,bccArray;
        //if overridecheckbox clicked
        var id = null;
        if (this.details.thread[0].mailId == null) {
            id = this.details.thread[0]._id;
        } else {
            id = this.details.thread[0].mailId;
        }

        // if user does't select the job button
        //is group message, i.e. multiple contacts selected for email 
        var isGroupMessage = false;

        //if simple mail compose i.e. no group selected via contact form

        //is contact selected for to option
        if (this.testCheckboxResult.length > 0) {
            //is multiple contact selected for to option
            if (this.testCheckboxResult.length > 1) {
                isGroupMessage = true;
                //if single to user selected and cc selected or multiple
            } else if (this.testCheckboxResult.length > 0 && this.ccCheckboxResult.length > 0) {
                isGroupMessage = true;
            } else if (this.selectedGroups.length > 0){
                isGroupMessage = true;
            }else {
                //if contact selected for cc option
                if (this.ccCheckboxResult.length > 0) {
                    //if multiple contacts selected for cc option
                    if (this.ccCheckboxResult.length > 1) {
                        isGroupMessage = true;
                    }
                }
            }
            //if contact selected for cc option
            if (this.bccCheckboxResult.length > 1) {
                isGroupMessage = true;
            }
        } else {
            //if contact selected for cc option
            if (this.ccCheckboxResult.length > 1) {
                isGroupMessage = true;
            }
            //if contact selected for cc option
            if (this.bccCheckboxResult.length > 1) {
                isGroupMessage = true;
            }
            if (this.selectedGroups.length > 0){
                isGroupMessage = true;
            }
        }

        if(subject == 'RFI Requested'){
            isGroupMessage = false;
        }

        //if is group message
        if (isGroupMessage == true) {
            //if group is created i.e. random group message
            if (this.isGroupCreated == true) {
                // console.log(true);
            } else {
                //if group is not created
                //if override selected i.e. message override
                if (this.override == true) {
                    if (this.level == undefined) {
                        let toast = this.toastCtrl.create({
                            message: 'Please select override level.',
                            duration: 3000,
                            position: 'top',
                            cssClass: 'danger'
                        });
                        toast.present();
                    } else {
                        // console.log('override true with level select');
                    }
                } else {
                    //if message level not override
                    // let alert = this.alertCtrl.create();
                    // alert.setTitle('Select Message Level');
                    // alert.addInput({
                    //     type: 'radio',
                    //     label: 'Level 1',
                    //     value: '1',
                    //     checked: false
                    // });
                    // alert.addInput({
                    //     type: 'radio',
                    //     label: 'Level 2',
                    //     value: '2',
                    //     checked: false
                    // });
                    // alert.addInput({
                    //     type: 'radio',
                    //     label: 'Level 3',
                    //     value: '3',
                    //     checked: false
                    // });
                    // alert.addInput({
                    //     type: 'radio',
                    //     label: 'Level 4',
                    //     value: '4',
                    //     checked: false
                    // });

                    // alert.addButton('Cancel');

                    // alert.addButton({
                    //     text: 'Okay',
                    //     handler: data => {
                            
                    //     }
                    // });

                    // alert.present().then(() => {
                    //     this.testCheckboxOpen = true;
                    // });

                    // reply mail code  here
                    var data = this.details.thread[0].level;
                    usersArray = [],
                        all_recipients = [],
                        fromUser = [];



                    fromUser.push({
                        'userId': localStorage.getItem('userinfo'),
                        'level': data
                    });


                    for (i = 0; i < this.testCheckboxResult.length; i++) {
                        // console.log(this.testCheckboxResult[i].userId)
                        usersArray.push({
                            'userId': this.testCheckboxResult[i].userId,
                            'level': data
                        });
                        all_recipients.push(this.testCheckboxResult[i].userId);
                    }
                    if (this.ccCheckboxResult.length > 0) {
                        for (i = 0; i < this.ccCheckboxResult.length; i++) {
                            usersArray.push({
                                'userId': this.ccCheckboxResult[i].userId,
                                'level': data
                            });
                        all_recipients.push(this.ccCheckboxResult[i].userId);
                        }
                    }

                    if (this.bccCheckboxResult.length > 0) {
                        for (i = 0; i < this.bccCheckboxResult.length; i++) {
                            usersArray.push({
                                'userId': this.bccCheckboxResult[i].userId,
                                'level': data
                            });
                        all_recipients.push(this.bccCheckboxResult[i].userId);
                        }
                    }

                    if (this.selectedGroups.length > 0) {
                        for (i = 0; i < this.selectedGroups.length; i++) {
                            var all_groupdata = this.selectedGroups[i].groupdata.split(',');
                            for(var a=0; a < all_groupdata.length; a++){
                                if(all_groupdata[a] != ''){
                                    if(all_recipients.indexOf(all_groupdata[a]) == -1){
                                        usersArray.push({
                                            'userId': all_groupdata[a],
                                            'level': data
                                        });
                                        all_recipients.push(all_groupdata[a]);
                                    }
                                }
                            }
                        }
                    }

                    this.smailData = {
                        'toId': usersArray,
                        'fromId': fromUser,
                        'subject': this.details.thread[0].subject,
                        'message': this.desc,
                        'attacment': this.attacments,
                        'isReply': true,
                        'mailId': id,
                        'bcc': this.bccId,
                        'cc': this.ccId,
                        'override': true,
                        'level': data,
                        'isGroupMsg': true,
                        'read': false,
                        'isForward': false,
                        'jobId': null,
                        'tradeId': null
                    };

                    if (usersArray.length == 0) {
                        let toast = this.toastCtrl.create({
                            message: 'Please specify at least one recipient.',
                            duration: 3000,
                            position: 'top',
                            cssClass: 'danger'
                        });
                        toast.present();
                    } else if (this.desc == '') {
                        let toast = this.toastCtrl.create({
                            message: 'Please enter message.',
                            duration: 3000,
                            position: 'top',
                            cssClass: 'danger'
                        });
                        toast.present();
                        // let alert = this.alertCtrl.create({
                        //     title: 'Smail',
                        //     subTitle: 'Send this message without a subject or text in the body?',
                        //     buttons: [{
                        //             text: 'Cancel',
                        //             role: 'cancel',
                        //             handler: () => {
                        //                 // console.log('Cancel clicked');
                        //             }
                        //         },
                        //         {
                        //             text: 'OK',
                        //             handler: () => {
                        //                 // console.log('Buy clicked');
                        //                 const loading = this.loadingCtrl.create({});
                        //                 loading.present();
                        //                 this.smailserviceProvider.sendSmail(this.smailData).subscribe((data) => {
                        //                     // console.log(data);
                        //                     loading.dismissAll();
                        //                     let toast = this.toastCtrl.create({
                        //                         message: 'Mail has been sent successfully.',
                        //                         duration: 3000,
                        //                         position: 'top',
                        //                         cssClass: 'success'
                        //                     });
                        //                     toast.present();
                        //                     localStorage.setItem('view', 'Sent');
                        //                     this.thread = false;
                        //                     this.getReplyMailData(id);;
                        //                 });
                        //             }
                        //         }
                        //     ]
                        // });
                        // alert.present();
                    } else {
                        const loading = this.loadingCtrl.create({});
                        loading.present();
                        this.smailserviceProvider.sendSmail(this.smailData).subscribe((data) => {
                            // console.log(data);
                            loading.dismissAll();
                            let toast = this.toastCtrl.create({
                                message: 'Mail has been sent successfully.',
                                duration: 3000,
                                position: 'top',
                                cssClass: 'success'
                            });
                            toast.present();
                            localStorage.setItem('view', 'Sent');
                            this.thread = false;
                            this.getReplyMailData(id);;
                        },
                        err => {
                            loading.dismissAll();
                            this.showTechnicalError('1');
                        });
                    }
                }
            }
        } else {
            //if only one contact selected for email sent
            usersArray = [],
                fromUser = [],
                ccArray = [],
                bccArray = [];
            for (i = 0; i < this.testCheckboxResult.length; i++) {
                for (j = 0; j < this.data.length; j++) {
                    if (this.testCheckboxResult[i].userId == this.data[j].userId) {
                        if (this.override == true && this.data[j].force == true) {
                            usersArray.push({
                                'userId': this.data[j].userId,
                                'level': this.data[j].level
                            });
                            fromUser.push({
                                'userId': localStorage.getItem('userinfo'),
                                'level': this.data[j].senderSetLevel
                            });
                        } else if (this.override == true && this.data[j].force == false) {
                            usersArray.push({
                                'userId': this.data[j].userId,
                                'level': this.level
                            });
                            fromUser.push({
                                'userId': localStorage.getItem('userinfo'),
                                'level': this.data[j].senderSetLevel
                            });
                        } else {
                            usersArray.push({
                                'userId': this.data[j].userId,
                                'level': this.data[j].level
                            });
                            fromUser.push({
                                'userId': localStorage.getItem('userinfo'),
                                'level': this.data[j].senderSetLevel
                            });
                        }

                    }
                }
            }

            for (i = 0; i < this.ccCheckboxResult.length; i++) {
                for (j = 0; j < this.data.length; j++) {
                    if (this.ccCheckboxResult[i].userId == this.data[j].userId) {
                        if (this.override == true && this.data[j].force == true) {
                            ccArray.push({
                                'userId': this.data[j].userId,
                                'level': this.data[j].level
                            });
                            //fromUser.push({'userId': localStorage.getItem('userinfo'), 'level':  this.data[j].senderSetLevel});
                        } else if (this.override == true && this.data[j].force == false) {
                            ccArray.push({
                                'userId': this.data[j].userId,
                                'level': this.level
                            });
                            //fromUser.push({'userId': localStorage.getItem('userinfo'), 'level':  this.data[j].senderSetLevel});
                        } else {
                            ccArray.push({
                                'userId': this.data[j].userId,
                                'level': this.data[j].level
                            });
                            //fromUser.push({'userId': localStorage.getItem('userinfo'), 'level':  this.data[j].senderSetLevel});
                        }

                    }
                }
            }


            for (i = 0; i < this.bccCheckboxResult.length; i++) {
                for (j = 0; j < this.data.length; j++) {
                    if (this.bccCheckboxResult[i].userId == this.data[j].userId) {
                        if (this.override == true && this.data[j].force == true) {
                            bccArray.push({
                                'userId': this.data[j].userId,
                                'level': this.data[j].level
                            });
                            //fromUser.push({'userId': localStorage.getItem('userinfo'), 'level':  this.data[j].senderSetLevel});
                        } else if (this.override == true && this.data[j].force == false) {
                            bccArray.push({
                                'userId': this.data[j].userId,
                                'level': this.level
                            });
                            //fromUser.push({'userId': localStorage.getItem('userinfo'), 'level':  this.data[j].senderSetLevel});
                        } else {
                            bccArray.push({
                                'userId': this.data[j].userId,
                                'level': this.data[j].level
                            });
                            //fromUser.push({'userId': localStorage.getItem('userinfo'), 'level':  this.data[j].senderSetLevel});
                        }

                    }
                }
            }

            if(subject == 'RFI Requested'){
                usersArray = [{
                    'userId': this.details.thread[0].fromId[0].userId,
                    'level': '0'
                }];
                fromUser = [{
                    'userId': localStorage.getItem('userinfo'),
                    'level': '0'
                }];
            }

            // console.log(usersArray)
            var mailData = {
                'toId': usersArray,
                'fromId': fromUser,
                'subject': this.details.thread[0].subject,
                'message': this.desc,
                'attacment': this.attacments,
                'isReply': true,
                'mailId': id,
                'bcc': bccArray,
                'cc': ccArray,
                'override': this.override,
                'level': this.level,
                'isGroupMsg': false,
                'read': false,
                'isForward': false,
                'jobId': null,
                'tradeId': null,
                'RfiEmailId': this.details.thread[0].others
            };
            // console.log(mailData);

            if (usersArray.length == 0) {
                let toast = this.toastCtrl.create({
                    message: 'Please specify at least one recipient.',
                    duration: 3000,
                    position: 'top',
                    cssClass: 'danger'

                });
                toast.present();
            } else if (this.subject == '' && this.desc == '') {
                let alert = this.alertCtrl.create({
                    title: 'Smail',
                    subTitle: 'Send this message without a subject or text in the body?',
                    buttons: [{
                            text: 'Cancel',
                            role: 'cancel',
                            handler: () => {
                                // console.log('Cancel clicked');
                            }
                        },
                        {
                            text: 'OK',
                            handler: () => {
                                // console.log('Buy clicked');
                                const loading = this.loadingCtrl.create({});
                                loading.present();
                                this.smailserviceProvider.sendSmail(mailData).subscribe((data) => {
                                    // console.log(data);
                                    loading.dismissAll();
                                    let toast = this.toastCtrl.create({
                                        message: 'Mail has been sent successfully.',
                                        duration: 3000,
                                        position: 'top',
                                        cssClass: 'success'
                                    });
                                    toast.present();
                                    // localStorage.setItem('view', 'Sent');
                                    this.thread = false;
                                    this.getReplyMailData(id);
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
            } else {
                const loading = this.loadingCtrl.create({});
                loading.present();
                this.smailserviceProvider.sendSmail(mailData).subscribe((data) => {
                    // console.log(data);
                    loading.dismissAll();
                    let toast = this.toastCtrl.create({
                        message: 'Mail has been sent successfully.',
                        duration: 3000,
                        position: 'top',
                        cssClass: 'success'
                    });
                    toast.present();
                    // localStorage.setItem('view', 'Sent');
                    this.thread = false;
                    this.getReplyMailData(id);
                },
                err => {
                    loading.dismissAll();
                    this.showTechnicalError('1');
                });
            }
        }


    };


    fwdmail() {
        var i,j,usersArray,all_recipients,fromUser,ccArray,bccArray;
        //if overridecheckbox clicked
        var id = null;
        if (this.details.thread[0].mailId == null) {
            id = this.details.thread[0]._id;
        } else {
            id = this.details.thread[0].mailId;
        }
        // if user does't select the job button
        //is group message, i.e. multiple contacts selected for email 
        var isGroupMessage = false;
        //if simple mail compose i.e. no group selected via contact form
        //is contact selected for to option
        if (this.testCheckboxResult.length > 0) {
            //is multiple contact selected for to option
            if (this.testCheckboxResult.length > 1) {
                isGroupMessage = true;
                //if single to user selected and cc selected or multiple
            } else if (this.testCheckboxResult.length > 0 && this.ccCheckboxResult.length > 0) {
                isGroupMessage = true;
            } else if (this.selectedGroups.length > 0){
                isGroupMessage = true;
            } else {
                //if contact selected for cc option
                if (this.ccCheckboxResult.length > 0) {
                    //if multiple contacts selected for cc option
                    if (this.ccCheckboxResult.length > 1) {
                        isGroupMessage = true;
                    }
                }
            }
            //if contact selected for cc option
            if (this.bccCheckboxResult.length > 1) {
                isGroupMessage = true;
            }
        } else {
            //if contact selected for cc option
            if (this.ccCheckboxResult.length > 1) {
                isGroupMessage = true;
            }
            //if contact selected for cc option
            if (this.bccCheckboxResult.length > 1) {
                isGroupMessage = true;
            }
            if (this.selectedGroups.length > 0){
                isGroupMessage = true;
            }
        }
        //if is group message
        if (isGroupMessage == true) {
            //if group is created i.e. random group message
            if (this.isGroupCreated == true) {
                // console.log(true);
            } else {
                //if group is not created
                //if override selected i.e. message override
                if (this.override == true) {
                    if (this.level == undefined) {
                        let toast = this.toastCtrl.create({
                            message: 'Please select override level.',
                            duration: 3000,
                            position: 'top',
                            cssClass: 'danger'
                        });
                        toast.present();
                    } else {
                        // console.log('override true with level select');
                    }
                } else {
                    var data = this.details.thread[0].level;
                    //if message level not override
                    // let alert = this.alertCtrl.create();
                    // alert.setTitle('Select Message Level');
                    // alert.addInput({
                    //     type: 'radio',
                    //     label: 'Level 1',
                    //     value: '1',
                    //     checked: false
                    // });
                    // alert.addInput({
                    //     type: 'radio',
                    //     label: 'Level 2',
                    //     value: '2',
                    //     checked: false
                    // });
                    // alert.addInput({
                    //     type: 'radio',
                    //     label: 'Level 3',
                    //     value: '3',
                    //     checked: false
                    // });
                    // alert.addInput({
                    //     type: 'radio',
                    //     label: 'Level 4',
                    //     value: '4',
                    //     checked: false
                    // });

                    // alert.addButton('Cancel');

                    // alert.addButton({
                    //     text: 'Okay',
                    //     handler: data => {
                            
                    //     }
                    // });
                    // alert.present().then(() => {
                    //     this.testCheckboxOpen = true;
                    // });
                    // console.log(data);
                    usersArray = [],
                        all_recipients = [],
                        fromUser = [];

                    fromUser.push({
                        'userId': localStorage.getItem('userinfo'),
                        'level': data
                    });


                    for (i = 0; i < this.testCheckboxResult.length; i++) {
                        // console.log(this.testCheckboxResult[i].userId)
                        usersArray.push({
                            'userId': this.testCheckboxResult[i].userId,
                            'level': data
                        });
                        all_recipients.push(this.testCheckboxResult[i].userId);
                    }
                    if (this.ccCheckboxResult.length > 0) {
                        for (i = 0; i < this.ccCheckboxResult.length; i++) {
                            usersArray.push({
                                'userId': this.ccCheckboxResult[i].userId,
                                'level': data
                            });
                        all_recipients.push(this.ccCheckboxResult[i].userId);
                        }
                    }

                    if (this.bccCheckboxResult.length > 0) {
                        for (i = 0; i < this.bccCheckboxResult.length; i++) {
                            usersArray.push({
                                'userId': this.bccCheckboxResult[i].userId,
                                'level': data
                            });
                        all_recipients.push(this.bccCheckboxResult[i].userId);
                        }
                    }

                    if (this.selectedGroups.length > 0) {
                        for (i = 0; i < this.selectedGroups.length; i++) {
                            var all_groupdata = this.selectedGroups[i].groupdata.split(',');
                            for(var a=0; a < all_groupdata.length; a++){
                                if(all_groupdata[a] != ''){
                                    if(all_recipients.indexOf(all_groupdata[a]) == -1){
                                        usersArray.push({
                                            'userId': all_groupdata[a],
                                            'level': data
                                        });
                                        all_recipients.push(all_groupdata[a]);
                                    }
                                }
                            }
                        }
                    }
                    this.frd_mailData = {
                        'toId': usersArray,
                        'fromId': fromUser,
                        'subject': this.details.thread[0].subject,
                        'message': this.desc,
                        'attacment': this.attacments,
                        'isReply': true,
                        'mailId': id,
                        'bcc': this.bccId,
                        'cc': this.ccId,
                        'override': true,
                        'level': data,
                        'isGroupMsg': true,
                        'read': false,
                        'isForward': true,
                        'jobId': null,
                        'tradeId': null
                    };
                    if (usersArray.length == 0) {
                        let toast = this.toastCtrl.create({
                            message: 'Please specify at least one recipient.',
                            duration: 3000,
                            position: 'top',
                            cssClass: 'danger'
                        });
                        toast.present();
                    } else if (this.desc == '') {
                        let toast = this.toastCtrl.create({
                            message: 'Please enter message.',
                            duration: 3000,
                            position: 'top',
                            cssClass: 'danger'
                        });
                        toast.present();
                    } else if (this.subject == '') {
                        let alert = this.alertCtrl.create({
                            title: 'Smail',
                            subTitle: 'Send this message without a subject or text in the body?',
                            buttons: [{
                                    text: 'Cancel',
                                    role: 'cancel',
                                    handler: () => {
                                        // console.log('Cancel clicked');
                                    }
                                },
                                {
                                    text: 'OK',
                                    handler: () => {
                                        const loading = this.loadingCtrl.create({});
                                        loading.present();
                                        this.smailserviceProvider.sendSmail(this.frd_mailData).subscribe((data) => {
                                            loading.dismissAll();
                                            let toast = this.toastCtrl.create({
                                                message: 'Mail has been sent successfully.',
                                                duration: 3000,
                                                position: 'top',
                                                cssClass: 'success'
                                            });
                                            toast.present();
                                            // localStorage.setItem('view', 'Sent');
                                            this.thread = false;
                                            this.getReplyMailData(id);;
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
                    } else {
                        const loading = this.loadingCtrl.create({});
                        loading.present();
                        this.smailserviceProvider.sendSmail(this.frd_mailData).subscribe((data) => {
                            loading.dismissAll();
                            let toast = this.toastCtrl.create({
                                message: 'Mail has been sent successfully.',
                                duration: 3000,
                                position: 'top',
                                cssClass: 'success'
                            });
                            toast.present();
                            // localStorage.setItem('view', 'Sent');
                            this.thread = false;
                            this.getReplyMailData(id);;
                        },
                        err => {
                            loading.dismissAll();
                            this.showTechnicalError('1');
                        });
                    }
                }
            }
        } else {
            //if only one contact selected for email sent
             usersArray = [],
                fromUser = [],
                ccArray = [],
                bccArray = [];
            for (i = 0; i < this.testCheckboxResult.length; i++) {
                for (j = 0; j < this.data.length; j++) {
                    if (this.testCheckboxResult[i].userId == this.data[j].userId) {
                        if (this.override == true && this.data[j].force == true) {
                            usersArray.push({
                                'userId': this.data[j].userId,
                                'level': this.data[j].level
                            });
                            fromUser.push({
                                'userId': localStorage.getItem('userinfo'),
                                'level': this.data[j].senderSetLevel
                            });
                        } else if (this.override == true && this.data[j].force == false) {
                            usersArray.push({
                                'userId': this.data[j].userId,
                                'level': this.level
                            });
                            fromUser.push({
                                'userId': localStorage.getItem('userinfo'),
                                'level': this.data[j].senderSetLevel
                            });
                        } else {
                            usersArray.push({
                                'userId': this.data[j].userId,
                                'level': this.data[j].level
                            });
                            fromUser.push({
                                'userId': localStorage.getItem('userinfo'),
                                'level': this.data[j].senderSetLevel
                            });
                        }

                    }
                }
            }
            for (i = 0; i < this.ccCheckboxResult.length; i++) {
                for (j = 0; j < this.data.length; j++) {
                    if (this.ccCheckboxResult[i].userId == this.data[j].userId) {
                        if (this.override == true && this.data[j].force == true) {
                            ccArray.push({
                                'userId': this.data[j].userId,
                                'level': this.data[j].level
                            });
                            //fromUser.push({'userId': localStorage.getItem('userinfo'), 'level':  this.data[j].senderSetLevel});
                        } else if (this.override == true && this.data[j].force == false) {
                            ccArray.push({
                                'userId': this.data[j].userId,
                                'level': this.level
                            });
                            //fromUser.push({'userId': localStorage.getItem('userinfo'), 'level':  this.data[j].senderSetLevel});
                        } else {
                            ccArray.push({
                                'userId': this.data[j].userId,
                                'level': this.data[j].level
                            });
                            //fromUser.push({'userId': localStorage.getItem('userinfo'), 'level':  this.data[j].senderSetLevel});
                        }

                    }
                }
            }
            for (i = 0; i < this.bccCheckboxResult.length; i++) {
                for (j = 0; j < this.data.length; j++) {
                    if (this.bccCheckboxResult[i].userId == this.data[j].userId) {
                        if (this.override == true && this.data[j].force == true) {
                            bccArray.push({
                                'userId': this.data[j].userId,
                                'level': this.data[j].level
                            });
                            //fromUser.push({'userId': localStorage.getItem('userinfo'), 'level':  this.data[j].senderSetLevel});
                        } else if (this.override == true && this.data[j].force == false) {
                            bccArray.push({
                                'userId': this.data[j].userId,
                                'level': this.level
                            });
                            //fromUser.push({'userId': localStorage.getItem('userinfo'), 'level':  this.data[j].senderSetLevel});
                        } else {
                            bccArray.push({
                                'userId': this.data[j].userId,
                                'level': this.data[j].level
                            });
                            //fromUser.push({'userId': localStorage.getItem('userinfo'), 'level':  this.data[j].senderSetLevel});
                        }

                    }
                }
            }
            var mailData = {
                'toId': usersArray,
                'fromId': fromUser,
                'subject': this.details.thread[0].subject,
                'message': this.desc,
                'attacment': this.attacments,
                'isReply': true,
                'mailId': id,
                'bcc': bccArray,
                'cc': ccArray,
                'override': this.override,
                'level': this.level,
                'isGroupMsg': false,
                'read': false,
                'isForward': true,
                'jobId': null,
                'tradeId': null
            };
            if (usersArray.length == 0) {
                let toast = this.toastCtrl.create({
                    message: 'Please specify at least one recipient.',
                    duration: 3000,
                    position: 'top',
                    cssClass: 'danger'
                });
                toast.present();
            } else if (this.desc == '') {
                let toast = this.toastCtrl.create({
                    message: 'Please enter message.',
                    duration: 3000,
                    position: 'top',
                    cssClass: 'danger'
                });
                toast.present();
            } else if (this.subject == '') {
                let alert = this.alertCtrl.create({
                    title: 'Smail',
                    subTitle: 'Send this message without a subject?',
                    buttons: [{
                            text: 'Cancel',
                            role: 'cancel',
                            handler: () => {
                                // console.log('Cancel clicked');
                            }
                        },
                        {
                            text: 'OK',
                            handler: () => {
                                // console.log('Buy clicked');
                                const loading = this.loadingCtrl.create({});
                                loading.present();
                                this.smailserviceProvider.sendSmail(mailData).subscribe((data) => {
                                    // console.log(data);
                                    loading.dismissAll();
                                    let toast = this.toastCtrl.create({
                                        message: 'Mail has been sent successfully.',
                                        duration: 3000,
                                        position: 'top',
                                        cssClass: 'success'
                                    });
                                    toast.present();
                                    // localStorage.setItem('view', 'Sent');
                                    this.thread = false;
                                    this.getReplyMailData(id);
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
            } else {
                const loading = this.loadingCtrl.create({});
                loading.present();
                this.smailserviceProvider.sendSmail(mailData).subscribe((data) => {
                    // console.log(data);
                    loading.dismissAll();
                    let toast = this.toastCtrl.create({
                        message: 'Mail has been sent successfully.',
                        duration: 3000,
                        position: 'top',
                        cssClass: 'success'
                    });
                    toast.present();
                    // localStorage.setItem('view', 'Sent');
                    this.thread = false;
                    this.getReplyMailData(id);
                },
                err => {
                    loading.dismissAll();
                    this.showTechnicalError('1');
                });
            }
        }
    };

    toUserName(name) {
        this.toId = name;
        // console.log(name);
    };

    toCcName(name) {
        this.ccId = name;
        // console.log(name);
    };

    toBccName(name) {
        this.bccId = name;
        // console.log(name);
    };

    doCheckbox() {
        var i,j,k,m;
        let alert = this.alertCtrl.create();
        alert.setTitle('Select Contact');
        //if to contact not selected yet 
        if (this.testCheckboxResult.length == 0) {
            for (i = 0; i < this.data.length; i++) {
                //contact validation based on db conditions
                if (this.data[i].memberstatus == 2 && this.data[i].senderSetLevel != 0 && this.data[i].reciverSetLevel != 0) {
                    //if cc contacts selected 

                    var isContactExist = false;
                    for (k = 0; k < this.ccCheckboxResult.length; k++) {
                        if (this.data[i].userId == this.ccCheckboxResult[k].userId) {
                            isContactExist = true;
                        }
                    }
                    if (isContactExist == false) {
                        for (m = 0; m < this.bccCheckboxResult.length; m++) {
                            if (this.data[i].userId == this.bccCheckboxResult[m].userId) {
                                isContactExist = true;
                            }
                        }

                        if (!isContactExist) {
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
        } else {
            for (i = 0; i < this.data.length; i++) {
                if (this.data[i].memberstatus == 2 && this.data[i].senderSetLevel != 0 && this.data[i].reciverSetLevel != 0) {
                var isUserExist = false;
                for (j = 0; j < this.testCheckboxResult.length; j++) {
                    if (this.data[i].userId == this.testCheckboxResult[j].userId) {
                        if (this.data[i].memberstatus == 2 && this.data[i].senderSetLevel != 0 && this.data[i].reciverSetLevel != 0) {
                            isUserExist = true;
                        }
                    }
                }

                if (isUserExist) {
                    alert.addInput({
                        type: 'checkbox',
                        label: this.data[i].name,
                        value: this.data[i],
                        checked: true
                    });
                } else {
                    var bccContact = this.bccCheckboxResult;
                    if (this.ccCheckboxResult.length > 0) {
                        for (j = 0; j < this.ccCheckboxResult.length; j++) {
                            if (this.data[i].userId == this.ccCheckboxResult[j].userId) {
                                if (this.data[i].memberstatus == 2 && this.data[i].senderSetLevel != 0 && this.data[i].reciverSetLevel != 0) {
                                    isUserExist = true;
                                }
                            }
                        }
                        if (!isUserExist) {
                            for (m = 0; m < bccContact.length; j++) {
                                if (this.data[i].userId == bccContact[m].userId) {
                                    if (this.data[i].memberstatus == 2 && this.data[i].senderSetLevel != 0 && this.data[i].reciverSetLevel != 0) {
                                        isUserExist = true;
                                    }
                                }
                            }

                            if (!isUserExist) {
                                alert.addInput({
                                    type: 'checkbox',
                                    label: this.data[i].name,
                                    value: this.data[i],
                                    checked: false
                                });
                            }
                        }
                    } else {
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
        }

        alert.addButton('Cancel');

        alert.addButton({
            text: 'Okay',
            handler: data => {

                this.testCheckboxOpen = false;
                this.testCheckboxResult = data;

                if (this.testCheckboxResult.length == 1) {
                    if (this.userId == this.testCheckboxResult[0].senderId) {
                        this.level = this.testCheckboxResult[0].senderSetLevel;
                    } else {
                        this.level = this.testCheckboxResult[0].reciverSetLevel;
                    }
                }
            }
        });

        alert.present().then(() => {
            this.testCheckboxOpen = true;
        });
    };

    discardSmail() {
        //console.log('test')
        this.toId = [];
        this.testCheckboxResult = [];
        this.bccId = '';
        this.ccId = '';
        //this.subject = '';
        this.desc = '';
        this.ccCheckboxResult = [];
        this.bccCheckboxResult = [];
        this.attacments = [];
        this.level = '';
        this.thread = false;
        //console.log(this.toId)
    };

    removeContact(contact) {
        for (var i = 0; i < this.testCheckboxResult.length; i++) {
            if (contact.userId == this.testCheckboxResult[i].userId) {
                this.testCheckboxResult.splice(i, 1);
            }
        }
        this.replyMail = JSON.parse(localStorage.getItem('mailData'));
        if (this.testCheckboxResult.length == 1) {
            if (this.userId == this.testCheckboxResult[0].senderId) {
                this.level = this.testCheckboxResult[0].senderSetLevel;
            } else {
                this.level = this.testCheckboxResult[0].reciverSetLevel;
            }
        }
    };

    removeCcContact(contact) {
        for (var i = 0; i < this.ccCheckboxResult.length; i++) {
            if (contact.userId == this.ccCheckboxResult[i].userId) {
                this.ccCheckboxResult.splice(i, 1);
            }
        }
    };

    removeBccContact(contact) {
        for (var i = 0; i < this.bccCheckboxResult.length; i++) {
            if (contact.userId == this.bccCheckboxResult[i].userId) {
                this.bccCheckboxResult.splice(i, 1);
            }
        }
    };

    ccCheckbox() {
        var i,j,k,m,isUserExist;
        let alert = this.alertCtrl.create();
        alert.setTitle('Select Contact');
        //if no cc contact selected yet
        if (this.ccCheckboxResult.length == 0) {
            //if no to contact selected yet
            if (this.testCheckboxResult.length == 0 && this.bccCheckboxResult.length == 0) {
                for (i = 0; i < this.data.length; i++) {
                    //check contact validation based on set params in db
                    if (this.data[i].memberstatus == 2 && this.data[i].senderSetLevel != 0 && this.data[i].reciverSetLevel != 0) {
                        alert.addInput({
                            type: 'checkbox',
                            label: this.data[i].name,
                            value: this.data[i],
                            checked: false
                        });
                    }
                }
            } else {
                //if to contact selected
                var bccContact = this.bccCheckboxResult;
                for (i = 0; i < this.data.length; i++) {
                    isUserExist = false;
                    for (j = 0; j < this.testCheckboxResult.length; j++) {
                        if (this.data[i].userId == this.testCheckboxResult[j].userId) {
                            if (this.data[i].memberstatus == 2 && this.data[i].senderSetLevel != 0 && this.data[i].reciverSetLevel != 0) {
                                isUserExist = true;
                            }
                        }
                    }
                    // if user not selected yet
                    if (!isUserExist) {
                        for (k = 0; k < bccContact.length; k++) {
                            if (this.data[i].userId == bccContact[k].userId) {
                                if (this.data[i].memberstatus == 2 && this.data[i].senderSetLevel != 0 && this.data[i].reciverSetLevel != 0) {
                                    isUserExist = true;
                                }
                            }
                        }

                        if (!isUserExist) {
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
        } else if (this.ccCheckboxResult.length > 0 && this.testCheckboxResult.length == 0 && this.bccCheckboxResult.length == 0) {
            for (i = 0; i < this.data.length; i++) {
                isUserExist = false;
                for (j = 0; j < this.ccCheckboxResult.length; j++) {
                    if (this.data[i].userId == this.ccCheckboxResult[j].userId) {
                        if (this.data[i].memberstatus == 2 && this.data[i].senderSetLevel != 0 && this.data[i].reciverSetLevel != 0) {
                            isUserExist = true;
                        }
                    }
                }
                if (isUserExist) {
                    alert.addInput({
                        type: 'checkbox',
                        label: this.data[i].name,
                        value: this.data[i],
                        checked: true
                    });
                } else {
                    alert.addInput({
                        type: 'checkbox',
                        label: this.data[i].name,
                        value: this.data[i],
                        checked: false
                    });
                }
            }
        } else if (this.ccCheckboxResult.length == 0 && this.testCheckboxResult.length > 0 && this.bccCheckboxResult.length == 0) {
            for (i = 0; i < this.data.length; i++) {
                isUserExist = false;
                for (j = 0; j < this.testCheckboxResult.length; j++) {
                    if (this.data[i].userId == this.testCheckboxResult[j].userId) {
                        if (this.data[i].memberstatus == 2 && this.data[i].senderSetLevel != 0 && this.data[i].reciverSetLevel != 0) {
                            isUserExist = true;
                        }
                    }
                }
                if (!isUserExist) {
                    alert.addInput({
                        type: 'checkbox',
                        label: this.data[i].name,
                        value: this.data[i],
                        checked: true
                    });
                }
            }
        } else {
            for (i = 0; i < this.data.length; i++) {
                isUserExist = false;
                //check user exist in cc list
                for (j = 0; j < this.ccCheckboxResult.length; j++) {
                    if (this.data[i].userId == this.ccCheckboxResult[j].userId) {
                        if (this.data[i].memberstatus == 2 && this.data[i].senderSetLevel != 0 && this.data[i].reciverSetLevel != 0) {
                            isUserExist = true;
                        }
                    }
                }
                if (isUserExist) {
                    alert.addInput({
                        type: 'checkbox',
                        label: this.data[i].name,
                        value: this.data[i],
                        checked: true
                    });
                } else {
                    //check user exist in to list
                    isUserExist = false;
                    for (k = 0; k < this.testCheckboxResult.length; k++) {
                        if (this.data[i].userId == this.testCheckboxResult[k].userId) {
                            if (this.data[i].memberstatus == 2 && this.data[i].senderSetLevel != 0 && this.data[i].reciverSetLevel != 0) {
                                isUserExist = true;
                            }
                        }
                    }
                    if (!isUserExist) {
                        for (m = 0; m < this.bccCheckboxResult.length; m++) {
                            if (this.data[i].userId == this.bccCheckboxResult[m].userId) {
                                if (this.data[i].memberstatus == 2 && this.data[i].senderSetLevel != 0 && this.data[i].reciverSetLevel != 0) {
                                    isUserExist = true;
                                }
                            }
                        }

                        if (!isUserExist) {
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
        }


        alert.addButton('Cancel');

        alert.addButton({
            text: 'Okay',
            handler: data => {
                // console.log('Checkbox data:', data);
                //this.testCheckboxOpen = false;
                this.ccCheckboxResult = data;
            }
        });

        alert.present().then(() => {
            this.testCheckboxOpen = true;
        });
    };


    bccCheckbox() {
        var i,j,k,m,isUserExist;
        let alert = this.alertCtrl.create();
        alert.setTitle('Select Contact');


        //if no cc contact selected yet
        if (this.bccCheckboxResult.length == 0) {
            //if no to contact selected yet
            if (this.testCheckboxResult.length == 0 && this.ccCheckboxResult.length == 0) {
                for (i = 0; i < this.data.length; i++) {
                    //check contact validation based on set params in db
                    if (this.data[i].memberstatus == 2 && this.data[i].senderSetLevel != 0 && this.data[i].reciverSetLevel != 0) {
                        alert.addInput({
                            type: 'checkbox',
                            label: this.data[i].name,
                            value: this.data[i],
                            checked: false
                        });
                    }
                }
            } else {
                //if to contact selected
                for (i = 0; i < this.data.length; i++) {
                    isUserExist = false;
                    if (this.ccCheckboxResult.length > 0) {
                        for (j = 0; j < this.ccCheckboxResult.length; j++) {
                            if (this.data[i].userId == this.ccCheckboxResult[j].userId) {
                                if (this.data[i].memberstatus == 2 && this.data[i].senderSetLevel != 0 && this.data[i].reciverSetLevel != 0) {
                                    isUserExist = true;
                                }
                            }
                        }
                    }
                    // if user not selected yet
                    if (!isUserExist) {
                        if (this.testCheckboxResult.length > 0) {
                            for (j = 0; j < this.testCheckboxResult.length; j++) {
                                if (this.data[i].userId == this.testCheckboxResult[j].userId) {
                                    if (this.data[i].memberstatus == 2 && this.data[i].senderSetLevel != 0 && this.data[i].reciverSetLevel != 0) {
                                        isUserExist = true;
                                    }
                                }
                            }
                        }
                        if (!isUserExist) {
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
        } else if (this.bccCheckboxResult.length > 0 && this.testCheckboxResult.length == 0 && this.testCheckboxResult.length == 0) {
            for (i = 0; i < this.data.length; i++) {
                isUserExist = false;
                for (j = 0; j < this.bccCheckboxResult.length; j++) {
                    if (this.data[i].userId == this.bccCheckboxResult[j].userId) {
                        if (this.data[i].memberstatus == 2 && this.data[i].senderSetLevel != 0 && this.data[i].reciverSetLevel != 0) {
                            isUserExist = true;
                        }
                    }
                }
                if (isUserExist) {
                    alert.addInput({
                        type: 'checkbox',
                        label: this.data[i].name,
                        value: this.data[i],
                        checked: true
                    });
                } else {
                    // alert.addInput({
                    //  type: 'checkbox',
                    //  label: this.data[i].name,
                    //  value: this.data[i],
                    //      checked: false
                    // });
                    if (this.ccCheckboxResult.length > 0) {
                        for (j = 0; j < this.ccCheckboxResult.length; j++) {
                            if (this.data[i].userId == this.ccCheckboxResult[j].userId) {
                                if (this.data[i].memberstatus == 2 && this.data[i].senderSetLevel != 0 && this.data[i].reciverSetLevel != 0) {
                                    isUserExist = true;
                                }
                            }
                        }
                    }
                    // if user not selected yet
                    if (!isUserExist) {
                        if (this.testCheckboxResult.length > 0) {
                            for (j = 0; j < this.testCheckboxResult.length; j++) {
                                if (this.data[i].userId == this.testCheckboxResult[j].userId) {
                                    if (this.data[i].memberstatus == 2 && this.data[i].senderSetLevel != 0 && this.data[i].reciverSetLevel != 0) {
                                        isUserExist = true;
                                    }
                                }
                            }
                        }
                        if (!isUserExist) {
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
        } else {
            for (i = 0; i < this.data.length; i++) {
                isUserExist = false;
                //check user exist in cc list
                for (m = 0; j < this.bccCheckboxResult.length; j++) {
                    if (this.data[i].userId == this.bccCheckboxResult[m].userId) {
                        if (this.data[i].memberstatus == 2 && this.data[i].senderSetLevel != 0 && this.data[i].reciverSetLevel != 0) {
                            isUserExist = true;
                        }
                    }
                }
                if (isUserExist) {
                    alert.addInput({
                        type: 'checkbox',
                        label: this.data[i].name,
                        value: this.data[i],
                        checked: true
                    });
                } else {
                    for (j = 0; j < this.ccCheckboxResult.length; j++) {
                        if (this.data[i].userId == this.ccCheckboxResult[j].userId) {
                            if (this.data[i].memberstatus == 2 && this.data[i].senderSetLevel != 0 && this.data[i].reciverSetLevel != 0) {
                                isUserExist = true;
                            }
                        }
                    }
                    if (!isUserExist) {
                        //check user exist in to list
                        isUserExist = false;
                        for (k = 0; k < this.testCheckboxResult.length; k++) {
                            if (this.data[i].userId == this.testCheckboxResult[k].userId) {
                                if (this.data[i].memberstatus == 2 && this.data[i].senderSetLevel != 0 && this.data[i].reciverSetLevel != 0) {
                                    isUserExist = true;
                                }
                            }
                        }
                        if (!isUserExist) {
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
        }


        alert.addButton('Cancel');

        alert.addButton({
            text: 'Okay',
            handler: data => {
                // console.log('Checkbox data:', data);
                //  this.testCheckboxOpen = false;
                this.bccCheckboxResult = data;
            }
        });

        alert.present().then(() => {
            this.testCheckboxOpen = true;
        });
    };

    removeGroupsContact(contact){
        for(var i = 0; i < this.selectedGroups.length; i++){
            if(contact._id == this.selectedGroups[i]._id){
                this.selectedGroups.splice(i, 1);
            }
        }
    };

    groupListing(){
        this.groupprovider.getGroupData(this.userId).subscribe(response => {
          

          let alert = this.alertCtrl.create();
          alert.setTitle('Select Group');

          for(var i=0; i < response.length; i++){
            var isExist = false;
            for(var j=0; j < this.selectedGroups.length; j++){
                if(response[i]._id == this.selectedGroups[j]._id){
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

          alert.addButton('Cancel');

          alert.addButton({
            text: 'Okay',
            handler: data => {
              
              this.testCheckboxOpen = false;
              this.groups = data;
              this.selectedGroups = data;
              if(this.groups.length == 1){
                this.level = this.groups[0].userLevel;
              }
              // for(var j=0; j < data.length; j++){
              //   for(var i=0; i < this.data.length; i++){
              //     if(this.data[i]._id == data[j]){
              //       this.data.splice(i, 1);
              //     }
              //   }
              // }
            }
          });

          alert.present().then(() => {
            this.testCheckboxOpen = true;
          });

        },
        err => {
            this.showTechnicalError();
        });
    };

    presentPromptGroup() {
        let alert = this.alertCtrl.create({
            title: 'Create Group',
            inputs: [{
                    name: 'Name',
                    placeholder: 'name'
                },
                {
                    name: 'level',
                    placeholder: 'level',
                    type: 'text'
                }
            ],
            buttons: [{
                    text: 'Cancel',
                    role: 'cancel',
                    handler: data => {
                        // console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Save',
                    handler: data => {
                        var groupdata = [],
                            groupUsers = '',
                            obj = {};
                        // if (!(data.name && data.level))) {
                        // logged in!
                        var i;
                        if (this.testCheckboxResult.length > 0) {
                            for (i = 0; i < this.testCheckboxResult.length; i++) {
                                groupdata.push(this.testCheckboxResult[i].userId);
                            }
                        }

                        if (this.ccCheckboxResult.length > 0) {
                            for (i = 0; i < this.ccCheckboxResult.length; i++) {
                                groupdata.push(this.ccCheckboxResult[i].userId);
                            }
                        }

                        if (this.bccCheckboxResult.length > 0) {
                            for (i = 0; i < this.bccCheckboxResult.length; i++) {
                                groupdata.push(this.bccCheckboxResult[i].userId);
                            }
                        }

                        for (i = 0; i < groupdata.length; i++) {
                            groupUsers = groupUsers + groupdata[i] + ',';
                        }

                        obj = {
                            groupdata: groupUsers,
                            userId: this.userId,
                            userLevel: data.level,
                            name: data.Name
                        };

                        this.groupprovider.addGroup(obj).subscribe((response) => {
                            // console.log(response);
                            if (response.status == 0) {
                                let toast = this.toastCtrl.create({
                                    message: 'Group name already exist.',
                                    duration: 3000,
                                    position: 'top',
                                    cssClass: 'danger'
                                });
                                toast.present();
                            } else {
                                this.isGroupCreated = true;
                                let toast = this.toastCtrl.create({
                                    message: 'Group created successfull.',
                                    duration: 3000,
                                    position: 'top',
                                    cssClass: 'success'
                                });
                                toast.present();
                            }

                        },
                        err => {
                            this.showTechnicalError('1');
                        });
                    }
                }
            ]
        });

        alert.present();
    };

    callStaticFunction() {
        // console.log(localStorage.getItem('fname'));
        this.selectedFolder = localStorage.getItem('fname');
        this.selectedLevel = localStorage.getItem('smail_path');
        this.which_level = localStorage.getItem('which_level');
        // console.log(localStorage.getItem('current_folder'));
        if (localStorage.getItem('current_folder') == "inbox") {
            this.inboxData('ee','1');
        } else {
            this.sentMailsData('ee','1');
        }
    };

    //NODE CLICK FUNCTION: If the node is a child (it has the component property) 
    clickNode(node) {
        this.bread_level = node.name;
        this.bread_level_node = node;
        this.bread_folder = '';
        this.bread_static = ''; 
        //this.preState = null;
        this.showNodeStatic = null;
        this.showNodeChild = null;
        localStorage.removeItem('current_smail_path');
        if (!(node.component)) {
            //NODE IS A FOLDER --> expand childs
            this.showChild(node);

        } else {
            //NODE IS A FILE --> open Page Component in data model, passing the node such as parameter.
            this.shownGroup = null;
            this.navCtrl.push(node.component, {
                node: node
            });
        }
    };

    //FUNCTION TO CHANGE THE NODE WHICH IS ACTUALLY EXPANDED.
    showChild(node) {
        if (this.isSelected(node)) {
            this.removeArray(this.shownGroup, node.name);

        } else {
            //The node is actually contacted --> expand node and show childs
            this.shownGroup.push(node.name);
            localStorage.setItem('smail_path', node.name);
            // console.log(node.name)
            // this.selectedFolder = 'folder';
            this.selectedLevel = node.name;
            this.selectedNode = node.name;
            //this.inboxData('ee','1');
        }
    };

    //FUNCTION TO KNOW IF A FOLDER NODE HAVE TO BE EXPANDED OR CONTRATED
    isSelected(node) {
        return (this.shownGroup.indexOf(node.name) >= 0);
    };

    clickNodeChild(node) {
        this.bread_folder = node.name;
        this.bread_folder_node = node;
        this.bread_static = '';
        this.showNodeStatic = null;

        if (!(node.component)) {
            //NODE IS A FOLDER --> expand childs
            this.showChildNode(node);
        } else {
            //NODE IS A FILE --> open Page Component in data model, passing the node such as parameter.
            this.showNodeChild = null;
            this.navCtrl.push(node.component, {
                node: node
            });
        }
    };

    showChildNode(node) {
        if (this.isSelectedChild(node)) {
            //The node is actually expanded --> contract node and don't show childs
            this.showNodeChild = null;
            // localStorage.removeItem('smail_path');
            // localStorage.setItem('current_smail_path', node._id);
            // localStorage.setItem('fname', node.name);
            // console.log(node.name)
            // this.selectedFolder = node.name;
            // this.selectedNode = node.name;
            // this.selectedFolderId = node._id;
            // this.selecetedFolderNode = node;
            // this.selectedLevel = localStorage.getItem('smail_path');
            // this.inboxData('ee');
        } else {
            //The node is actually contacted --> expand node and show childs
            this.showNodeChild = node;
            localStorage.removeItem('smail_path');
            localStorage.setItem('current_smail_path', node._id);
            localStorage.setItem('fname', node.name);
            localStorage.setItem('which_level',node.level.replace('level',''));
            // this.selectedFolder = node.name;
            this.selectedNode = node.name;
            this.selectedFolderId = node._id;
            this.selecetedFolderNode = node;
            this.selectedLevel = localStorage.getItem('smail_path');
            //this.inboxData('ee','1');
        }
    };

    //FUNCTION TO KNOW IF A FOLDER NODE HAVE TO BE EXPANDED OR CONTRATED
    isSelectedChild(node) {
        return this.showNodeChild === node;
    };

    clickNodeStatic(node) {
        this.bread_static = node;
        if (!(node.component)) {
            //NODE IS A FOLDER --> expand childs
            this.showChildStatic(node);

        } else {
            //NODE IS A FILE --> open Page Component in data model, passing the node such as parameter.
            this.showNodeChild = null;
            this.navCtrl.push(node.component, {
                node: node
            });
        }
    };

    showChildStatic(node) {
        if (this.isSelectedStatic(node)) {
            //The node is actually expanded --> contract node and don't show childs
            this.showNodeStatic = null;
        } else {
            //this.preState = '';
            //The node is actually contacted --> expand node and show childs
            this.showNodeStatic = node;
            this.selectedNode = '';
            localStorage.removeItem('current_smail_path');
            localStorage.setItem('current_folder', node);
            // console.log(node);
            this.callStaticFunction();
        }
    };

    //FUNCTION TO KNOW IF A FOLDER NODE HAVE TO BE EXPANDED OR CONTRATED
    isSelectedStatic(node) {
        return this.showNodeStatic === node;
    };

    editFolder(name, id) {
        $("#val_"+id).val(name.name);
        this.Node = name;
        this.foldername = name.name;


        if (this.prevId == null) {
            this.prevId = id;
            document.getElementById(id).style.display = 'block';
            document.getElementById('0' + id).style.display = 'none';
        } else {
            document.getElementById(this.prevId).style.display = 'none';
            document.getElementById('0' + this.prevId).style.display = 'block';
            document.getElementById(id).style.display = 'block';
            document.getElementById('0' + id).style.display = 'none';
        }
    };

    renameFolder(index, id) {
        const loading = this.loadingCtrl.create({});
        loading.present();
        localStorage.setItem('nodename', this.Node.name);
        localStorage.setItem('nodelevel', this.Node.level);
        // console.log(this.oldValue);
        // console.log(this.Node);
        var data = this.Node;
        data.name = $("#val_"+id).val();
        // console.log(this.Node);
        //this.Node.name = this.Node;
        this.companyProvider.renameFolder(data).subscribe((formdata) => {
            // console.log(formdata);
            if (formdata.status == 1) {
                //document.getElementById('00'+id).innerHTML = this.Node;
                // this.directory[id].path = this.file_path.split('/').slice(0, -1).join('/')+'/'+this.Node;
                document.getElementById(id).style.display = 'none';
                document.getElementById('0' + id).style.display = 'block';
                // if (this.Node.level == 'level1') {
                //     this.directory[0].children[index].name = this.Node.name;
                // } else if (this.Node.level == 'level2') {
                //     this.directory[1].children[index].name = this.Node.name;
                // } else if (this.Node.level == 'level3') {
                //     this.directory[2].children[index].name = this.Node.name;
                // } else if (this.Node.level == 'level4') {
                //     this.directory[3].children[index].name = this.Node.name;
                // }


                loading.dismissAll();
                let toast = this.toastCtrl.create({
                    message: 'Folder name updated successfully.',
                    duration: 3000,
                    position: 'top',
                    cssClass: 'success'
                });
                toast.present();
            } else if (formdata.status == 2) {
                loading.dismissAll()
                let toast = this.toastCtrl.create({
                    message: 'Folder name already exists.',
                    duration: 3000,
                    position: 'top',
                    cssClass: 'danger'
                });
                toast.present();
            } else {
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
    };

    cancelFolder(index, id) {
        // var name = localStorage.getItem('nodename'),
        //     level = localStorage.getItem('nodelevel');
        // if (level == 'level1') {
        //     this.directory[0].children[index].name = name;
        // } else if (level == 'level2') {
        //     console.log(this.directory[1].children[index])
        //     this.directory[1].children[index].name = name;
        // } else if (level == 'level3') {
        //     this.directory[2].children[index].name = name;
        // } else if (level == 'level4') {
        //     this.directory[3].children[index].name = name;
        // }
        document.getElementById(id).style.display = 'none';
        document.getElementById('0' + id).style.display = 'block';
    };


    locksClicked() {
        //this.myEvent.emit(null)
        this.reverse = false;
        this.openedLevel = [];
        this.allowed_levels = [];
        this.levelArray = [];
        var userId = localStorage.getItem('userinfo');
        this.all_levels = JSON.parse(localStorage.getItem('alllevel'));
        var i;
        if (this.all_levels) {
            this.all_levels.forEach((value) => {
                // console.log(value);
                this.openedLevel = [];
                var decrypted = CryptoJS.AES.decrypt(value, userId);
                // console.log(decrypted.toString(CryptoJS.enc.Utf8).split('#')[0]);
                if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level1') {
                    this.openedLevel.push({
                        'level': 1,
                        'name': 'level1',
                        'checked': true
                    });
                    this.levelArray = [{
                        'level': 1,
                        'checked': true
                    }];
                    for (i = 0; i < 1; i++) {
                        this.allowed_levels.push('level' + (i + 1));
                    }
                } else if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level2') {
                    this.openedLevel.push({
                        'level': 1,
                        'name': 'level1',
                        'checked': true
                    });
                    this.openedLevel.push({
                        'level': 2,
                        'name': 'level2',
                        'checked': true
                    });
                    this.levelArray = [{
                            'level': 1,
                            'checked': true
                        },
                        {
                            'level': 2,
                            'checked': true
                        }
                    ];
                    for (i = 0; i < 2; i++) {
                        this.allowed_levels.push('level' + (i + 1));
                    }
                } else if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level3') {
                    this.openedLevel.push({
                        'level': 1,
                        'name': 'level1',
                        'checked': true
                    });
                    this.openedLevel.push({
                        'level': 2,
                        'name': 'level2',
                        'checked': true
                    });
                    this.openedLevel.push({
                        'level': 3,
                        'name': 'level3',
                        'checked': true
                    });
                    this.levelArray = [{
                            'level': 1,
                            'checked': true
                        },
                        {
                            'level': 2,
                            'checked': true
                        },
                        {
                            'level': 3,
                            'checked': true
                        }
                    ];
                    for (i = 0; i < 3; i++) {
                        this.allowed_levels.push('level' + (i + 1));
                    }
                } else if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level4') {
                    this.openedLevel.push({
                        'level': 1,
                        'name': 'level1',
                        'checked': true
                    });
                    this.openedLevel.push({
                        'level': 2,
                        'name': 'level2',
                        'checked': true
                    });
                    this.openedLevel.push({
                        'level': 3,
                        'name': 'level3',
                        'checked': true
                    });
                    this.openedLevel.push({
                        'level': 4,
                        'name': 'level4',
                        'checked': true
                    });
                    this.levelArray = [{
                            'level': 1,
                            'checked': true
                        },
                        {
                            'level': 2,
                            'checked': true
                        },
                        {
                            'level': 3,
                            'checked': true
                        },
                        {
                            'level': 4,
                            'checked': true
                        }
                    ];
                    for (i = 0; i < 4; i++) {
                        this.allowed_levels.push('level' + (i + 1));
                    }
                } else if (decrypted.toString(CryptoJS.enc.Utf8).split('#')[0] == 'level0') {
                    this.openedLevel = [];
                    this.allowed_levels = [];
                    this.levelArray = [];
                    //localStorage.setItem('selectedLevel', 0);
                    localStorage.removeItem('selectedLevel');
                }
            });
            this.allowed_levels.push('level' + 0);

            // console.log()
        }

        this.companyProvider.getFolders(this.userId).subscribe((all_files) => {
            // console.log(all_files)
            if (all_files.data == null) {
                this.directory = [];
            } else {
                var myArray = all_files.data;
                for (i = myArray.length - 1; i >= 0; --i) {
                    if (this.allowed_levels.indexOf(myArray[i].name) == -1) {
                        myArray.splice(i, 1);
                    }
                }
                this.directory = myArray;
            }

            if(this.preState == 'Inbox'){
                this.inboxData('ee');
            }else{
                this.sentMailsData('ee');
            }
    
        },
        err => {
            this.showTechnicalError();
        });
        this.getOpenLevels();
    };

    attachfiles() {
        let modal = this.modalCtrl.create('SmailFileUploadPage');
        modal.onDidDismiss(data => {
            for (var i = 0; i < data.length; i++) {
                this.attacments.push(data[i]);
            }
            // console.log(data);
        });
        modal.present();
    };

    removeFile(index) {
        const loading = this.loadingCtrl.create({});
        loading.present();
        this.companyProvider.deleteDirectoryFiles('directory/smail_data/' + this.attacments[index]).subscribe((response) => {
            // console.log(response);
            loading.dismissAll();
            this.attacments.splice(index, 1);
        },
        err => {
            loading.dismissAll();
            this.showTechnicalError('1');
        });
    };

    listCheckbox(isChecked, value) {
        if (isChecked == true) {
            this.deleteSmails.push(value);
        } else {
            for (var i = 0; i < this.deleteSmails.length; i++) {
                if (this.deleteSmails[i]._id == value._id) {
                    this.deleteSmails.splice(i, 1);
                }
            }
        }
    };

    trash() {
        if(this.deleteSmails.length > 0){
            let alert = this.alertCtrl.create({
                title: 'Delete mails',
                message: 'Do you want to delete these mails?',
                buttons: [{
                        text: 'Cancel',
                        role: 'cancel',
                        handler: () => {
                            // console.log('Cancel clicked');
                        }
                    },
                    {
                        text: 'Yes',
                        handler: () => {
                            const loading = this.loadingCtrl.create({});
                            loading.present();
                            var array = [];
                            // console.log(this.deleteSmails)
                            for (var i = 0; i < this.deleteSmails.length; i++) {
                                if (this.deleteSmails[i].mailId == null) {
                                    array.push(this.deleteSmails[i]._id);
                                } else {
                                    array.push(this.deleteSmails[i].mailId);
                                }
                            }
                            this.smailserviceProvider.deleteSmails(array, this.userId).subscribe((data) => {
                                // console.log(data);
                                this.deleteSmails = [];
                                loading.dismissAll();
                                let toast = this.toastCtrl.create({
                                    message: 'Mails has been deleted successfully.',
                                    duration: 3000,
                                    position: 'top',
                                    cssClass: 'success'
                                });
                                toast.present();
                                this.events.publish('read_mail:changed', '');
                                if (this.preState == 'Inbox') {
                                    this.inboxData('ee');
                                } else {
                                    this.sentMailsData('ee');
                                }
                                //this.navCtrl.push(SmailPage);
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
        }
        else
        {
            let toast = this.toastCtrl.create({
                message: 'Please select atleast one mail.',
                duration: 3000,
                position: 'top',
                cssClass: 'danger'
            });
            toast.present();
        }
    };

    allChecked(isChecked) {
        this.deleteSmails = [];
        var i;
        if (isChecked) {
            for (i = 0; i < this.items.length; i++) {
                this.deleteSmails.push(this.items[i]);
                this.items[i].id = true;
            }
        } else {
            for (i = 0; i < this.items.length; i++) {
                this.items[i].id = false;
            }
        }

    };

    getValueOpton(value) {
        // console.log(value);
    };

    root() {
        this.navCtrl.setRoot('DashboardPage');
    };

    acceptInvite(link) {
        if (localStorage.getItem('view') == 'sent' || localStorage.getItem('view') == 'Sent') {
            this.navCtrl.setRoot('ContactsPage');
        } else {
            const loading = this.loadingCtrl.create({});
            loading.present();
            var id = link.split('/');
            id = id[id.length - 1];
            // console.log(id)
            var sendData = {
                memberId: id,
                memberstatus: '2'
            }

            this.memberserviceProvider.acceptInvitation(sendData).subscribe((dashboard_data) => {
                loading.dismissAll();
                if(dashboard_data.error){
                    let toast = this.toastCtrl.create({
                        message: dashboard_data.error,
                        duration: 3000,
                        position: 'top',
                        cssClass: 'danger'
                    });
                    toast.present();
                }else{
                    let toast = this.toastCtrl.create({
                        message: 'Invitation has been accepted successfully.',
                        duration: 3000,
                        position: 'top',
                        cssClass: 'success'
                    });
                    toast.present();
                    this.navCtrl.setRoot('ContactsPage');
                }
                
            },
            err => {
                loading.dismissAll();
                this.showTechnicalError('1');
            });
        }
    };

    rejectContact(link){
        if (localStorage.getItem('view') == 'sent' || localStorage.getItem('view') == 'Sent') {
            this.navCtrl.setRoot('ContactsPage');
        } else {
            const loading = this.loadingCtrl.create({});
            loading.present();
            var id = link.split('/');
            id = id[id.length - 1];
            // console.log(id)
            var sendData = {
                memberId: id,
                memberstatus: '0'
            }

            this.memberserviceProvider.acceptInvitation(sendData).subscribe((dashboard_data) => {
                loading.dismissAll();
                if(dashboard_data.error){
                    let toast = this.toastCtrl.create({
                        message: dashboard_data.error,
                        duration: 3000,
                        position: 'top',
                        cssClass: 'danger'
                    });
                    toast.present();
                }else{
                    let toast = this.toastCtrl.create({
                        message: 'Invitation has been rejected successfully.',
                        duration: 3000,
                        position: 'top',
                        cssClass: 'success'
                    });
                    toast.present();
                    this.navCtrl.setRoot('ContactsPage');
                }
            },
            err => {
                loading.dismissAll();
                this.showTechnicalError('1');
            });
        }
    };


    // this is run whenever the (ionInput) event is fired
    searchFn(searchTerm, jobId, readStatus, tradeId, isJobChanged, selectedType,isVal = false) {
        this.term = searchTerm;
        this.details = '';
        this.thread = false;
        this.items = this.allemails;

        let val = searchTerm;

        // if the value is an empty string don't filter the items
        if (val && val.trim() != '') {
          this.items = this.items.filter((item) => {
            return (item.email.toLowerCase().indexOf(val.toLowerCase()) > -1 || item.subject.toLowerCase().indexOf(val.toLowerCase()) > -1 || item.name.toLowerCase().indexOf(val.toLowerCase()) > -1 || item.toArray[0].name.toLowerCase().indexOf(val.toLowerCase()) > -1);
          })
        }


        // if (this.term && this.term.trim() != '') {
        //     this.items = this.items.filter((item) => {
        //         var temp = item.toArray.filter((contact) => {
        //             return (contact.email.toLowerCase().indexOf(this.term.toLowerCase()) > -1)
        //         });

        //         if (item.subject.toLowerCase().indexOf(this.term.toLowerCase()) > -1) {
        //             return item;
        //         } else {
        //             if (item.name.toLowerCase().indexOf(this.term.toLowerCase()) > -1) {
        //                 return item;
        //             } else {
        //                 if (temp.length > 0) {
        //                     return temp;
        //                 }
        //             }
        //         }
        //     });
        // }
        if (readStatus != undefined && readStatus != '') {

            this.items = this.items.filter((item) => {
                if (readStatus == 1) {
                    return (item.read == true);
                } else {
                    return (item.read == false);
                }
            });
        }

        if (jobId != '') {
            this.items = this.items.filter((item) => {
                return (item.jobId == jobId);
            });
        }

        if (selectedType != '') {
            this.items = this.items.filter((item) => {
                return (item.jobType == selectedType);
            });
        }
        // console.log(this.items)
        if (tradeId != '' && isJobChanged == false) {
            this.items = this.items.filter((item) => {
                return (item.tradeId == tradeId);
            });
        }

        if(isJobChanged == true && isVal == false){
            this.selectedTrade = '';
            this.selected_trade_icon = null;
            this.companyProvider.allTrades(jobId).subscribe((data)=>{
                // console.log(data)
                this.trades = data;
                if(this.trades != ''){
                    var all_trades = [];
                    this.trades.forEach(function(trade){
                        all_trades[trade._id] = trade;
                    })
                    this.trades = all_trades;
                }
            },
            err => {
                this.showTechnicalError();
            });
        }


        if (this.items.length > 0) {
           // this.openSmaildetailPage(this.items[0], 0);
        } else {
            this.details = '';
        }

    }

  isParaActive:boolean = false;
  isBtnActive:boolean = false;
 
    //ToggleClass function functionality
    toggleClass(){
        this.isParaActive = !this.isParaActive;
        this.isBtnActive = !this.isBtnActive;
    };

    smail(){
        this.allowed_levels = [];
        for(var i=0; i < this.openedLevel.length; i++){
            this.openedLevel[i].checked = true;
            this.allowed_levels.push('level'+(i+1));
        }
        this.selectedFolder = '';
        localStorage.setItem('view', "Inbox");
        this.preState = 'Inbox';
        this.inboxData('ee');
    };

    inboxPage(){
        localStorage.setItem('view', 'Inbox');
        this.preState = 'Inbox';
        this.inboxData('ee');
    };

    undo(item, index){
        const loading = this.loadingCtrl.create({});
        loading.present();
        var id;
            if (item.mailId == null) {
                id = item._id;
            } else {
                id = item.mailId;
            }
        this.smailserviceProvider.undoEmails(this.userId,id ).subscribe((data) => {
            loading.dismissAll();
            if(data.status == 1){
                this.items.splice(index, 1);
                let toast = this.toastCtrl.create({
                    message: 'Mail has been undo successfully.',
                    duration: 3000,
                    position: 'top',
                    cssClass: 'success'
                });
                toast.present();
            }else{
                let toast = this.toastCtrl.create({
                    message: 'You can\'t undo this mail.Its already been read by recipient.',
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
    };

    viewTransmittal(bidId){
        this.navCtrl.push('bidding-page', {
            bidJobId: bidId,
            status: 9,
          });
    }

    downloadTransmittal(transmittalId){
        let modal = this.modalCtrl.create('PdfTransmittalPage', {transmittalId : transmittalId});
            modal.present();
    }

    dragMail(mailId){
        localStorage.setItem('fnn_counter','1');
        this.drag_mailId = mailId;
    }

    dragOut(){
        if(localStorage.getItem('fnn_counter') == '1'){
            setTimeout(function(){
                localStorage.setItem('fnn_counter','0');
                console.log(localStorage.getItem('fnn_counter'))
            },200);
        }
    }

    dropSmails(folderId){
        if(localStorage.getItem('fnn_counter') == '1'){
            localStorage.setItem('fnn_counter','0');
            const loading = this.loadingCtrl.create({});
            loading.present();
            this.smailserviceProvider.drag_smail_folder(this.drag_mailId,folderId).subscribe((data) => {
                loading.dismissAll();
                if(data.status == 1){
                    let toast = this.toastCtrl.create({
                        message: 'Mail has been droped successfully.',
                        duration: 3000,
                        position: 'top',
                        cssClass: 'success'
                    });
                    toast.present();
                    // if (this.preState == 'Inbox') {
                    //     this.inboxData('ee');
                    // } else {
                    //     this.sentMailsData('ee');
                    // }
                }else{
                    let toast = this.toastCtrl.create({
                        message: 'There is some error.plz try later.',
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
    }

    ChangeShareJobStatus(assocId,status){
        const loading = this.loadingCtrl.create({});
        loading.present();
        this.companyProvider.changeStatusEmployee(assocId,status).subscribe((updated)=>{
            if(updated.status == '1'){
                var msg = status == '1' ? 'accepted' : 'rejected';
                let toast = this.toastCtrl.create({
                    message: 'Invitation has been '+msg+' successfully.',
                    duration: 3000,
                    position: 'top',
                    cssClass: 'success'
                   });
                toast.present();
            }
            else if(updated.status == '2'){
                let toast = this.toastCtrl.create({
                    message: 'Link Expired, Action has been already performed.',
                    duration: 3000,
                    position: 'top',
                    cssClass: 'info'
                   });
                toast.present();
            }
            else if(updated.status == '3'){
                let toast = this.toastCtrl.create({
                    message: 'Error, Invitation has been removed by sender.',
                    duration: 3000,
                    position: 'top',
                    cssClass: 'info'
                   });
                toast.present();
            }
            else{
                let toast = this.toastCtrl.create({
                    message: 'Error,Plz try later.',
                    duration: 3000,
                    position: 'top',
                    cssClass: 'danger'
                   });
                toast.present();
            }
            loading.dismissAll();
        },
        err => {
            loading.dismissAll();
            this.showTechnicalError('1');
        });
    }
}