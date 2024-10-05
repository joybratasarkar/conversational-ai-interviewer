import { Routes } from "@angular/router";
import { projectGuard } from "../guard/project.guard";
import { ReloadGuard } from "../guard/LocalStorageCleanupGuard";

export const ALL_ROUTES: Routes =[
    {
        path: '',
        redirectTo: 'Ai-interviewer',
        pathMatch: 'full',
    },
    {
        path: 'Ai-interviewer',
        loadChildren: () => import('../../interview/interview.module').then(m => m.InterviewModule),
    }
];