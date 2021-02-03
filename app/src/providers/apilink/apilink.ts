import { Injectable } from '@angular/core';
import { BaseRequestOptions, RequestOptions, RequestOptionsArgs } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ApilinkProvider extends BaseRequestOptions {
constructor () {
    super();
    this.headers.append('Auth_Token','MyCustomHeaderValue');
  }
  merge(options?: RequestOptionsArgs): RequestOptions {
    return new CommonRequestOptions(super.merge(extracted(options)));
  }
}

/**
 * for inner merge when using post put patch delete...others method
 */
export class CommonRequestOptions extends RequestOptions {
  merge(options?: RequestOptionsArgs): RequestOptions {
    return new RequestOptions(super.merge(extracted(options)));
  }
}

/**
 * inject default values
 *
 * @param options
 * @returns {RequestOptionsArgs}
 */
export function extracted(options: RequestOptionsArgs) {
  if (!validUrl(options.url)) {
     var API_ENDPOINT = 'https://www.serrare.com';      
    // var API_ENDPOINT = 'http://54.89.30.156';
    var API_PORT = '3002';
    options.url = API_ENDPOINT +':'+API_PORT +'/'+ (options.url ? options.url : "");
    localStorage.setItem('APIURL',API_ENDPOINT +':'+API_PORT);
    localStorage.setItem('baseUrl',API_ENDPOINT);
  }
  

  return options;
}

/**
 * validate url
 *
 * @param url
 * @returns {boolean}
 */
export function validUrl(url: string) {
  return /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/.test(url);
}