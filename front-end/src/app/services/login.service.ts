import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Login } from '../models/login';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { environment } from '../../environments/environment';
 
const helper = new JwtHelperService();
 
@Injectable({
  providedIn: 'root'
})
export class LoginService {

  currentUser: any;
  user_id: any;
  loggedin: any;

  constructor(private http: HttpClient,protected localStorage: LocalStorage) { }

  login_user(loginuser:Login){
  	return this.http.post<any>(`${environment.apiUrl}/auth/login`,{email:loginuser.email,password:loginuser.password}).pipe(map(user => {
      
      // login successful if there's a jwt token in the response
      if (user && user.token) {
        
        localStorage.setItem('currentUser', user.token);

      }
      return user;
    }));
  }

  isLoggedIn() {
    this.loggedin = 0;
    var session_val = localStorage.getItem('currentUser');
    if(session_val){
      this.currentUser = this.getDecodedValue(session_val);
      // this.currentUser = JSON.parse(this.getDecodedValue(session_val));
      if (this.currentUser) {
        this.user_id = this.currentUser.id;
        this.loggedin = 1;
      }
    }		
    return this.loggedin;
  }
  
  logout() {
		// remove user from local storage to log user out
		localStorage.removeItem('currentUser');
		localStorage.clear();
  }
  
  getDecodedValue(sessionEncodedValue){

    const helper = new JwtHelperService();

    const decodedToken = helper.decodeToken(sessionEncodedValue);

    // Other functions

    //return JSON.stringify(decodedToken);
    return decodedToken;
  }

  encodeSession(sessionDecodedValue){

    return this.http.post<any>(`${environment.apiUrl}/auth/encodeUserSession`,{value:sessionDecodedValue}).pipe(map(data => {
      
      // login successful if there's a jwt token in the response
      if (data && data.token) {
        
        localStorage.setItem('currentUser', data.token);

      }

    }));
  }

  change_password(passwordDetails){
  	return this.http.post<any>(`${environment.apiUrl}/auth/update_password`,{password:passwordDetails.password,userid:passwordDetails.userid}).pipe(map(user => {
      
      // login successful if there's a jwt token in the response
      if (user && user.token) {
        
        const helper = new JwtHelperService();

        const decodedToken4 = helper.decodeToken(user.token);

        return decodedToken4;
      }

    }));
  }

  forgot_password(loginuser){
    
  	return this.http.post<any>(`${environment.apiUrl}/auth/forgot_password`,{email:loginuser.email}).pipe(map(user => {      
      // login successful if there's a jwt token in the response
      if (user && user.token) {
        
        const helper = new JwtHelperService();
  
        const decodedToken2 = helper.decodeToken(user.token);

        return decodedToken2;

      }
    }));
  }

  forgot_password_change(passwordDetails){
  	return this.http.post<any>(`${environment.apiUrl}/auth/change_forgot_password`,{password:passwordDetails.password,userid:passwordDetails.id}).pipe(map(user => {
      
      // login successful if there's a jwt token in the response
      if (user && user.token) {
        
        const helper = new JwtHelperService();

        const decodedToken4 = helper.decodeToken(user.token);

        return decodedToken4;
      }

    }));
  }
}
