import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedComponentsModule } from './shared-components/shared-components.module';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './core/interceptor/token';
import { ToastrModule } from 'ngx-toastr';
import { NgxCaptureModule } from 'ngx-capture';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { MicrophonePermissionDialogComponent } from './core/dialog/microphone-permission-dialog/microphone-permission-dialog.component';
import { MaterialModule } from './shared-libraries/material/material';

@NgModule({
  declarations: [
    AppComponent,
    MicrophonePermissionDialogComponent,    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedComponentsModule,
    NoopAnimationsModule,
    MaterialModule,
    ToastrModule.forRoot(),
    NgxCaptureModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
