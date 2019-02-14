import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TemplateComponent } from './template/template.component';
import { ResourceChargesComponent } from './resource-charges/resource-charges.component';
import { EnvironmentalChargesComponent } from './environmental-charges/environmental-charges.component';
import { FixedChargesComponent } from './fixed-charges/fixed-charges.component';
import { LoadDetailsComponent } from './load-details/load-details.component';
import { ContractDemandComponent } from './contract-demand/contract-demand.component';

const routes: Routes = [
  {path: 'template/:id', component: TemplateComponent},
  {path: 'resource-charges/:id/:tc_id', component: ResourceChargesComponent},
  {path: 'environmental-charges/:id/:tc_id', component: EnvironmentalChargesComponent},
  {path: 'fixed-charges/:id/:tc_id', component: FixedChargesComponent},
  {path: 'load-details/:id/:tc_id', component: LoadDetailsComponent},
  {path: 'contract-demand/:id/:tc_id', component: ContractDemandComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TariffRuleRoutingModule { }
