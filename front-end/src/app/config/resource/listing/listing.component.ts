import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CrudService } from './../../resource/crud.service';
import { any } from 'prop-types';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { LoginService } from 'src/app/services/login.service';
import { DatePipe } from '@angular/common';
import {MsgDialogService} from './../../../general/msg-dialog.service';
import { CommonService } from 'src/app/services/common.service';

//declare var $ : any;

@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.scss']
})
export class ListingComponent implements OnInit {
  resourcesList;
  resourcesDeletedList;
  parameterList;
  unitList;
  msg: any = "";
  msgStatus: any = "";
  returnUrl: any;
  resourceForm : FormGroup;
  currentUser : any ;
  userId : number = 0;
  
  constructor(private fb: FormBuilder, private CrudService: CrudService,
    private route: ActivatedRoute, private router: Router, private loginService: LoginService,
    private dateType: DatePipe, public dialog : MsgDialogService, private commonService: CommonService) { 
      
    }

  ngOnInit() {
    this.setSessionUser();
    this.setTempMsgDetails();
    this.getList();
    this.getDeletedList();
    this.resourceForm = this.fb.group({
      resource_id : ['',[Validators.required]],
      rp_id : ['',[Validators.required]],
      ru_id : ['',[Validators.required]],
    });
  }

  setTempMsgDetails(){
    this.msg = localStorage.getItem('tempMsg');
    this.msgStatus = localStorage.getItem('tempMsgStatus');
    localStorage.setItem('tempMsg', '');
    localStorage.setItem('tempMsgStatus', '');
    this.dialogOpen();
  }

  dialogOpen(){
    if(this.msg != ''){
      this.dialog.openInfoModal(this.msg, this.msgStatus);
    }
  }

  onSubmit(){
    //console.log(this.resourceForm);
    if(this.resourceForm.valid){
      var val = this.resourceForm.value;
      this.msg = "Successfully Added.";
      this.msgStatus = "success";
      var data = {
        created_by : this.userId,
        billing_ru_id : val.ru_id,
        is_deleted : '0',
        updated_date : this.dateType.transform(Date.now(),'yyyy-MM-dd HH:mm:ss')
      }
      
      this.CrudService.unDelete(val.resource_id, data).subscribe(
        retData =>{
          this.dialogOpen();
          setTimeout(() => {
            this.ngOnInit();
          }, 3000);
      });
      
    }else{
      this.msg = "Something went wrong.";
      this.msgStatus = "danger";
      this.dialogOpen();
    }
  }

  ngAfterViewInit(){
    
  }

  getList(){
    this.CrudService.list().subscribe(data => {
      this.resourcesList = data.list;
    });
  }

  getDeletedList(){
    this.CrudService.deletedList().subscribe(data => {
      this.resourcesDeletedList = data.list;
    });
  }

  getParameterList(val){
    this.commonService.resource_parameters(val).subscribe(data => {
      this.parameterList = data.list;
    });
  }

  getUnitList(val){
    this.commonService.resource_units(val).subscribe(data => {
      this.unitList = data.list;
    });
  }

  updateDeleteStatus(resource_id:number =0){
    var deleteStatus = confirm("Are you sure to delete this Resource?");
    if(deleteStatus) {
      this.CrudService.delete(resource_id, this.userId).subscribe(
        retData => {
          localStorage.setItem('tempMsg', retData.rep.msg);
          localStorage.setItem('tempMsgStatus', retData.rep.status);
          this.ngOnInit();
        },
        error => {
          this.msg = error.error.message;
          this.msgStatus = 'danger';
          this.dialogOpen();
        }
      );
    }
  }

  setSessionUser(){
    this.currentUser = this.loginService.getDecodedValue(localStorage.getItem('currentUser')); 
    this.userId = this.currentUser.id;
  }

}
