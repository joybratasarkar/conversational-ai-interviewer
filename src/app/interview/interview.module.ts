import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InterviewRoutingModule } from './interview-routing.module';
import { IntroductionScreenComponent } from './components/introduction-screen/introduction-screen.component';
import { AiInterviewScreenComponent } from './components/ai-interview-screen/ai-interview-screen.component';
import { SharedLibrariesModule } from '../shared-libraries/shared-libraries.module';
import { InterviewLayoutComponent } from './layout/interview-layout/interview-layout.component';
import { WebcamModule } from 'ngx-webcam';
import { SharedComponentsModule } from '../shared-components/shared-components.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ThankyouScreenComponent } from './components/thankyou-screen/thankyou-screen.component';
import { StartInterviewScreenComponent } from './components/start-interview-screen/start-interview-screen.component';
import { HeaderComponent } from './components/header/header.component';
import { InstructionsScreenComponent } from './components/instructions-screen/instructions-screen.component';


@NgModule({
  declarations: [
    IntroductionScreenComponent,
    AiInterviewScreenComponent,
    InterviewLayoutComponent,
    ThankyouScreenComponent,
    StartInterviewScreenComponent,
    HeaderComponent,
    InstructionsScreenComponent,
    
  ],
  imports: [
    CommonModule,
    InterviewRoutingModule,
    SharedLibrariesModule,
    WebcamModule,
    SharedComponentsModule,
    MatProgressSpinnerModule,
    
    
    
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  
})
export class InterviewModule { }
