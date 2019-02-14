import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { VirtualMeterService } from '../virtual-meter.service';
import { LoginService } from '../../../services/login.service';
import { CommonService } from '../../../services/common.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

export interface DialogData {
	formGroup: FormGroup;
	index?: number;
}

@Component({
	selector: 'app-add-edit',
	templateUrl: './add-edit.component.html',
	styleUrls: ['./add-edit.component.scss']
})
export class AddEditComponent implements OnInit {
	meterFormGroup: FormGroup;
	sourceMeterFormArray: FormArray;
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
	nsmReadonly = true;
	sourceMeterList: any;
	consumptions;

	constructor(private fb: FormBuilder, private virtualMeterService: VirtualMeterService, private route: ActivatedRoute,
		private router: Router, private loginService: LoginService, private commonService: CommonService, public dialog: MatDialog) { }

	ngOnInit() {
		this.succMsg = localStorage.getItem('succMsg');
		this.errorMsg = localStorage.getItem('errorMsg');
		localStorage.setItem('succMsg', '');
		localStorage.setItem('errorMsg', '');

		this.currentUser = this.loginService.getDecodedValue(localStorage.getItem('currentUser'));
		this.userId = this.currentUser.id;
		this.customerId = this.currentUser.customer_id;
		this.editId = this.route.snapshot.params['id'];

		this.meterFormGroup = this.fb.group({
			meter_id: [0],
			given_meter_id: ['', Validators.required],
			given_tag_id: ['', Validators.required],
			meter_name: ['', Validators.required],
			meter_set_val: ['0', [Validators.required, CustomValidators.meterValue]],
			high_val: ['0', [Validators.required, CustomValidators.meterValue]],
			low_val: ['0', [Validators.required, CustomValidators.meterValue]],
			no_source_meter: ['', [Validators.required, CustomValidators.intValue]],
			resource_id: ['', Validators.required],
			consumption_id: [''],
			value_items: this.fb.array([]),
			created_by: [this.userId],
			customer_id: [this.customerId],
			source_meters: this.fb.array([])
		});

		this.commonService.resource_list(0, 0).subscribe(data => {
			this.resources = data.list;
		});

		if (this.editId) {
			this.isreadonly = true;
			this.virtualMeterService.viewMeter(this.editId)
				.subscribe(data => {
					this.viewMeter = data.meter[0];
					
					this.sourceMeterFormArray = this.meterFormGroup.get('source_meters') as FormArray;
					this.sourceMeterList = new Array(this.viewMeter.source_meter_list.length);
					for (let i = 0; i < this.viewMeter.source_meter_list.length; i++) {
						const element = this.viewMeter.source_meter_list[i];
						this.sourceMeterFormArray.push(this.fb.group({
							type: [element.type, Validators.required],
							meter_id: [element.source_meter_id, Validators.required],
							operation: [element.operation, Validators.required],
							contribution: [element.contribution, [Validators.required, CustomValidators.contributionValue]]
						}));
						this.meterTypeChange(element.type, i, this.viewMeter.resource_id);
					}
					this.meterFormGroup = this.fb.group({
						meter_id: [this.viewMeter.meter_id],
						given_meter_id: [this.viewMeter.given_meter_id, Validators.required],
						given_tag_id: [this.viewMeter.tag_id, Validators.required],
						meter_name: [this.viewMeter.meter_name, Validators.required],
						meter_set_val: [this.viewMeter.meter_set_val, [Validators.required, CustomValidators.meterValue]],
						high_val: [this.viewMeter.high_val, [Validators.required, CustomValidators.meterValue]],
						low_val: [this.viewMeter.low_val, [Validators.required, CustomValidators.meterValue]],
						no_source_meter: [this.viewMeter.source_meter_list.length, [Validators.required, CustomValidators.intValue]],
						resource_id: [this.viewMeter.resource_id, Validators.required],
						consumption_id: [this.viewMeter.consumption_id],
						value_items: this.fb.array([]),
						created_by: [this.viewMeter.created_by],
						customer_id: [this.viewMeter.customer_id],
						source_meters: this.sourceMeterFormArray
					});
					const viArray = this.meterFormGroup.get('value_items') as FormArray;
					for (let i = 0; i < this.viewMeter.value_list.length; i++) {
						const element = this.viewMeter.value_list[i];
						var benchmarkFormGroup = this.fb.group({
							meter_val: [element.meter_val, [Validators.required, CustomValidators.meterValue]],
							miv_priod: [element.miv_priod, Validators.required],
							miv_type: [element.miv_type, Validators.required],
						});
						viArray.push(benchmarkFormGroup);
					}
					this.commonService.consumption_list(this.customerId, this.viewMeter.resource_id).subscribe(data => {
						this.consumptions = new Array();
						this.modifyTree(data.list, '');
					});
					
				},
					error => {
						this.errorMsg = error.error.message;
					});
		}
		else {
			this.virtualMeterService.given_meter_id(this.customerId).subscribe(data => {
				this.meterFormGroup.patchValue({
					given_meter_id: data.id
				});
			});
			this.virtualMeterService.given_tag_id(this.customerId).subscribe(data => {
				this.meterFormGroup.patchValue({
					given_tag_id: data.id
				});
			});
		}

	}


	openDialog(): void {
		const riArray = this.meterFormGroup.get('value_items') as FormArray;
		if (riArray.length < 4) {
			const dialogRef = this.dialog.open(BenchmarkValueDialog, {
				width: '350px',
				data: { formGroup: this.meterFormGroup }
			});

			dialogRef.afterClosed().subscribe(result => {
				if (result) {
					this.meterFormGroup = result.formGroup;
				}
			});
		}
	}

	createSourceMeter(): FormGroup {
		return this.fb.group({
			type: ['', Validators.required],
			meter_id: ['', Validators.required],
			operation: ['', Validators.required],
			contribution: ['100', [Validators.required, CustomValidators.contributionValue]]
		});
	}

	addSourceMeter(): void {
		this.sourceMeterFormArray = this.meterFormGroup.get('source_meters') as FormArray;
		this.sourceMeterFormArray.push(this.createSourceMeter());
	}

	resourceChange(resource_id) {
		this.meterFormGroup.patchValue({
			no_source_meter: ''
		});
		this.nsmReadonly = false;
		this.sourceMeterFormArray = this.meterFormGroup.get('source_meters') as FormArray;
		while (this.sourceMeterFormArray.length !== 0) {
			this.sourceMeterFormArray.removeAt(0)
		}
		this.meterFormGroup.patchValue({
			consumption_id: ''
		});
		this.commonService.consumption_list(this.customerId, resource_id).subscribe(data => {
			this.consumptions = new Array();
			this.modifyTree(data.list, '');
		});
	}

	modifyTree(data, parant_name) {
		for (let i = 0; i < data.length; i++) {
			const element = data[i];
			this.consumptions.push({
				id: element.id,
				name: parant_name + element.name,
			});
			this.modifyTree(element.children, parant_name + element.name + ' -> ');

		}

		return true;
	}

	no_source_meter_change(event) {
		this.sourceMeterFormArray = this.meterFormGroup.get('source_meters') as FormArray;
		while (this.sourceMeterFormArray.length !== 0) {
			this.sourceMeterFormArray.removeAt(0)
		}

		for (let i = 0; i < parseInt(event.target.value); i++) {
			this.addSourceMeter();
		}
		this.sourceMeterList = new Array(parseInt(event.target.value));
	}

	meterTypeChange(type, i, resource_id) {
		this.virtualMeterService.sourceMeterList(this.customerId, type, resource_id, this.editId).subscribe(data => {
			this.sourceMeterList[i] = data.list;
		});
	}

	deleteBenchmark(i) {
		if (confirm("Are you sure to delete?")) {
			const riArray = this.meterFormGroup.get('value_items') as FormArray;
			riArray.removeAt(i);
		}
	}

	editBenchmark(i) {

		const riArray = this.meterFormGroup.get('value_items') as FormArray;
		if (riArray.length < 4) {
			const dialogRef = this.dialog.open(BenchmarkValueDialog, {
				width: '350px',
				data: { formGroup: this.meterFormGroup, index: i }
			});

			dialogRef.afterClosed().subscribe(result => {
				if (result) {
					this.meterFormGroup = result.formGroup;
				}
			});
		}
	}

	submit(type) {
		this.submitType = type
	}

	onSubmit() {
		this.submitted = true;
		// console.log(this.meterFormGroup);
		// stop here if form is invalid
		if (this.meterFormGroup.invalid) {
			this.errorMsg = 'Please fill all required fields.';
			return;
		} else {

			if (this.editId) {

				this.virtualMeterService.update_meter(this.meterFormGroup.value).subscribe(
					data => {
						if (this.submitType == 'save_exit') {
							this.returnUrl = 'customer/virtual-meter/list';
						} else {
							this.returnUrl = 'customer/virtual-meter/edit/' + this.editId;
						}
						this.succMsg = 'Meter updated successfully';
						localStorage.setItem('succMsg', this.succMsg);
						this.router.navigate([this.returnUrl]);
					},
					error => {
						this.errorMsg = error.error.message;
					}
				);

			} else {
				this.virtualMeterService.create_meter(this.meterFormGroup.value).subscribe(
					data => {
						if (this.submitType == 'save_exit') {
							this.returnUrl = 'customer/virtual-meter/list';
						} else {
							this.returnUrl = 'customer/virtual-meter/edit/' + data.meter_id;
						}
						this.succMsg = 'Virtual Meter added successfully';
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

@Component({
	selector: 'benchmark-value-dialog',
	templateUrl: 'benchmark-value-dialog.html',
})
export class BenchmarkValueDialog {
	meterFormGroup: FormGroup;
	benchmarkFormGroup: FormGroup;
	submitted = false;
	errorMsg: string;
	priodList = ['daily', 'weekly'];
	typeList = ['above', 'low'];
	priodTypeComb: any[];
	typeComb: any[];

	constructor(
		public dialogRef: MatDialogRef<BenchmarkValueDialog>,
		@Inject(MAT_DIALOG_DATA) public data: DialogData, private fb: FormBuilder) {
			this.meterFormGroup = data.formGroup;

		const viArray = this.meterFormGroup.get('value_items') as FormArray;

		this.priodTypeComb = new Array();
		for (let i = 0; i < this.priodList.length; i++) {
			const priod = this.priodList[i];
			const pData = { 'priod': priod, typeList: [] };
			for (let j = 0; j < this.typeList.length; j++) {
				const type = this.typeList[j];
				var match = false;
				for (let d = 0; d < viArray.value.length; d++) {
					const vi = viArray.value[d];
					if (data.index != d && vi.miv_priod == priod && vi.miv_type == type) {
						match = true;
					}
				}
				if (!match) {
					pData.typeList.push(type);
				}
			}
			if (pData.typeList.length > 0) {
				this.priodTypeComb.push(pData);
			}
		}
		
		if (viArray.value[data.index]) {
			const eFgVal = viArray.value[data.index];		
			this.benchmarkFormGroup = this.fb.group({
				meter_val: [eFgVal.meter_val, [Validators.required, CustomValidators.meterValue]],
				miv_priod: [eFgVal.miv_priod, Validators.required],
				miv_type: [eFgVal.miv_type, Validators.required],
			});
			this.priodChange(eFgVal.miv_priod);
		}
		else {
			this.benchmarkFormGroup = this.fb.group({
				meter_val: ['', [Validators.required, CustomValidators.meterValue]],
				miv_priod: ['', Validators.required],
				miv_type: ['', Validators.required],
			});
		}
	}

	onNoClick(): void {
		this.dialogRef.close();
	}

	priodChange(value): void {
		for (let i = 0; i < this.priodTypeComb.length; i++) {
			const element = this.priodTypeComb[i];
			if (value == element.priod) {
				this.typeComb = element.typeList;
			}
		}
	}

	benchmarkSubmit() {
		this.submitted = true;
		// stop here if form is invalid
		if (this.benchmarkFormGroup.invalid) {
			this.errorMsg = 'Please fill all required fields.';
			return;
		} else {
			const viArray = this.meterFormGroup.get('value_items') as FormArray;
			viArray.push(this.benchmarkFormGroup);
			this.dialogRef.close({ formGroup: this.meterFormGroup });

		}

	}

}


// create your class that extends the angular validator class
export class CustomValidators extends Validators {

	// create a static method for your validation
	static meterValue(control: FormControl) {

		// first check if the control has a value
		if (control.value && control.value.length > 0) {

			// setup simple regex for white listed characters
			const floatRegx = /^[+-]?([0-9]*[.])?[0-9]+$/;
			// match the control value against the regular expression
			const matches = control.value.match(floatRegx);

			// if there are matches return an object, else return null.
			return matches && matches.length ? null : { invalid_characters: matches };
		} else {
			return null;
		}
	}

	// create a static method for your validation
	static intValue(control: FormControl) {

		// first check if the control has a value
		if (control.value && control.value.length > 0) {

			// setup simple regex for white listed characters
			const floatRegx = /^[0-9]+$/;
			// match the control value against the regular expression
			const matches = control.value.match(floatRegx);

			// if there are matches return an object, else return null.
			return matches && matches.length ? null : { invalid_characters: matches };
		} else {
			return null;
		}
	}

	// create a static method for your validation
	static contributionValue(control: FormControl) {

		// first check if the control has a value
		if (control.value && control.value.length > 0) {

			// setup simple regex for white listed characters
			const floatRegx = /(^100(\.0{1,2})?$)|(^([1-9]([0-9])?|0)(\.[0-9]{1,2})?$)/;
			// match the control value against the regular expression
			const matches = control.value.match(floatRegx);

			// if there are matches return an object, else return null.
			return matches && matches.length ? null : { invalid_characters: matches };
		} else {
			return null;
		}
	}
}