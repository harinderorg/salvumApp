import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class GroupserviceProvider {

  constructor(public http: Http) {
  }

   	updateGroup(data){
		return this.http
		    .post('editgroup', data)
		      .map((data)=>{
		            return data.json();
		      }, error => {
		         return error.json();
		      });
	};

	addGroup(data){
		return this.http
		    .post('addGroup', data)
		      .map((data)=>{
		            return data.json();
		      }, error => {
		         return error.json();
		      });
	};

	getGroupData(data){
		return this.http
		    .get('getGroupData/'+data)
		      .map((data)=>{
		            return data.json();
		      }, error => {
		         return error.json();
		      });
	};
}