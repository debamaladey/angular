import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BasicDetailsService {

  constructor(private http: HttpClient,protected localStorage: LocalStorage) { }

  add_customer(customer){
  	return this.http.post<any>(`${environment.apiUrl}/auth/login`,{email:customer.email,password:customer.password}).pipe(map(user => {
      
      // login successful if there's a jwt token in the response
      if (user && user.token) {
        const helper = new JwtHelperService();

        const decodedToken = helper.decodeToken(user.token);

        //console.log(decodedToken);

        // Other functions
        const expirationDate = helper.getTokenExpirationDate(user.token);
        const isExpired = helper.isTokenExpired(user.token);

        localStorage.setItem('currentUser', JSON.stringify(decodedToken));

      }
      return user;
    }));
  }
}
