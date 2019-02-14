import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddEditComponent } from './add-edit/add-edit.component';
import { ListComponent } from './list/list.component';
import { AssignCustomerComponent } from './assign-customer/assign-customer.component';

const routes: Routes = [
  {path: 'add', component: AddEditComponent},
  {path: 'edit/:id', component: AddEditComponent},
  {path: 'list', component: ListComponent},
  {path: 'assign-customer/:id', component: AssignCustomerComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
