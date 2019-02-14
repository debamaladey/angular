import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  forgotPasswordFormGroup: FormGroup; 
  currentUser;
  returnUrl: string;
  errorMsg;
  succMsg;

  constructor(private fb: FormBuilder,private loginService: LoginService,private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.forgotPasswordFormGroup = this.fb.group({
  		email:['', [Validators.required,Validators.email]]
    });
  }

  onSubmit() {
    
  	this.loginService.forgot_password(this.forgotPasswordFormGroup.value).subscribe(
        data => {
          this.errorMsg = ''; 
          this.succMsg = 'We have sent you a mail. Please go to your mail to change your password.'        
        },
        error => {
          this.errorMsg = error.error.message;
          this.succMsg = '';
        }
    );
  }

}
