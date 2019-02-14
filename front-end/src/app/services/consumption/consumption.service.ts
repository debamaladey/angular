import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConsumptionService {

  constructor(private http: HttpClient,protected localStorage: LocalStorage) { }

  consumption_lists(customerId){
  	return this.http
      .post<any>(`${environment.apiUrl}/consumption/getAllList`,{customerId:customerId})
      .pipe(map(res => {
    
        // login successful if there's a jwt token in the response
        if (res && res.token) {
  
          const helper = new JwtHelperService();
  
          const decodedToken3 = helper.decodeToken(res.token);
  
          return decodedToken3;
  
        }
        
    }));
  }

  consumption_delete(resouceId){
  	return this.http
      .post<any>(`${environment.apiUrl}/consumption/deleteConsumption`,{resouceId:resouceId})
      .pipe(map(res => {
    
        // login successful if there's a jwt token in the response
        if (res && res.token) {
  
          const helper = new JwtHelperService();
  
          const decodedToken3 = helper.decodeToken(res.token);
  
          return decodedToken3;
  
        }
        
    }));
  }

  consumption_update(resouceId,resourceName,parent_id,userId,customerId){
  	return this.http
      .post<any>(`${environment.apiUrl}/consumption/add_edit_consumption`,{resouceId:resouceId,resourceName:resourceName,parent_id:parent_id,userId:userId,customerId:customerId})
      .pipe(map(res => {
    
        // login successful if there's a jwt token in the response
        if (res && res.token) {
  
          const helper = new JwtHelperService();
  
          const decodedToken3 = helper.decodeToken(res.token);
  
          return decodedToken3;
  
        }
        
    }));
  }

  consumption_meter_lists(customerId){
  	return this.http
      .post<any>(`${environment.apiUrl}/consumption/getLists`,{customerId:customerId})
      .pipe(map(res => {
    
        // login successful if there's a jwt token in the response
        if (res && res.token) {
  
          const helper = new JwtHelperService();
  
          const decodedToken3 = helper.decodeToken(res.token);
  
          return decodedToken3;
  
        }
        
    }));
  }

  meter_lists(){
    
    return this.http.get<any>(`${environment.apiUrl}/consumption/getMeterLists`).pipe(map(res => {
    
        // login successful if there's a jwt token in the response
        if (res && res.token) {
  
          const helper = new JwtHelperService();
  
          const decodedToken3 = helper.decodeToken(res.token);
  
          return decodedToken3;
  
        }
        
    }));
  }

  assign_meter(meterId,resourceID){
  	return this.http
      .post<any>(`${environment.apiUrl}/consumption/assignMeter`,{meterId:meterId,resourceID:resourceID})
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
