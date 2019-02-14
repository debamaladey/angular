import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TariffRuleRoutingModule } from './tariff-rule-routing.module';
import { ResourceChargesComponent } from './resource-charges/resource-charges.component';
import { EnvironmentalChargesComponent } from './environmental-charges/environmental-charges.component';
import { FixedChargesComponent } from './fixed-charges/fixed-charges.component';
import { LoadDetailsComponent } from './load-details/load-details.component';
import { ContractDemandComponent } from './contract-demand/contract-demand.component';
import { TemplateComponent } from './template/template.component';
import { GeneralModule } from './../../general/general.module';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material';
import { MatRadioModule } from '@angular/material/radio';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap/';
import { MatDatepickerModule } from '@angular/material/datepicker';

@NgModule({
  declarations: [ResourceChargesComponent, EnvironmentalChargesComponent, FixedChargesComponent, LoadDetailsComponent, ContractDemandComponent, TemplateComponent],
  imports: [
    CommonModule,
    TariffRuleRoutingModule,
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
    NgbModule,
    MatDatepickerModule,
  ]
})
export class TariffRuleModule { }
