import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { ResourceRoutingModule } from './resource-routing.module';
import { AddEditComponent } from './add-edit/add-edit.component';
import { ListingComponent } from './listing/listing.component';

@NgModule({
  declarations: [AddEditComponent, ListingComponent],
  imports: [
    CommonModule,
    ResourceRoutingModule
  ]
})
export class ResourceModule { }
