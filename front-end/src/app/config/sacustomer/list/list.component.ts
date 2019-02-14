import { AfterViewInit, Component, OnInit, Renderer, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { MsgDialogService } from 'src/app/general/msg-dialog.service';
import { CustomerService } from '../../../services/sacustomer/customer.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements AfterViewInit,OnDestroy,OnInit {
  users;
  returnUrl: string;
  errorMsg;
  succMsg;
  msg: any = "";
  msgStatus: any = "";
  dataList: any;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  constructor(private customerService: CustomerService,private route: ActivatedRoute,
    private router: Router,private renderer: Renderer,private commonServic : CommonService,
    public dialog : MsgDialogService) { }

  ngOnInit() {
    this.setTempMsgDetails();
    this.getCustomerList();    
  }

  setTempMsgDetails(){
    this.msg = localStorage.getItem('tempMsg');
    this.msgStatus = localStorage.getItem('tempMsgStatus');
    localStorage.setItem('tempMsg', '');
    localStorage.setItem('tempMsgStatus', '');
    this.dialogOpen();
  }

  getCustomerList(){
    // this.customerService.customer_lists().subscribe(data => {
    //   this.users = data.list;
    //   return this.users;
    // });
    this.dtOptions = {
			pagingType: 'full_numbers',
			serverSide: true,
			processing: true,
			pageLength: 10,
			ajax: (dataTablesParameters: any, callback) => {
				this.customerService.customer_lists(dataTablesParameters).subscribe(data => {
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
        name: "CM.id",
        data: "id",
        searchable: false,
        orderable: false,
      },
      {
        title: "Customer Name",
        name: "CM.customer_name",
        data: "customer_name",
        searchable: true,
        orderable: true,
      },
      {
        title: "Customer Unique Id",
        name: "CM.customer_unique_id",
        data: "customer_unique_id",
        searchable: true,
        orderable: true,
      },
      {
        title: "City",
        name: "C.name",
        data: "cname",
        searchable: true,
        orderable: true,
      },
      {
        title: "State",
        name: "ST.name",
        data: "sname",
        searchable: true,
        orderable: true,
      },
      {
        title: "Actions",
        name: "CM.id",
        data: 'id',
        searchable: false,
        orderable: false,
        render: function (data: any, type: any, full: any) {
          var actColumn = '';          
          actColumn += '<a href="javascript:void(0);" [matTooltip]="View Details" class="btn-actions btn-edit float-left"><i temp-id="'+data+'" temp-action="view" class="material-icons">pageview</i></a>';
          actColumn += '<a href="javascript:void(0);" [matTooltip]="Delete" class="btn-actions btn-delete float-left"><i temp-id="'+data+'" temp-action="delete" class="material-icons">delete_forever</i></a></td>';
          return actColumn;
        }
      }
    ];

    return column;
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
    this.renderer.listenGlobal('document', 'click', (event) => {
      if (event.target.hasAttribute("temp-action")) {
        var id = event.target.getAttribute('temp-id');
        var action = event.target.getAttribute('temp-action');
        if(action == 'view'){
          this.editUser(id);
        }else if(action == 'delete'){
          this.deleteUser(id);
        }
      }
    });
  }

  deleteUser(id){
    var deleteStatus = confirm("Are you sure to delete?");
    if(deleteStatus) {
      this.customerService.deleteOneUser(id).subscribe(
        retData => {
          this.msg = "Deleted Successfully.";
          this.msgStatus = "success";
          this.dataTableRender();
        }
      );
    }
  }

  editUser(id){    
    this.router.navigate(['/config/sacustomer/edit/',id]);
  }

  ngOnDestroy(): void{
    this.dtTrigger.unsubscribe();
  }

  dialogOpen(){
    if(this.msg != ''){
      this.dialog.openInfoModal(this.msg, this.msgStatus);
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

}
