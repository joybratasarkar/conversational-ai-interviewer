import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, fromEvent } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BeforeUnloadService {

  constructor(private toastr: ToastrService,
    private _router: Router

  ) { }

  getBeforeUnloadEvent(): Observable<Event> {
    return fromEvent(window, 'beforeunload');
  }

  confirmOnReload(interviewInProgress: string | null): void {

    this.getBeforeUnloadEvent().subscribe((event: any) => {

      if (interviewInProgress === 'true') {

        // localStorage.removeItem("AIInterViewUser");
        // localStorage.removeItem("interviewInProgress");
        // localStorage.removeItem("total_questions");
        // this._router.navigate(['/auth/login']);


        // Set default browser message for page reload
        this.toastr.warning('Reloading this page may disrupt the interview process and result in data loss or connection issues.');

      }
    });
  }
}
