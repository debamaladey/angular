import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
// import { LocalStorage } from '@ngx-pwa/local-storage';
import { environment } from '../../environments/environment';
import { Validators, FormControl } from '@angular/forms';

const helper = new JwtHelperService();

@Injectable({
	providedIn: 'root'
})
export class CommonService {
	tablesArr: Array<{ id: string, val: string, status: string, tariff_rule_url: string }>;
	constructor(private http: HttpClient) {
		this.tablesArr = [];
	}

	resource_list(customer, parent) {
		return this.http.get<any>(`${environment.apiUrl}/common/resource_list/` + customer + '/' + parent).pipe(map(response => {
			if (response && response.token) {
				return helper.decodeToken(response.token);
			}
		}));
	}

	resource_parameters(resource) {
		return this.http.get<any>(`${environment.apiUrl}/common/resource_parameters/` + resource).pipe(map(response => {
			if (response && response.token) {
				return helper.decodeToken(response.token);
			}
		}));
	}

	resource_units(parameter) {
		return this.http.get<any>(`${environment.apiUrl}/common/resource_units/` + parameter).pipe(map(response => {
			if (response && response.token) {
				return helper.decodeToken(response.token);
			}
		}));
	}

	state_list() {
		return this.http.get<any>(`${environment.apiUrl}/common/state_list/`).pipe(map(response => {
			if (response && response.token) {
				return helper.decodeToken(response.token);
			}
		}));
	}

	city_list(state_id) {
		return this.http.get<any>(`${environment.apiUrl}/common/city_list/` + state_id).pipe(map(response => {
			if (response && response.token) {
				return helper.decodeToken(response.token);
			}
		}));
	}

	tariff_table_list() {
		return this.http.get<any>(`${environment.apiUrl}/common/tariff_table_list/`).pipe(map(response => {
			if (response && response.token) {
				return helper.decodeToken(response.token);
			}
		}));
	}

	getTemplateChargesArr() {
		this.tablesArr = [
			{ "id": "res_chrages", "val": "Resource Charges", "status": "no", "tariff_rule_url": "resource-charges" },
			{ "id": "env_chrages", "val": "Environmental Charges", "status": "no", "tariff_rule_url": "environmental-charges" },
			{ "id": "fixed_chrages", "val": "Fixed Charges", "status": "no", "tariff_rule_url": "fixed-charges" },
			{ "id": "load_chrages", "val": "Load Details Charges", "status": "no", "tariff_rule_url": "load-details" },
			{ "id": "contract_chrages", "val": "Contract Demand Charges", "status": "no", "tariff_rule_url": "contract-demand" }
		];
		return this.tablesArr;
	}

	consumption_list(customer, parent) {
		return this.http.get<any>(`${environment.apiUrl}/common/consumption_list/` + customer + '/' + parent).pipe(map(response => {

			if (response && response.token) {
				return helper.decodeToken(response.token);
			}
		}));
	}

	getEmailDetails() {
		return this.http.get<any>(`${environment.apiUrl}/common/get_email_details/`).pipe(map(response => {
			if (response && response.token) {
				return helper.decodeToken(response.token);
			}
		}));

	}

	add(table_name: String, data: any) {
		var postData = {
			table_name: table_name,
			inData: data
		}
		return this.http.post<any>(`${environment.apiUrl}/common/add/`, postData).pipe(map(response => {
			if (response && response.token) {
				return helper.decodeToken(response.token);
			}
		}));
	}
}



// create your class that extends the angular validator class
export class CustomValidators extends Validators {

	// create a static method for your validation
	static amount(control: FormControl) {

		// first check if the control has a value
		if (control.value && control.value.length > 0) {

			// setup simple regex for white listed characters
			const floatRegx = /^([0-9]*[.])?[0-9]*$/;
			// match the control value against the regular expression
			const matches = control.value.match(floatRegx);

			// if there are matches return an object, else return null.
			return matches && matches.length ? null : { invalid: true };
		} else {
			return null;
		}
	}

	// create a static method for your validation
	static numeric(control: FormControl) {

		// first check if the control has a value
		if (control.value && control.value.length > 0) {

			// setup simple regex for white listed characters
			const floatRegx = /^([1-9][0-9]*)$/;
			// match the control value against the regular expression
			const matches = control.value.match(floatRegx);

			// if there are matches return an object, else return null.
			return matches && matches.length ? null : { invalid: true };
		} else {
			return null;
		}
	}
}
