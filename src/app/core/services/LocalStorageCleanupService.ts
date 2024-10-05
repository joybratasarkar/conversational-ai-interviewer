import { Injectable } from '@angular/core';
import { Route, Router } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageCleanupService {

  private closeTabSubject: Subject<void> = new Subject<void>();

  constructor(
    private _router: Router
  ) {

    // this.setupBeforeUnloadListener();
  }


  public setupBeforeUnloadListener(): void {
    
    window.addEventListener('beforeunload', (event: any) => {
      
      // Check if the event is triggered by closing the tab
      if (event.currentTarget.performance.navigation.type !== 1) {
        return; // If it's a reload, exit without doing anything
      }
      
      let interviewInProgress = !!localStorage.getItem('interviewInProgress'); // Convert to boolean
      
      if (interviewInProgress) {
        
        // localStorage.removeItem("AIInterViewUser");
        // localStorage.removeItem("interviewInProgress");
        // this._router.navigate(['/auth/login']);
        
        // Notify subscribers that the tab is being closed
        this.closeTabSubject.next();
      // }
      }
      })
    }
  
    
    


  onCloseTab(): Subject<void> {
    return this.closeTabSubject;
  }
}
