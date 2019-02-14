import { Component, OnInit,Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { LoginService } from '../../services/login.service';
import { MatDialogRef,MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-assign-customer',
  templateUrl: './assign-customer.component.html',
  styleUrls: ['./assign-customer.component.scss']
})
export class AssignCustomerComponent implements OnInit {

  userFormGroup: FormGroup; 
  currentUser;
  returnUrl: string;
  errorMsg;
  userId;
  UserRoleType;
  amId = 0;
  submitted = false;
  succMsg;
  selected: string;
  accountmanagers;
  customers = [];
  assign_customers;
  editId = '';
  show_load : boolean = false;

  constructor(private fb: FormBuilder,private route: ActivatedRoute,private router: Router,private loginService: LoginService,private userService: UserService,public dialogRef: MatDialogRef<AssignCustomerComponent>,@Inject(MAT_DIALOG_DATA) public data:any) { 
    this.amId = data.userid;
  }

  ngOnInit() {
    this.currentUser = this.loginService.getDecodedValue(localStorage.getItem('currentUser')); 
    this.userId = this.currentUser.id;
    this.UserRoleType = this.currentUser.role_user_type;
    //this.amId = this.route.snapshot.params['id'];
    this.selected = this.amId.toString();
    this.userService.acc_manager_lists().subscribe(data => {
      this.accountmanagers = data.list;
    });
    this.userService.customer_lists().subscribe(data => {
      this.customers = data.list;
    });
    this.userService.assign_customer_lists(this.amId).subscribe(data => {
      this.assign_customers = data.list;
    });
  	this.userFormGroup = this.fb.group({
      am_id:[this.amId],
      customer:[[], Validators.required],
    });
  }

  onSubmit() {
    if(confirm("Are you sure?")) {
      this.submitted = true;
      this.show_load = true;
      // stop here if form is invalid
      if (this.userFormGroup.invalid) {
        this.show_load = false;
        this.errorMsg = 'Please fill all required fields.';
        return;
      } else {
        this.userService.assign_customer(this.userFormGroup.value).subscribe(
          data => {
            this.dialogRef.close('add');            
          },
          error => {
            this.errorMsg = error.error.message;
          }
        );
      }
    }
  }

  deleteAssignUser(id){
    if(confirm("Are you sure to delete?")) {
      this.show_load = true;
      this.userService.deleteAssignUser(id)            
        .subscribe(data => {
          this.dialogRef.close('delete');
        },
        error => {
          this.show_load = false;
          this.errorMsg = error.error.message;
        });
    }
  }

}
