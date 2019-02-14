import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GeneralModule } from '../../../general/general.module';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap/';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { TemplateRoutingModule } from './template-routing.module';
import { AddEditComponent } from './add-edit/add-edit.component';
import { ListComponent } from './list/list.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { ChargesVariableConfigComponent } from './charges-variable-config/charges-variable-config.component';
import { ViewComponent } from './view/view.component';
import {DataTablesModule} from 'angular-datatables';
import {MatTooltipModule} from '@angular/material/tooltip'; 

@NgModule({
  declarations: [AddEditComponent, ListComponent, ChargesVariableConfigComponent, ViewComponent],
  imports: [
    CommonModule,
    TemplateRoutingModule,
    GeneralModule,
    NgScrollbarModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    ReactiveFormsModule,
    NgbModule,
    MatDatepickerModule,
    MatCheckboxModule,
    DataTablesModule,
    MatTooltipModule,
  ]
})
export class TemplateModule { }
