import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginService } from '../../../services/login.service';
import { ClusterService } from '../../../services/cluster/cluster.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

 
  clusters;
  returnUrl: string;
  errorMsg;
  succMsg;
  currentUser;
  userId;
  UserRoleType;
  customerId;

  constructor(private route: ActivatedRoute,private router: Router,private loginService: LoginService,private clusterService: ClusterService) { }

  ngOnInit() {
    this.currentUser = this.loginService.getDecodedValue(localStorage.getItem('currentUser')); 
    this.userId = this.currentUser.id;
    this.UserRoleType = this.currentUser.role_user_type;
    this.customerId = this.currentUser.customer_id;

    this.clusterService.lists().subscribe(data => {
      this.clusters = data.list;
      return this.clusters;
    });
  }

  deleteCluster(id){
    if(confirm("Are you sure to delete?")) {
      this.clusterService.deleteOneCluster(id)            
        .subscribe(data => {
          this.succMsg = data.list.msg;
          this.clusterService.lists().subscribe(data => {
            this.clusters = data.list;
            return this.clusters;
          });
        },
        error => {
          this.errorMsg = error.error.message;
        });
    }
  }

  editCluster(id){   
    this.router.navigate(['config/cluster/edit/',id]);
  }
}
