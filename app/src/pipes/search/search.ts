import { Injectable, Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the SearchPipe pipe.
 *
 * See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
 * Angular Pipes.
 */
@Pipe({
  name: 'search',
  pure: true
})
@Injectable()
export class SearchPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  	transform(list: any[], searchTerm: string): any[] {
	    if (searchTerm) {
	        searchTerm = searchTerm.toUpperCase();
	        return list.filter(item => {
	          	return item[0].fullname.toUpperCase().indexOf(searchTerm) !== -1 
	        });
	    }else {
	        return list;
	    }
  	}
}
