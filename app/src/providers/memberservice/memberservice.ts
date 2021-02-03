import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/Rx'; 
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';
@Injectable()
export class MemberserviceProvider {

  constructor(public http: Http) {  
  }

  membersList(userId){
	return this.http.get('getUserList/'+ userId).map((res)=>{
	return res.json();
	}).catch((error: any) => {
	    return Observable.throw(new Error(error.status));
	});
 }

 friend_requests(userId){
	return this.http.get('friend_requests/'+ userId).map((res)=>{
	return res.json();
	}).catch((error: any) => {
	    return Observable.throw(new Error(error.status));
	});
 }
 
 sendInvitation(data){
	return this.http
	    .post('inviteMembers', data)
	      .map((data)=>{
	            return data.json();
	      }, error => {
	         return error.json();
	      });
 }

 resendInvitation(data){
	return this.http
	    .put('inviteMembers', data)
	      .map((data)=>{
	            return data.json();
	      }, error => {
	         return error.json();
	      });
 } 

 acceptInvitation(data){
	return this.http
	    .put('accptinvitation', data)
	      .map((data)=>{
	            return data.json();
	      }, error => {
	         return error.json();
	      });
 }
}