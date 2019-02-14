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
export class MeterService {
	

	constructor(private http: HttpClient) { }

	given_meter_id(customer) { 
		return this.http.get<any>(`${environment.apiUrl}/customer/get_meter_id/`+customer).pipe(map(response => {
			if (response && response.token) {
				return helper.decodeToken(response.token);
			}
		}));
	}

	create_meter(meter) { 
		// console.log(meter);
		return this.http.post<any>(`${environment.apiUrl}/customer/create_meter`,meter).pipe(map(response => {
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

	listMeter(customer) { 
		return this.http.get<any>(`${environment.apiUrl}/customer/list_meter/`+customer).pipe(map(response => {
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

	meter_list_by_resource(customer, resource, meter: any = '0', type: any = '0') {
		return this.http.get<any>(`${environment.apiUrl}/customer/meter_list_by_resource/`+customer+'/'+resource+'/'+meter+'/'+type).pipe(map(response => {
			if (response && response.token) {
				return helper.decodeToken(response.token);
			}
		}));
	}

	listTag(customer, meter: any = '0') { 
		return this.http.get<any>(`${environment.apiUrl}/customer/list_tag/`+customer+'/'+meter).pipe(map(response => {
			if (response && response.token) {
				return helper.decodeToken(response.token);
			}
		}));
	}

	update_meter_config(meter) { 
		// console.log(meter);
		return this.http.post<any>(`${environment.apiUrl}/customer/update_meter_config`,meter).pipe(map(response => {
			if (response && response.token) {
				return helper.decodeToken(response.token);
			}
		}));
	}

	meterConsumption(customer, parent, meter: any = '0') { 
		return this.http.get<any>(`${environment.apiUrl}/customer/consumption_meter_list/`+customer+'/'+parent+'/'+meter).pipe(map(response => {
			if (response && response.token) {
				return helper.decodeToken(response.token);
			}
		}));
	}
}
