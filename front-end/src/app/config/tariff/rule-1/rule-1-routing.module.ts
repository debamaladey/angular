import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TodZoneAddEditComponent } from './tod-zone-add-edit/tod-zone-add-edit.component';
import { TodZoneListComponent } from './tod-zone-list/tod-zone-list.component';
import { TemplateAddEditComponent } from './template-add-edit/template-add-edit.component';
import { TemplateListComponent } from './template-list/template-list.component';


const rul1Routes: Routes = [
  {path: 'tod-zone-add', component: TodZoneAddEditComponent},
  {path: 'tod-zone-list', component: TodZoneListComponent},
  {path: 'template-add', component: TemplateAddEditComponent},
  {path: 'template-list', component: TemplateListComponent}
];

@NgModule({
  imports: [RouterModule.forChild(rul1Routes)],
  exports: [RouterModule]
})
export class Rule1RoutingModule { }
