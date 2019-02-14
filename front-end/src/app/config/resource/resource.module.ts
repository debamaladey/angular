import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';


import { ResourceRoutingModule } from './resource-routing.module';
import { AddEditComponent } from './add-edit/add-edit.component';
import { ListingComponent } from './listing/listing.component';
import { GeneralModule } from '../../general/general.module';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { UnitListComponent } from './unit-list/unit-list.component';
import { UnitAddEditComponent } from './unit-add-edit/unit-add-edit.component';
import {MatDialogModule} from "@angular/material";

@NgModule({
  declarations: [ AddEditComponent, ListingComponent, UnitListComponent, UnitAddEditComponent],
  imports: [
    CommonModule,
    ResourceRoutingModule,
    GeneralModule,
    NgScrollbarModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule
  ],
  providers:[
    DatePipe
  ]
})
export class ResourceModule { }
