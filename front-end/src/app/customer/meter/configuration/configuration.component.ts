import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { MeterService } from '../meter.service';
import { LoginService } from '../../../services/login.service';
import { CommonService } from '../../../services/common.service';

@Component({
	selector: 'app-configuration',
	templateUrl: './configuration.component.html',
	styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent implements OnInit {
	configFormGroup: FormGroup;
	currentUser;
	returnUrl: string;
	errorMsg;
	succMsg;
	userId;
	customerId;
	resources;
	submitted = false;
	isreadonly = false;
	editId = '';
	submitType;
	viewMeter;
	meterList: [];
	parameterList: [];
	unitList = [];
	tagList: [];

	constructor(private fb: FormBuilder, private meterService: MeterService, private route: ActivatedRoute,
		private router: Router, private loginService: LoginService, private commonService: CommonService) { }

	ngOnInit() {
		this.succMsg = localStorage.getItem('succMsg');
		this.errorMsg = localStorage.getItem('errorMsg');
		localStorage.setItem('succMsg', '');
		localStorage.setItem('errorMsg', '');

		this.currentUser = this.loginService.getDecodedValue(localStorage.getItem('currentUser'));
		this.userId = this.currentUser.id;
		this.customerId = this.currentUser.customer_id;
		this.editId = this.route.snapshot.params['id'];

		this.configFormGroup = this.fb.group({
			resource_id: ['', Validators.required],
			meter_id: ['', Validators.required],
			tag_items: this.fb.array([]),
			created_by: [this.userId]
		});

		this.commonService.resource_list(0, 0).subscribe(data => {
			this.resources = data.list;
		});

		this.meterService.listTag(this.customerId, this.editId).subscribe(data => {
			this.tagList = data.list;
		});

		if (this.editId) {
			this.isreadonly = true;
			this.meterService.viewMeter(this.editId)
				.subscribe(data => {
					this.viewMeter = data.meter[0];
					
					this.configFormGroup = this.fb.group({
						resource_id: [this.viewMeter.resource_id, [Validators.required]],
						meter_id: [this.viewMeter.meter_id, Validators.required],
						tag_items: this.fb.array([]),
						created_by: [this.userId]
					});
					this.meterService.meter_list_by_resource(this.customerId, this.viewMeter.resource_id, this.editId, 'real').subscribe(data => {
						this.meterList = data.list;
					});
					this.commonService.resource_parameters(this.viewMeter.resource_id).subscribe(data => {
						this.parameterList = data.list;
					});
					
					for (let i = 0; i < this.viewMeter.tag_list.length; i++) {
						var tag_data = this.viewMeter.tag_list[i];

						this.commonService.resource_units(tag_data.rp_id).subscribe(data => {
							this.unitList[i] = data.list;
						});

						var tag_id = new Array();
						if (tag_data.tag_id) {
							tag_data.tag_id.split(',').forEach(element => {
								tag_id.push(parseInt(element));
							});
						}
						
						const ti = this.fb.group({
							rp_id: [tag_data.rp_id, Validators.required],
							ru_id: [tag_data.ru_id, Validators.required],
							tag_id: [tag_id, Validators.required],
						});
						const tiArray = this.configFormGroup.get('tag_items') as FormArray;
						tiArray.push(ti);
					}
					if (this.viewMeter.tag_list.length == 0) {
						this.addTagDetails();
					}
				},
					error => {
						this.errorMsg = error.error.message;
					});
		}
		else {

		}
	}

	addTagDetails() {
		this.unitList.push([]);
		const ti = this.fb.group({
			rp_id: ['', Validators.required],
			ru_id: ['', Validators.required],
			tag_id: [[''], Validators.required],
		});
		const tiArray = this.configFormGroup.get('tag_items') as FormArray;
		tiArray.push(ti);
	}

	removeTagDetails(index): void {
		const tiArray = this.configFormGroup.get('tag_items') as FormArray;
		tiArray.removeAt(index);
	}

	resourceChange(resource_id) {
		this.meterService.meter_list_by_resource(this.customerId, resource_id, this.editId, 'real').subscribe(data => {
			this.meterList = data.list;
		});
		this.commonService.resource_parameters(resource_id).subscribe(data => {
			this.parameterList = data.list;
			this.configFormGroup = this.fb.group({
				resource_id: [resource_id, Validators.required],
				meter_id: ['', Validators.required],
				tag_items: this.fb.array([]),
				created_by: [this.userId]
			});
			this.addTagDetails();
		});
	}

	parameterChange(id, rp_id) {
		this.commonService.resource_units(rp_id).subscribe(data => {
			this.unitList[id] = data.list;
		});
		const tiArray = this.configFormGroup.get('tag_items') as FormArray;
		tiArray.controls[id].patchValue({
			ru_id: '',
		});
	}

	meterChange(meter_id) {
	}

	submit(type) {
		this.submitType = type
	}

	onSubmit() {
		this.submitted = true;
		console.log(this.configFormGroup);
		// stop here if form is invalid
		if (this.configFormGroup.invalid) {
			this.errorMsg = 'Please fill all required fields.';
			return;
		} else {

			if (this.editId) {

				this.meterService.update_meter_config(this.configFormGroup.value).subscribe(
					data => {
						console.log(data);
						if (this.submitType == 'save_exit') {
							this.returnUrl = 'customer/meter/list';
						} else {
							this.returnUrl = 'customer/meter/configuration/' + this.editId;
						}
						this.succMsg = 'Meter configuration updated successfully';
						localStorage.setItem('succMsg', this.succMsg);
						this.router.navigate([this.returnUrl]);
					},
					error => {
						this.errorMsg = error.error.message;
					}
				);

			} else {
				this.meterService.update_meter_config(this.configFormGroup.value).subscribe(
					data => {
						console.log(data.meter_id);
						if (this.submitType == 'save_exit') {
							this.returnUrl = 'customer/meter/list';
						} else {
							this.returnUrl = 'customer/meter/configuration/' + data.meter_id;
						}
						this.succMsg = 'Meter configuration successfully';
						localStorage.setItem('succMsg', this.succMsg);
						this.router.navigate([this.returnUrl]);
					},
					error => {
						this.errorMsg = error.error.message;
					}
				);

			}

		}

	}

}
