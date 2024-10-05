import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BroadcastService {
  constructor() { }

  private broadcastChannel: BroadcastChannel = new BroadcastChannel('reload');

  /**
   * Function to post message to broadcast channel
   */
  postMessage(): void {
    this.broadcastChannel.postMessage({ type: 'reload' });
  }

  /**
   * Function to listen to message in broadcast channel
   */
  getMessage(): void {
    this.broadcastChannel.onmessage = (message) => {
      const data = message?.data;
      if (data?.type == 'reload') {
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    }
  }

  /**
   * Function to close broadcast channel as soon as app is destroyed
   */
  closeBroadcast(): void {
    this.broadcastChannel.close();
  }
}
