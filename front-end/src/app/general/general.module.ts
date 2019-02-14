import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GeneralRoutingModule } from './general-routing.module';
import { HeaderComponent } from './header/header.component';
import { MatMenuModule} from '@angular/material/menu';
import { NavComponent } from './nav/nav.component';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material';
import { MatSelectModule } from '@angular/material/select';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';

// import { TickerComponent } from '../ticker/ticker.component';

@NgModule({
  declarations: [HeaderComponent, NavComponent, ConfirmDialogComponent],
  imports: [
    CommonModule,
    GeneralRoutingModule,
    MatMenuModule,
    NgScrollbarModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
    // TickerComponent
  ],
  exports:[
    HeaderComponent,
    NavComponent
    
  ]
})
export class GeneralModule { }
