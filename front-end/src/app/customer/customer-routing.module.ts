import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BasicDetailsComponent } from './basic-details/basic-details.component';
import { MeteringConfigurationComponent } from './metering-configuration/metering-configuration.component';
import { ResourceComponent } from './resource/resource.component';
import { ComsumptionComponent } from './comsumption/comsumption.component';
import { ConsumtionMeterAssignComponent } from './comsumption/consumtion-meter-assign/consumtion-meter-assign.component';

const customerRoutes: Routes = [
  {path: 'basic-details', component: BasicDetailsComponent},
  {path: 'meter-configuration', component: MeteringConfigurationComponent},
  {path : 'virtual-meter', loadChildren : './virtual-meter/virtual-meter.module#VirtualMeterModule'},
  {path : 'meter', loadChildren : './meter/meter.module#MeterModule'},
  {path : 'dashboard', loadChildren : './dashboard/dashboard.module#DashboardModule'},
  {path : 'resources', component: ResourceComponent},
  {path : 'consumption', component: ComsumptionComponent},
  {path : 'consumption/meter-assign', component: ConsumtionMeterAssignComponent}    
];

@NgModule({
  imports: [RouterModule.forChild(customerRoutes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule { }
