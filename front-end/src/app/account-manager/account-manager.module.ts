import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GeneralModule } from './../general/general.module';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AccountManagerRoutingModule } from './account-manager-routing.module';
import { AmdashboardComponent } from './amdashboard/amdashboard.component';
import { AssignCustomerComponent } from './assign-customer/assign-customer.component';

@NgModule({
  declarations: [AmdashboardComponent, AssignCustomerComponent],
  imports: [
    CommonModule,
    AccountManagerRoutingModule,
    NgScrollbarModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    GeneralModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
  ]
})
export class AccountManagerModule { }
