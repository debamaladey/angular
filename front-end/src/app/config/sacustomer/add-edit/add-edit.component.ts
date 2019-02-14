import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { CustomerService } from '../../../services/sacustomer/customer.service';
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.scss']
})
export class AddEditComponent implements OnInit {

  customerFormGroup: FormGroup; 
  currentUser;
  returnUrl: string;
  errorMsg;
  userId;
  customerTypes;
  editId = '';
  submitted = false;
  isreadonly = false;
  succMsg;
  // selected = '3';
  typeselected: string;
  stateselected: string;
  cityselected: string;
  stateLists;
  cityLists;
  viewUsers;
  users;
  show_load : boolean = false;
  phcode;

  constructor(private fb: FormBuilder,private customerService: CustomerService,private route: ActivatedRoute,
    private router: Router,private loginService: LoginService) { }

  ngOnInit() {

    this.currentUser = this.loginService.getDecodedValue(localStorage.getItem('currentUser')); 
    this.userId = this.currentUser.id;

  	this.customerFormGroup = this.fb.group({
      id:[],
      name:['', Validators.required],
      customer_unique_id:['', Validators.required],
      email:['', [Validators.required,Validators.email]],
      mobile:["", [Validators.required]],
      password:['', Validators.required],
      customer_name:['', Validators.required],
      cus_type:['', Validators.required],
      state:['', Validators.required],
      city:['', Validators.required],
      address:['', Validators.required],
      latitude:['', [Validators.required, CustomValidators.latlongValue]],
      longitude:['', [Validators.required, CustomValidators.latlongValue]],
      customer_user_id:[],
      userid:[this.userId]
    });
    
    this.customerService.cust_type_lists().subscribe(data => {
      this.customerTypes = data.list;
    });

    this.customerService.state_lists().subscribe(data => {
      this.stateLists = data.list;
    });

    this.customerService.ph_code().subscribe(data => {
      this.phcode = data.list[0].phonecode;
    });

    this.editId = this.route.snapshot.params['id'];
    
    if(this.editId){
      this.isreadonly = true;
      this.customerService.editOneUser(this.editId)            
      .subscribe(data => {
        this.viewUsers = data.list;
        this.typeselected = this.viewUsers[0].customer_type.toString();
        this.stateselected = this.viewUsers[0].state_id.toString();
        this.cityselected = this.viewUsers[0].city_id.toString();

        this.customerService.city_lists(this.viewUsers[0].state_id).subscribe(data => {
          this.cityLists = data.list;
          this.cityselected = this.viewUsers[0].city_id.toString();
          this.customerFormGroup.patchValue({    
            city :this.cityselected
          });
        });

        this.customerFormGroup = this.fb.group({
          id:[this.viewUsers[0].id],
          name:[this.viewUsers[0].name, Validators.required],
          customer_unique_id:[this.viewUsers[0].customer_unique_id, Validators.required],
          email:[this.viewUsers[0].email, [Validators.required,Validators.email]],
          mobile:[this.viewUsers[0].mobile, [Validators.required]],
          password:[],
          customer_name:[this.viewUsers[0].customer_name, Validators.required],
          cus_type:[this.viewUsers[0].customer_type, Validators.required],
          state:[this.viewUsers[0].state_id, Validators.required],
          city:[this.viewUsers[0].city_id, Validators.required],
          address:[this.viewUsers[0].address, Validators.required],
          latitude:[this.viewUsers[0].latitude, [Validators.required, CustomValidators.latlongValue]],
          longitude:[this.viewUsers[0].longitude, [Validators.required, CustomValidators.latlongValue]],
          customer_user_id:[this.viewUsers[0].customer_user_id],
          userid:[this.userId]
        });
      },
      error => {
        this.errorMsg = error.error.message;
      });
    }

  }
  // RxwebValidators.latitude()
  selectCity(state){
    this.customerService.city_lists(state.value).subscribe(data => {
      this.cityLists = data.list;
    });
  }

  onSubmit() {
    this.submitted = true;
    this.show_load = true;
    // stop here if form is invalid
    if (this.customerFormGroup.invalid) {
      this.errorMsg = 'Please fill all required fields.';
      this.show_load = false;
      return;
    } else {

      if(this.editId){

        this.customerService.update_user(this.customerFormGroup.value,this.editId).subscribe(
          data => {
            setTimeout(()=>{  
              this.succMsg = data.rep.msg;
              this.returnUrl = 'config/sacustomer/list' ;
              this.router.navigate([this.returnUrl]);
              this.show_load = false;
            }, 3000);
          },
          error => {
            this.errorMsg = error.error.message;
            this.show_load = false;
          }
        );
  
      }else{
        
        this.customerService.create_user(this.customerFormGroup.value).subscribe(
          data => {
            setTimeout(()=>{  
              this.succMsg = data.rep.msg;
              this.returnUrl = 'config/sacustomer/list' ;
              this.router.navigate([this.returnUrl]);
              this.show_load = false;
            }, 3000);
          },
          error => {
            this.errorMsg = error.error.message;
            this.show_load = false;
          }
        );
  
      }

    }

  }

}

// create your class that extends the angular validator class
export class CustomValidators extends Validators {
  
	// create a static method for your validation
	static latlongValue(control: FormControl) {
	   
	  // first check if the control has a value
	  if (control.value && control.value.length > 0) {
		 
		// setup simple regex for white listed characters
		const floatRegx = /^-?([1-8]?[1-9]|[1-9]0)\.{1}\d{1,6}/;
		// match the control value against the regular expression
		const matches = control.value.match(floatRegx);
		
		// if there are matches return an object, else return null.
		return matches && matches.length ? null : { invalid_characters: matches };
	  } else {
		return null;
	  }
	}
  }
