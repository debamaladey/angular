import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { DataserviceService } from '../dataservice.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {
  tm_id : Number = 0;
  templateData: any = {};
  templateConfigData: any = {};
  stateList: [];
  cityList: [];
  resourceList: [];
  parameterList: [];
  unitList: [];
  
  constructor(private loginService : LoginService, 
    private route: ActivatedRoute, private router:Router, private commonService: CommonService,
    private dataService: DataserviceService) {
      this.tm_id = this.route.snapshot.params.tm_id;
  }

  ngOnInit() {
    this.setStateList();
    this.setResourceList();
    this.getTemplateData();
  }

  getTemplateData(){
    this.dataService.getTemplateDataView(this.tm_id).subscribe(
      retData => {
        if(retData.rep.data.list.length > 0){
          this.templateData = retData.rep.data.list[0];
        }else{
          this.templateData = {};
        }
      }
    )
    this.dataService.getTemplateConfigData(this.tm_id).subscribe(
      retData => {
        var fetchData = retData.rep.data.list;
        if(fetchData.length > 0){
          var tempConfDataArr = [];
          var tempConfigType = '';
          var m = 0;
          var tablesArr = this.commonService.getTemplateChargesArr();
            for (let index = 0; index < fetchData.length; index++) {
              if(tempConfigType != fetchData[index].tc_name){
                tempConfDataArr[m] = {};
                tempConfDataArr[m].name = tempConfigType = fetchData[index].tc_name;
                tempConfDataArr[m].list = [];
                for (let i = 0; i < tablesArr.length; i++) {
                  if('checkbox_'+tablesArr[i].id == tempConfigType){
                    tempConfDataArr[m].val = tablesArr[i].val;
                  }
                }
                
                for (let k = 0; k < fetchData.length; k++) {
                  if(tempConfigType == fetchData[k].tc_name){
                    tempConfDataArr[m].list.push(fetchData[k].tc_var_name);
                  }
                }
                m++;
              }
            }
            this.templateConfigData = tempConfDataArr;
        }else{
          this.templateConfigData = {};
          console.log(this.templateConfigData);
        }
      }
    );
  }

  setStateList(){
    this.commonService.state_list().subscribe(
      retData =>{
        this.stateList = retData.rep.data.list;
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
      }
    );
  }

  setResourceList(){
    this.commonService.resource_list(0,0).subscribe(
      retData =>{
        //console.log(retData);
        this.resourceList = retData.list;
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
      }
    );
  }

  goToTemplateList(){
    var url = 'config/tariff/template/list' ;
    this.router.navigate([url]);
  }

  goToConfig(){
    var url = 'config/tariff/template/charges_variable_config/'+this.tm_id ;
    this.router.navigate([url]);
  }

}
