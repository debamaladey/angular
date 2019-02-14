import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
// import { LocalStorage } from '@ngx-pwa/local-storage';
import { environment } from '../../../environments/environment';

const helper = new JwtHelperService();

@Injectable({
	providedIn: 'root'
})
export class VirtualMeterService {

	constructor(private http: HttpClient) { }

	given_meter_id(customer) {
		return this.http.get<any>(`${environment.apiUrl}/customer/get_virtual_meter_id/` + customer).pipe(map(response => {
			if (response && response.token) {
				return helper.decodeToken(response.token);
			}
		}));
	}

	given_tag_id(customer) {
		return this.http.get<any>(`${environment.apiUrl}/customer/get_virtual_tag_id/` + customer).pipe(map(response => {
			if (response && response.token) {
				return helper.decodeToken(response.token);
			}
		}));
	}

	sourceMeterList(customer, type, resource_id, edit_id) {
		return this.http.get<any>(`${environment.apiUrl}/customer/source_meter_list/` + customer+'/'+type+'/'+resource_id+'/'+edit_id).pipe(map(response => {
			if (response && response.token) {
				return helper.decodeToken(response.token);
			}
		}));
	}

	create_meter(meter) { 
		// console.log(meter);
		return this.http.post<any>(`${environment.apiUrl}/customer/create_virtual_meter`,meter).pipe(map(response => {
			if (response && response.token) {
				return helper.decodeToken(response.token);
			}
		}));
	}

	listMeter(customer) { 
		return this.http.get<any>(`${environment.apiUrl}/customer/list_virtual_meter/`+customer).pipe(map(response => {
			if (response && response.token) {
				return helper.decodeToken(response.token);
			}
		}));
	}

	deleteMeter(id) { 
		return this.http.get<any>(`${environment.apiUrl}/customer/delete_meter/`+id).pipe(map(response => {
			if (response && response.token) {
				return helper.decodeToken(response.token);
			}
		}));
	}

	update_meter(meter) { 
		// console.log(meter);
		return this.http.post<any>(`${environment.apiUrl}/customer/update_meter`,meter).pipe(map(response => {
			if (response && response.token) {
				return helper.decodeToken(response.token);
			}
		}));
	}

	viewMeter(id) { 
		return this.http.get<any>(`${environment.apiUrl}/customer/view_meter/`+id).pipe(map(response => {
			if (response && response.token) {
				return helper.decodeToken(response.token);
			}
		}));
	}
}
