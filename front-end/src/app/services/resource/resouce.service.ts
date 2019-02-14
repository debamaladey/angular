import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResouceService {

  constructor(private http: HttpClient,protected localStorage: LocalStorage) { }

  resouce_lists(customerId){
  	return this.http
      .post<any>(`${environment.apiUrl}/resource/getAllList`,{customerId:customerId})
      .pipe(map(res => {
    
        // login successful if there's a jwt token in the response
        if (res && res.token) {
  
          const helper = new JwtHelperService();
  
          const decodedToken3 = helper.decodeToken(res.token);
  
          return decodedToken3;
  
        }
        
    }));
  }

  resouce_delete(resouceId){
  	return this.http
      .post<any>(`${environment.apiUrl}/resource/deleteResource`,{resouceId:resouceId})
      .pipe(map(res => {
    
        // login successful if there's a jwt token in the response
        if (res && res.token) {
  
          const helper = new JwtHelperService();
  
          const decodedToken3 = helper.decodeToken(res.token);
  
          return decodedToken3;
  
        }
        
    }));
  }

  resouce_update(resouceId,resourceName,parent_id,userId,customerId){
  	return this.http
      .post<any>(`${environment.apiUrl}/resource/add_edit_resource`,{resouceId:resouceId,resourceName:resourceName,parent_id:parent_id,userId:userId,customerId:customerId})
      .pipe(map(res => {
    
        // login successful if there's a jwt token in the response
        if (res && res.token) {
  
          const helper = new JwtHelperService();
  
          const decodedToken3 = helper.decodeToken(res.token);
  
          return decodedToken3;
  
        }
        
    }));
  }
}
