import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { User } from '../models/user';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { environment } from '../../environments/environment';
import { LoginService } from '../services/login.service';

const helper = new JwtHelperService();

@Injectable({
  providedIn: 'root'
})

export class UserService {

  currentUser: any;
  user_id: any;
  role;

  constructor(private http: HttpClient,protected localStorage: LocalStorage,private loginService: LoginService) { }

  create_user(createuser){
    
    var subject = "Signup Mail";
    var msg = "<html><body><div>Hi "+createuser.name+",<br> You have successfully signed up. <br>Your email id is "+createuser.email+"<br>Your password is "+createuser.password+"<br> Regards, Admin</div></body></html>";

  	return this.http.post<any>(`${environment.apiUrl}/users/createUser`,{name:createuser.name,email:createuser.email,password:createuser.password,mobile:createuser.mobile,role:createuser.role,userid:createuser.userid,UserRoleType:createuser.user_role_type,customer_id:createuser.customer_id,subject:subject,msg:msg}).pipe(map(user => {
      // login successful if there's a jwt token in the response
      if (user && user.token) {
        
        const helper = new JwtHelperService();

        const decodedToken1 = helper.decodeToken(user.token);

        return decodedToken1;
      }
    }));
  }

  role_lists(customer_id){

    return this.http
      .post<any>(`${environment.apiUrl}/users/user_roles`,{customer_id:customer_id})
      .pipe(map(roles => {
    
        // login successful if there's a jwt token in the response
        if (roles && roles.token) {
  
          const helper = new JwtHelperService();
  
          const decodedToken = helper.decodeToken(roles.token);
  
          return decodedToken;
  
        }
        
    }));
  }

  user_lists(data,customer_id){
    return this.http
      .post<any>(`${environment.apiUrl}/users/getAllUser`,{data:data,customer_id:customer_id})
      .pipe(map(lists => {
    
        // login successful if there's a jwt token in the response
        if (lists && lists.token) {

          const helper = new JwtHelperService();
  
          const decodedToken2 = helper.decodeToken(lists.token);
  
          return decodedToken2;
  
        }
        
    }));
  }

  acc_manager_lists(){

    return this.http.get<any>(`${environment.apiUrl}/users/getAllAccManager`).pipe(map(lists => {
      
      // login successful if there's a jwt token in the response
      if (lists && lists.token) {

        const helper = new JwtHelperService();

        const decodedToken2 = helper.decodeToken(lists.token);

        return decodedToken2;

      }
      
    }));
  }

  deleteOneUser(id){
 
    return this.http
      .post<any>(`${environment.apiUrl}/users/deleteUser`,{id:id})
      .pipe(map(res => {
    
        // login successful if there's a jwt token in the response
        if (res && res.token) {
  
          const helper = new JwtHelperService();
  
          const decodedToken3 = helper.decodeToken(res.token);
  
          return decodedToken3;
  
        }
        
      }));
  }

  editOneUser(id){
 
    return this.http
      .post<any>(`${environment.apiUrl}/users/ViewUser`,{id:id})
      .pipe(map(res => {
    
        // login successful if there's a jwt token in the response
        if (res && res.token) {
  
          const helper = new JwtHelperService();
  
          const decodedToken3 = helper.decodeToken(res.token);
  
          return decodedToken3;
  
        }
        
      }));
  }

  update_user(updateuser:User,id){
  	return this.http.post<any>(`${environment.apiUrl}/users/updateUser`,{name:updateuser.name,mobile:updateuser.mobile,password:updateuser.password,role:updateuser.role,id:id}).pipe(map(user => {
      // login successful if there's a jwt token in the response
      if (user && user.token) {
        
        const helper = new JwtHelperService();

        const decodedToken4 = helper.decodeToken(user.token);

        return decodedToken4;
      }
    }));
  }

  getModuleList() {
		this.currentUser = this.loginService.getDecodedValue(localStorage.getItem('currentUser')); 
		if (this.currentUser) {
      this.role = this.currentUser.role_id;
      return this.http.post<any>(`${environment.apiUrl}/users/user_module`,{role:this.role}).pipe(map(roles => {
      
        // login successful if there's a jwt token in the response
        if (roles && roles.token) {
          const helper = new JwtHelperService();
  
          const decodedToken = helper.decodeToken(roles.token);
          // Other functions
          const expirationDate = helper.getTokenExpirationDate(roles.token);
          const isExpired = helper.isTokenExpired(roles.token);
          return decodedToken;
        }
        
      }));
    }
  }

  customer_lists(){

    return this.http.get<any>(`${environment.apiUrl}/users/customer_lists`).pipe(map(user => {
      // login successful if there's a jwt token in the response
      if (user && user.token) {
        
        const helper = new JwtHelperService();

        const decodedToken4 = helper.decodeToken(user.token);

        return decodedToken4;
      }
    }));
  }

  assign_customer_lists(id){
  	return this.http.post<any>(`${environment.apiUrl}/users/assigned_customers`,{am_id:id}).pipe(map(user => {
      // login successful if there's a jwt token in the response
      if (user && user.token) {
        
        const helper = new JwtHelperService();

        const decodedToken4 = helper.decodeToken(user.token);

        return decodedToken4;
      }
    }));
  }

  assign_customer(data){
  	return this.http.post<any>(`${environment.apiUrl}/users/assign_customer_by_acc_manager`,{am_id:data.am_id,acc_manager:data.acc_manager,customer:data.customer}).pipe(map(user => {
      // login successful if there's a jwt token in the response
      if (user && user.token) {
        
        const helper = new JwtHelperService();

        const decodedToken1 = helper.decodeToken(user.token);

        return decodedToken1;
      }
    }));
  }

  deleteAssignUser(id){
  	return this.http.post<any>(`${environment.apiUrl}/users/delete_assign_customer`,{rid:id}).pipe(map(user => {
      // login successful if there's a jwt token in the response
      if (user && user.token) {
        
        const helper = new JwtHelperService();

        const decodedToken1 = helper.decodeToken(user.token);

        return decodedToken1;
      }
    }));
  }

  ph_code(){

    return this.http
      .get<any>(`${environment.apiUrl}/common/phone_code`)
      .pipe(map(lists => {
    
        // login successful if there's a jwt token in the response
        if (lists && lists.token) {

          const helper = new JwtHelperService();
  
          const decodedToken2 = helper.decodeToken(lists.token);
  
          return decodedToken2;
  
        }
        
    }));
  }
  
}
