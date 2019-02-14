import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { any } from 'prop-types';

@Injectable({
  providedIn: 'root'
})
export class TodService {
  currentUser: any;
  user_id: any;
  apiBaseUrl: any = `${environment.apiUrl}`;

  constructor(private http: HttpClient, protected localStorage : LocalStorage) { }

  list(){
    return this.http.get<any>(this.apiBaseUrl+`/tariff/tod_zone_deff_list`).pipe(map(retData =>{
      if (retData && retData.token) {
        const helper = new JwtHelperService();
        const decodedToken2 = helper.decodeToken(retData.token);
        return decodedToken2;
      }
    }))
  }

  saveTodZone(todItems : any){
    return this.http.post<any>(this.apiBaseUrl+`/tariff/tod_zone_deff_save`, todItems).pipe(map(retData =>{
      if (retData && retData.token) {
        const helper = new JwtHelperService();
        const decodedToken2 = helper.decodeToken(retData.token);
        return decodedToken2;
      }
    }))
  }
}
