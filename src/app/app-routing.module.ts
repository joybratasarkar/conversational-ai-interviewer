import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthLayoutComponent } from './auth/layouts/auth-layout/auth-layout.component';
import { ProjectLayoutComponent } from './shared-components/layouts/project-layout/project-layout.component';
import { ALL_ROUTES } from './core/routes/all-routes';
import { AuthGuard } from './core/guard/auth.guard';
import { projectGuard } from './core/guard/project.guard';

const routes: Routes = [
  {
    path: 'auth',
    component: AuthLayoutComponent,
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
    canActivate: [projectGuard],

  },
  {
    path: '',
    component: ProjectLayoutComponent,
    children: ALL_ROUTES,
    // canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
