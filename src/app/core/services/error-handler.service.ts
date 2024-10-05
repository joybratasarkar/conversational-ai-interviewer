import { Injectable } from '@angular/core';
// import { UtilityService } from './utility.service';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorPopupComponent } from 'src/app/shared-components/components/error-popup/error-popup.component';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  constructor(
    private _router: Router,
    // private _utility: UtilityService,
    private _authService: AuthService,
    // private _gtagService: GoogleAnalyticsService
  ) { }

  /**
   * Function to open error dialog box and route to appropriate page
   * @param error {@link HttpErrorResponse} Error from backend
   */
  routeAccordingToError(error: HttpErrorResponse) {
    if (environment.production) {
      // this._gtagService.globalError(error?.error);
    }
    // console.log(error);
    if (error.status === 0) {
      // this._utility.openDialogBox(ErrorPopupComponent, { content: 'Please check your internet connection or try again later' });
    } else if (error.status == 403) {
      // this._utility.openDialogBox(ErrorPopupComponent, { content: 'Forbidden' });
      // this._authService.removeLocalStorageData();
      // this._router.navigate(['/auth/login']);
    } else if (error.status >= 500) {
      // this._utility.openDialogBox(ErrorPopupComponent, { content: 'Server Error. Please try again.' })
    } else if (error.status == 401) {
      this._router.navigate(['/unauthorised']);
    } else {
      // this._utility.openDialogBox(ErrorPopupComponent, { content: error?.error?.message });
    }

    // this._utility.autoHideDialogBox(3000);
  }
}
