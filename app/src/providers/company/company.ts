import { Injectable } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/Rx'; 
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';
@Injectable() 
export class CompanyProvider {

  constructor(public http: Http) {}
  // get all companies
  getAllCompanies(userId){
	return this.http.get('companies/'+userId).map((res)=>{
	return res.json();
	}).catch((error: any) => {
	    return Observable.throw(new Error(error.status));
	});
 } 
 userCompaniesList(userId){ 
	return this.http.get('userCompaniesList/'+userId).map((res)=>{
	return res.json();
	}).catch((error: any) => {
	    return Observable.throw(new Error(error.status));
	});
 }

 userCompanyDetails(userId,companyId){ 
	return this.http.get('userCompanyDetails/'+userId+'/'+companyId).map((res)=>{
	return res.json();
	}).catch((error: any) => {
	    return Observable.throw(new Error(error.status));
	});
 }

 // get all jobs
  getAllJobs(userId){
	return this.http.get('jobs/'+userId).map((res)=>{
	return res.json();
	}).catch((error: any) => {
	    return Observable.throw(new Error(error.status));
	});
  }

  get_recipts(siteId){
	return this.http.get('site_recipts/'+siteId).map((res)=>{
	return res.json();
	}).catch((error: any) => {
	    return Observable.throw(new Error(error.status));
	});
  }

 myJobsList(userId,companyId){
	return this.http.get('myJobsList/'+userId+'/'+companyId).map((res)=>{
	return res.json();
	}).catch((error: any) => {
	    return Observable.throw(new Error(error.status));
	});
 }
  // get all bids
  getMyBids(jobId){
	return this.http.get('myBids/'+jobId).map((res)=>{
	return res.json();
	}).catch((error: any) => {
	    return Observable.throw(new Error(error.status));
	});
 } 
 // get all job coworkers
  jobCoworkers(jobId){
	return this.http.get('jobCoworkers/'+jobId).map((res)=>{
	return res.json();
	}).catch((error: any) => {
	    return Observable.throw(new Error(error.status));
	});
 } 
 // get user dashboard data
  getUserDashboardData(userId){
	return this.http.get('getUserDashboardData/'+userId).map((res)=>{
	return res.json();
	}).catch((error: any) => {
        return Observable.throw(new Error(error.status));
    });
 } 
 // get user comp data
  getCompanyDetails(jobId){
	return this.http.get('getCompanyDetails/'+jobId).map((res)=>{
	return res.json();
	}).catch((error: any) => {
	    return Observable.throw(new Error(error.status));
	});
 } 
  // get user dashboard data
  getUserCurrentSubscription(userId){
	return this.http.get('getUserCurrentSubscription/'+userId).map((res)=>{
	return res.json();
	}).catch((error: any) => {
	    return Observable.throw(new Error(error.status));
	});
 } 
 getDirectory(userId,type){
	return this.http.get('getDirectory/'+userId+'/'+type).map((res)=>{
	return res.json();
	}).catch((error: any) => {
	    return Observable.throw(new Error(error.status));
	});
 } 

 jobDetails(jobId){
	return this.http.get('jobDetails/'+jobId).map((res)=>{
	return res.json();
	}).catch((error: any) => {
	    return Observable.throw(new Error(error.status));
	});
 } 
 tradeDetails(tradeId){
	return this.http.get('tradeDetails/'+tradeId).map((res)=>{
	return res.json();
	}).catch((error: any) => {
	    return Observable.throw(new Error(error.status));
	});
 } 
 lastTradeDetails(jobId){
	return this.http.get('lastTradeDetails/'+jobId).map((res)=>{
	return res.json();
	}).catch((error: any) => {
	    return Observable.throw(new Error(error.status));
	});
 }
 CalendarDetails(eventId){
	return this.http.get('CalendarDetails/'+eventId).map((res)=>{
	return res.json();
	}).catch((error: any) => {
	    return Observable.throw(new Error(error.status));
	});
 }
 allTrades(jobId){
 	jobId = jobId == '' ? null : jobId;
	return this.http.get('trades/'+jobId).map((res)=>{
	return res.json();
	}).catch((error: any) => {
	    return Observable.throw(new Error(error.status));
	});
 }
 // delete company
 deleteCompany(companyId){
	return this.http.get('deleteCompany/'+companyId).map((res)=>{
	return res.json();
	}).catch((error: any) => {
	    return Observable.throw(new Error(error.status));
	});
 }
 // get Activated Licenses
 getActivatedLicenses(userId){
	return this.http.get('getActivatedLicenses/'+userId).map((res)=>{
	return res.json();
	}).catch((error: any) => {
	    return Observable.throw(new Error(error.status));
	});
 }
  // delete Rfis
 deleteRFIs(RfiId){
	return this.http.get('deleteRFIs/'+RfiId).map((res)=>{
	return res.json();
	}).catch((error: any) => {
	    return Observable.throw(new Error(error.status));
	});
 } 
   // delete Employees
 deleteEmployees(employeeId){
	return this.http.get('deleteEmployees/'+employeeId).map((res)=>{
	return res.json();
	}).catch((error: any) => {
	    return Observable.throw(new Error(error.status));
	});
 } 
   // delete adendum
 deleteAdendums(adendumId){
	return this.http.get('deleteAdendums/'+adendumId).map((res)=>{
	return res.json();
	}).catch((error: any) => {
	    return Observable.throw(new Error(error.status));
	});
 } 
 // delete calendar events
 deleteCalendarEvent(eventId){
	return this.http.get('deleteCalendarEvent/'+eventId).map((res)=>{
	return res.json();
	}).catch((error: any) => {
	    return Observable.throw(new Error(error.status));
	});
 } 
 // get shared folders
 getSharedData(userId){
	return this.http.get('getSharedData/'+userId).map((res)=>{
	return res.json();
	}).catch((error: any) => {
	    return Observable.throw(new Error(error.status));
	});
 }
  // get transmittal details
 getTransmittalDetails(tid){
	return this.http.get('getTransmittalDetails/'+tid).map((res)=>{
	return res.json();
	}).catch((error: any) => {
	    return Observable.throw(new Error(error.status));
	});
 } 
 // Calendar Events 
 getCalendarEvents(id,state){
	return this.http.get('getCalendarEvents/'+state+'/'+id).map((res)=>{
	return res.json();
	}).catch((error: any) => {
	    return Observable.throw(new Error(error.status));
	});
 }
  // trade invites
 tradeInvities(tradeId){
	return this.http.get('tradeInvities/'+tradeId).map((res)=>{
	return res.json();
	}).catch((error: any) => {
	    return Observable.throw(new Error(error.status));
	});
 }
 // applied bids
 getAppliedBids(tradeId,userId){
	return this.http.get('getAppliedBids/'+tradeId+'/'+userId).map((res)=>{
	return res.json();
	}).catch((error: any) => {
	    return Observable.throw(new Error(error.status));
	});
 }
  // get assoc employees
 getAllEmployees(companyId,userId){
	return this.http.get('associateEmployeesList/'+companyId+'/'+userId).map((res)=>{
	return res.json();
	}).catch((error: any) => {
	    return Observable.throw(new Error(error.status));
	});
 }
  // get all contacts
 getContactList(userId){
	return this.http.get('getContactList/'+userId).map((res)=>{
	return res.json();
	}).catch((error: any) => {
	    return Observable.throw(new Error(error.status));
	});
 }
   // get all external contacts
 getExternalContacts(userId){
	return this.http.get('getContacts/'+userId).map((res)=>{
	return res.json();
	}).catch((error: any) => {
	    return Observable.throw(new Error(error.status));
	});
 }
    // get all external contacts
 getUserGroups(userId){
	return this.http.get('getUserGroups/'+userId).map((res)=>{
	return res.json();
	}).catch((error: any) => {
	    return Observable.throw(new Error(error.status));
	});
 }
   // get all bid jobs
 fetchBidJobs(userId){
	return this.http.get('bidJobsList/'+userId).map((res)=>{
	return res.json();
	}).catch((error: any) => {
	    return Observable.throw(new Error(error.status));
	});
 }
   // get bid job details
 bidJobsDetail(Id){
	return this.http.get('bidJobsDetail/'+Id).map((res)=>{
	return res.json();
	}).catch((error: any) => {
	    return Observable.throw(new Error(error.status));
	});
 }
    // get RFI Email Details
 getRFIEmailDetail(Id){
	return this.http.get('getRFIEmailDetail/'+Id).map((res)=>{
	return res.json();
	}).catch((error: any) => {
	    return Observable.throw(new Error(error.status));
	});
 } 
 // get shared users data
 getSharedDataUsers(Id1,Id2){
	return this.http.get('getSharedDataUsers/'+Id1+'/'+Id2).map((res)=>{
	return res.json();
	}).catch((error: any) => {
	    return Observable.throw(new Error(error.status));
	});
 }
  // get job files
 getJobFiles(jobId,type,userId){
	return this.http.get('getJobFiles/'+jobId+'/'+type+'/'+userId).map((res)=>{
	return res.json();
	}).catch((error: any) => {
	    return Observable.throw(new Error(error.status));
	});
 }
   // get job files
 associateJobsList(userId,companyId){
	return this.http.get('associateJobsList/'+userId+'/'+companyId).map((res)=>{
	return res.json();
	}).catch((error: any) => {
	    return Observable.throw(new Error(error.status));
	});
 }
  // get shared noti
 getSharedNotifications(userId){
	return this.http.get('getSharedNotifications/'+userId).map((res)=>{
	return res.json();
	}).catch((error: any) => {
	    return Observable.throw(new Error(error.status));
	}); 
 }
   // get invitation noti
 notification(userId){
	return this.http.get('notification/'+userId).map((res)=>{
	return res.json();
	}).catch((error: any) => {
	    return Observable.throw(new Error(error.status));
	});
 }
   // get job Contacts 
 tradeContacts(jobId){
	return this.http.get('tradeContacts/'+jobId).map((res)=>{
	return res.json();
	}).catch((error: any) => {
	    return Observable.throw(new Error(error.status));
	});
 } 
    // get Contract details
 contractDetails(ContId){
	return this.http.get('contractDetails/'+ContId).map((res)=>{
	return res.json();
	}).catch((error: any) => {
	    return Observable.throw(new Error(error.status));
	});
 }
     // view Contract details
 viewContractDetails(BidId,userId,state = null){
	return this.http.get('viewContractDetails/'+BidId+'/'+userId+'/'+state).map((res)=>{
	return res.json();
	}).catch((error: any) => {
	    return Observable.throw(new Error(error.status));
	});
 } 
  // get My pre RFIs
 getMyPreRFIs(tradeId,userId,InviteId){
	return this.http.get('getMyPreRFIs/'+tradeId+'/'+userId+'/'+InviteId).map((res)=>{
	return res.json();
	}).catch((error: any) => {
	    return Observable.throw(new Error(error.status));
	});
 } 
 // get all users
 getAllUsers(){
	return this.http.get('allUsers').map((res)=>{
	return res.json();
	}).catch((error: any) => {
	    return Observable.throw(new Error(error.status));
	});
 } 
   // get My post RFIs
 getMyPostRFIs(tradeId,userId,InviteId){
	return this.http.get('getMyPostRFIs/'+tradeId+'/'+userId+'/'+InviteId).map((res)=>{
	return res.json();
	}).catch((error: any) => {
	    return Observable.throw(new Error(error.status));
	}); 
 } 
 // get job adendumss
 getAdendums(jobId){ 
	return this.http.get('getAdendums/'+jobId).map((res)=>{
	return res.json();
	}).catch((error: any) => {
	    return Observable.throw(new Error(error.status));
	}); 
 }
  // get job rfis
 getRFIs(jobId){ 
	return this.http.get('getRFIs/'+jobId).map((res)=>{
	return res.json();
	}).catch((error: any) => {
	    return Observable.throw(new Error(error.status));
	});
 }
  // get job Transmittals
 getTransmittals(jobId,userId){ 
	return this.http.get('getTransmittals/'+jobId+'/'+userId).map((res)=>{
	return res.json();
	}).catch((error: any) => {
	    return Observable.throw(new Error(error.status));
	}); 
 }
 // get rfi details
 getRFIDetails(RfiId){ 
	return this.http.get('getRFIDetails/'+RfiId).map((res)=>{
	return res.json();
	}).catch((error: any) => {
	    return Observable.throw(new Error(error.status));
	}); 
 }
  // get job contracts
 getContracts(jobId){ 
	return this.http.get('getContracts/'+jobId).map((res)=>{
	return res.json();
	}).catch((error: any) => {
	    return Observable.throw(new Error(error.status));
	});
 }
   // get job downloads
 getDownloads(jobId){ 
	return this.http.get('getDownloads/'+jobId).map((res)=>{
	return res.json();
	}).catch((error: any) => {
	    return Observable.throw(new Error(error.status));
	}); 
 } 
    // get My Transmittals
 getMyTransmittals(InviteId,userId,jobId,email,tradeId){ 
	return this.http.get('getMyTransmittals/'+InviteId+'/'+userId+'/'+jobId+'/'+email+'/'+tradeId).map((res)=>{
	return res.json();
	}).catch((error: any) => {
	    return Observable.throw(new Error(error.status));
	});
 }  
 // get trade bids
 getTradeFiles(tradeId){ 
	return this.http.get('getTradeFiles/'+tradeId).map((res)=>{
	return res.json();
	}).catch((error: any) => {
	    return Observable.throw(new Error(error.status));
	}); 
 } 
  // get job dashboard
 jobDashboard(jobId,userId){
	return this.http.get('jobDashboard/'+jobId+'/'+userId).map((res)=>{
	return res.json();
	}).catch((error: any) => {
	    return Observable.throw(new Error(error.status));
	});
 } 
  // get Transmittal Receiver
 getTransmittalReceiver(bidId){
 	console.log(bidId,'bidId')
 	bidId = bidId == '' ? null : bidId;
	return this.http.get('getTransmittalReceiver/'+bidId).map((res)=>{
	return res.json();
	}).catch((error: any) => {
	    return Observable.throw(new Error(error.status));
	}); 
 }
   // get Transmittal pdf
 downloadTransmittal(tid){
	return this.http.get('pdfTransmittal/'+tid).map((res)=>{
	return res.json();
	}).catch((error: any) => {
	    return Observable.throw(new Error(error.status));
	});
 }

  jobUsers(jobId){
	return this.http.get('jobUsers/'+jobId).map((res)=>{
	return res.json();
	}).catch((error: any) => {
	    return Observable.throw(new Error(error.status));
	});
 }

 getTempBids(bidJobId,userId){
	return this.http.get('getTempBids/'+bidJobId+'/'+userId).map((res)=>{
	return res.json();
	}).catch((error: any) => {
	    return Observable.throw(new Error(error.status));
	});
 }

 // get ion icons
 getIonIcons(baseUrl){ 
	return this.http.get(baseUrl+'/userpanel/assets/json/ionicons_data.json').map((res)=>{
	return res.json(); 
	}).catch((error: any) => {
	    return Observable.throw(new Error(error.status));
	});
 } 

  // get Trades List
 getTradesList(baseUrl){ 
 	// baseUrl+'/userpanel/assets/json/trades_list.json'
 	// http://localhost:8100/assets/json/trades_list.json
	return this.http.get(baseUrl+'/userpanel/assets/json/trades_list.json').map((res)=>{
	return res.json();  
	}).catch((error: any) => { 
	    return Observable.throw(new Error(error.status));
	});
 } 

   updateJobNotisEmail(data){
     return this.http.post('updateJobNotisEmail', data).map((res)=>{
       return res.json();
     }).catch((error: any) => {
       return Observable.throw(new Error(error.status));
     });
   } 

   removeBids(data){
     return this.http.post('removeBids', data).map((res)=>{
       return res.json();
     }).catch((error: any) => {
       return Observable.throw(new Error(error.status));
     });
   } 
 // add company
	 addCompany(userId,formdata) {
	  return this.http
	    .post('companies/'+userId, formdata)
	      .map((data)=>{
	            return data.json();
	      }, error => {
	         return error.json(); 
	      });
	}
	// add bid Notes
	 addBidNotes(formdata) {
	  return this.http
	    .post('addBidNotes', formdata)
	      .map((data)=>{
	            return data.json();
	      }, error => {
	         return error.json(); 
	      });
	}

	// add sec emails
	 addEmail(formdata) {
	  return this.http
	    .post('addEmail', formdata)
	      .map((data)=>{
	            return data.json();
	      }, error => {
	         return error.json();
	      });
	}

	// update Email Otp
	 updateEmailOtp(formdata) {
	  return this.http
	    .post('updateEmailOtp', formdata)
	      .map((data)=>{
	            return data.json();
	      }, error => {
	         return error.json();
	      });
	}

	// check emails otp
	 checkEmailOTP(formdata) {
	  return this.http
	    .post('checkEmailOTP', formdata)
	      .map((data)=>{
	            return data.json();
	      }, error => {
	         return error.json();
	      });
	}

	// add manual rfi
	 manualRFI(formdata) {
	  return this.http
	    .post('manualRFI', formdata)
	      .map((data)=>{
	            return data.json();
	      }, error => {
	         return error.json();
	      });
	}

	// submit Engg Reply
	 submitEnggReply(formdata) {
	  return this.http
	    .post('submitEnggReply', formdata)
	      .map((data)=>{
	            return data.json();
	      }, error => {
	         return error.json();
	      });
	}

	// add temp bids
	 addTempBids(formdata) {
	  return this.http
	    .post('addTempBids', formdata)
	      .map((data)=>{
	            return data.json();
	      }, error => {
	         return error.json();
	      });
	}

	// add rfi email
	 addRfiEmail(formdata) {
	  return this.http
	    .post('addRfiEmail', formdata)
	      .map((data)=>{
	            return data.json();
	      }, error => {
	         return error.json();
	      });
	}

	// save bid pdf to export loc
	 saveBidPdf(formdata) {
	  return this.http
	    .post('saveBidPdf', formdata)
	      .map((data)=>{
	            return data.json();
	      }, error => {
	         return error.json();
	      });
	}
	// get rfi email
	 getEmailRFIs(jobId,type) {
	  return this.http
	    .post('getEmailRFIs', {jobId : jobId, type : type})
	      .map((data)=>{
	            return data.json();
	      }, error => {
	         return error.json();
	      });
	}
	// update RFIs Engg
	 updateRFIsEngg(rfis) {
	  return this.http
	    .post('updateRFIsEngg', {rfis : rfis})
	      .map((data)=>{
	            return data.json();
	      }, error => {
	         return error.json();
	      });
	}

	// add Coworkers
	 addCoworkers(data) {
	  return this.http
	    .post('addCoworkers', data)
	      .map((data)=>{
	            return data.json();
	      }, error => {
	         return error.json();
	      });
	}

	// dir FileUpload Smail 
	 dirFileUploadSmail(userId,formdata) {
	  return this.http
	    .post('dirFileUploadSmail/'+userId, formdata)
	      .map((data)=>{
	            return data.json();
	      }, error => {
	         return error.json();
	      });
	}

 // add Associate Employees
	 addAssociateEmployees(formdata) {
	  return this.http
	    .post('addAssociateEmployees', formdata)
	      .map((data)=>{
	            return data.json();
	      }, error => {
	         return error.json();
	      });
	}
 //share Jobs
	 shareJobs(formdata) {
	  return this.http
	    .post('shareJobs', formdata)
	      .map((data)=>{
	            return data.json();
	      }, error => {
	         return error.json();
	      });
	}
	//save Employee Timing
	 saveEmployeeTiming(formdata) {
	  return this.http
	    .post('saveEmployeeTiming', formdata)
	      .map((data)=>{
	            return data.json();
	      }, error => {
	         return error.json();
	      });
	}
// delete Bids
	 deleteBids(data) {
 	// let data = new URLSearchParams();
 	// data.append('bidIds', ids);
	  return this.http
	    .post('deleteBids', data)
	      .map((data)=>{
	            return data.json();
	      }, error => {
	         return error.json();
	      });
	}
// delete rfi emails
	 deleteRfiEmails(data) {
	  return this.http
	    .post('deleteRfiEmails', data)
	      .map((data)=>{
	            return data.json();
	      }, error => {
	         return error.json();
	      });
	}
// delete jobs
	 deleteJobs(data) {
	  return this.http
	    .post('deleteJobs', data)
	      .map((data)=>{
	            return data.json();
	      }, error => {
	         return error.json();
	      });
	}
	// cancel Subscription
	 cancelSubscription(data) {
	  return this.http
	    .post('cancelSubscription', data)
	      .map((data)=>{
	            return data.json();
	      }, error => {
	         return error.json();
	      });
	}
	// delete trades
	 deleteTrades(data) {
	  return this.http
	    .post('deleteTrades', data)
	      .map((data)=>{
	            return data.json();
	      }, error => {
	         return error.json();
	      });
	}
	// switch User Company
	 switchUserCompany(data) {
	  return this.http
	    .post('switchUserCompany', data)
	      .map((data)=>{
	            return data.json();
	      }, error => {
	         return error.json();
	      });
	}
	// save pdf Transmittal
	pdfTransmittal(tid,content) {
 	let data = new URLSearchParams();
 	data.append('transmittalId', tid);
 	data.append('content', content);
	  return this.http
	    .post('pdfTransmittal/'+tid, data)
	      .map((data)=>{
	            return data.json();
	      }, error => {
	         return error.json();
	      });
	}
	// send Transmittal
	sendTransmittal(tid,sender_id,rec_id,user_name,baseUrl) {
 	let data = new URLSearchParams();
 	data.append('sender_id', sender_id);
 	data.append('rec_id', rec_id);
 	data.append('user_name', user_name);
 	data.append('baseUrl', baseUrl);
	  return this.http
	    .post('sendTransmittal/'+tid, data)
	      .map((data)=>{
	            return data.json();
	      }, error => {
	         return error.json();
	      });
	}
	// change Shared Privileges
	ChangeGroupStatus(fid,userId,from_user,status) {
 	let data = new URLSearchParams();
 	data.append('folderId', fid);
 	data.append('userId', userId);
 	data.append('from_user', from_user);
 	data.append('status', status);
	  return this.http
	    .post('ChangeGroupStatus', data)
	      .map((data)=>{
	            return data.json();
	      }, error => {
	         return error.json();
	      });
	}
	// change Shared Privileges
	changeSharedPrivileges(jobId,userId,priv) {
 	let data = new URLSearchParams();
 	data.append('jobId', jobId);
 	data.append('userId', userId);
 	data.append('priv', priv);
	  return this.http
	    .post('changeSharedPrivileges', data)
	      .map((data)=>{
	            return data.json();
	      }, error => {
	         return error.json();
	      });
	}
	// download Bid Attachments
	downloadBidAttachments(files) {
	  return this.http
	    .post('downloadBidAttachments', files)
	      .map((data)=>{
	            return data.json();
	      }, error => {
	         return error.json();
	      });
	}
	// zip Attachments
	makeZipAttachments(files,name) {
	  return this.http
	    .post('makeZipAttachments', {attachments: files, name: name})
	      .map((data)=>{
	            return data.json();
	      }, error => {
	         return error.json();
	      });
	}
	// delete jobs
	 openCloseJobs(data,status) {
	  return this.http
	    .post('openCloseJobs/'+status, data)
	      .map((data)=>{
	            return data.json();
	      }, error => {
	         return error.json();
	      });
	}
// job notis
	 jobNotifications(tradeId,formdata) {
	  return this.http
	    .post('jobNotifications/'+tradeId, formdata)
	      .map((data)=>{
	            return data.json();
	      }, error => {
	         return error.json();
	      });
	}
	// add downloads
	 addDownloads(formdata) {
	  return this.http
	    .post('addDownloads', formdata)
	      .map((data)=>{
	            return data.json();
	      }, error => {
	         return error.json();
	      });
	}
	// add bid files
	 addBidFiles(formdata) {
	  return this.http
	    .post('addBidFiles', formdata)
	      .map((data)=>{
	            return data.json();
	      }, error => {
	         return error.json();
	      });
	}
	// add share folders
	 shareFolders(formdata) {
	  return this.http
	    .post('addShareFolders', formdata)
	      .map((data)=>{
	            return data.json();
	      }, error => {
	         return error.json(); 
	      });
	}
	// add adendums
	 addAdendum(formdata) {
	  return this.http
	    .post('addAdendum', formdata)
	      .map((data)=>{
	            return data.json();
	      }, error => {
	         return error.json(); 
	      });
	}
	// check share folder accept
	 checkShareFolderAccept(userId1,userId2) {
	 	let data = new URLSearchParams();
	 	data.append('fromId', userId1);
	 	data.append('toId', userId2);
	  return this.http
	    .post('checkShareFolderAccept', data)
	      .map((data)=>{
	            return data.json();
	      }, error => {
	         return error.json(); 
	      });
	}
	// change privilege employee
	 changePrivilegeEmployee(employeeId,privilege) {
	 	let data = new URLSearchParams();
	 	data.append('employeeId', employeeId);
	 	data.append('privilege', privilege);
	  return this.http
	    .post('changePrivilegeEmployee', data)
	      .map((data)=>{
	            return data.json();
	      }, error => {
	         return error.json(); 
	      });
	}
	// change Status Employee
	 changeStatusEmployee(employeeId,status) {
	 	let data = new URLSearchParams();
	 	data.append('employeeId', employeeId);
	 	data.append('status', status);
	  return this.http
	    .post('changeStatusEmployee', data)
	      .map((data)=>{
	            return data.json();
	      }, error => {
	         return error.json(); 
	      });
	}
	// assign job another
	 assignJobAnother(toId,companyId,userId) {
	 	let data = new URLSearchParams();
	 	data.append('toId', toId);
	 	data.append('companyId', companyId);
	 	data.append('userId', userId);
	  return this.http
	    .post('assignJobAnother', data)
	      .map((data)=>{
	            return data.json();
	      }, error => {
	         return error.json(); 
	      });
	}
	// view User
	 viewUser(userId) {
	 	let data = new URLSearchParams();
	 	data.append('userId', userId);
	  return this.http
	    .post('viewUser', data)
	      .map((data)=>{
	            return data.json();
	      }, error => {
	         return error.json(); 
	      });
	}
	// add Transmittals
	 addTransmittal(subject,rec_id,tradeId,comments,userId,jobId,submittals,senders,description,sending_items,sender_sign,other_type) {
	 	let data = new URLSearchParams();
	 	data.append('subject', subject);
	 	data.append('rec_id', rec_id);
	 	data.append('tradeId', tradeId);
	 	data.append('comments', comments);
	 	data.append('sender_id', userId);
	 	data.append('jobId', jobId);
	 	data.append('description', description);
	 	data.append('submittals', submittals);
	 	data.append('sender_sign', sender_sign);
	 	data.append('other_type', other_type);
	 	data.append('sending_items', JSON.stringify(sending_items));
	 	data.append('senders', JSON.stringify(senders));
		  return this.http
		    .post('addTransmittal', data)
		      .map((data)=>{
		            return data.json();
		      }, error => {
		         return error.json(); 
		      });
	} 
	// edit Transmittals 
	 editTransmittal(subject,rec_id,tradeId,comments,submittals,tid,senders,desc,sending_items,userId,sender_sign,other_type,rec_sign='') {
	 	let data = new URLSearchParams();
	 	data.append('subject', subject);
	 	data.append('rec_id', rec_id);
	 	data.append('tradeId', tradeId);
	 	data.append('comments', comments);
	 	data.append('tid', tid);
	 	data.append('submittals', submittals);
	 	data.append('description', desc);
	 	data.append('userId', userId);
	 	data.append('sender_sign', sender_sign);
	 	data.append('rec_sign', rec_sign);
	 	data.append('other_type', other_type);
	 	data.append('sending_items', JSON.stringify(sending_items));
	 	data.append('senders', JSON.stringify(senders));
		  return this.http
		    .post('editTransmittal', data)
		      .map((data)=>{
		            return data.json();
		      }, error => {
		         return error.json(); 
		      });
	} 
	// set job as awarded or not
	 awardJob(InvId,bidId,status,jobId,tradeId,userId,toUser,to_email,to_name,user_name,baseUrl) {
	 	let data = new URLSearchParams();
	 	data.append('InvId', InvId);
	 	data.append('bidId', bidId);
	 	data.append('jobId', jobId);
	 	data.append('tradeId', tradeId);
	 	data.append('status', status);
	 	data.append('userId', userId);
	 	data.append('toId', toUser);
	 	data.append('to_email', to_email);
	 	data.append('to_name', to_name);
	 	data.append('user_name', user_name);
	 	data.append('baseUrl', baseUrl);
	  return this.http
	    .post('awardJob', data)
	      .map((data)=>{
	            return data.json();
	      }, error => {
	         return error.json(); 
	      });
	} 
	// add New Group Members
	 addNewGroupMembers(folderId,members,userId) {
	  return this.http
	    .post('addNewGroupMembers/'+folderId+'/'+userId, members)
	      .map((data)=>{
	            return data.json();
	      }, error => {
	         return error.json(); 
	      });
	} 
	// cancel Contract
	 cancelContract(InvId,bidId) {
	 	let data = new URLSearchParams();
	 	data.append('InvId', InvId);
	 	data.append('bidId', bidId);
	  return this.http
	    .post('cancelContract', data)
	      .map((data)=>{
	            return data.json();
	      }, error => {
	         return error.json(); 
	      });
	} 
	// drag drop folders
	 dragDropFolder(fromPath,toPath,shared_id) {
	 	let data = new URLSearchParams();
	 	data.append('old_path', fromPath);
	 	data.append('new_path', toPath);
	 	data.append('shared_id', shared_id);
		  return this.http
		    .post('dragDropFolder', data)
		      .map((data)=>{
		            return data.json();
		      }, error => {
		         return error.json(); 
		      });
	}

	// generate File image view
	 generateFile(file_path) {
	 	let data = new URLSearchParams();
	 	data.append('file_path', file_path);
	  return this.http
	    .post('generateFile', data)
	      .map((data)=>{
	            return data.json();
	      }, error => {
	         return error.json(); 
	      });
	} 
	// set notification status read
	 setReadNotification(notificationId,userId) {
	 	let data = new URLSearchParams();
	 	data.append('notificationId', notificationId);
	 	data.append('userId', userId);
	  return this.http
	    .post('setReadNotification', data)
	      .map((data)=>{
	            return data.json();
	      }, error => {
	         return error.json(); 
	      });
	} 
	// set notification status read
	 setReadFile(fileId,userId) {
	 	let data = new URLSearchParams();
	 	data.append('fileId', fileId);
	 	data.append('userId', userId);
	  return this.http
	    .post('setReadFile', data)
	      .map((data)=>{
	            return data.json();
	      }, error => {
	         return error.json(); 
	      });
	} 
	// exit folder
	 exitFolderGroup(folderId,userId) {
	 	let data = new URLSearchParams();
	 	data.append('folderId', folderId);
	 	data.append('userId', userId);
	  return this.http
	    .post('exitFolderGroup', data)
	      .map((data)=>{
	            return data.json();
	      }, error => {
	         return error.json(); 
	      });
	} 
	// check share folder accept
	 ChangeSharingStatus(fromId,toId,status,level,from_user) {
	 	let data = new URLSearchParams();
	 	data.append('fromId', fromId);
	 	data.append('toId', toId);
	 	data.append('status', status);
	 	data.append('level', level);
	 	data.append('from_user', from_user); 
	  return this.http
	    .post('ChangeSharingStatus', data)
	      .map((data)=>{
	            return data.json();
	      }, error => {
	         return error.json(); 
	      });
	} 
	// submit Bids 
	submitBids(jobId,tradeId,userId,bid_status,bid_comments,files,bidId,first_name,last_name,company_name,email,isMail,bid_breakdown) {
		let data = new URLSearchParams();
	 	data.append('jobId', jobId);
	 	data.append('tradeId', tradeId);
	 	data.append('userId', userId);
	 	data.append('bid_status', bid_status);
	 	data.append('bid_comments', bid_comments);
	 	data.append('files', files);
	 	data.append('bidId', bidId);
	 	data.append('first_name', first_name);
	 	data.append('last_name', last_name);
	 	data.append('company_name', company_name);
	 	data.append('email', email);
	 	data.append('isMail', isMail);
	 	data.append('bid_breakdown', JSON.stringify(bid_breakdown));
		  return this.http
		    .post('submitBids', data)
		      .map((data)=>{
		            return data.json();
		      }, error => {
		         return error.json();
		      });
		}
	// submit RFIs 
	submitRFIs(data) {
		  return this.http
		    .post('addRFI', data)
		      .map((data)=>{
		            return data.json();
		      }, error => {
		         return error.json();
		      });
		}
	// reply RFIs 
	replyRFI(data) {
		  return this.http
		    .post('replyRFI', data)
		      .map((data)=>{
		            return data.json();
		      }, error => {
		         return error.json();
		      });
		}

	// get dir files
	getDirectoryFiles(file_path) {
		let data = new URLSearchParams();
	 	data.append('file_path', file_path);
		  return this.http
		    .post('getDirectoryFiles', data)
		      .map((data)=>{
		            return data.json();
		      }, error => {
		         return error.json();
		      });
		} 
		// delete dir files 
	deleteDirectoryFiles(file_path,fid = null,isShared = null,userId = null,toId = null,toLevel = null,from_user = null,show_add_folder = null,clicked_fid = null,isRoot = null) {
		let data = new URLSearchParams();
	 	data.append('file_path', file_path);
	 	data.append('fid', fid);
	 	data.append('isShared', isShared); 
	 	data.append('userId', userId);
	 	data.append('toId', toId);
	 	data.append('toLevel', toLevel);
	 	data.append('from_user', from_user);
	 	data.append('show_add_folder', show_add_folder);
	 	data.append('clicked_fid', clicked_fid);
	 	data.append('isRoot', isRoot);
		  return this.http
		    .post('deleteDirectoryFiles', data)
		      .map((data)=>{
		            return data.json();
		      }, error => {
		         return error.json();
		      });
		} 
	// delete dir folders 
	deleteDirectoryFolders(file_path,fid = null,isShared = null,userId = null,toId = null,toLevel = null,from_user = null,show_add_folder = null,clicked_fid = null,isRoot = null) {
		let data = new URLSearchParams();
	 	data.append('file_path', file_path);
	 	data.append('fid', fid);
	 	data.append('isShared', isShared);
	 	data.append('userId', userId);
	 	data.append('toId', toId);
	 	data.append('toLevel', toLevel);
	 	data.append('from_user', from_user);
	 	data.append('show_add_folder', show_add_folder);
	 	data.append('clicked_fid', clicked_fid);
	 	data.append('isRoot', isRoot);
		  return this.http
		    .post('deleteDirectoryFolders', data)
		      .map((data)=>{
		            return data.json();
		      }, error => {
		         return error.json();
		      });
		} 
		// add dir folders 
	addDirectoryFolders(file_path,folder_name,userId = null,isShared = null,onLevel = null,toId = null,toLevel = null,from_user = null,show_add_folder = null,clicked_fid = null) {
		let data = new URLSearchParams();
	 	data.append('file_path', file_path);
	 	data.append('folder_name', folder_name);
	 	data.append('userId', userId);
	 	data.append('isShared', isShared);
	 	data.append('onLevel', onLevel);
	 	data.append('toId', toId);
	 	data.append('toLevel', toLevel);
	 	data.append('from_user', from_user);
	 	data.append('show_add_folder', show_add_folder);
	 	data.append('clicked_fid', clicked_fid);
		  return this.http
		    .post('addDirectoryFolders', data)
		      .map((data)=>{
		            return data.json();
		      }, error => {
		         return error.json();
		      });
		}
	// rename dir folders 
	renameDirectoryFolder(old_path,new_path,fid,isShared = null,userId = null,toId = null,toLevel = null,from_user = null,show_add_folder = null,clicked_fid = null) {
		let data = new URLSearchParams();
	 	data.append('old_path', old_path);
	 	data.append('new_path', new_path);
	 	data.append('fid', fid);
	 	data.append('isShared', isShared);
	 	data.append('userId', userId);
	 	data.append('toId', toId);
	 	data.append('toLevel', toLevel);
	 	data.append('from_user', from_user);
	 	data.append('show_add_folder', show_add_folder);
	 	data.append('clicked_fid', clicked_fid);
		  return this.http
		    .post('renameDirectoryFolder', data)
		      .map((data)=>{
		            return data.json();
		      }, error => {
		         return error.json();
		      });
		} 
	// rename dir folders 
	renameJobFolder(old_path,new_path,userId) {
		let data = new URLSearchParams();
	 	data.append('old_path', old_path);
	 	data.append('new_path', new_path);
	 	data.append('userId', userId);
		  return this.http
		    .post('renameJobFolder', data)
		      .map((data)=>{
		            return data.json();
		      }, error => {
		         return error.json();
		      });
		} 
		// download Folders
	downloadFolders(folder_path) {
		let data = new URLSearchParams();
	 	data.append('folder_path', folder_path);
		  return this.http
		    .post('downloadFolders', data)
		      .map((data)=>{
		            return data.json();
		      }, error => {
		         return error.json();
		      });
		} 
	// add license key
	addLicenseKey(licenseKey,userId) {
		let data = new URLSearchParams();
	 	data.append('licenseKey', licenseKey);
	 	data.append('userId', userId);
		  return this.http
		    .post('addLicenseKey', data)
		      .map((data)=>{
		            return data.json();
		      }, error => {
		         return error.json();
		      });
		} 
	// edit calendar event
	 editCalendarEvent(event_id,formdata) {
	  return this.http
	    .post('editCalendarEvent/'+event_id, formdata)
	      .map((data)=>{
	            return data.json();
	      }, error => {
	         return error.json();
	      });
	}
	// edit adendum
	 editAdendum(adendumId,formdata) {
	  return this.http
	    .post('editAdendum/'+adendumId, formdata)
	      .map((data)=>{
	            return data.json();
	      }, error => {
	         return error.json();
	      });
	}
	// reorder RFIs
	 reorderRFIs(formdata) {
	  return this.http
	    .post('reorderRFIs', formdata)
	      .map((data)=>{
	            return data.json();
	      }, error => {
	         return error.json();
	      });
	}
	// add calendar events
	 calendarEvents(jobId, tradeId, formdata) { 
	  return this.http
	    .post('calendarEvents/'+jobId+'/'+tradeId, formdata)
	      .map((data)=>{
	            return data.json();
	      }, error => {
	         return error.json();
	      });
	}
	// add contract
	 addContract(InvId, BidId, jobId, tradeId, formdata) { 
	  return this.http
	    .post('addContract/'+InvId+'/'+BidId+'/'+jobId+'/'+tradeId, formdata)
	      .map((data)=>{
	            return data.json();
	      }, error => {
	         return error.json();
	      });
	}
	// edit contract
	 editContract(ContId, formdata) { 
	  return this.http
	    .post('editContract/'+ContId, formdata)
	      .map((data)=>{
	            return data.json();
	      }, error => {
	         return error.json();
	      });
	}
	// edit calendar events
	 updateCalendarEvent(jobId, tradeId, formdata) { 
	  return this.http
	    .post('updateCalendarEvent/'+jobId+'/'+tradeId, formdata)
	      .map((data)=>{
	            return data.json();
	      }, error => {
	         return error.json();
	      });
	}
	// edit trade
	 editTrade(jobId, tradeId, isPosted, formdata) { 
	  return this.http
	    .post('editTrade/'+jobId+'/'+tradeId+'/'+isPosted, formdata)
	      .map((data)=>{
	            return data.json();
	      }, error => {
	         return error.json();
	      });
	}
	// add trade files
	 addTradeFiles(jobId, tradeId, formdata, type) { 
	  return this.http
	    .post('addTradeFiles/'+jobId+'/'+tradeId+'/'+type, formdata)
	      .map((data)=>{
	            return data.json();
	      }, error => {
	         return error.json();
	      });
	}
	// add bid invitees
	 addInviteBidders(jobId, tradeId, formdata) { 
	  return this.http
	    .post('addInviteBidders/'+jobId+'/'+tradeId, formdata)
	      .map((data)=>{
	            return data.json();
	      }, error => {
	         return error.json();
	      });
	}
	// post request
	 postData(endpoint,params) { 
	  return this.http
	    .post(endpoint, params)
	      .map((data)=>{
	            return data.json();
	      }, error => {
	         return error.json();
	      });
	} 

	// add bid invitees contacts
	 addInviteBidders_contacts(formdata) { 
	  return this.http
	    .post('addInviteBidders_contacts', formdata)
	      .map((data)=>{
	            return data.json();
	      }, error => {
	         return error.json();
	      });
	}
	// edit bid invitees
	 editInviteBidders(jobId, tradeId, formdata) { 
	  return this.http
	    .post('editInviteBidders/'+jobId+'/'+tradeId, formdata)
	      .map((data)=>{
	            return data.json();
	      }, error => {
	         return error.json();
	      });
	}
	// add job files folder 
	 addFoldersFiles(jobId, tradeId, formdata) { 
	  return this.http
	    .post('addFoldersFiles/'+jobId+'/'+tradeId, formdata)
	      .map((data)=>{
	            return data.json();
	      }, error => {
	         return error.json();
	      });
	}
	// add bid invitees
	 addInviteBiddersManually(jobId, tradeId, formdata) { 
	  return this.http
	    .post('addInviteBiddersManually/'+jobId+'/'+tradeId, formdata)
	      .map((data)=>{
	            return data.json();
	      }, error => {
	         return error.json();
	      });
	}
	// add calendar events
	 addSingleCalendarEvent(jobId, tradeId, formdata) { 
	  return this.http
	    .post('addSingleCalendarEvent/'+jobId+'/'+tradeId, formdata)
	      .map((data)=>{
	            return data.json();
	      }, error => {
	         return error.json();
	      });
	}
	// add job
	 addJob(userId,formdata) {
	  return this.http
	    .post('jobs/'+userId, formdata)
	      .map((data)=>{
	            return data.json();
	      }, error => {
	         return error.json();
	      });
	}
	// edit job
	 editJob(jobId,formdata) { 
	  return this.http
	    .post('editJob/'+jobId, formdata)
	      .map((data)=>{
	            return data.json();
	      }, error => {
	         return error.json();
	      });
	}
	// add trade
	 addTrade(jobId,formdata) { 
	  return this.http
	    .post('trades/'+jobId, formdata)
	      .map((data)=>{
	            return data.json();
	      }, error => {
	         return error.json();
	      });
	}
	// edit company
	 editCompany(formdata) {
	  return this.http
	    .post('editCompany', formdata)
	      .map((data)=>{
	            return data.json();
	      }, error => {
	         return error.json();
	      });
	} 
	// update Folder
	 updateFolder(formdata) {
	  return this.http
	    .post('updateFolder', formdata)
	      .map((data)=>{
	            return data.json();
	      }, error => {
	         return error.json();
	      });
	} 

  getFolders(userId){
 	return this.http.get('folder/'+ userId).map((res)=>{
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

  createFolder(userId, formdata){
 	return this.http.post('folder/'+userId, formdata).map((data)=>{
	        return data.json();
	    }, error => {
	        return error.json();
	    });
 }
  deleteFolder(folderId){
 	return this.http.post('deletefolder',folderId).map((data)=>{
	        return data.json();
	    }, error => {
	        return error.json();
	    });
 } 

 deleteBidders(contactId){
 	let data = new URLSearchParams();
	 	data.append('contactId', contactId);
 	return this.http.post('deleteBidders',data).map((data)=>{
	        return data.json();
	    }, error => {
	        return error.json();
	    });
 }

 deleteCoworkers(jobId,userId,unique_id){
 	let data = new URLSearchParams();
	 	data.append('jobId', jobId);
	 	data.append('userId', userId);
	 	data.append('unique_id', unique_id);
 	return this.http.post('deleteCoworkers',data).map((data)=>{
	        return data.json();
	    }, error => {
	        return error.json();
	    });
 } 

 editCoworkers(data){
 	return this.http.post('editCoworkers',data).map((data)=>{
	        return data.json();
	    }, error => {
	        return error.json();
	    });
 }

 updateBidStatus(bidId,bid_status){
 	let data = new URLSearchParams();
	 	data.append('bidId', bidId);
	 	data.append('bid_status', bid_status);
 	return this.http.post('updateBidStatus',data).map((data)=>{
	        return data.json();
	    }, error => {
	        return error.json();
	    });
 } 

 replyComment(bidId,bid_comment,posted_email,name,Iid,baseUrl){
 	let data = new URLSearchParams();
	 	data.append('bidId', bidId);
	 	data.append('bid_comment', bid_comment);
	 	data.append('email', posted_email);
	 	data.append('name', name);
	 	data.append('Iid', Iid);
	 	data.append('baseUrl', baseUrl);
 	return this.http.post('replyComment',data).map((data)=>{
	        return data.json();
	    }, error => {
	        return error.json();
	    });
 } 
 
 deleteTradeFiles(fileId){
 	let data = new URLSearchParams();
	 	data.append('fileId', fileId);
 	return this.http.post('deleteTradeFiles',data).map((data)=>{
	        return data.json();
	    }, error => {
	        return error.json();
	    });
 }
  renameFolder(folder_name){
 	return this.http
    .post('renamefolder/' + folder_name.userId, folder_name).map((data)=>{
        return data.json();
    }, error => {
        return error.json();
    });
 }
 getYahooContacts(){
 	return this.http
    .post('getYahooContacts','').map((data)=>{
        return data.json();
    }, error => {
        return error.json();
    });
 }
}
