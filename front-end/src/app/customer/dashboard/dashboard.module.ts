import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { ListComponent } from './list/list.component';

import { GeneralModule } from './../../general/general.module';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {MatStepperModule} from '@angular/material/stepper';


@NgModule({
  declarations: [ListComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    NgScrollbarModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    GeneralModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    MatStepperModule
    
  ]
})
export class DashboardModule { }
