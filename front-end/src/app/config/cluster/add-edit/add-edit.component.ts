import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { LoginService } from '../../../services/login.service';
import { ClusterService } from '../../../services/cluster/cluster.service';

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.scss']
})
export class AddEditComponent implements OnInit {

  clusterFormGroup: FormGroup; 
  returnUrl: string;
  errorMsg;
  cId = 0;
  submitted = false;
  succMsg;
  selected: string;
  editId = '';
  show_load : boolean = false;
  currentUser;
  userId;
  UserRoleType;
  customers;
  assign_customers;
  viewCluster;

  constructor(private fb: FormBuilder,private route: ActivatedRoute,private router: Router,private loginService: LoginService,private clusterService: ClusterService) { }

  ngOnInit() {
    this.currentUser = this.loginService.getDecodedValue(localStorage.getItem('currentUser')); 
    this.userId = this.currentUser.id;
    this.UserRoleType = this.currentUser.role_user_type;
    this.cId = this.route.snapshot.params['id'];
    if(this.cId == undefined || this.cId == null){
      this.cId = 0;
    }
    this.selected = this.cId.toString();
    this.clusterService.customer_lists().subscribe(data => {
      this.customers = data.list;
    });
    this.clusterService.assign_customer_lists(this.cId).subscribe(data => {
      this.assign_customers = data.list;
    });
  	this.clusterFormGroup = this.fb.group({
      id:[this.cId],
      cluster_name:['', Validators.required],
      cluster_desc:['', Validators.required],
      customer:[[], Validators.required],
    });
    if(this.cId != 0){
      this.clusterService.editCluster(this.cId)            
      .subscribe(data => {
        this.viewCluster = data.list; 
        this.clusterFormGroup = this.fb.group({
          id:[this.viewCluster[0].id],
          cluster_name:[this.viewCluster[0].cluster_name, Validators.required],
          cluster_desc:[this.viewCluster[0].cluster_desc, Validators.required],
          customer:[[]]
        });
      },
      error => {
        this.errorMsg = error.error.message;
      });
    }
  }

  onSubmit() {
    this.submitted = true;
    this.show_load = true;
    // stop here if form is invalid
    if (this.clusterFormGroup.invalid) {
      this.show_load = false;
      this.errorMsg = 'Please fill all required fields.';
      return;
    } else {
      this.clusterService.assign_customer(this.clusterFormGroup.value).subscribe(
        data => {
          //location.reload();
          setTimeout(()=>{  
            this.succMsg = data.rep.msg;
            this.returnUrl = 'config/cluster/list' ;
            this.router.navigate([this.returnUrl]);
            this.show_load = false;
          }, 1000);             
        },
        error => {
          this.errorMsg = error.error.message;
        }
      );
    }
  }

  deleteAssignUser(id,cid){
    
    if(confirm("Are you sure to delete?")) {
      this.show_load = true;
      this.clusterService.deleteAssignUser(id,cid)            
        .subscribe(data => {
          //location.reload(); 
          setTimeout(()=>{  
            this.succMsg = data.rep.msg;
            this.customers = [];
            this.clusterService.customer_lists().subscribe(data => {
              this.customers = data.list;
            });
            this.clusterService.assign_customer_lists(this.cId).subscribe(data => {
              this.assign_customers = data.list;
            });
            this.show_load = false;
          }, 1000);
        },
        error => {
          this.show_load = false;
          this.errorMsg = error.error.message;
        });
    }
  }

}
