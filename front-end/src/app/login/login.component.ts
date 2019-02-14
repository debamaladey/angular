import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {  

  loginFormGroup: FormGroup; 
  currentUser;
  returnUrl: string;
  errorMsg;

  constructor(private fb: FormBuilder,private loginService: LoginService,private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {

  	this.loginFormGroup = this.fb.group({
  		email:['', [Validators.required,Validators.email]],
  		password:['', Validators.required]
    });
    
    this.loginService.logout();
    //this.loginService.isLoggedIn();

  }

  onSubmit() {
    
  	this.loginService.login_user(this.loginFormGroup.value).subscribe(
        data => {
          this.errorMsg = '';
          this.currentUser = this.loginService.getDecodedValue(localStorage.getItem('currentUser')); 
          if(this.currentUser.password_set == 'No'){
              this.returnUrl = 'config/change-password/change' ;
          }else{
            if(this.currentUser.role_id == 1){
              this.returnUrl = 'config/superadmin/dashboard' ;
            }else if(this.currentUser.role_id == 2){
              this.returnUrl = 'account-manager/dashboard' ;
            }else{
              this.returnUrl = 'customer/dashboard/list' ;
            }
          }          
          this.router.navigate([this.returnUrl]);
        },
        error => {
          this.errorMsg = error.error.message;
        }
    );
  }

}
