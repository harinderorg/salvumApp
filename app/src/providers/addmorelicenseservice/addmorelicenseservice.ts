import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/Rx'; 
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AddmorelicenseserviceProvider {

  constructor(public http: Http) {
  }

  getAllLicenseList(){
	return this.http.get('licenses').map((res)=>{
	return res.json();
	}).catch((error: any) => {
	    return Observable.throw(new Error(error.status));
	});
 }

}
