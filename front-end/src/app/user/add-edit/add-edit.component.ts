import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { LoginService } from '../../services/login.service';
import {MatPasswordStrengthComponent} from '@angular-material-extensions/password-strength';

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.scss']
})
export class AddEditComponent implements OnInit {

  userFormGroup: FormGroup; 
  currentUser;
  returnUrl: string;
  errorMsg;
  userId;
  UserRoleType;
  userRoles;
  editId = '';
  viewUsers;
  submitted = false;
  isreadonly = false;
  users;
  succMsg;
  // selected = '3';
  selected: string;
  customerId;
  show_load : boolean = false;
  phcode;
  password_strength;

  constructor(private fb: FormBuilder,private userService: UserService,private route: ActivatedRoute,
    private router: Router,private loginService: LoginService) { }

  ngOnInit() {

    this.currentUser = this.loginService.getDecodedValue(localStorage.getItem('currentUser')); 
    this.userId = this.currentUser.id;
    this.UserRoleType = this.currentUser.role_user_type;
    this.customerId = this.currentUser.customer_id;
    this.userService.ph_code().subscribe(data => {
      this.phcode = data.list[0].phonecode;
    });

  	this.userFormGroup = this.fb.group({
      id:[],
      name:['', Validators.required],
      email:['', [Validators.required,Validators.email]],
      mobile:["", [Validators.required]],
      password: ['', Validators.required],
      role:['', Validators.required],
      role_name:[],
      userid:[this.userId],
      user_role_type:[this.UserRoleType],
      customer_id:[this.customerId]
    });
    
    this.userService.role_lists(this.customerId).subscribe(data => {
      this.userRoles = data.roles_list;
    });

    this.editId = this.route.snapshot.params['id'];
    
    if(this.editId){
      this.isreadonly = true;
      this.userService.editOneUser(this.editId)            
      .subscribe(data => {
        this.viewUsers = data.user_edit; 
        this.selected = this.viewUsers[0].role_id.toString();
        this.userFormGroup = this.fb.group({
          id:[this.viewUsers[0].id],
          name:[this.viewUsers[0].name, Validators.required],
          email:[this.viewUsers[0].email, [Validators.required,Validators.email]],
          mobile:[this.viewUsers[0].mobile, [Validators.required]],
          password:[],
          role:[this.viewUsers[0].role_id, Validators.required],
          role_name:[this.viewUsers[0].role_name],
          userid:[this.userId],
          user_role_type:[this.UserRoleType],
          customer_id:[this.customerId]
        });
      },
      error => {
        this.errorMsg = error.error.message;
      });
    }

  }

  onStrengthChanged(event){
    this.password_strength = event;
  }

  onSubmit() {
    this.submitted = true;
    this.show_load = true;
    // stop here if form is invalid
    if (this.userFormGroup.invalid) {
      this.show_load = false;
      this.errorMsg = 'Please fill all required fields.';
      return;
    } else {

      if(this.editId){

        this.userService.update_user(this.userFormGroup.value,this.editId).subscribe(
          data => {
            setTimeout(()=>{  
              this.succMsg = data.rep.msg;
              this.returnUrl = 'user/list' ;
              this.router.navigate([this.returnUrl]);
              this.show_load = false;
            }, 3000);            
          },
          error => {
            this.show_load = false;
            this.errorMsg = error.error.message;
          }
        );
  
      }else{
  
        this.userService.create_user(this.userFormGroup.value).subscribe(
          data => {
            setTimeout(()=>{  
              this.succMsg = data.rep.msg;
              this.returnUrl = 'user/list' ;
              this.router.navigate([this.returnUrl]);
              this.show_load = false;
            }, 3000);
          },
          error => {
            this.show_load = false;
            this.errorMsg = error.error.message;
          }
        );
  
      }

    }

  }

}