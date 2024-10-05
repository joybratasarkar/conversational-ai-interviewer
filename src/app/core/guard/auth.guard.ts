import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private _router: Router,
    private _auth: AuthService

  ) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      
    const searchParams:any = new URLSearchParams(state.url.split('?')[1]);
    
    // let queryParamsLength= Object.keys(searchParams).length;
    
    if(searchParams?.size==0)
    {
      
      // localStorage.removeItem("AIInterViewUser");

      // localStorage.removeItem("interviewInProgress");
      // localStorage.removeItem("total_questions");


      
      // this._router.navigate(['/auth/login']);
      
      return false;
    }
    else if (this._auth.userToken) {
      
      return true;
    }
    else {
      
      this._router.navigate(['/auth/login']);
      return false;
    }
  }

}
