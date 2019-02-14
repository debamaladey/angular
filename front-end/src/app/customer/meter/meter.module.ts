import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MeterRoutingModule } from './meter-routing.module';
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
import { ConfigurationComponent } from './configuration/configuration.component';
import {MatDialogModule} from '@angular/material';

@NgModule({
	declarations: [ListComponent, AddEditComponent, ConfigurationComponent, BenchmarkValueDialog],
	entryComponents: [BenchmarkValueDialog],
	imports: [
		CommonModule,
		MeterRoutingModule,
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
export class MeterModule { }
