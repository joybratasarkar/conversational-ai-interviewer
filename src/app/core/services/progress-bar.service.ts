import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProgressBarService {
  progressData = new BehaviorSubject<number>(0);
  showProgressBar = new BehaviorSubject<boolean>(false);

  constructor() { }

  /**
   * Function to get progress of api call
   * @param event {@link HttpEvent} Event from api call
   */
  updateProgressData(event: any): void {
    if (event?.type != 0) {
      let percentage = (event?.loaded * 100) / event?.total;
      this.progressData.next(percentage);
    }
  }


}
