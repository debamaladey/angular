import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { environment } from '../../../environments/environment';
import { LoginService } from '../../services/login.service';

@Injectable({
  providedIn: 'root'
})
export class ClusterService {

  constructor(private http: HttpClient,protected localStorage: LocalStorage,private loginService: LoginService) { }

  lists(){

    return this.http.get<any>(`${environment.apiUrl}/cluster/lists`).pipe(map(lists => {
      // login successful if there's a jwt token in the response
      if (lists && lists.token) {
        
        const helper = new JwtHelperService();

        const decodedToken = helper.decodeToken(lists.token);

        return decodedToken;
      }
    }));
  }

  deleteOneCluster(id){ 
    return this.http
    .post<any>(`${environment.apiUrl}/cluster/delete`,{id:id})
    .pipe(map(res => {
  
      // login successful if there's a jwt token in the response
      if (res && res.token) {

        const helper = new JwtHelperService();

        const decodedToken3 = helper.decodeToken(res.token);

        return decodedToken3;

      }
      
    }));
  }

  customer_lists(){

    return this.http.get<any>(`${environment.apiUrl}/cluster/customer_lists`).pipe(map(lists => {
      // login successful if there's a jwt token in the response
      if (lists && lists.token) {
        
        const helper = new JwtHelperService();

        const decodedToken = helper.decodeToken(lists.token);

        return decodedToken;
      }
    }));
  }

  assign_customer_lists(id){ 
    return this.http
    .post<any>(`${environment.apiUrl}/cluster/assign_customers`,{id:id})
    .pipe(map(res => {
  
      // login successful if there's a jwt token in the response
      if (res && res.token) {

        const helper = new JwtHelperService();

        const decodedToken3 = helper.decodeToken(res.token);

        return decodedToken3;

      }
      
    }));
  }


  assign_customer(data){
  	return this.http.post<any>(`${environment.apiUrl}/cluster/assign_customer_by_sa`,{id:data.id,cluster_name:data.cluster_name,cluster_desc:data.cluster_desc,customer:data.customer}).pipe(map(user => {
      // login successful if there's a jwt token in the response
      if (user && user.token) {
        
        const helper = new JwtHelperService();

        const decodedToken1 = helper.decodeToken(user.token);

        return decodedToken1;
      }
    }));
  }

  deleteAssignUser(id,cid){
  	return this.http.post<any>(`${environment.apiUrl}/cluster/delete_assign_customer`,{rid:id,cid:cid}).pipe(map(user => {
      // login successful if there's a jwt token in the response
      if (user && user.token) {
        
        const helper = new JwtHelperService();

        const decodedToken1 = helper.decodeToken(user.token);

        return decodedToken1;
      }
    }));
  }

  editCluster(id){
 
    return this.http
      .post<any>(`${environment.apiUrl}/cluster/editCluster`,{id:id})
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
