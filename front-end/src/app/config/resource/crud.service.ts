import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class CrudService {

  currentUser: any;
  user_id: any;
  apiBaseUrl: any = `${environment.apiUrl}`;

  constructor(private http: HttpClient,protected localStorage: LocalStorage) { }

  list(){
    return this.http.get<any>(this.apiBaseUrl+`/resource/list`).pipe(map(lists => {
      if (lists && lists.token) {
        const helper = new JwtHelperService();
        const decodedToken2 = helper.decodeToken(lists.token);
        return decodedToken2;
      }
    }))
  }

  deletedList(){
    return this.http.get<any>(this.apiBaseUrl+`/resource/deleted_list`).pipe(map(lists => {
      if (lists && lists.token) {
        const helper = new JwtHelperService();
        const decodedToken2 = helper.decodeToken(lists.token);
        return decodedToken2;
      }
    }))
  }

  add(resourceData:any){
  	return this.http.post<any>(this.apiBaseUrl+`/resource/add`,resourceData).pipe(map(data => {
      if (data && data.token) {
        const helper = new JwtHelperService();
        const decodedToken1 = helper.decodeToken(data.token);
        return decodedToken1;
      }
    }));
  }

  update(resourceData:any, id : number){
  	return this.http.post<any>(this.apiBaseUrl+`/resource/update/`+id,resourceData).pipe(map(data => {
      if (data && data.token) {
        const helper = new JwtHelperService();
        const decodedToken1 = helper.decodeToken(data.token);
        return decodedToken1;
      }
    }));
  }

  getOne(id : number){
  	return this.http.get<any>(this.apiBaseUrl+`/resource/view/`+id).pipe(map(data => {
      if (data && data.token) {
        const helper = new JwtHelperService();
        const decodedToken1 = helper.decodeToken(data.token);
        return decodedToken1;
      }
    }));
  }

  delete(id : number, userId : number){
  	return this.http.get<any>(this.apiBaseUrl+`/resource/delete/`+id+`/`+userId).pipe(map(data => {
      if (data && data.token) {
        const helper = new JwtHelperService();
        const decodedToken1 = helper.decodeToken(data.token);
        return decodedToken1;
      }
    }));
  }

  unDelete(id : number, data: any){
  	return this.http.post<any>(this.apiBaseUrl+`/resource/un_delete/`+id, data).pipe(map(data => {
      if (data && data.token) {
        const helper = new JwtHelperService();
        const decodedToken1 = helper.decodeToken(data.token);
        return decodedToken1;
      }
    }));
  }

  checkUniqueName(id: number=0, name: any){
    var obj = {
      resource_name: name
    }
    return this.http.post<any>(this.apiBaseUrl+`/resource/checkUniqueName/`+id, obj).pipe(map(data => {
      if (data && data.token) {
        const helper = new JwtHelperService();
        const decodedToken1 = helper.decodeToken(data.token);
        return decodedToken1;
      }
    }));
  }

  unitList(id: number = 0){
    return this.http.get<any>(this.apiBaseUrl+`/resource/unit/list/`+id).pipe(map(lists => {
      if (lists && lists.token) {
        const helper = new JwtHelperService();
        const decodedToken2 = helper.decodeToken(lists.token);
        return decodedToken2;
      }
    }))
  }

  unitDelete(id : number){
  	return this.http.get<any>(this.apiBaseUrl+`/resource/unit/delete/`+id).pipe(map(data => {
      if (data && data.token) {
        const helper = new JwtHelperService();
        const decodedToken1 = helper.decodeToken(data.token);
        return decodedToken1;
      }
    }));
  }

  unitAdd(resourceData:any){
  	return this.http.post<any>(this.apiBaseUrl+`/resource/unit/add`,resourceData).pipe(map(data => {
      if (data && data.token) {
        const helper = new JwtHelperService();
        const decodedToken1 = helper.decodeToken(data.token);
        return decodedToken1;
      }
    }));
  }

  unitUpdate(resourceData:any, id : number){
  	return this.http.post<any>(this.apiBaseUrl+`/resource/unit/update/`+id,resourceData).pipe(map(data => {
      if (data && data.token) {
        const helper = new JwtHelperService();
        const decodedToken1 = helper.decodeToken(data.token);
        return decodedToken1;
      }
    }));
  }

  unitGetOne(id : number){
  	return this.http.get<any>(this.apiBaseUrl+`/resource/unit/view/`+id).pipe(map(data => {
      if (data && data.token) {
        const helper = new JwtHelperService();
        const decodedToken1 = helper.decodeToken(data.token);
        return decodedToken1;
      }
    }));
  }


}


