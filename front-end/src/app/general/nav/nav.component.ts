import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  userModules;
  moduleExists;
  currentUser;
  userID;
  customerID;
  roleID;
  show_load : boolean = false;
  userType;

  constructor(private userService: UserService,private loginService: LoginService) { }

  ngOnInit() {
    setTimeout(()=>{  
      this.currentUser = this.loginService.getDecodedValue(localStorage.getItem('currentUser'));
      this.userID = this.currentUser.id;
      this.customerID = this.currentUser.customer_id;
      this.roleID = this.currentUser.role_id;
      this.userType = this.currentUser.role_user_type
      this.show_load = true;
    }, 2000);    
  }

  // hasPermission(moduleId) {
  //   console.log(moduleId);  
  //   return true;    
  //   // this.userService.getModuleList().subscribe(data => {
  //   //   this.userModules = data.module_list;
  //   // });
      
  //   // if(this.userModules){
  //   //   this.moduleExists = this.userModules.filter(modules => modules.module_id === moduleId);
  //   //   if(this.moduleExists.length > 0){
  //   //     return true;
  //   //   } else{
  //   //     return false;
  //   //   }
  //   // } else {
  //   //   return false;
  //   // }
  // }

}
