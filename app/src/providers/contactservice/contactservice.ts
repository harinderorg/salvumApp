import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/Rx'; 
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ContactserviceProvider {

  constructor(public http: Http) {
  }


  contactsList(userId){
    return this.http.get('getContactList/'+ userId).map((res)=>{
      return res.json();
    }).catch((error: any) => {
      return Observable.throw(new Error(error.status));
    });
  }
  readNotis(nid){
    return this.http.get('readNotis/'+ nid).map((res)=>{
      return res.json();
    }).catch((error: any) => {
      return Observable.throw(new Error(error.status));
    });
  }
  getUserEmails(userId){
  	return this.http.get('getUserEmails/'+ userId).map((res)=>{
    	return res.json();
  	}).catch((error: any) => {
      return Observable.throw(new Error(error.status));
    });
  }
  contactDelete(userId, memberId){
    return this.http.post('getContactList/'+ userId, {id: memberId}).map((res)=>{
      return res.json();
    }).catch((error: any) => {
      return Observable.throw(new Error(error.status));
    });
  }
  getNotifications(userId, level){
    return this.http.post('notify', {'senderId':userId, 'level': level}).map((res)=>{
      return res.json();
    }).catch((error: any) => {
      return Observable.throw(new Error(error.status));
    });
  }

  deleteNotis(nid){
    return this.http.post('deleteNotis', {'id':nid}).map((res)=>{
      return res.json();
    }).catch((error: any) => {
      return Observable.throw(new Error(error.status));
    });
  }

  removeAllNotis(userId){
    return this.http.post('removeAllNotis', {'userId':userId}).map((res)=>{
      return res.json();
    }).catch((error: any) => {
      return Observable.throw(new Error(error.status));
    });
  } 

  makeEmailPrimary(data){
    return this.http.post('makeEmailPrimary', data).map((res)=>{
      return res.json();
    }).catch((error: any) => {
      return Observable.throw(new Error(error.status));
    });
  }

  deleteEmails(data){
    return this.http.post('deleteEmails', data).map((res)=>{
      return res.json();
    }).catch((error: any) => {
      return Observable.throw(new Error(error.status));
    });
  }

  getNotificationsCount(userId, level){
    return this.http.post('notify_count', {'senderId':userId, 'level': level}).map((res)=>{
      return res.json();
    }).catch((error: any) => {
      return Observable.throw(new Error(error.status));
    });
  }

  getLevelNotifications(userId, level){
    return this.http.post('allNotification', {'userId':userId, 'level': level}).map((res)=>{
      return res.json();
    }).catch((error: any) => {
      return Observable.throw(new Error(error.status));
    });
  }

  getNotification(userId, level){
    return this.http.post('singleNotification', {'senderId':userId, 'level': level}).map((res)=>{
      return res.json();
    }).catch((error: any) => {
      return Observable.throw(new Error(error.status));
    });
  }

  getAllNotification(userId, level){
    return this.http.post('allNotification', {'userId':userId, 'level': 0}).map((res)=>{
      return res.json();
    }).catch((error: any) => {
      return Observable.throw(new Error(error.status));
    });
  }

  getAllNotifications(userId, level){
    return this.http.post('allNotificationList', {'userId':userId, 'level': 0}).map((res)=>{
      return res.json();
    }).catch((error: any) => {
      return Observable.throw(new Error(error.status));
    });
  }

  readNotification(userId, level, ntype){
    return this.http.post('readNotification', {'senderId':userId, 'level': level, 'type': ntype}).map((res)=>{
      return res.json();
    }).catch((error: any) => {
      return Observable.throw(new Error(error.status));
    });
  };

  readNotifications(userId, notificationId){
    return this.http.put('readNotification', {'senderId':userId, 'notificationId': notificationId }).map((res)=>{
      return res.json();
    }).catch((error: any) => {
      return Observable.throw(new Error(error.status));
    });
  };

  updateImage(userId, filename){
    return this.http.get('updateProfile/'+ userId + '/' + filename).map((res)=>{
      return res.json();
    }).catch((error: any) => {
      return Observable.throw(new Error(error.status));
    });
  }

  acceptInvitation(data){
    return this.http.put('accptinvitation', data).map((res)=>{
      return res.json();
    }).catch((error: any) => {
      return Observable.throw(new Error(error.status));
    });
  }

  setSenderLevel(data){
    return this.http.put('sendersetleveldata', data).map((res)=>{
      return res.json();
    }).catch((error: any) => {
      return Observable.throw(new Error(error.status));
    });
  }

  setReceiverLevel(data){
    return this.http.put('reciviersetleveldata', data).map((res)=>{
      return res.json();
    }).catch((error: any) => {
      return Observable.throw(new Error(error.status));
    });
  }

  addGroup(data){
    return this.http.post('addGroup', data).map((res)=>{
      return res.json();
    }).catch((error: any) => {
      return Observable.throw(new Error(error.status));
    });
  }

  getUserInfo(data){
    return this.http.post('viewUser', data).map((res)=>{
      return res.json();
    }).catch((error: any) => {
      return Observable.throw(new Error(error.status));
    });
  }

  updateUserData(data){
    return this.http.post('updateUser', data).map((res)=>{
      return res.json();
    }).catch((error: any) => {
      return Observable.throw(new Error(error.status));
    });
  }

  updateProfile(data){
    return this.http.post('updateProfile', data).map((res)=>{
      return res.json();
    }).catch((error: any) => {
      return Observable.throw(new Error(error.status));
    });
  }

  updateSocialLink(data){
    return this.http.post('updateUserSocailLink', data).map((res)=>{
      return res.json();
    }).catch((error: any) => {
      return Observable.throw(new Error(error.status));
    });
  }

  allLevelData(userId, level){
    return this.http.get('allleveldata/' + userId + '/' + level).map((res)=>{
      return res.json();
    }).catch((error: any) => {
      return Observable.throw(new Error(error.status));
    });
  }

  updateWebUrl(data){
    return this.http.put('addlevel', data).map((res)=>{
      return res.json();
    }).catch((error: any) => {
      return Observable.throw(new Error(error.status));
    });
  }

  walletsDetail(userId){
    return this.http.get('walletDeatil/'+ userId).map((res)=>{
      return res.json();
    }).catch((error: any) => {
      return Observable.throw(new Error(error.status));
    });
  }

  deleteWallet(data){
    return this.http.post('deletewallet/', data).map((res)=>{
      return res.json();
    }).catch((error: any) => {
      return Observable.throw(new Error(error.status));
    });
  }

  deleteSite(id){
    return this.http.delete('addwebsite/'+ id).map((res)=>{
      return res.json();
    }).catch((error: any) => {
      return Observable.throw(new Error(error.status));
    });
  }
}