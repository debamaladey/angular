import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CrudService } from '../crud.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-unit-add-edit',
  templateUrl: './unit-add-edit.component.html',
  styleUrls: ['./unit-add-edit.component.scss']
})
export class UnitAddEditComponent implements OnInit {
  unitForm : FormGroup;
  submitted : boolean = false;
  buttonSaveVal : any = 'Save';
  currentUser : any ;
  userId : number = 0;
  returnUrl: string;
  msg: any = "";
  msgStatus: any = "";
  editId : number = 0;
  resource_id: number = 0;
  constructor(private fb: FormBuilder, private CrudService: CrudService, private route: ActivatedRoute, private router:Router) { }

  ngOnInit() {
    //console.log(this.route.snapshot.params);
    this.resource_id = this.route.snapshot.params['resource_id'];
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.userId = this.currentUser.id;
    this.unitForm = this.fb.group({
      unit_name : ['',[Validators.required]],
      actionType : ['add'],
      resource_id : ['0'],
      unit_id : ['0'],
    });
    this.editId = this.route.snapshot.params['unit_id'];
    //console.log(this.editId);
    if(this.editId > 0){
      this.CrudService.unitGetOne(this.editId).subscribe(
        retData => {
          this.unitForm = this.fb.group({
            resource_name : [retData.rep.data[0].resource_name,[Validators.required]],
            resource_type : [''],
            actionType : ['edit'],
            resource_id : retData.rep.data[0].resource_id,
            unit_id : retData.rep.data[0].ru_id,
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

  get unit_name() {
    return this.unitForm.get('unit_name');
  }

  get actionType() {
    return this.unitForm.get('actionType');
  }

  get resourceId() {
    return this.unitForm.get('resource_id');
  }

  get unitId() {
    return this.unitForm.get('unit_id');
  }

  onSubmit() {
    var formData = this.unitForm.value;
    var postResData = {
      unit_name : formData.unit_name,
      resource_id : formData.resource_id,
      created_by : this.userId
    }
    if(formData.actionType == 'add'){
      this.add(postResData);
    }else if(formData.actionType == 'edit'){
      var id = formData.resource_id;
      this.update(postResData, id);
    }
    
  }

  add(postResData){
    this.CrudService.unitAdd(postResData).subscribe(
      retData => {
        this.msg = retData.rep.msg;
        this.msgStatus = retData.rep.status;
        if(this.msgStatus == 'success'){
          this.returnUrl = 'config/resource/unit/list/'+this.resource_id ;
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
    this.CrudService.unitUpdate(postResData, id).subscribe(
      retData => {
        this.msg = retData.rep.msg;
        this.msgStatus = retData.rep.status;
        if(this.msgStatus == 'success'){
          this.returnUrl = 'config/resource/unit/list'+this.resource_id ;
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

  setTempMsgDetails(){
    this.msg = localStorage.getItem('tempMsg');
    this.msgStatus = localStorage.getItem('tempMsgStatus');
    localStorage.setItem('tempMsg', '');
    localStorage.setItem('tempMsgStatus', '');
  }

  

}
