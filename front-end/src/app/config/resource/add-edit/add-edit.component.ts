import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, AbstractControl, ValidatorFn, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CrudService } from '../crud.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.scss']
})

export class AddEditComponent implements OnInit {
  resourceForm : FormGroup;
  submitted : boolean = false;
  buttonSaveVal : any = 'Save';
  currentUser : any ;
  userId : number = 0;
  returnUrl: string;
  msg: any = "";
  msgStatus: any = "";
  editId : number = 0;
  checkUniqueStatus : number = 0;
  resourceList: any;
  @Input() listMsg: any = "";
  constructor(private fb: FormBuilder, private CrudService: CrudService,private route: ActivatedRoute,
    private router: Router, private loginService:LoginService) { }


  get parent_resource_id() {
    return this.resourceForm.get('resource_unit') as FormArray
  } 
  
  

  ngOnInit() {
    //this.setTempMsgDetails();
    // this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    // this.userId = this.currentUser.id;
    this.currentUser = this.loginService.getDecodedValue(localStorage.getItem('currentUser')); 
    this.userId = this.currentUser.id;
    
    this.resourceForm = this.fb.group({
      resource_name : ['',[Validators.required]],
      actionType : ['add'],
      resource_id : ['0'],
    });
    this.editId = this.route.snapshot.params['id'];
    if(this.editId > 0){
      this.CrudService.getOne(this.editId).subscribe(
        retData => {
          this.resourceForm = this.fb.group({
            resource_name : [retData.rep.data[0].resource_name,[Validators.required]],
            resource_type : [''],
            actionType : ['edit'],
            resource_id : retData.rep.data[0].resource_id,
          });
          this.buttonSaveVal = 'Update';
        },
        error => {
          this.msg = error.error.message;
          this.msgStatus = 'danger';
        }
      );
    }
  }

  onSubmit() {
    var formData = this.resourceForm.value;
    var postResData = {
      resource_name : formData.resource_name,
      created_by : this.userId
    }
    if(formData.actionType == 'add'){
      this.add(postResData);
    }else if(formData.actionType == 'edit'){
      var id = formData.resource_id;
      this.update(postResData, id);
    }
    
  }

  get resource_name() {
    return this.resourceForm.get('resource_name');
  }

  get actionType() {
    return this.resourceForm.get('actionType');
  }

  get resourceId() {
    return this.resourceForm.get('resource_id');
  }

  add(postResData){
    this.CrudService.add(postResData).subscribe(
      retData => {
        this.msg = retData.rep.msg;
        this.msgStatus = retData.rep.status;
        if(this.msgStatus == 'success'){
          this.returnUrl = 'config/resource/list' ;
          this.router.navigate([this.returnUrl]);
          localStorage.setItem('tempMsg', this.msg);
          localStorage.setItem('tempMsgStatus', this.msgStatus);
        }
      },
      error => {
        this.msg = error.error.message;
        this.msgStatus = 'danger';
      }
    );
  }

  update(postResData, id){
    this.CrudService.update(postResData, id).subscribe(
      retData => {
        this.msg = retData.rep.msg;
        this.msgStatus = retData.rep.status;
        if(this.msgStatus == 'success'){
          this.returnUrl = 'config/resource/list';
          this.router.navigate([this.returnUrl]);
          localStorage.setItem('tempMsg', this.msg);
          localStorage.setItem('tempMsgStatus', this.msgStatus);
        }
      },
      error => {
        this.msg = error.error.message;
        this.msgStatus = 'danger';
      }
    );
  }

  setSessionUser(){
    this.currentUser = this.loginService.getDecodedValue(localStorage.getItem('currentUser')); 
    this.userId = this.currentUser.id;
  }

  setTempMsgDetails(){
    this.msg = localStorage.getItem('tempMsg');
    this.msgStatus = localStorage.getItem('tempMsgStatus');
    localStorage.setItem('tempMsg', '');
    localStorage.setItem('tempMsgStatus', '');
  }

  

}
