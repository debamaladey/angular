import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { Rule1RoutingModule } from './rule-1-routing.module';
import { TodZoneAddEditComponent } from './tod-zone-add-edit/tod-zone-add-edit.component';
import { TodZoneListComponent } from './tod-zone-list/tod-zone-list.component';
import { TemplateAddEditComponent } from './template-add-edit/template-add-edit.component';
import { TemplateListComponent } from './template-list/template-list.component';
import { GeneralModule } from '../../../general/general.module';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap/';
import { MatDatepickerModule } from '@angular/material/datepicker';

@NgModule({
  declarations: [TodZoneAddEditComponent, TodZoneListComponent, TemplateAddEditComponent, TemplateListComponent],
  imports: [
    CommonModule,
    Rule1RoutingModule,
    GeneralModule,
    NgScrollbarModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    ReactiveFormsModule,
    NgbModule,
    MatDatepickerModule
    
  ]
})
export class Rule1Module { 
  time = {hour: 13, minute: 30};
  meridian = true;

  toggleMeridian() {
      this.meridian = !this.meridian;
  }
}
