import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './guard/auth.guard';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

//import { BasicDetailsComponent } from './customer/basic-details/basic-details.component';

const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', component : LoginComponent},
  {path: 'forgot-password', loadChildren : './forgot-password/forgot-password.module#ForgotPasswordModule'},
  {path: 'customer', loadChildren : './customer/customer.module#CustomerModule',canActivate: [AuthGuard]},
  {path: 'config', loadChildren : './config/config.module#ConfigModule',canActivate: [AuthGuard]},
  {path: 'super-admin', loadChildren : './superadmin/superadmin.module#SuperadminModule',canActivate: [AuthGuard]},
  {path: 'user', loadChildren : './user/user.module#UserModule',canActivate: [AuthGuard]},
  {path: 'user-permission', loadChildren : './user-permission/user-permission.module#UserPermissionModule',canActivate: [AuthGuard]},
  {path: 'account-manager', loadChildren : './account-manager/account-manager.module#AccountManagerModule',canActivate: [AuthGuard]},
  { path: 'page-not-found', component: PageNotFoundComponent },
  { path: '**', redirectTo: 'page-not-found' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
