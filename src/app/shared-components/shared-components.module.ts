import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectLayoutComponent } from './layouts/project-layout/project-layout.component';
import { HeaderComponent } from './components/header/header.component';
import { RouterModule } from '@angular/router';
import { ErrorPopupComponent } from './components/error-popup/error-popup.component';
import { HttpClientModule } from '@angular/common/http';
import { NgxCaptureModule } from 'ngx-capture';
import { WebcamModule } from 'ngx-webcam';
import { ToastrModule } from 'ngx-toastr';

import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { TittlecasePipe } from './pipe/tittlecase.pipe';
import { ScrollToBottomDirective } from '../core/Directive/scroll';
import { SpeedTestModule } from 'ng-speed-test';
import { SafePipe } from './pipe/safe.pipe';


@NgModule({
  declarations: [
    ProjectLayoutComponent,
    HeaderComponent,
    HeaderComponent,
    ErrorPopupComponent,
    TittlecasePipe,
    ScrollToBottomDirective,
    SafePipe
    
  ],
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    SpeedTestModule,
    NgxCaptureModule,
      NgxSkeletonLoaderModule.forRoot({ animation: 'pulse', loadingText: 'This item is actually loading...' }),


  ],
  exports: [
    ProjectLayoutComponent,
    RouterModule,
    HttpClientModule,
    NgxCaptureModule,
    NgxSkeletonLoaderModule,
    SpeedTestModule,
    TittlecasePipe,
    ScrollToBottomDirective,
    SafePipe
  ]
})
export class SharedComponentsModule { }
