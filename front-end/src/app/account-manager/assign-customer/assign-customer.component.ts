import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AssigncustomerService } from '../../services/assigncustomer/assigncustomer.service';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-assign-customer',
  templateUrl: './assign-customer.component.html',
  styleUrls: ['./assign-customer.component.scss']
})
export class AssignCustomerComponent implements OnInit {

  users;
  returnUrl: string;
  errorMsg;
  succMsg;

  constructor(private assigncustomerService: AssigncustomerService,private loginService: LoginService,private route: ActivatedRoute,
    private router: Router) { }

    currentUser = this.loginService.getDecodedValue(localStorage.getItem('currentUser')); 
    userId = this.currentUser.id;    

  ngOnInit() {
    this.currentUser.customer_id = 0;
    this.loginService.encodeSession(this.currentUser).subscribe(data => {
      this.assigncustomerService.customer_lists(this.userId).subscribe(data => {
        this.users = data.list;
      });      
    });
  }

  customerDashboard(customerId) {
    this.currentUser.customer_id = customerId;
    this.loginService.encodeSession(this.currentUser).subscribe(data => {
      this.returnUrl = 'customer/dashboard/list' ;
      this.router.navigate([this.returnUrl]);
    });
  }

}
