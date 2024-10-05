import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IntroductionScreenComponent } from './components/introduction-screen/introduction-screen.component';
import { AiInterviewScreenComponent } from './components/ai-interview-screen/ai-interview-screen.component';
import { ReloadGuard } from '../core/guard/LocalStorageCleanupGuard';
import { ThankyouScreenComponent } from './components/thankyou-screen/thankyou-screen.component';
import { StartInterviewScreenComponent } from './components/start-interview-screen/start-interview-screen.component';
import { InstructionsScreenComponent } from './components/instructions-screen/instructions-screen.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full'
  },
  {
    path: '',
    component: InstructionsScreenComponent
  },
  {
    path: 'start-interview-screen',
    component: StartInterviewScreenComponent,
    // canActivate: [ReloadGuard]
  },
  {
    path: 'ai-interview-screen',
    component: AiInterviewScreenComponent,
    // canActivate: [ReloadGuard]
  },
  {
    path: 'instructions-screen',
    component: InstructionsScreenComponent,
  },
  {
    path: 'thankyou',
    component: ThankyouScreenComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InterviewRoutingModule { }
