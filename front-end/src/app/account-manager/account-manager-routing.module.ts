import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AmdashboardComponent } from './amdashboard/amdashboard.component';
import { AssignCustomerComponent } from './assign-customer/assign-customer.component';

const routes: Routes = [
  {path: 'dashboard', component: AmdashboardComponent},
  {path: 'customer', component: AssignCustomerComponent},
  {path: 'tariff-rule', loadChildren: './tariff-rule/tariff-rule.module#TariffRuleModule'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountManagerRoutingModule { }
