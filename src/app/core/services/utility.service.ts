import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  constructor() { }
  setAuthToken(token: string) {
    localStorage.setItem('Token', token);
  };
   /**
    * @description This function saves the user in local storage only upon login.
    * @param user
    */
   setUser(user: any) {
    localStorage.setItem('user', user);
  };
    /**
  * Function to convert string to base64 encoded string
  * @param stringText Value to encode
  * @returns `encoded string`
  */
    base64Encode(stringText: any): string {
      return window.btoa(stringText);
    }
}
