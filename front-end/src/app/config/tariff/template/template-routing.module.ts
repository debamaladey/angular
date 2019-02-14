import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddEditComponent } from 'src/app/config/tariff/template/add-edit/add-edit.component';
import { ListComponent } from 'src/app/config/tariff/template/list/list.component';
import { ChargesVariableConfigComponent } from './charges-variable-config/charges-variable-config.component';
import { ViewComponent } from './view/view.component';


const routes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  {path: 'add', component:AddEditComponent},
  {path: 'charges_variable_config/:tm_id', component:ChargesVariableConfigComponent},
  {path: 'edit/:tm_id', component: AddEditComponent},
  {path: 'view/:tm_id', component: ViewComponent},
  {path: 'list', component: ListComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TemplateRoutingModule { }
