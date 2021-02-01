import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, ToastController, NavParams, AlertController, Platform, ModalController } from 'ionic-angular';
import { Http, Headers, Response } from '@angular/http';
import 'rxjs/Rx';
import { CompanyProvider } from '../../providers/company/company';
// import { InAppBrowser } from '@ionic-native/in-app-browser';
declare var gapi: any;
declare var WL: any;
declare var window: any;

@IonicPage()
@Component({
  selector: 'page-invite',
  templateUrl: 'invite.html',
  providers: [CompanyProvider] 
})
export class InvitePage {
  outlookClientID = 'ae10e214-991f-4dd3-8d57-36a995595340';
  outlookClientSecret = 'xsanNW046?%xgxOIPTM39#^';
  outlookRedirectUrl = 'http://localhost:8100/';
  OutlookContactsList: any;
  config : object = {
     'client_id':'1065094829001-t4ugmilrod6huv27l13eqmsevoopmolo.apps.googleusercontent.com',
    'scope': 'https://www.google.com/m8/feeds'
  };
  isBrowser:any;
  formattedSignature:any;
  baseUrl : any = localStorage.getItem('baseUrl');
  constructor(public companyProvider: CompanyProvider,public navCtrl: NavController, public navParams: NavParams,  public alertCtrl: AlertController,public modalCtrl: ModalController,public http:Http ,public loadingCtrl:LoadingController,private platform: Platform,public toastCtrl: ToastController) {
   this.http = http;



    // if(localStorage.getItem('code')!= null){
    //     var url = 'http://socialinviter.com/api/contacts.aspx?service=outlook&type=accesstoken&consumerkey=000000004420141D&consumersecret=bjspjKDTQ2^peOWA0679?_!&returnurl='+encodeURIComponent('http://localhost:8100/#/invite') +'&signaturekey='+localStorage.getItem('frmtSignature')+ '&token='+ encodeURIComponent(localStorage.getItem('code'))+'&tokensecret=&tokenverifier=';

    //     this.http.get(url).map(res => res.json())
    //     .subscribe(data => {
    //       console.log(data)
    //       return this.http.get(data.data.authurl).map(res=>res)
    //       .subscribe(response => {
    //         console.log(response)
    //         window.location.href = response.url
    //       });
    //     })
    // }
  }

  ionViewDidLoad() {
  this.isBrowser = localStorage.getItem('isBrowser');
  var url = window.location.href;
  if(url.search('verified') >= 0)
  {
    this.yahooLogin();
  }
  if(url.search('confirmed') >= 0)
  {
    this.gmailLogin();
  }
  if(url.search('accepted') >= 0)
  {
    this.hotmailLogin('1');
  }
  }

  outlookLogin() {
    this.platform.ready().then(() => {
      this.outLookLogin().then(code => {
        console.log('back...')
        const credentials = `client_id=${this.outlookClientID}
        &client_secret=${this.outlookClientSecret}&redirect_uri=${this.outlookRedirectUrl}
        &grant_type=authorization_code
        &code=${code}`;
 
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        this.http.post('https://login.microsoftonline.com/common/oauth2/v2.0/token', credentials, { headers: headers })
          .map(res => res.json())
          .subscribe(data => {
            console.log('enter..')
            console.log(data)
            this.callFinalApi(data.access_token);
          }, (error) => {
            console.log(error);
          });
      });
    });
  }

  outLookLogin(): Promise<any> {
    return new Promise((resolve, reject) => {
 
      const url = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?state=Eav6wrDocSdnkKHfvdzBs9XmtE2SitGd&scope=profile+openid+email+offline_access+User.Read+Mail.Send+Contacts.ReadWrite.Shared&response_type=code&approval_prompt=auto&client_id=${this.outlookClientID}&redirect_uri=${this.outlookRedirectUrl}`;
 
      // var browserRef = window.open(url, "_blank", "location=no,clearsessioncache=yes,clearcache=yes");
      var browserRef = window.cordova.InAppBrowser.open(url, "_blank", "location=no,clearsessioncache=yes,clearcache=yes");

      browserRef.addEventListener("loadstart", (event) => {
        console.log('event')
        console.log(event)
        if ((event.url).indexOf(this.outlookRedirectUrl) === 0) {
          console.log('hello1')
          browserRef.removeEventListener("exit", (event) => { });
          browserRef.close();
          let code = this.getParameterByName('code', event.url);
          if (code) {
            console.log('code')
            console.log(code)
            resolve(code);
          } else {
            console.log('reject')
            reject("Problem authenticating with outlook");
          }
        }
      });
      browserRef.addEventListener("exit", function (event) {
        reject("The Outlook sign in flow was canceled");
      });
    });
  }

  callFinalApi(access_token){
    console.log('final entry...')
    const headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers.append('Authorization', `Bearer $`+access_token);
    this.http.get('https://graph.microsoft.com/beta/me/people/?$skip=0&$top=1000', { headers: headers })
      .map((response: Response) => response.json()
        .subscribe((rows: any) => {

          this.OutlookContactsList = rows;
          console.log('rows')
          console.log(rows)
        }, error => {
          console.log(error);
        })
      , (error) => {
        return error;
      });
  }

  // to get query string form the auth url of outlook
  getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }


 inviteContacts() {
    gapi.auth.authorize(this.config).then((data)  => {
     this.contact(data.access_token);
    })
 }

 contact(token){
  const loading = this.loadingCtrl.create({});
  loading.present();
    return this.http.get('http://www.google.com/m8/feeds/contacts/default/full?access_token=' + token + "&alt=json" ).map(res => res.json())
    .subscribe(data => {
    loading.dismissAll();
    let myModal = this.modalCtrl.create('ImportmailPage', data.feed.entry);
    myModal.present();
  },
    err => {
        loading.dismissAll();
        this.showTechnicalError();
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

hotmail(){
// var url = 'http://socialinviter.com/api/contacts.aspx?service=outlook&type=authenticationurl&consumerkey=000000004420141D&consumersecret=bjspjKDTQ2^peOWA0679?_!&returnurl='+encodeURIComponent('http://localhost:8100/#/invite') +'&signaturekey='+localStorage.getItem('frmtSignature');
//   this.http.get(url).map(res => res.json())
//     .subscribe(data => {
//       console.log(data)
//       return this.http.get(data.data.authurl).map(res=>res)
//       .subscribe(response => {
//         console.log(response)
//         window.location.href = response.url
//       });
//   })
    
    WL.init({
      client_id: '00000000442014C0',
      redirect_uri: 'http://localhost:8100',
      scope: ["wl.contacts_emails"],
      response_type: "token"
    });
    
    WL.login({
        scope: ["wl.contacts_emails"]
    }).then(function (response) 
    {
      console.log(response)
    WL.api({
            path: "me/contacts",
            method: "GET",
        }).then(
            function (response) {
                      //your response data with contacts 
              console.log(response.data);
            },
            function (responseFailed) {
              console.log(responseFailed);
            }
        );
        
    },
    function (responseFailed) 
    {
        console.log("Error signing in: " + responseFailed.error_description);
    });
}


  inviteSpecificCons() {
    let myModal = this.modalCtrl.create('ModelPage');
    myModal.present();
  }


    ///////////////////////// GOOGLE LOGIN
    // googleLogin() {
    //   var requestToken = "";
    // var accessToken = "";
    // var clientSecret = "nErpqb6cXRnI0nuUikzLo4cb";
    // var clientId = "78327687001-l6ilns324mnt4alfkftn2c82p31ssvua.apps.googleusercontent.com";

    //     var ref = window.open('https://accounts.google.com/o/oauth2/auth?client_id=' + clientId + '&redirect_uri=http://localhost:8100/invite&scope=https://www.googleapis.com/auth/urlshortener  https://www.google.com/m8/feeds&approval_prompt=force&response_type=code&access_type=offline', '_blank', 'location=no');
    //             this.http({
    //               method: "post", 
    //               url: "https://accounts.google.com/o/oauth2/token", 
    //               data: "client_id=" + clientId + "&client_secret=" + clientSecret + "&redirect_uri=http://localhost:8100/invite" + "&grant_type=authorization_code" + "&code=" + requestToken 
    //             })
    //                 .success(function(data) {
    //                     accessToken = data.access_token;
    //                     console.log(accessToken);

    //                     //$scope.contactFxn(accessToken);

    //                 })
    //                 .error(function(data, status) {
    //                     alert("ERROR: " + data);
    //                 });
          
    // }

  root(){
    this.navCtrl.setRoot('DashboardPage');
  };

  members(){
    this.navCtrl.push('MembersPage'); 
  };

  yahooLogin()
  {
    const loading = this.loadingCtrl.create({});
    loading.present();
      return this.http.get(this.baseUrl+'/yaho').map(res => res.json())
      .subscribe(data => {
        loading.dismissAll();
        if(data[0] != 1)
        {
          let myModal = this.modalCtrl.create('ImportmailPage',{
              yahoo_contacts : data, 
              type : 'yahoo'
            });
            myModal.present();
        }
        else
        {
          window.location.href = data[1];     
        }
    },
    err => {
        loading.dismissAll();
        this.showTechnicalError('1');
    });
  }

  gmailLogin()
  {
    const loading = this.loadingCtrl.create({});  
    loading.present();
      return this.http.get(this.baseUrl+'/gmail?get_contacts=all').map(res => res.json())
      .subscribe(data => {
        loading.dismissAll(); 
        if(data[0] != 1)
        {
          let myModal = this.modalCtrl.create('ImportmailPage',{
              gmail_contacts : data, 
              type : 'gmail'
            });
            myModal.present();
        }
        else
        {
          window.location.href = data[1];     
        }
    },
    err => {
        loading.dismissAll();
        this.showTechnicalError('1');
    });
  }

  hotmailLogin(code = '0')
  {
    const loading = this.loadingCtrl.create({});  
    loading.present();
      return this.http.get(this.baseUrl+'/hotmail?code='+code).map(res => res.json())
      .subscribe(data => {
        loading.dismissAll(); 
        console.log('...hotmail working...')
        console.log(data)
        console.log('----end----')
        if(data[0] != 1)
          {
            console.log('enter')
            let myModal = this.modalCtrl.create('ImportmailPage',{
                hotmail_contacts : data, 
                type : 'hotmail'
              });
              myModal.present();
          }
          else
          {
            window.location.href = data[1];     
          }
          
    },
    err => {
        loading.dismissAll();
        this.showTechnicalError('1');
    });
  }
}
