import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { BasicDetailsService } from '../basic-details/basic-details.service';

@Component({
	selector: 'app-basic-details',
	templateUrl: './basic-details.component.html',
	styleUrls: ['./basic-details.component.scss']
})
export class BasicDetailsComponent implements OnInit {

	basicDetailsFormGroup: FormGroup;
	currentUser;
	returnUrl: string;
	errorMsg;
	selected = 'option2';
	namePattern = "^[a-zA-Z ]+$"; 
	phonePattern = "^[0-9-]{10,}$"; 
	isValidFormSubmitted = null;

	constructor(private fb: FormBuilder,private route: ActivatedRoute,
		private router: Router,private BasicDetailsService: BasicDetailsService) { }

	ngOnInit() {

		this.basicDetailsFormGroup = this.fb.group({
			name:['', [Validators.required, Validators.pattern(this.namePattern)]],
			email:['', [Validators.required,Validators.email]],
			password:['', [Validators.required]],
			mobile:['', [Validators.required, Validators.pattern(this.phonePattern)]]
		});
	}

	get name() {
		return this.basicDetailsFormGroup.get('name');
	}

	get email() {
		return this.basicDetailsFormGroup.get('email');
	}

	get password() {
		return this.basicDetailsFormGroup.get('password');
	}

	get mobile() {
		return this.basicDetailsFormGroup.get('mobile');
	} 

	onSubmit() {
		this.isValidFormSubmitted = false;
		if (this.basicDetailsFormGroup.invalid) {
			return;
		}
		this.isValidFormSubmitted = true;
		this.BasicDetailsService.add_customer(this.basicDetailsFormGroup.value).subscribe(
	        data => {
	          this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
	          this.errorMsg = '';
	          this.returnUrl = 'config/dashboard' ;
	          this.router.navigate([this.returnUrl]);
	        },
	        error => {
	          console.log(error);
	          this.errorMsg = error.error.message;
	        }
	    );

	}

}
