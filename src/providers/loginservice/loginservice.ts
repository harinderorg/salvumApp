import { Injectable } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class LoginserviceProvider {

  constructor(public http: Http) {
  }

  login(email,password,fcm_token){
  	let data = new URLSearchParams();
   	data.append('email', email);
    data.append('password', password);
   	data.append('fcm_token', fcm_token);
  	return this.http.post('loginUser', data).map((res)=>{
  	return res.json();
  	}, error => {
        return error.json();
    });
 }

}