import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ConsumptionService } from '../../../services/consumption/consumption.service';
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-consumtion-meter-assign',
  templateUrl: './consumtion-meter-assign.component.html',
  styleUrls: ['./consumtion-meter-assign.component.scss']
})
export class ConsumtionMeterAssignComponent implements OnInit {

  consumptionList;
  returnUrl: string;
  errorMsg;
  succMsg;
  meterList;

  constructor(private consumptionService: ConsumptionService,private route: ActivatedRoute,
    private router: Router,private loginService: LoginService) { }

   currentUser = this.loginService.getDecodedValue(localStorage.getItem('currentUser')); 
   userId = this.currentUser.id;
   customerId = this.currentUser.customer_id;

  ngOnInit() {
    this.listing();    
  }
  listing(){
    this.consumptionService.consumption_meter_lists(this.customerId).subscribe(data => {
      this.consumptionList = data.list;        
    });
    this.consumptionService.meter_lists().subscribe(data => {
      this.meterList = data.list;        
    });
  }
  changeAssignedMeter(meterId,resourceID){
    this.consumptionService.assign_meter(meterId,resourceID).subscribe(data => {
      this.succMsg = data.rep.msg;
      this.listing();    
      this.returnUrl = 'customer/consumption/meter-assign' ;
      this.router.navigate([this.returnUrl]);
    },
    error => {
      this.errorMsg = error.error.message;
    });
  }

}
