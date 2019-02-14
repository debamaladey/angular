import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { LoginService } from 'src/app/services/login.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from '../../../services/common.service';
import { TariffRuleService } from '../tariff-rule.service';

@Component({
	selector: 'app-template',
	templateUrl: './template.component.html',
	styleUrls: ['./template.component.scss']
})
export class TemplateComponent implements OnInit {
	templateFormGroupArr;
	currentUser;
	returnUrl: string;
	errorMsg;
	succMsg;
	userId;
	customerId = '';
	templates;
	submitted = false;
	isreadonly = false;
	submitType;
	resources: any;
	customer_name: string;
	state_name: string;
	city_name: string;
	tariff_rules_list_arr: any;

	constructor(private fb: FormBuilder, private loginService: LoginService, private route: ActivatedRoute,
		private router: Router, private commonService: CommonService, private tariffRuleService: TariffRuleService) { }

	ngOnInit() {

		this.succMsg = localStorage.getItem('succMsg');
		this.errorMsg = localStorage.getItem('errorMsg');
		localStorage.setItem('succMsg', '');
		localStorage.setItem('errorMsg', '');

		this.currentUser = this.loginService.getDecodedValue(localStorage.getItem('currentUser'));
		this.userId = this.currentUser.id;
		this.customerId = this.route.snapshot.params['id'];

		this.commonService.resource_list(0, 0).subscribe(data => {
			this.resources = data.list;
			this.templateFormGroupArr = new Array();
			for (let i = 0; i < this.resources.length; i++) {
				this.tariffRuleService.listTemplate(this.customerId, this.resources[i].resource_id).subscribe(data => {
					this.resources[i].templates = data.list;
				});
				this.templateFormGroupArr[this.resources[i].resource_id] = this.fb.group({
					tdl_id: ['', Validators.required],
					created_by: [this.userId],
					customer_id: [this.customerId],
					resource_id: [this.resources[i].resource_id],
					ruleCreateEnable: [false],
					tariff_rule: '',
				});
			}
		});

		this.tariffRuleService.viewCustomer(this.customerId).subscribe(data => {
			this.customer_name = data.list[0].customer_name;
			this.state_name = data.list[0].state_name;
			this.city_name = data.list[0].city_name;
		});

		this.tariffRuleService.getTemplate(this.customerId).subscribe(data => {
			// console.log(data);
			this.tariff_rules_list_arr = new Array();
			for (let i = 0; i < data.list.length; i++) {
				const element = data.list[i];

				this.templateFormGroupArr[element.resource_id].patchValue({
					tdl_id: element.tdl_id,
					ruleCreateEnable: [true],
				});

				this.tariffRuleService.listTariffRule(element.tdl_id).subscribe(data => {
					this.tariff_rules_list_arr[element.resource_id] = data;
				});

			}
		});


	}

	onSubmit(i) {
		this.submitted = true;
		// console.log(this.templateFormGroupArr[i]);
		// stop here if form is invalid
		if (this.templateFormGroupArr[i].invalid) {
			this.errorMsg = 'Please fill all required fields.';
			return;
		} else {

			this.tariffRuleService.set_template(this.templateFormGroupArr[i].value).subscribe(
				data => {
					// this.returnUrl = 'account-manager/tariff-rule/template/' + this.customerId;
					this.succMsg = 'Template set successfully';
					localStorage.setItem('succMsg', this.succMsg);
					// this.router.navigate([this.returnUrl]);
					this.ngOnInit();
				},
				error => {
					this.errorMsg = error.error.message;
				}
			);

		}

	}

	tariffRuleChange(tariff_rule_url) {
		this.returnUrl = '/account-manager/tariff-rule/' + tariff_rule_url;
		this.router.navigate([this.returnUrl]);
	}

}
