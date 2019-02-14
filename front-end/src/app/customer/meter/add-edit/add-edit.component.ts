import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { MeterService } from '../meter.service';
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
	consumptions;


	constructor(private fb: FormBuilder, private meterService: MeterService, private route: ActivatedRoute,
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
			meter_name: ['', Validators.required],
			resource_id: ['', Validators.required],
			consumption_id: [''],
			value_items: this.fb.array([]),
			created_by: [this.userId],
			customer_id: [this.customerId]
		});

		this.commonService.resource_list(0, 0).subscribe(data => {
			this.resources = data.list;
		});

		if (this.editId) {
			this.isreadonly = true;
			this.meterService.viewMeter(this.editId)
				.subscribe(data => {
					this.viewMeter = data.meter[0];

					this.meterFormGroup = this.fb.group({
						meter_id: [this.viewMeter.meter_id],
						given_meter_id: [this.viewMeter.given_meter_id, Validators.required],
						meter_name: [this.viewMeter.meter_name, Validators.required],
						resource_id: [this.viewMeter.resource_id, Validators.required],
						consumption_id: [this.viewMeter.consumption_id],
						value_items: this.fb.array([]),
						created_by: [this.viewMeter.created_by],
						customer_id: [this.viewMeter.customer_id]
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

					this.meterService.meterConsumption(this.customerId, this.viewMeter.resource_id, this.editId).subscribe(conspMeter => {
						var consp_meter_list = {};
						for (let i = 0; i < conspMeter.list.length; i++) {
							const element = conspMeter.list[i];
							consp_meter_list[element.consumption_id] = element.meter_id;

						}
						this.commonService.consumption_list(this.customerId, this.viewMeter.resource_id).subscribe(data => {
							this.consumptions = new Array();
							this.modifyTree(data.list, '', consp_meter_list);
						});
					});
				},
					error => {
						this.errorMsg = error.error.message;
					});
		}
		else {
			this.meterService.given_meter_id(this.customerId).subscribe(data => {
				this.meterFormGroup.patchValue({
					given_meter_id: data.id
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

	resourceChange(resource_id) {
		this.meterFormGroup.patchValue({
			consumption_id: ''
		});

		this.meterService.meterConsumption(this.customerId, resource_id, this.editId).subscribe(conspMeter => {
			var consp_meter_list = {};
			for (let i = 0; i < conspMeter.list.length; i++) {
				const element = conspMeter.list[i];
				consp_meter_list[element.consumption_id] = element.meter_id;

			}
			this.commonService.consumption_list(this.customerId, resource_id).subscribe(data => {
				this.consumptions = new Array();
				this.modifyTree(data.list, '', consp_meter_list);
			});
		});
	}

	modifyTree(data, parant_name, consp_meter_list) {
		for (let i = 0; i < data.length; i++) {
			const element = data[i];
			this.consumptions.push({
				id: element.id,
				disable: (consp_meter_list[element.id] ? true : false),
				name: parant_name + element.name,
			});
			this.modifyTree(element.children, parant_name + element.name + ' -> ', consp_meter_list);

		}

		return true;
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

				this.meterService.update_meter(this.meterFormGroup.value).subscribe(
					data => {
						if (this.submitType == 'save_exit') {
							this.returnUrl = 'customer/meter/list';
						} else {
							this.returnUrl = 'customer/meter/edit/' + this.editId;
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
				this.meterService.create_meter(this.meterFormGroup.value).subscribe(
					data => {
						if (this.submitType == 'save_exit') {
							this.returnUrl = 'customer/meter/list';
						} else {
							this.returnUrl = 'customer/meter/edit/' + data.meter_id;
						}
						this.succMsg = 'Meter added successfully';
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
			return matches && matches.length ? null : { invalid: true };
		} else {
			return null;
		}
	}
}
