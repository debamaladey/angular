import { Component, OnInit } from '@angular/core';
import { CrudService } from '../crud.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-unit-list',
  templateUrl: './unit-list.component.html',
  styleUrls: ['./unit-list.component.scss']
})
export class UnitListComponent implements OnInit {
  resourcesUnitList;
  msg: any = "";
  msgStatus: any = "";
  returnUrl: any;
  resource_id: number = 0;
  resourceName: any;

  constructor(private CrudService: CrudService, private route : ActivatedRoute, private router : Router) { }

  ngOnInit() {
    this.resource_id = this.route.snapshot.params['resource_id'];
    this.setResourceName();
    this.setTempMsgDetails();
    //console.log(this.resourceName);
    this.getList();
  }

  setResourceName(){
    this.CrudService.getOne(this.resource_id).subscribe(
      retData => {
        //console.log(retData.rep.data[0].resource_name);
        this.resourceName = retData.rep.data[0].resource_name;
      });
  }

  setTempMsgDetails(){
    this.msg = localStorage.getItem('tempMsg');
    this.msgStatus = localStorage.getItem('tempMsgStatus');
    localStorage.setItem('tempMsg', '');
    localStorage.setItem('tempMsgStatus', '');
  }

  ngAfterViewInit(){
    
  }

  getList(){
    this.CrudService.unitList(this.resource_id).subscribe(data => {
      this.resourcesUnitList = data.list;
    });
  }

  updateDeleteStatus(id: number =0){
    this.CrudService.unitDelete(id).subscribe(
      retData => {
        localStorage.setItem('tempMsg', retData.rep.msg);
        localStorage.setItem('tempMsgStatus', retData.rep.status);
        this.ngOnInit();
      },
      error => {
        this.msg = error.error.message;
        this.msgStatus = 'danger';
      }
    );
  }

}
