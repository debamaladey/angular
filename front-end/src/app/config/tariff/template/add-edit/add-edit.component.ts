import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { LoginService } from 'src/app/services/login.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { DataserviceService } from '../dataservice.service';
import { MsgDialogService } from 'src/app/general/msg-dialog.service';

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.scss']
})
export class AddEditComponent implements OnInit {
  editId: Number = 0;
  selected = '';
  templateForm : FormGroup;
  msg: any = "";
  msgStatus: any = "";
  currentUser: any;
  userId: number;
  stateList: [];
  cityList: [];
  resourceList: [];
  parameterList: [];
  unitList: [];
  tablesArr: Array<{id:string,val:string,status:string}>
  
  constructor(private fb: FormBuilder,private loginService: LoginService, private route: ActivatedRoute,
    private router: Router, private commonService: CommonService, private dataService: DataserviceService,
    public dialog : MsgDialogService ) {
      this.tablesArr = [];
    }

  ngOnInit() {
    this.setTablesArr();
    this.setSessionUser();
    this.setStateList();
    this.setResourceList();
    this.setTemplateForm();
    //console.log(this.templateForm);
    this.editId = this.route.snapshot.params['template_id'];
    
  }

  dialogOpen(){
    if(this.msg != ''){
      this.dialog.openInfoModal(this.msg, this.msgStatus);
    }
  }

  onSubmit(){
    var submitData = this.templateForm.value;
    if(submitData.checkbox_contract_chrages == false 
      && submitData.checkbox_env_chrages == false 
      && submitData.checkbox_fixed_chrages == false
      && submitData.checkbox_load_chrages == false
      && submitData.checkbox_res_chrages == false){
        this.msg = "Please checked any one from the checkbox group to configure the charges variable.";
        this.msgStatus = "danger";
        this.dialogOpen();
      }else{
        this.saveData(submitData);
      }
    console.log(this.templateForm.value);
  }

  saveData(data){
    this.dataService.savedTemplate(data).subscribe(
      retData => {
        setTimeout(() => {
          var tm_id = retData.rep.data.list;
          var url = 'config/tariff/template/charges_variable_config/'+tm_id ;
          this.router.navigate([url]);
        }, 1000);
      }
    );
  }

  setTemplateForm(){
    this.templateForm = this.fb.group({
      tm_id:[0],
      temp_name : ['',[Validators.required]],
      state_id : ['',[Validators.required]],
      city_id : ['',[Validators.required]],
      resource_id : ['',[Validators.required]],
      rp_id : ['',[Validators.required]], // resource parameter table ,[Validators.required]
      ru_id : ['',[Validators.required]], // resource parameter unit table
      checkbox_res_chrages: [''],
      checkbox_env_chrages: [''],
      checkbox_fixed_chrages: [''],
      checkbox_load_chrages: [''],
      checkbox_contract_chrages: [''],
      created_by: [this.userId],
    })
  }

  get form_temp_name() {
    return this.templateForm.get('temp_name');
  }

  get form_state_id() {
    return this.templateForm.get('state_id');
  }

  get form_city_id() {
    return this.templateForm.get('city_id');
  }

  get form_resource_id() {
    return this.templateForm.get('resource_id');
  }

  get form_rp_id() {
    return this.templateForm.get('rp_id');
  }

  get form_ru_id() {
    return this.templateForm.get('ru_id');
  }

  setStateList(){
    this.commonService.state_list().subscribe(
      retData =>{
        this.stateList = retData.rep.data.list;
      },
      error =>{
        this.msg = error.error.message;
        this.msgStatus = 'danger';
        this.dialogOpen();
      }
    );
  }

  generateCity(state_id : any = ''){
    if(state_id == ''){
      this.cityList = [];
    } else if(state_id > 0){
      this.setCityList(state_id);
    }
  }

  setCityList(state_id : number = 0){
    this.commonService.city_list(state_id).subscribe(
      retData =>{
        this.cityList = retData.rep.data.list;
      },
      error =>{
        this.msg = error.error.message;
        this.msgStatus = 'danger';
        this.dialogOpen();
      }
    );
  }

  setResourceList(){
    this.commonService.resource_list(0,0).subscribe(
      retData =>{
        //console.log(retData);
        this.resourceList = retData.list;
      },
      error =>{
        this.msg = error.error.message;
        this.msgStatus = 'danger';
        this.dialogOpen();
      }
    );
  }

  generateParameter(res_id : any = ''){
    if(res_id == ''){
      this.parameterList = [];
    } else if(res_id > 0){
      this.setParameterList(res_id);
    }
    this.unitList = [];
  }

  setParameterList(res_id: number=0){
    this.commonService.resource_parameters(res_id).subscribe(
      retData =>{
        this.parameterList = retData.list;
      },
      error =>{
        this.msg = error.error.message;
        this.msgStatus = 'danger';
        this.dialogOpen();
      }
    );
  }

  generateUnit(param_id: any = ''){
    if(param_id == ''){
      this.unitList = [];
    } else if(param_id > 0){
      this.setUnitList(param_id);
    }
  }

  setUnitList(param_id: number = 0 ){
    this.commonService.resource_units(param_id).subscribe(
      retData =>{
        this.unitList = retData.list;
      },
      error =>{
        this.msg = error.error.message;
        this.msgStatus = 'danger';
        this.dialogOpen();
      }
    );
  }

  setTablesArr(){
    this.tablesArr = this.commonService.getTemplateChargesArr();
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
    this.dialogOpen();
  }

  goToTemplateList(){
    var url = 'config/tariff/template/list' ;
    this.router.navigate([url]);
  }

}
