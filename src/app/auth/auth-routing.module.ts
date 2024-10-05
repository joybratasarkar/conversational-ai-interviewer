import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ExamIdScreenComponent } from './components/login/exam-id-screen/exam-id-screen.component';
import { FAQsScreenComponent } from './components/login/faqs-screen/faqs-screen.component';
import { ResendIdScreenComponent } from './components/login/resend-id-screen/resend-id-screen.component';
import { ContactUsScreenComponent } from './components/login/contact-us-screen/contact-us-screen.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: ExamIdScreenComponent
  },

  {
    path: 'faq',
    component: FAQsScreenComponent
  },
  {
    path: 'resend-id',
    component: ResendIdScreenComponent
  },
  {
    path: 'contact-us',
    component: ContactUsScreenComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
