import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { LoginService } from 'src/app/services/login.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { DataserviceService } from '../dataservice.service';
import { setTNodeAndViewData } from '@angular/core/src/render3/state';
import { MsgDialogService } from 'src/app/general/msg-dialog.service';

@Component({
  selector: 'app-charges-variable-config',
  templateUrl: './charges-variable-config.component.html',
  styleUrls: ['./charges-variable-config.component.scss']
})
export class ChargesVariableConfigComponent implements OnInit {
  tm_id : Number = 0;
  tdl_id : Number = 0;
  configForm : FormGroup;
  msg: any = "";
  msgStatus: any = "";
  currentUser: any;
  userId: number;
  tablesArr:Array<{id:string,val:string,status:string}>
  templateData: any;
  templateName: any;
  checkbox_res_chrages_status;
  checkbox_env_chrages_status;
  checkbox_fixed_chrages_status;
  checkbox_load_chrages_status;
  checkbox_contract_chrages_status;

  constructor(private fb: FormBuilder, private loginService : LoginService, 
    private route: ActivatedRoute, private router:Router, private commonService: CommonService,
    private dataService: DataserviceService,public dialog : MsgDialogService
    ) { 
      this.tablesArr = [];
      this.tm_id = this.route.snapshot.params.tm_id;
      this.checkbox_res_chrages_status = 0;
      this.checkbox_env_chrages_status = 0;
      this.checkbox_fixed_chrages_status = 0;
      this.checkbox_load_chrages_status = 0;
      this.checkbox_contract_chrages_status = 0;
    }

  ngOnInit() {
    this.setSessionUser();
    this.setTablesArr();
    this.setConfigForm();
    this.getTemplateData();
    
  }

  dialogOpen(){
    if(this.msg != ''){
      this.dialog.openInfoModal(this.msg, this.msgStatus);
    }
  }

  onSubmit(){
    var submitData = this.configForm;
    this.errorSet(submitData);
    if(this.msgStatus == ''){
      this.saveConfigData();
    }
  }

  saveConfigData(){
    var configVal = this.configForm.value;
    this.dataService.saveConfigData(configVal).subscribe(
      retData => {
        setTimeout(() => {
          var tm_id = retData.rep.data.list;
          var url = 'config/tariff/template/list';
          localStorage.setItem('tempMsg', retData.rep.msg);
          localStorage.setItem('tempMsgStatus', retData.rep.status);
          this.router.navigate([url]);
        }, 1000);
      }
    );
  }

  errorSet(submitData){
    this.msg = "";
    this.msgStatus = "";
    if(this.configForm.status == 'INVALID'){
      this.msg = "Please enter the value which are blank.";
      this.msgStatus = "danger";
      this.dialogOpen();
    }else{
      Object.keys(this.configForm.controls).forEach(key => {
        if(key == 'tm_id' ||  key == 'tdl_id'){
          
        }else{
          if(this.configForm.get(key).status == 'INVALID'){
            this.msg = "Please enter the value which are blank.";
            this.msgStatus = "danger";
            this.configForm.get(key).markAsDirty();
            this.dialogOpen();
          }else{
            this.msg = "";
            this.msgStatus = "";
          }
        }
      });
    }
  }

  setConfigForm(){
    this.configForm = this.fb.group({
      tm_id: this.tm_id,
      checkbox_res_chrages: this.fb.array([]),
      checkbox_env_chrages: this.fb.array([]),
      checkbox_fixed_chrages: this.fb.array([]),
      checkbox_load_chrages: this.fb.array([]),
      checkbox_contract_chrages: this.fb.array([]),
    })
  }

  get checkbox_res_chrages(){
    return this.configForm.get('checkbox_res_chrages') as FormArray;
  }

  get checkbox_env_chrages(){
    return this.configForm.get('checkbox_env_chrages') as FormArray;
  }

  get checkbox_fixed_chrages(){
    return this.configForm.get('checkbox_fixed_chrages') as FormArray;
  }

  get checkbox_load_chrages(){
    return this.configForm.get('checkbox_load_chrages') as FormArray;
  }

  get checkbox_contract_chrages(){
    return this.configForm.get('checkbox_contract_chrages') as FormArray;
  }

  getTemplateData(){
    this.dataService.getTemplateData(this.tm_id).subscribe(
      retData => {
        // console.log(retData.rep.data.list.length);
        // console.log(retData.rep.data.list);
        if(retData.rep.data.list.length > 0){
          this.templateData = retData.rep.data.list;
          this.templateName = retData.rep.data.list[0].temp_name;
          this.tdl_id = retData.rep.data.list[0].tdl_id;
          this.setChargesForm();
        }else{
          this.templateData = '';
          this.templateName = '';
        }
      }
    )
  }

  setChargesForm(){
    if(this.templateData.length > 0){
      for (let index = 0; index < this.templateData.length; index++) {
        if(this.templateData[index].tc_status == 1){
          const es = this.fb.group({
            tc_id: this.templateData[index].tc_id,
            tc_var_name: ['',[Validators.required]],
          })
          const formarrr = this.configForm.get(this.templateData[index].tc_name) as FormArray;
          formarrr.push(es);
          this.setChargesVaribaleDivShowStatus(this.templateData[index].tc_name, this.templateData[index].tc_id);
        }
      }
    }
  }

  cloneTypeForm(type, tc_id){
    const es = this.fb.group({
      tc_id: tc_id,
      tc_var_name: ['',[Validators.required]],
    })
    const formarrr = this.configForm.get('checkbox_'+type) as FormArray;
    formarrr.push(es);
  }

  deleteTypeRow(type, index: number) {
    var deleteStatus = confirm("Are you sure to delete this Variable?");
    if(deleteStatus) {
      // control refers to your formarray
      const control = <FormArray>this.configForm.get('checkbox_'+type);
      // remove the chosen row
      control.removeAt(index);
    }
}

  setChargesVaribaleDivShowStatus(name, tc_id){
    if(name == "checkbox_res_chrages"){
      this.checkbox_res_chrages_status = tc_id;
    }else if(name == "checkbox_env_chrages"){
      this.checkbox_env_chrages_status = tc_id;
    }else if(name == "checkbox_fixed_chrages"){
      this.checkbox_fixed_chrages_status = tc_id;
    }else if(name == "checkbox_load_chrages"){
      this.checkbox_load_chrages_status = tc_id;
    }else if(name == "checkbox_contract_chrages"){
      this.checkbox_contract_chrages_status = tc_id;
    }
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
