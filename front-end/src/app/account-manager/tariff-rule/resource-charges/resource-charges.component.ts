import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { LoginService } from 'src/app/services/login.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService, CustomValidators } from '../../../services/common.service';
import { TariffRuleService } from '../tariff-rule.service';

@Component({
	selector: 'app-resource-charges',
	templateUrl: './resource-charges.component.html',
	styleUrls: ['./resource-charges.component.scss']
})
export class ResourceChargesComponent implements OnInit {
	resourceChargesFormGroup: FormGroup;
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
	workingHours: Array<{ id: number, val: string }>;
	weekDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

	constructor(private fb: FormBuilder, private loginService: LoginService, private route: ActivatedRoute,
		private router: Router, private commonService: CommonService, private tariffRuleService: TariffRuleService) {
		this.workingHours = [];
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

		this.tariffRule = 'resource-charges' + '/' + this.customerId + '/' + this.tariffConfigId;


		this.tariffRuleService.getTemplateByTariff(this.tariffConfigId).subscribe(data => {
			this.temp_name = data.list[0].temp_name;
			this.tariffRuleService.listTariffRule(data.list[0].tdl_id).subscribe(data => {
				this.tariff_rules_list = data;
			});
		});

		this.resourceChargesFormGroup = this.fb.group({
			tc_id: [this.tariffConfigId],
			trl1_id: [0],
			created_by: [this.userId],
			rule_items: this.fb.array([]),
			tod_items: this.fb.array([])
		});

		this.setWorkingHour();

		this.tariffRuleService.getTariffRule(this.customerId, this.tariffConfigId).subscribe(data => {
			if (data.list.length > 0) {
				this.resourceChargesFormGroup.patchValue({
					trl1_id: data.list[0].trl1_id
				});
				this.tariffRuleService.getTemplateTariffVariable(this.tariffConfigId).subscribe(data2 => {
					this.tariffVariable = data2.list;
					var trValue = new Array();
					var tdrValue = new Array();
					var tariffRule = data.list[0].tariff_rule;
					var todRule = data.list[0].tod_rule;
					if (tariffRule.length > 0) {
						for (let i = 0; i < tariffRule.length; i++) {
							var rMatch = false;
							for (let j = 0; j < trValue.length; j++) {
								if (tariffRule[i].from_date == trValue[j].from_date && tariffRule[i].to_date == trValue[j].to_date) {
									dfgT.data[tariffRule[i].tcvn_id] = tariffRule[i];
									rMatch = true;
								}
							}
							if (!rMatch) {
								var dfgT = {
									from_date: tariffRule[i].from_date,
									to_date: tariffRule[i].to_date,
									data: [],
								};
								dfgT.data[tariffRule[i].tcvn_id] = tariffRule[i];
								trValue.push(dfgT);
							}
						}
						trValue.forEach(element => {
							this.updateTariffRuleFields(element);
						});
					}
					else {
						this.addTariffRuleFields();
					}
					if (this.tariffVariable.length > 1) {
						if (todRule.length > 0){
							for (let i = 0; i < todRule.length; i++) {		
								if (!tdrValue[todRule[i].tcvn_id]) {
									tdrValue[todRule[i].tcvn_id] = [];
								}						
								tdrValue[todRule[i].tcvn_id].push(todRule[i]);
							}
							this.updateTODFields(tdrValue);
						}
						else{
							this.addTODFields();
						}
					}
				});
			}
		});
	}

	addTODFields() {
		for (let i = 0; i < this.tariffVariable.length; i++) {
			const todi = this.fb.group({
				tcvn_id: [this.tariffVariable[i].tcvn_id],
				tc_var_name: [this.tariffVariable[i].tc_var_name],
				tod_values: this.fb.array([])
			});
			for (let d = 0; d < this.weekDays.length; d++) {
				var sTime = '';
				if (i == 0) {
					sTime = '00:00';
				}
				var eTime = '';
				if ((i+1) == this.tariffVariable.length) {
					eTime = '00:00';
				}
				const todv = this.fb.group({
					tcvn_id: [this.tariffVariable[i].tcvn_id],
					day: [this.weekDays[d]],
					start_time: [sTime, [Validators.required]],
					end_time: [eTime, [Validators.required]],
				});	
				const todvArray = todi.get('tod_values') as FormArray;
				todvArray.push(todv);			
			}
			const todiArray = this.resourceChargesFormGroup.get('tod_items') as FormArray;
			todiArray.push(todi);
		}
	}

	updateTODFields(data) {
		for (let i = 0; i < this.tariffVariable.length; i++) {
			const todi = this.fb.group({
				tcvn_id: [this.tariffVariable[i].tcvn_id],
				tc_var_name: [this.tariffVariable[i].tc_var_name],
				tod_values: this.fb.array([])
			});
			for (let d = 0; d < this.weekDays.length; d++) {				
				for (let j = 0; j < data[this.tariffVariable[i].tcvn_id].length; j++) {
					const element = data[this.tariffVariable[i].tcvn_id][j];
					if (this.weekDays[d] == element.day) {
						var sTime = element.start_time.substring(0, 5);
						if (i == 0) {
							sTime = '00:00';
						}
						var eTime = element.end_time.substring(0, 5);
						if ((i+1) == this.tariffVariable.length) {
							eTime = '00:00';
						}
						const todv = this.fb.group({
							tcvn_id: [this.tariffVariable[i].tcvn_id],
							day: [this.weekDays[d]],
							start_time: [sTime, [Validators.required]],
							end_time: [eTime, [Validators.required]],
						});	
						const todvArray = todi.get('tod_values') as FormArray;
						todvArray.push(todv);	
					}					
				}		
			}
			const todiArray = this.resourceChargesFormGroup.get('tod_items') as FormArray;
			todiArray.push(todi);
		}
	}

	addTariffRuleFields() {
		const ri = this.fb.group({
			from_date: ['', [Validators.required]],
			to_date: ['', [Validators.required]],
			rule_values: this.fb.array([])
		});
		for (let i = 0; i < this.tariffVariable.length; i++) {
			const rv = this.fb.group({
				tcvn_id: [this.tariffVariable[i].tcvn_id, [Validators.required]],
				trl4_value: ['', [Validators.required, CustomValidators.amount]],
			});
			const rvArray = ri.get('rule_values') as FormArray;
			rvArray.push(rv);
		}
		const riArray = this.resourceChargesFormGroup.get('rule_items') as FormArray;
		riArray.push(ri);
	}

	updateTariffRuleFields(data) {
		const ri = this.fb.group({
			from_date: [data.from_date, [Validators.required]],
			to_date: [data.to_date, [Validators.required]],
			rule_values: this.fb.array([])
		});
		for (let i = 0; i < this.tariffVariable.length; i++) {
			const rv = this.fb.group({
				tcvn_id: [this.tariffVariable[i].tcvn_id, [Validators.required]],
				trl4_value: [data.data[this.tariffVariable[i].tcvn_id].trl4_value, [Validators.required, CustomValidators.amount]],
			});
			const rvArray = ri.get('rule_values') as FormArray;
			rvArray.push(rv);
		}
		const riArray = this.resourceChargesFormGroup.get('rule_items') as FormArray;
		riArray.push(ri);
	}

	cloneForm(): void {
		this.addTariffRuleFields();
	}

	removeRule(index): void {
		const riArray = this.resourceChargesFormGroup.get('rule_items') as FormArray;
		riArray.removeAt(index);
	}

	tariffRuleChange(tariff_rule_url) {
		this.returnUrl = '/account-manager/tariff-rule/' + tariff_rule_url;
		this.router.navigate([this.returnUrl]);
	}

	timestamp(date:string) {
		return (new Date(date)).getTime();
	}

	onSubmit() {
		this.submitted = true;
		// console.log(this.meterFormGroup);
		// stop here if form is invalid
		if (this.resourceChargesFormGroup.invalid) {
			this.errorMsg = 'Please fill all required fields.';
			return;
		} else {
			//validation start
			const riArray = this.resourceChargesFormGroup.get('rule_items') as FormArray;
			const tiArray = this.resourceChargesFormGroup.get('tod_items') as FormArray;
			const ruleItems = this.resourceChargesFormGroup.value.rule_items;
			const todItems = this.resourceChargesFormGroup.value.tod_items;
			const tempRI = [];
			for (let i = 0; i < ruleItems.length; i++) {
				const rule = ruleItems[i];
				var match = false;
				for (let j = 0; j < tempRI.length; j++) {
					const sRule = tempRI[j];
					if ((this.timestamp(sRule.from_date) <= this.timestamp(rule.from_date) && this.timestamp(sRule.to_date) >= this.timestamp(rule.from_date)) 
					|| (this.timestamp(sRule.from_date) <= this.timestamp(rule.to_date) && this.timestamp(sRule.to_date) >= this.timestamp(rule.to_date))
					|| (this.timestamp(sRule.from_date) > this.timestamp(rule.from_date) && this.timestamp(sRule.to_date) < this.timestamp(rule.to_date))
					) {
						match = true;
					}
				}
				if (!match) {
					tempRI.push(rule);
				}
				else{
					const to_date_FC = riArray.controls[i].get('to_date') as FormControl;
					const from_date_FC = riArray.controls[i].get('from_date') as FormControl;
					to_date_FC.setErrors({'conflict': true});
					from_date_FC.setErrors({'conflict': true});
					this.errorMsg = 'Date range conflict, set properly.';
					return;
				}
				if (this.timestamp(rule.from_date) > this.timestamp(rule.to_date)) {
					const to_date_FC = riArray.controls[i].get('to_date') as FormControl;
					to_date_FC.setErrors({'lessvalue': true});
					this.errorMsg = 'End date must be greater than start date.';
					return;
				}
			}
			const tempTI = [];
			for (let i = 0; i < todItems.length; i++) {
				const tvArray = tiArray.controls[i].get('tod_values') as FormArray;
				const tod = todItems[i];
				var match = false;
				for (let k = 0; k < tod.tod_values.length; k++) {
					const todval = tod.tod_values[k];
					for (let j = 0; j < tempTI.length; j++) {
						const sTod = tempTI[j];
						var start1 = +sTod.tod_values[k].start_time.substring(0,2);
						var end1 = +sTod.tod_values[k].end_time.substring(0,2);
						var start2 = +tod.tod_values[k].start_time.substring(0,2);
						var end2 = +tod.tod_values[k].end_time.substring(0,2);
						var tempArr = [];
						for (let t = start1; t < end1; t++) {
							tempArr[t] = true;
						}
						for (let t = start2; t < end2; t++) {
							if (tempArr[t]) {
								match = true;
								const start_time_FC = tvArray.controls[k].get('start_time') as FormControl;
								const end_time_FC = tvArray.controls[k].get('end_time') as FormControl;
								start_time_FC.setErrors({'conflict': true});
								end_time_FC.setErrors({'conflict': true});
							}
						}
					}
				}

				if (!match) {
					tempTI.push(tod);
				}
				else{
					this.errorMsg = 'Time range conflict, set properly.';
					return;
				}
			}
			//validation end
			this.tariffRuleService.setResource(this.resourceChargesFormGroup.value).subscribe(
				data => {
					this.returnUrl = 'account-manager/tariff-rule/template/' + this.customerId;
					this.succMsg = 'Resource changes tariff rule set successfully';
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

	setWorkingHour() {
		for (let i: number = 0; i < 25; i++) {
			if (i > 9) {
				if (i == 24) {
					this.workingHours.push({ "id": i, "val": "00:00" });
				} else {
					this.workingHours.push({ "id": i, "val": i + ":00" });
				}
			} else {
				this.workingHours.push({ "id": i, "val": "0" + i + ":00" });
			}
		}
	}

	hourChange(event)  {
		
		var _value = event.value;
		var _name = event.source.ngControl.name;
		var _index = event.source.ngControl._parent.name;
		var _indexParent = event.source.ngControl._parent._parent._parent.name;
		if (_index == 0) {
			const todiArray = this.resourceChargesFormGroup.get('tod_items') as FormArray;
			const todvArray = todiArray.controls[_indexParent].get('tod_values') as FormArray;
			for (let i = 1; i < 7; i++) {
				var obj = {};
				   obj[_name] = _value;
				todvArray.controls[i].patchValue(obj);
			}
		}
		if (_name == 'end_time') {
			const todiArray = this.resourceChargesFormGroup.get('tod_items') as FormArray;
			if (todiArray.controls[_indexParent+1]) {
				const todvArray = todiArray.controls[_indexParent+1].get('tod_values') as FormArray;
				todvArray.controls[_index].patchValue({start_time: _value});
				if (_index == 0) {
					const todvArray1 = todiArray.controls[_indexParent].get('tod_values') as FormArray;
					for (let i = 1; i < 7; i++) {
						var obj = {};
						   obj[_name] = _value;
						   todvArray1.controls[i].patchValue(obj);
					}
					
					for (let i = 1; i < 7; i++) {
						todvArray.controls[i].patchValue({start_time: _value});
					}
				}
			}
		}
	}

}
