import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddEditComponent } from './add-edit/add-edit.component';
import { ListComponent } from './list/list.component';

const routes: Routes = [
  {path: 'add', component: AddEditComponent},
  {path: 'edit/:id', component: AddEditComponent},
  {path: 'list', component: ListComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SAcustomerRoutingModule { }
