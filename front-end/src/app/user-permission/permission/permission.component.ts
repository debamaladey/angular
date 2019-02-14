import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { PermissionService } from '../../services/permission/permission.service';

@Component({
  selector: 'app-permission',
  templateUrl: './permission.component.html',
  styleUrls: ['./permission.component.scss']
})
export class PermissionComponent implements OnInit {

  roleLists:any;
  userFormGroup: FormGroup; 
  errorMsg;
  succMsg;
  moduleLists;
  returnUrl;
  submitted;
  rolemoduleArray;
  rolemodulePermission = [];
  index;

  constructor(private fb: FormBuilder,private PermissionService: PermissionService,private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {    
    this.PermissionService.role_module_array().subscribe(data2 => {
      this.rolemoduleArray = data2.list;
    });
    this.PermissionService.role_lists().subscribe(data => {
      this.roleLists = data.list;
      if(this.roleLists.length > 0){        
        for(let i = 0; i < this.roleLists.length; i++){
          this.PermissionService.module_lists(this.roleLists[i].role_id).subscribe(data1 => {
            this.roleLists[i].modules = data1.list;
          });   
        }
      }    
    });
  }

  userPermission(moduleId,roleId,event) {
    if(event.target.checked == true){
      this.PermissionService.role_module_permission(moduleId,roleId,1)            
      .subscribe(data => {
      },
      error => {
      });
    } else {
      this.PermissionService.role_module_permission(moduleId,roleId,0)            
      .subscribe(data => {
      },
      error => {       
      });
    }
  }

  onSubmit() {
    this.succMsg = 'Permission added successfully';
    this.returnUrl = 'user-permission/list' ;
    this.router.navigate([this.returnUrl]);
  }

  checkModulePermission(moduleId,roleId) {
    
    this.index = 0;
    if(this.rolemoduleArray && this.rolemoduleArray.length>0){
      for (var i = 0; i < this.rolemoduleArray.length; i++) {
  
        if (this.rolemoduleArray[i]['module_id'] == moduleId && this.rolemoduleArray[i]['role_id'] == roleId) {
          this.index = 1;
        }

      }
    }
    if(this.index == 1){
      return true;
    }else{
      return false;
    }
  }

}
