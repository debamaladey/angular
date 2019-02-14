import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginService } from '../login.service';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';

const helper = new JwtHelperService();

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  currentUser;
  userId;
  customerId;
  apiBaseUrl: any = `${environment.apiUrl}`;
  constructor(private http: HttpClient, private loginService: LoginService) { }

  getConsumptionResourceDropdown() {
    this.setSessionData();
    var url = this.apiBaseUrl + '/customer/dashboard/consumption_resource_dropdown';
    var postData = {
      customer_id: this.customerId
    }
    //console.log(postData);
    return this.http.post<any>(url, postData).pipe(map(
      retData => {
        if (retData && retData.token) {
          //console.log(this.decodeData(retData));
          return this.decodeData(retData);
        }
      }
    ));
    
  }

  getConsumptionResourceUnitDetails(meter_id) {
    this.setSessionData();
    var url = this.apiBaseUrl + '/customer/dashboard/consumption_resource_unit_details/'+meter_id;
    return this.http.get<any>(url).pipe(map(
      retData => {
        if (retData && retData.token) {
          return this.decodeData(retData);
        }
      }
    ));
    
  }

  getConsumptionTagData(tag_id, type){
    var postData = {
      tag_id : tag_id,
      type : type
    }
    var url = this.apiBaseUrl + '/customer/dashboard/consumption_tag_data_details/';
    return this.http.post<any>(url, postData).pipe(map(
      retData => {
        if (retData && retData.token) {
          return this.decodeData(retData);
        }
      }
    ));
  }

  getMajorConsumptionResourceUnitDetails(resource_id){
    this.setSessionData();
    var postData = {
      resource_id : resource_id,
      customer_id : this.customerId
    }
    var url = this.apiBaseUrl + '/customer/dashboard/major_consumption_resource_unit_details/';
    return this.http.post<any>(url, postData).pipe(map(
      retData => {
        if (retData && retData.token) {
          return this.decodeData(retData);
        }
      }
    ));
  }

  setSessionData() {
    this.currentUser = this.loginService.getDecodedValue(localStorage.getItem('currentUser'));
    this.userId = this.currentUser.id;
    this.customerId = this.currentUser.customer_id;
    //console.log(this.customerId);
  }

  decodeData(retData) {
    const decodedToken2 = helper.decodeToken(retData.token);
    return decodedToken2;
  }
}
