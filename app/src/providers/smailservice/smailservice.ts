import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/Rx'; 
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';
@Injectable()
export class SmailserviceProvider {

  	constructor(public http: Http) {
  	}

   	sendSmail(data){
		return this.http
	    .post('sMailApi', data)
	      .map((data)=>{
	            return data.json();
	      }, error => {
	         return error.json();
	      });
 	};

 	updateUnconnect(data){
		return this.http
	    .post('updateUnconnect', data)
	      .map((data)=>{
	            return data.json();
	      }, error => {
	         return error.json();
	      });
 	};

 	removeUnconnect(data){
		return this.http
	    .post('removeUnconnect', data)
	      .map((data)=>{
	            return data.json();
	      }, error => {
	         return error.json();
	      });
 	};

 	drag_smail_folder(mailId,folderId){ 
		return this.http
	    .post('drag_smail_folder', {id : mailId, folderId : folderId})
	      .map((data)=>{
	            return data.json();
	      }, error => {
	         return error.json();
	      });
 	};

 	sendList(userId){
		return this.http.get('sendMailListData/'+ userId).map((res)=>{
		return res.json();
		}).catch((error: any) => {
		    return Observable.throw(new Error(error.status));
		});
 	};

 	inbox(userId){
		return this.http.put('sendMailListData/'+ userId, {}).map((res)=>{
			return res.json();
		}).catch((error: any) => {
		    return Observable.throw(new Error(error.status));
		});
 	};

 	delete(userId){
		return this.http.delete('sendMailListData/'+ userId).map((res)=>{
			return res.json();
		}).catch((error: any) => {
		    return Observable.throw(new Error(error.status));
		});
 	};

 	reply(userId, smailId){
		return this.http.put('sMailApi',{userId: userId, smailId: smailId}).map((res)=>{
			return res.json();
		}).catch((error: any) => {
		    return Observable.throw(new Error(error.status));
		});
 	};

 	level_based(userId, level){
		return this.http.get('smail/'+userId+'/'+level).map((res)=>{
			return res.json();
		}).catch((error: any) => {
		    return Observable.throw(new Error(error.status));
		});
 	};

 	readsmail(userId,mailId,loginId){
		return this.http.post('sendMailListData/'+ userId, {mailId : mailId,loginId:loginId}).map((res)=>{
			return res.json();
		}).catch((error: any) => {
		    return Observable.throw(new Error(error.status));
		});
 	};

 	deleteSmails(ids, userId){
 		return this.http.post('deletemails', {'idArray': ids, 'userId': userId}).map((res)=>{
			return res.json();
		}).catch((error: any) => {
		    return Observable.throw(new Error(error.status));
		});
 	};

 	undoEmails(userId, id){
 		return this.http.post('undoemails/' + userId, {'emailId': id}).map((res)=>{
			return res.json();
		}).catch((error: any) => {
		    return Observable.throw(new Error(error.status));
		});
 	};

 	

}