import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { GeneralModule } from './../general/general.module';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material';
import { AddEditComponent } from './add-edit/add-edit.component';
import { ListComponent } from './list/list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AssignCustomerComponent } from './assign-customer/assign-customer.component';
import { MatPasswordStrengthModule } from '@angular-material-extensions/password-strength';
import {DataTablesModule} from 'angular-datatables';

@NgModule({
  declarations: [AddEditComponent, ListComponent, AssignCustomerComponent],
  imports: [
    CommonModule,
    UserRoutingModule,
    NgScrollbarModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    GeneralModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    MatDialogModule,
    MatPasswordStrengthModule,
    DataTablesModule
  ],
  exports: [
    MatDialogModule
  ],
  entryComponents : [AssignCustomerComponent]
})
export class UserModule { }
