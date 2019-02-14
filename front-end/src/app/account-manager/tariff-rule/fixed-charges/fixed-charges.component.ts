import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { LoginService } from 'src/app/services/login.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService, CustomValidators } from '../../../services/common.service';
import { TariffRuleService } from '../tariff-rule.service';

@Component({
  selector: 'app-fixed-charges',
  templateUrl: './fixed-charges.component.html',
  styleUrls: ['./fixed-charges.component.scss']
})
export class FixedChargesComponent implements OnInit {
	fixedChargeFormGroup: FormGroup;
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
	tariff_rules_list: any;
	tariffConfigId: any;
	temp_name: string;
	tariffRule: string;
	tariffVariable = new Array();

	constructor(private fb: FormBuilder, private loginService: LoginService, private route: ActivatedRoute,
		private router: Router, private commonService: CommonService, private tariffRuleService: TariffRuleService) {

	}

	ngOnInit() {
		this.succMsg = localStorage.getItem('succMsg');
		this.errorMsg = localStorage.getItem('errorMsg');
		localStorage.setItem('succMsg', '');
		localStorage.setItem('errorMsg', '');

		this.currentUser = this.loginService.getDecodedValue(localStorage.getItem('currentUser'));
		this.userId = this.currentUser.id;
		this.customerId = this.route.snapshot.params['id'];
		this.tariffConfigId = this.route.snapshot.params['tc_id'];

		this.tariffRule = 'fixed-charges' + '/' + this.customerId + '/' + this.tariffConfigId;


		this.tariffRuleService.getTemplateByTariff(this.tariffConfigId).subscribe(data => {
			this.temp_name = data.list[0].temp_name;
			this.tariffRuleService.listTariffRule(data.list[0].tdl_id).subscribe(data => {
				this.tariff_rules_list = data;
			});
		});

		this.fixedChargeFormGroup = this.fb.group({
			tc_id: [this.tariffConfigId],
			trl1_id: [0],
			created_by: [this.userId],
			rule_items: this.fb.array([]),
		});

		this.tariffRuleService.getTariffRule(this.customerId, this.tariffConfigId).subscribe(data => {
			if (data.list.length > 0) {
				this.fixedChargeFormGroup.patchValue({
					trl1_id: data.list[0].trl1_id
				});
				this.tariffRuleService.getTemplateTariffVariable(this.tariffConfigId).subscribe(data2 => {
					this.tariffVariable = data2.list;
					var tariffRule = data.list[0].tariff_rule;
					if (tariffRule.length > 0) {
						this.updateTariffRuleFields(tariffRule);
					}
					else {
						this.addTariffRuleFields();
					}
				});
			}
		});
	}

	addTariffRuleFields() {
		for (let i = 0; i < this.tariffVariable.length; i++) {
			const ri = this.fb.group({
				tcvn_id: [this.tariffVariable[i].tcvn_id, [Validators.required]],
				tc_var_name: [this.tariffVariable[i].tc_var_name, [Validators.required]],
				trl4_value: ['', [Validators.required, CustomValidators.amount]],
				trl4_period: ['', [Validators.required]],
			});
			const riArray = this.fixedChargeFormGroup.get('rule_items') as FormArray;
			riArray.push(ri);
		}
	}

	updateTariffRuleFields(data) {
		for (let i = 0; i < this.tariffVariable.length; i++) {
			for (let j = 0; j < data.length; j++) {
				const element = data[j];
				if (data[j].tcvn_id == this.tariffVariable[i].tcvn_id) {
					const ri = this.fb.group({
						tcvn_id: [this.tariffVariable[i].tcvn_id, [Validators.required]],
						tc_var_name: [this.tariffVariable[i].tc_var_name, [Validators.required]],
						trl4_value: [data[j].trl4_value, [Validators.required, CustomValidators.amount]],
						trl4_period: [data[j].trl4_period, [Validators.required]],
					});
					const riArray = this.fixedChargeFormGroup.get('rule_items') as FormArray;
					riArray.push(ri);
				}
			}
		}
	}

	tariffRuleChange(tariff_rule_url) {
		this.returnUrl = '/account-manager/tariff-rule/' + tariff_rule_url;
		this.router.navigate([this.returnUrl]);
	}

	onSubmit() {
		this.submitted = true;
		// console.log(this.meterFormGroup);
		// stop here if form is invalid
		if (this.fixedChargeFormGroup.invalid) {
			this.errorMsg = 'Please fill all required fields.';
			return;
		} else {
			this.tariffRuleService.setFixed(this.fixedChargeFormGroup.value).subscribe(
				data => {
					this.returnUrl = 'account-manager/tariff-rule/template/' + this.customerId;
					this.succMsg = 'Fixed charge tariff rule set successfully';
					localStorage.setItem('succMsg', this.succMsg);
					this.router.navigate([this.returnUrl]);
					// this.ngOnInit();
				},
				error => {
					this.errorMsg = error.error.message;
				}
			);

		}

	}

}