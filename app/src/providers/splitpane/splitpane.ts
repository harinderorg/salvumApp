import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Platform } from 'ionic-angular';

@Injectable()
export class SplitpaneProvider {
	splitPaneState: boolean;
  	constructor(public http: Http, public platform: Platform ) {
    	this.splitPaneState = false;
  	}

  	setSplitPane(state: boolean) {
        if (this.platform.width() > 768) {
            this.splitPaneState = state;
        } else {
            this.splitPaneState = false;
        }
    }

    getSplitPane() {
        return this.splitPaneState;
    }

}


    