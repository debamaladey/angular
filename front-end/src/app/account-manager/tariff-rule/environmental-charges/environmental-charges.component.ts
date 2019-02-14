import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { LoginService } from 'src/app/services/login.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService, CustomValidators } from '../../../services/common.service';
import { TariffRuleService } from '../tariff-rule.service';

@Component({
	selector: 'app-environmental-charges',
	templateUrl: './environmental-charges.component.html',
	styleUrls: ['./environmental-charges.component.scss']
})
export class EnvironmentalChargesComponent implements OnInit {
	environmentalChargesFormGroup: FormGroup;
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

		this.tariffRule = 'environmental-charges' + '/' + this.customerId + '/' + this.tariffConfigId;


		this.tariffRuleService.getTemplateByTariff(this.tariffConfigId).subscribe(data => {
			this.temp_name = data.list[0].temp_name;
			this.tariffRuleService.listTariffRule(data.list[0].tdl_id).subscribe(data => {
				this.tariff_rules_list = data;
			});
		});

		this.environmentalChargesFormGroup = this.fb.group({
			tc_id: [this.tariffConfigId],
			trl1_id: [0],
			created_by: [this.userId],
			rule_items: this.fb.array([])
		});

		this.tariffRuleService.getTariffRule(this.customerId, this.tariffConfigId).subscribe(data => {
			if (data.list.length > 0) {
				this.environmentalChargesFormGroup.patchValue({
					trl1_id: data.list[0].trl1_id
				});
				this.tariffRuleService.getTemplateTariffVariable(this.tariffConfigId).subscribe(data2 => {
					this.tariffVariable = data2.list;
					var tariffRule = data.list[0].tariff_rule;
					if (tariffRule.length > 0) {
						for (let i = 0; i < this.tariffVariable.length; i++) {
							const ri = this.fb.group({
								tcvn_id: this.tariffVariable[i].tcvn_id,
								tc_var_name: this.tariffVariable[i].tc_var_name,
								rule_values: this.fb.array([])
							});
							for (let j = 0; j < tariffRule.length; j++) {
								if (tariffRule[j].tcvn_id == this.tariffVariable[i].tcvn_id) {
									const rv = this.fb.group({
										from_date: [tariffRule[j].from_date, [Validators.required]],
										to_date: [tariffRule[j].to_date, [Validators.required]],
										trl4_value: [tariffRule[j].trl4_value, [Validators.required, CustomValidators.amount]],
									});
									const rvArray = ri.get('rule_values') as FormArray;
									rvArray.push(rv);
								}
							}

							const riArray = this.environmentalChargesFormGroup.get('rule_items') as FormArray;
							riArray.push(ri);

						}
					}
					else {
						for (let i = 0; i < this.tariffVariable.length; i++) {
							const ri = this.fb.group({
								tcvn_id: this.tariffVariable[i].tcvn_id,
								tc_var_name: this.tariffVariable[i].tc_var_name,
								rule_values: this.fb.array([])
							});
							const riArray = this.environmentalChargesFormGroup.get('rule_items') as FormArray;
							riArray.push(ri);
							this.addTariffRuleFields(i);
						}
					}
				});
			}
		});
	}

	addTariffRuleFields(i) {
		const riArray = this.environmentalChargesFormGroup.get('rule_items') as FormArray;
		const rv = this.fb.group({
			from_date: ['', [Validators.required]],
			to_date: ['', [Validators.required]],
			trl4_value: ['', [Validators.required, CustomValidators.amount]],
		});
		const rvArray = riArray.controls[i].get('rule_values') as FormArray;
		rvArray.push(rv);

	}

	cloneForm(i): void {
		this.addTariffRuleFields(i);
	}

	removeRule(i, j): void {
		const riArray = this.environmentalChargesFormGroup.get('rule_items') as FormArray;
		const rvArray = riArray.controls[i].get('rule_values') as FormArray;
		rvArray.removeAt(j);
	}

	tariffRuleChange(tariff_rule_url) {
		this.returnUrl = '/account-manager/tariff-rule/' + tariff_rule_url;
		this.router.navigate([this.returnUrl]);
	}

	timestamp(date: string) {
		return (new Date(date)).getTime();
	}

	onSubmit() {
		this.submitted = true;
		// console.log(this.meterFormGroup);
		// stop here if form is invalid
		if (this.environmentalChargesFormGroup.invalid) {
			this.errorMsg = 'Please fill all required fields.';
			return;
		} else {
			const riArray = this.environmentalChargesFormGroup.get('rule_items') as FormArray;
			const ruleItems = this.environmentalChargesFormGroup.value.rule_items;
			for (let i = 0; i < ruleItems.length; i++) {
				const rule = ruleItems[i];
				const tempRI = [];
				const ruleValues = riArray.controls[i].get('rule_values') as FormArray;
				for (let v = 0; v < rule.rule_values.length; v++) {
					const rule_value = rule.rule_values[v];

					var match = false;
					for (let j = 0; j < tempRI.length; j++) {
						const sRule = tempRI[j];
						if ((this.timestamp(sRule.from_date) <= this.timestamp(rule_value.from_date) && this.timestamp(sRule.to_date) >= this.timestamp(rule_value.from_date))
							|| (this.timestamp(sRule.from_date) <= this.timestamp(rule_value.to_date) && this.timestamp(sRule.to_date) >= this.timestamp(rule_value.to_date))
							|| (this.timestamp(sRule.from_date) > this.timestamp(rule_value.from_date) && this.timestamp(sRule.to_date) < this.timestamp(rule_value.to_date))
						) {
							match = true;
						}
					}
					if (!match) {
						tempRI.push(rule_value);
					}
					else {
						const to_date_FC = ruleValues.controls[i].get('to_date') as FormControl;
						const from_date_FC = ruleValues.controls[i].get('from_date') as FormControl;
						to_date_FC.setErrors({ 'conflict': true });
						from_date_FC.setErrors({ 'conflict': true });
						this.errorMsg = 'Date range conflict, set properly.';
						return;
					}
					if (this.timestamp(rule_value.from_date) > this.timestamp(rule_value.to_date)) {
						const to_date_FC = ruleValues.controls[i].get('to_date') as FormControl;
						to_date_FC.setErrors({ 'lessvalue': true });
						this.errorMsg = 'End date must be greater than start date.';
						return;
					}
				}
			}
			
			this.tariffRuleService.setEnvironmental(this.environmentalChargesFormGroup.value).subscribe(
				data => {
					this.returnUrl = 'account-manager/tariff-rule/template/' + this.customerId;
					this.succMsg = 'Environmental changes tariff rule set successfully';
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
