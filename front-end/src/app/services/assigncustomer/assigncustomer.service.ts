import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { environment } from '../../../environments/environment';

const helper = new JwtHelperService();

@Injectable({
  providedIn: 'root'
})
export class AssigncustomerService {

  constructor(private http: HttpClient,protected localStorage: LocalStorage) { }

  customer_lists(id){
 
    return this.http
      .post<any>(`${environment.apiUrl}/account_manager/assign_customer`,{id:id})
      .pipe(map(res => {
    
        // login successful if there's a jwt token in the response
        if (res && res.token) {
  
          const helper = new JwtHelperService();
  
          const decodedToken = helper.decodeToken(res.token);
  
          return decodedToken;
  
        }
        
      }));
  }

}
