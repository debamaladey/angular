import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import {MatPasswordStrengthComponent} from '@angular-material-extensions/password-strength';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  passwordFormGroup: FormGroup; 
  returnUrl: string;
  errorMsg;
  editId = '';
  submitted = false;
  isreadonly = false;
  succMsg;
  currentUser;
  show_load;
  password_strength;

  constructor(private fb: FormBuilder,private route: ActivatedRoute,private router: Router,private loginService: LoginService) { }

  ngOnInit() {
    this.editId = this.route.snapshot.params['id'];
    this.passwordFormGroup = this.fb.group({
      id:[this.editId],
      password: ['', [Validators.required]],
      confirm_password: ['', [Validators.required]]
    }, {validator: this.checkPasswords });
  }

  onStrengthChanged(event){
    this.password_strength = event;
  }

  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    let pass = group.controls.password.value;
    let confirmPass = group.controls.confirm_password.value;

    return pass === confirmPass ? null : { notSame: true }     
  }

   onSubmit() {
    this.submitted = true;
    this.show_load = true;
    
    // stop here if form is invalid
    if (this.passwordFormGroup.invalid) {
      this.errorMsg = 'Please fill all required fields.';
      this.show_load = false;
      return;
    } else {
      this.loginService.forgot_password_change(this.passwordFormGroup.value).subscribe(
        data => {
          setTimeout(()=>{  
            this.succMsg = data.rep.msg;
            this.returnUrl = 'forgot-password/change/'+this.editId ;
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
