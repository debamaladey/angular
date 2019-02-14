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
export class CustomerService {

  constructor(private http: HttpClient,protected localStorage: LocalStorage) { }

  cust_type_lists(){
  	return this.http.get<any>(`${environment.apiUrl}/sacustomer/cust_type_list`).pipe(map(types => {
      
      // login successful if there's a jwt token in the response
      if (types && types.token) {

        const helper = new JwtHelperService();

        const decodedToken = helper.decodeToken(types.token);

        return decodedToken;

      }
      
    }));
  }

  state_lists(){
  	return this.http.get<any>(`${environment.apiUrl}/sacustomer/state_list`).pipe(map(states => {
      
      // login successful if there's a jwt token in the response
      if (states && states.token) {

        const helper = new JwtHelperService();

        const decodedToken = helper.decodeToken(states.token);

        return decodedToken;

      }
      
    }));
  }

  city_lists(stateId){
  	return this.http
      .post<any>(`${environment.apiUrl}/sacustomer/city_list`,{stateId:stateId})
      .pipe(map(res => {
    
        // login successful if there's a jwt token in the response
        if (res && res.token) {
  
          const helper = new JwtHelperService();
  
          const decodedToken3 = helper.decodeToken(res.token);
  
          return decodedToken3;
  
        }
        
    }));
  }

  create_user(createuser){

    var subject = "Signup Mail";
    var msg = "<html><body><div>Hi "+createuser.name+",<br> You have successfully signed up. <br>Your email id is "+createuser.email+"<br>Your password is "+createuser.password+"<br> Regards, Admin</div></body></html>";

  	return this.http.post<any>(`${environment.apiUrl}/sacustomer/createUser`,{name:createuser.name,email:createuser.email,password:createuser.password,mobile:createuser.mobile,userid:createuser.userid,customer_name:createuser.customer_name,cus_type:createuser.cus_type,state:createuser.state,city:createuser.city,address:createuser.address,latitude:createuser.latitude,longitude:createuser.longitude,customer_unique_id:createuser.customer_unique_id,id:0,subject:subject,msg:msg}).pipe(map(user => {
      // login successful if there's a jwt token in the response
      if (user && user.token) {
        
        const helper = new JwtHelperService();

        const decodedToken1 = helper.decodeToken(user.token);

        return decodedToken1;
      }
    }));
  }

  customer_lists(data){

    return this.http.post<any>(`${environment.apiUrl}/sacustomer/getAllUser`,data).pipe(map(response => {
			if (response && response.token) {
        return this.decodeData(response);
			}
		}));
  }

  decodeData(retData){
    const decodedToken2 = helper.decodeToken(retData.token);
    return decodedToken2;
  }

  deleteOneUser(id){
 
    return this.http
      .post<any>(`${environment.apiUrl}/sacustomer/deleteUser`,{id:id})
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
      .post<any>(`${environment.apiUrl}/sacustomer/viewUser`,{id:id})
      .pipe(map(res => {
    
        // login successful if there's a jwt token in the response
        if (res && res.token) {
  
          const helper = new JwtHelperService();
  
          const decodedToken3 = helper.decodeToken(res.token);
  
          return decodedToken3;
  
        }
        
      }));
  }

  update_user(updateuser,id){
  	return this.http.post<any>(`${environment.apiUrl}/sacustomer/updateUser`,{name:updateuser.name,email:updateuser.email,password:updateuser.password,mobile:updateuser.mobile,userid:updateuser.userid,customer_name:updateuser.customer_name,cus_type:updateuser.cus_type,state:updateuser.state,city:updateuser.city,address:updateuser.address,latitude:updateuser.latitude,longitude:updateuser.longitude,customer_user_id:updateuser.customer_user_id,id:id,customer_unique_id:updateuser.customer_unique_id}).pipe(map(user => {
      // login successful if there's a jwt token in the response
      if (user && user.token) {
        
        const helper = new JwtHelperService();

        const decodedToken4 = helper.decodeToken(user.token);

        return decodedToken4;
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
