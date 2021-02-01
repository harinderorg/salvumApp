import { Injectable } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/Rx'; 
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AlllicenseserviceProvider {

  constructor(public http: Http) {
  }

  getLicenseList(userId,companyId,type){
	  return this.http.get('getUserLicenses/'+userId+'/'+companyId+'/'+type).map((res)=>{
	    return res.json();
	  }).catch((error: any) => {
      return Observable.throw(new Error(error.status));
    });
  };

  assignLicenseToUsers(licenses, contacts, userName, privileges, loginId){
    return this.http.post('assignLicense', {licenses: licenses, contacts: contacts, userName: userName, privileges: privileges, loginId: loginId} ).map((res)=>{
      return res.json();
    }).catch((error: any) => {
      return Observable.throw(new Error(error.status));
    });
  }

  // remove User From License
  removeUserFromLicense(licenseId,userId,loginId) {
  let data = new URLSearchParams();
  data.append('licenseId', licenseId);
  data.append('userId', userId);
  data.append('loginId', loginId);
    return this.http
      .post('removeUserFromLicense', data)
        .map((data)=>{
              return data.json();
        }, error => {
           return error.json();
        });
  }
  // remove Assigned License
  removeAssignedLicense(licenseId,userId,loginId) { 
  let data = new URLSearchParams();
  data.append('licenseId', licenseId);
  data.append('userId', userId);
  data.append('loginId', loginId);
    return this.http
      .post('removeAssignedLicense', data)
        .map((data)=>{
              return data.json();
        }, error => {
           return error.json();
        });
  }

  // de Activate License
  deActivateLicense(licenseId,userId) { 
  let data = new URLSearchParams();
  data.append('licenseId', licenseId);
  data.append('userId', userId);
    return this.http
      .post('deActivateLicense', data)
        .map((data)=>{
              return data.json();
        }, error => {
           return error.json();
        });
  }

}
