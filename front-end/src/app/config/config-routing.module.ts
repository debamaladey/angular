import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'resource', pathMatch: 'full' },
  {path: 'superadmin', loadChildren : './sa-dashboard/sa-dashboard.module#SaDashboardModule'},
  {path: 'tariff', loadChildren : './tariff/tariff.module#TariffModule'},
  {path: 'resource', loadChildren : './resource/resource.module#ResourceModule'},
  {path: 'sacustomer', loadChildren : './sacustomer/sacustomer.module#SAcustomerModule'},
  {path: 'cluster', loadChildren : './cluster/cluster.module#ClusterModule'},
  {path: 'change-password', loadChildren : './change-password/change-password.module#ChangePasswordModule'},
  {path: 'mail', loadChildren : './email/email.module#EmailModule'},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigRoutingModule { }
