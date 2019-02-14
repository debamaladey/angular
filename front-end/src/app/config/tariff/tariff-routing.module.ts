import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
const tariffRoutes: Routes = [
  // {path: 'rule-1', loadChildren : './tariff/rule-1.module#Rule1Module'},
  {path: 'rule-1', loadChildren : './rule-1/rule-1.module#Rule1Module'},
  {path: 'template', loadChildren : './template/template.module#TemplateModule'}
];

@NgModule({
  imports: [RouterModule.forChild(tariffRoutes)],
  exports: [RouterModule]
})
export class TariffRoutingModule { }
