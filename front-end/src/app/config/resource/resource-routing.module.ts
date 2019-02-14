import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddEditComponent } from './add-edit/add-edit.component';
import { ListingComponent } from './listing/listing.component';
import { UnitListComponent } from './unit-list/unit-list.component';
import { UnitAddEditComponent } from './unit-add-edit/unit-add-edit.component';

const resourceRoutes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  {path: 'list', component: ListingComponent},
  {path: 'add', component: AddEditComponent},
  {path: 'edit/:id', component: AddEditComponent},
  {path: 'unit/list/:resource_id', component: UnitListComponent},
  {path: 'unit/add/:resource_id', component: UnitAddEditComponent},
  {path: 'unit/edit/:resource_id/:unit_id', component: UnitAddEditComponent},
];

@NgModule({
  imports: [RouterModule.forChild(resourceRoutes)],
  exports: [RouterModule]
})
export class ResourceRoutingModule { }
