import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Directive } from '@angular/core';
import { IonicApp, IonicModule} from 'ionic-angular';
import { DatePipe } from '@angular/common';
import { NgPipesModule } from 'ngx-pipes';
import { MyApp } from './app.component'; 
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpModule, RequestOptions } from '@angular/http';

import { File } from '@ionic-native/file';  
import { Transfer } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { Device } from '@ionic-native/device';
import { FileTransfer } from '@ionic-native/file-transfer'; 
import { PdfmakeModule } from 'ng-pdf-make';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { ClickOutsideModule } from 'ng-click-outside';
import { TooltipsModule } from 'ionic-tooltips';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
import { FCM } from '@ionic-native/fcm';
import { PushNotificationModule } from 'ng-push-notification';

import { ApilinkProvider } from '../providers/apilink/apilink';
import { CustomheaderPage } from '../pages/customheader/customheader';
import { CustomfooterPage } from '../pages/customfooter/customfooter';

const config: SocketIoConfig = { url: 'https://serrare.com:3001', options: {} };

@NgModule({
  declarations: [ 
    MyApp, 
    CustomheaderPage, 
    CustomfooterPage,
  ],
  imports: [
    BrowserModule, 
    NgPipesModule,
    PdfmakeModule,
    ClickOutsideModule,
    BrowserAnimationsModule,
    TooltipsModule,
    SocketIoModule.forRoot(config),
    IonicModule.forRoot(MyApp),
    PushNotificationModule.forRoot({
        dir: 'auto',
        lang: 'en-US',
        renotify: false,
        sticky: false,
        noscreen: false,
        silent: true,
        closeDelay: 6000,
        icon: 'assets/img/logo-icon.png'
    }),
    HttpModule,
  ],
  bootstrap: [
    IonicApp
  ],
  entryComponents: [
    MyApp, 
    CustomheaderPage, 
    CustomfooterPage,
  ],

  providers: [
    StatusBar,
    SplashScreen,
    File,
    Transfer,
    FileTransfer,
    Camera,
    Device,
    FilePath,
    //{provide: ErrorHandler, useClass: IonicErrorHandler},
    {provide: RequestOptions, useClass: ApilinkProvider},
    DatePipe, 
    FCM,
    InAppBrowser
  ]

  
})
@Directive({ selector: '[ng2FileDrop, ng2FileSelect]'})
export class AppModule {} 