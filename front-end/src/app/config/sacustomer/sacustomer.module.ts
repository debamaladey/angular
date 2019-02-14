import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SAcustomerRoutingModule } from './sacustomer-routing.module';
import { GeneralModule } from './../../general/general.module';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material';
import { MatSelectModule } from '@angular/material/select';
import { AddEditComponent } from './add-edit/add-edit.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ListComponent } from './list/list.component';
import {DataTablesModule} from 'angular-datatables';

@NgModule({
  declarations: [AddEditComponent, ListComponent],
  imports: [
    CommonModule,
    SAcustomerRoutingModule,
    NgScrollbarModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    GeneralModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    DataTablesModule
  ]
})
export class SAcustomerModule { }
