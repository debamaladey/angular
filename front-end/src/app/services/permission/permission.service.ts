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
export class PermissionService {

  currentUser: any;
  user_id: any;

  constructor(private http: HttpClient,protected localStorage: LocalStorage) { }

  role_lists(){
  	return this.http.get<any>(`${environment.apiUrl}/permission/roles_list`).pipe(map(roles => {
      
      // login successful if there's a jwt token in the response
      if (roles && roles.token) {

        const helper = new JwtHelperService();

        const decodedToken = helper.decodeToken(roles.token);

        return decodedToken;

      }
      
    }));
  }

  module_lists(roleId){
  	return this.http.post<any>(`${environment.apiUrl}/permission/modules_list`,{roleId:roleId}).pipe(map(modules => {
      
      // login successful if there's a jwt token in the response
      if (modules && modules.token) {

        const helper = new JwtHelperService();

        const decodedToken = helper.decodeToken(modules.token);

        return decodedToken;

      }
      
    }));
  }

  role_module_array(){
  	return this.http.get<any>(`${environment.apiUrl}/permission/role_modules_list`).pipe(map(modules => {
      
      // login successful if there's a jwt token in the response
      if (modules && modules.token) {

        const helper = new JwtHelperService();

        const decodedToken = helper.decodeToken(modules.token);

        return decodedToken;

      }
      
    }));
  }

  role_module_permission(moduleId,roleId,val){
  	return this.http
      .post<any>(`${environment.apiUrl}/permission/permission_role_module`,{moduleId:moduleId,roleId:roleId,val:val})
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
