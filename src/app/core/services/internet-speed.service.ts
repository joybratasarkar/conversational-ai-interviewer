import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InternetSpeedService {

  constructor() { }
  getInternetSpeed(): number | undefined {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      
      if ('downlink' in connection) {
        return connection.downlink;
      } else if ('effectiveType' in connection) {
        console.log('connection.effectiveType',connection.effectiveType);
        
        switch(connection.effectiveType) {
          case 'slow-2g':
            return 0.1; 
          case '2g':
            return 0.2; 
          case '3g':
            return 0.5; 
          case '4g':
            return 2;   
        }
      }
    }
    // If navigator.connection API is not available or speed information is not supported
    return undefined;
  }
  
}
