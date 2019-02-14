import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddEditComponent } from './add-edit/add-edit.component';
import { ListComponent } from './list/list.component';
import { ConfigurationComponent } from './configuration/configuration.component';

const meter: Routes = [
  {path: 'add', component: AddEditComponent},
  {path: 'edit/:id', component: AddEditComponent},
  {path: 'list', component: ListComponent},
  {path: 'configuration', component: ConfigurationComponent},
  {path: 'configuration/:id', component: ConfigurationComponent},
];

@NgModule({
  imports: [RouterModule.forChild(meter)],
  exports: [RouterModule]
})
export class MeterRoutingModule { }
