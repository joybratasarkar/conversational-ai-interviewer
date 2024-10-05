import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectLayoutComponent } from './shared-components/layouts/project-layout/project-layout.component';
import { ALL_ROUTES } from './core/routes/all-routes';
import { AuthGuard } from './core/guard/auth.guard';
import { projectGuard } from './core/guard/project.guard';

const routes: Routes = [
 
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
