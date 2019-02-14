import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';

const helper = new JwtHelperService();

@Injectable({
  providedIn: 'root'
})
export class DataserviceService {
  currentUser: any;
  user_id: any;
  apiBaseUrl: any = `${environment.apiUrl}`;
  

  constructor(private http: HttpClient, protected localStorage : LocalStorage) { 
    
  }

  getTempListData(){
    var url = this.apiBaseUrl+'/tariff/template_list';
    return this.http.get<any>(url).pipe(map(
      retData => {
        if (retData && retData.token) {
          //console.log(this.decodeData(retData));
          return this.decodeData(retData);
        }
      }
    ));
  }

  

  savedTemplate(data){
    var url = this.apiBaseUrl+'/tariff/template_save';
    return this.http.post<any>(url, data).pipe(map(retData=>{
      if (retData && retData.token) {
        //console.log(this.decodeData(retData));
        return this.decodeData(retData);
      }
    }))
  }

  saveConfigData(data){
    var url = this.apiBaseUrl+'/tariff/template_config_save';
    return this.http.post<any>(url, data).pipe(map(retData=>{
      if (retData && retData.token) {
        //console.log(this.decodeData(retData));
        return this.decodeData(retData);
      }
    }))
  }

  deleteTemplate(id){
    var url = this.apiBaseUrl+'/tariff/template_delete/'+id;
    return this.http.get<any>(url).pipe(map(
      retData => {
        if(retData && retData.token){
          return this.decodeData(retData);
        }
      }
    ))
  }

  getTemplateData(tm_id){
    var url = this.apiBaseUrl+'/tariff/get_template_data/'+tm_id;
    return this.http.get<any>(url).pipe(map(
      retData => {
        if (retData && retData.token) {
          return this.decodeData(retData);
        }
      }
    ))
  }

  getTemplateDataView(tm_id){
    var url = this.apiBaseUrl+'/tariff/get_template_data_view/'+tm_id;
    return this.http.get<any>(url).pipe(map(
      retData => {
        if (retData && retData.token) {
          return this.decodeData(retData);
        }
      }
    ))
  }

  getTemplateConfigData(tm_id){
    var url = this.apiBaseUrl+'/tariff/get_template_config_data_view/'+tm_id;
    return this.http.get<any>(url).pipe(map(
      retData => {
        if (retData && retData.token) {
          return this.decodeData(retData);
        }
      }
    ))
  }

  datatable(data) { 
		var url = this.apiBaseUrl+'/tariff/sa_template_datatable/';
		return this.http.post<any>(url,data).pipe(map(response => {
			if (response && response.token) {
        return this.decodeData(response);
			}
		}));
	}

  decodeData(retData){
    const decodedToken2 = helper.decodeToken(retData.token);
    return decodedToken2;
  }


}
