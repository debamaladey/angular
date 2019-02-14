import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VirtualMeterRoutingModule } from './virtual-meter-routing.module';
import { GeneralModule } from './../../general/general.module';
import { ListComponent } from './list/list.component';
import { AddEditComponent, BenchmarkValueDialog } from './add-edit/add-edit.component';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material';
import { MatRadioModule } from '@angular/material/radio';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {MatDialogModule} from '@angular/material';

@NgModule({
  declarations: [ListComponent, AddEditComponent, BenchmarkValueDialog],
  entryComponents: [BenchmarkValueDialog],
  imports: [
    CommonModule,
    VirtualMeterRoutingModule,
    NgScrollbarModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    GeneralModule,
    MatCheckboxModule,
    MatRadioModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
		MatDialogModule,
  ]
})
export class VirtualMeterModule { }
