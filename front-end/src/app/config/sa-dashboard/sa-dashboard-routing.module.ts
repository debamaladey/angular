import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SadashboardComponent } from './sadashboard/sadashboard.component';

const routes: Routes = [
  {path: 'dashboard', component: SadashboardComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SaDashboardRoutingModule { }
