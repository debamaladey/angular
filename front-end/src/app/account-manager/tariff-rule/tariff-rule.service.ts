import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
// import { LocalStorage } from '@ngx-pwa/local-storage';
import { environment } from '../../../environments/environment';
import { CommonService } from '../../services/common.service';

const helper = new JwtHelperService();

@Injectable({
	providedIn: 'root'
})
export class TariffRuleService {

	constructor(private http: HttpClient, private commonService: CommonService) { }

	viewCustomer(id) {
		return this.http.get<any>(`${environment.apiUrl}/account_manager/view_customer/` + id).pipe(map(response => {
			if (response && response.token) {
				return helper.decodeToken(response.token);
			}
		}));
	}

	getTemplate(id) {
		return this.http.get<any>(`${environment.apiUrl}/account_manager/get_template/` + id).pipe(map(response => {
			if (response && response.token) {
				return helper.decodeToken(response.token);
			}
		}));
	}

	listTemplate(customer_id, resource_id) {
		return this.http.get<any>(`${environment.apiUrl}/account_manager/list_template/` + customer_id +'/'+resource_id).pipe(map(response => {
			if (response && response.token) {
				return helper.decodeToken(response.token);
			}
		}));
	}

	set_template(data) { 
		// console.log(data);
		return this.http.post<any>(`${environment.apiUrl}/account_manager/set_template/`,data).pipe(map(response => {
			if (response && response.token) {
				return helper.decodeToken(response.token);
			}
		}));
	}

	listTariffRule(tdl_id) {
		return this.http.get<any>(`${environment.apiUrl}/account_manager/list_tariff_rule/` + tdl_id).pipe(map(response => {
			if (response && response.token) {
				var data = helper.decodeToken(response.token);

				const templateTariffRule = data.list;
				const allTariffRule = this.commonService.getTemplateChargesArr();
				for (let k = 0; k < templateTariffRule.length; k++) {
					for (let j = 0; j < allTariffRule.length; j++) {
						if (templateTariffRule[k].tc_name == 'checkbox_'+allTariffRule[j].id) {
							templateTariffRule[k].data = allTariffRule[j];
						}
					}						
				}
				return templateTariffRule;
			}
		}));
	}

	getTemplateByTariff(tc_id) {
		return this.http.get<any>(`${environment.apiUrl}/account_manager/get_template_by_tariff/` + tc_id).pipe(map(response => {
			if (response && response.token) {
				return helper.decodeToken(response.token);
			}
		}));
	}

	getTemplateTariffVariable(tc_id) {
		return this.http.get<any>(`${environment.apiUrl}/account_manager/get_template_tariff_variable/` + tc_id).pipe(map(response => {
			if (response && response.token) {
				return helper.decodeToken(response.token);
			}
		}));
	}

	getTariffRule(customer_id,tc_id) {
		return this.http.get<any>(`${environment.apiUrl}/account_manager/get_tariff_rule/` + customer_id + '/' + tc_id).pipe(map(response => {
			if (response && response.token) {
				return helper.decodeToken(response.token);
			}
		}));
	}

	setResource(data) { 
		// console.log(data);
		return this.http.post<any>(`${environment.apiUrl}/account_manager/set_resource/`,data).pipe(map(response => {
			if (response && response.token) {
				return helper.decodeToken(response.token);
			}
		}));
	}

	setEnvironmental(data) { 
		// console.log(data);
		return this.http.post<any>(`${environment.apiUrl}/account_manager/set_environmental/`,data).pipe(map(response => {
			if (response && response.token) {
				return helper.decodeToken(response.token);
			}
		}));
	}

	setFixed(data) { 
		// console.log(data);
		return this.http.post<any>(`${environment.apiUrl}/account_manager/set_fixed/`,data).pipe(map(response => {
			if (response && response.token) {
				return helper.decodeToken(response.token);
			}
		}));
	}

	setLoadDetails(data) { 
		// console.log(data);
		return this.http.post<any>(`${environment.apiUrl}/account_manager/set_load_details/`,data).pipe(map(response => {
			if (response && response.token) {
				return helper.decodeToken(response.token);
			}
		}));
	}

	setContractDemand(data) { 
		// console.log(data);
		return this.http.post<any>(`${environment.apiUrl}/account_manager/set_contract_demand/`,data).pipe(map(response => {
			if (response && response.token) {
				return helper.decodeToken(response.token);
			}
		}));
	}
}
