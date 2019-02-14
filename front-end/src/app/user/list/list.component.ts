import { AfterViewInit, Component, OnInit, Renderer, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { LoginService } from '../../services/login.service';
import {MatDialogConfig,MatDialog } from '@angular/material';
import { AssignCustomerComponent } from '../assign-customer/assign-customer.component';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { MsgDialogService } from 'src/app/general/msg-dialog.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  users;
  returnUrl: string;
  errorMsg;
  succMsg;
  currentUser;
  userId;
  UserRoleType;
  customerId;
  msg: any = "";
  msgStatus: any = "";
  dataList: any;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  constructor(private userService: UserService,private route: ActivatedRoute,
    private router: Router,private loginService: LoginService,private dialog: MatDialog,private renderer: Renderer,private commonServic : CommonService,public dialogService : MsgDialogService) { }

  ngOnInit() {
    this.currentUser = this.loginService.getDecodedValue(localStorage.getItem('currentUser')); 
    this.userId = this.currentUser.id;
    this.UserRoleType = this.currentUser.role_user_type;
    this.customerId = this.currentUser.customer_id;

    this.setTempMsgDetails();
    this.getUserList(this.customerId); 
  }

  setTempMsgDetails(){
    this.msg = localStorage.getItem('tempMsg');
    this.msgStatus = localStorage.getItem('tempMsgStatus');
    localStorage.setItem('tempMsg', '');
    localStorage.setItem('tempMsgStatus', '');
    this.dialogOpen();
  }

  getUserList(customerId){
    this.dtOptions = {
			pagingType: 'full_numbers',
			serverSide: true,
			processing: true,
			pageLength: 10,
			ajax: (dataTablesParameters: any, callback) => {
				this.userService.user_lists(dataTablesParameters,customerId).subscribe(data => {          
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
        name: "u.id",
        data: "id",
        searchable: false,
        orderable: false,
      },
      {
        title: "Name",
        name: "u.name",
        data: "name",
        searchable: true,
        orderable: true,
      },
      {
        title: "Email",
        name: "u.email",
        data: "email",
        searchable: true,
        orderable: true,
      },
      {
        title: "Mobile",
        name: "u.mobile",
        data: "mobile",
        searchable: true,
        orderable: true,
      },
      {
        title: "User Role",
        name: "r.role_name",
        data: "role_name",
        searchable: true,
        orderable: true,
      },
      {
        title: "Actions",
        name: "u.id",
        data: 'id',
        searchable: false,
        orderable: false,
        render: function (data: any, type: any, full: any) {          
          var actColumn = '';          
          actColumn += '<a href="javascript:void(0);" [matTooltip]="View Details" class="btn-actions btn-edit float-left"><i temp-id="'+data+'" temp-action="view" class="material-icons">pageview</i></a>';
          actColumn += '<a href="javascript:void(0);" [matTooltip]="Delete" class="btn-actions btn-delete float-left"><i temp-id="'+data+'" temp-action="delete" class="material-icons">delete_forever</i></a></td>';
          if(full.id != 1 && full.role_id == 2){
            actColumn += '<a href="javascript:void(0);" [matTooltip]="Assign Customer" class="btn-actions btn-delete float-left"><i temp-id="'+data+'" temp-action="assign" class="material-icons">assign</i></a></td>';
          }
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
        }else if(action == 'assign'){
          this.onCreate(id);
        }
      }
    });
  }

  deleteUser(id){
    if(confirm("Are you sure to delete?")) {
      //alert(id);
      this.userService.deleteOneUser(id).subscribe(
        retData => {
          this.msg = "Deleted Successfully.";
          this.msgStatus = "success";
          this.dataTableRender();
        }
      );
    }
  }

  editUser(id){    
    this.router.navigate(['/user/edit/',id]);
  }

  assignCustomer(id){    
    this.router.navigate(['/user/assign-customer/',id]);
  }

  onCreate(id){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.height = '400px';
    dialogConfig.width = '600px';
    dialogConfig.data = { userid: id}
    const dialogRef = this.dialog.open(AssignCustomerComponent,dialogConfig);
    dialogRef.afterClosed().subscribe(
      data => {
        if(data == 'add'){
          this.succMsg = 'Customer added successfully';
        }else if(data == 'delete'){
          this.succMsg = 'Customer removed successfully';
        }        
      }
    ); 
  }

  ngOnDestroy(): void{
    this.dtTrigger.unsubscribe();
  }

  dialogOpen(){
    if(this.msg != ''){
      this.dialogService.openInfoModal(this.msg, this.msgStatus);
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
