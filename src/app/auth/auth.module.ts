import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './components/login/login.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { SharedLibrariesModule } from '../shared-libraries/shared-libraries.module';
import { FormsModule } from '@angular/forms';
import { WebcamModule } from 'ngx-webcam';
import { SharedComponentsModule } from '../shared-components/shared-components.module';
import { ExamIdScreenComponent } from './components/login/exam-id-screen/exam-id-screen.component';
import { FAQsScreenComponent } from './components/login/faqs-screen/faqs-screen.component';
import { ContactUsScreenComponent } from './components/login/contact-us-screen/contact-us-screen.component';
import { ResendIdScreenComponent } from './components/login/resend-id-screen/resend-id-screen.component';
import { RouterModule } from '@angular/router';
import { InterviewModule } from '../interview/interview.module';


@NgModule({
  declarations: [
    LoginComponent,
    AuthLayoutComponent,
    ExamIdScreenComponent,
    FAQsScreenComponent,
    ContactUsScreenComponent,
    ResendIdScreenComponent,
    
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    SharedLibrariesModule,
    WebcamModule,
    SharedComponentsModule,
    RouterModule,InterviewModule
  ]
})
export class AuthModule { }
