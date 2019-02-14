import { AfterViewInit, Component, OnInit, Renderer, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { CommonService } from 'src/app/services/common.service';
import { DataserviceService } from '../dataservice.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { MsgDialogService } from 'src/app/general/msg-dialog.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements AfterViewInit,OnDestroy,OnInit {
  tempList ;
  msg: any = "";
  msgStatus: any = "";
  dataList: any;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  constructor(private renderer: Renderer, private route:ActivatedRoute, private router: Router,
    private loginService: LoginService, private commonServic : CommonService, private dataService: DataserviceService,
    public dialog : MsgDialogService) { }

  ngOnInit() {
    this.setTempMsgDetails();
    this.getTemplateList();
  }

  dialogOpen(){
    if(this.msg != ''){
      this.dialog.openInfoModal(this.msg, this.msgStatus);
    }
  }

  getTemplateList(){
    this.dtOptions = {
			pagingType: 'full_numbers',
			serverSide: true,
			processing: true,
			pageLength: 10,
			ajax: (dataTablesParameters: any, callback) => {
				this.dataService.datatable(dataTablesParameters).subscribe(data => {
						callback({
							recordsTotal: data.recordsTotal['COUNT(*)'],
							recordsFiltered: data.recordsFiltered['COUNT(*)'],
							data: data.data[0]
						});
				});
			},
      columns: this.setDataTableColumn(),
      responsive: true,
    };
  }

  setDataTableColumn(){
    var column = [
      {
        title: "Id",
        name: "TM.tm_id",
        data: "tm_id",
        searchable: false,
        orderable: false,
      },
      {
        title: "Template Name",
        name: "TMD.temp_name",
        data: "temp_name",
        searchable: true,
        orderable: true,
      },
      {
        title: "State",
        name: "ST.name",
        data: "state_name",
        searchable: true,
        orderable: true,
      },
      {
        title: "City",
        name: "CT.name",
        data: "city_name",
        searchable: true,
        orderable: true,
      },
      {
        title: "Resource",
        name: "RM.resource_name",
        data: "resource_name",
        searchable: true,
        orderable: true,
      },
      {
        title: "Unit",
        name: "RU.unit_name",
        data: "unit_name",
        searchable: true,
        orderable: true,
      },
      {
        title: "Created By",
        name: "UM.name",
        data: "user_name",
        searchable: true,
        orderable: true,
      },
      {
        title: "Actions",
        name: "TM.tm_id",
        data: 'tm_id',
        searchable: false,
        orderable: false,
        render: function (data: any, type: any, full: any) {
          var actColumn = '';
          if(full.config_status == 'no'){
            actColumn += '<a href="javascript:void(0);" [matTooltip]="Config Charges Variable" class="btn-actions btn-edit float-left"><i temp-id="'+data+'" temp-action="config" class="material-icons">brush</i></a>';
          }
          actColumn += '<a href="javascript:void(0);" [matTooltip]="View Details" class="btn-actions btn-edit float-left"><i temp-id="'+data+'" temp-action="view" class="material-icons">pageview</i></a>';
          actColumn += '<a href="javascript:void(0);" [matTooltip]="Delete" class="btn-actions btn-delete float-left"><i temp-id="'+data+'" temp-action="delete" class="material-icons">delete_forever</i></a></td>';
          return actColumn;
        }
      }
    ];

    return column;
  }

  addTemplate(){
    var url = 'config/tariff/template/add' ;
    this.router.navigate([url]);
  }

  delete(id){
    var deleteStatus = confirm("Are you sure to delete this template?");
    if(deleteStatus) {
      this.dataService.deleteTemplate(id).subscribe(
        retData => {
          this.msg = "Deleted Successfully.";
          this.msgStatus = "success";
          this.dataTableRender();
        }
      );
    }
    
  }

  dataTableRender(){
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
    this.dialogOpen();
  }

  chargesVariableConfigUrl(id){
    var url = 'config/tariff/template/charges_variable_config/'+id ;
    this.router.navigate([url]);
  }

  view(id){
    var url = 'config/tariff/template/view/'+id ;
    this.router.navigate([url]);
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
    this.renderer.listenGlobal('document', 'click', (event) => {
      if (event.target.hasAttribute("temp-action")) {
        var id = event.target.getAttribute('temp-id');
        var action = event.target.getAttribute('temp-action');
        if(action == 'config'){
          this.chargesVariableConfigUrl(id);
        }else if(action == 'view'){
          this.view(id);
        }else if(action == 'delete'){
          this.delete(id);
        }
      }
    });
  }

  ngOnDestroy(): void{
    this.dtTrigger.unsubscribe();
  }

  setTempMsgDetails(){
    this.msg = localStorage.getItem('tempMsg');
    this.msgStatus = localStorage.getItem('tempMsgStatus');
    localStorage.setItem('tempMsg', '');
    localStorage.setItem('tempMsgStatus', '');
    this.dialogOpen();
  }

}
