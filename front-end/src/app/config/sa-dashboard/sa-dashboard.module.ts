import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SaDashboardRoutingModule } from './sa-dashboard-routing.module';
import { SadashboardComponent } from './sadashboard/sadashboard.component';

import { GeneralModule } from './../../general/general.module';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [SadashboardComponent],
  imports: [
    CommonModule,
    SaDashboardRoutingModule,
    NgScrollbarModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    GeneralModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
  ]
})
export class SaDashboardModule { }
