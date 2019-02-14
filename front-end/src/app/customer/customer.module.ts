import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerRoutingModule } from './customer-routing.module';
import { BasicDetailsComponent } from './basic-details/basic-details.component';
import { GeneralModule } from '../general/general.module';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material';
import { MatSelectModule } from '@angular/material/select';
import { MeteringConfigurationComponent } from './metering-configuration/metering-configuration.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ResourceComponent } from './resource/resource.component';
import { NgxTreeDndModule } from 'ngx-tree-dnd';
import { ComsumptionComponent } from './comsumption/comsumption.component';
import { ConsumtionMeterAssignComponent } from './comsumption/consumtion-meter-assign/consumtion-meter-assign.component';

@NgModule({
  declarations: [BasicDetailsComponent, MeteringConfigurationComponent, ResourceComponent, ComsumptionComponent, ConsumtionMeterAssignComponent],
  imports: [
    CommonModule,
    CustomerRoutingModule,
    GeneralModule,
    NgScrollbarModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    NgxTreeDndModule
  ]
})
export class CustomerModule { }
