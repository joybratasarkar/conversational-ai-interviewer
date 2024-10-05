import { inject } from '@angular/core';
import { CanActivateFn, NavigationExtras, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';


export const projectGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const _auth = inject(AuthService);
  // const token = JSON.parse(localStorage.getItem('interviewInProgress') || '');
  
  if (_auth.userToken) {
    
    const navigationExtras: NavigationExtras = {
      queryParams: route.queryParams,
    };
    
    router.navigate(['/introduction-screen'], navigationExtras);
    return false;
  }
  else {
    
    return true;
  }
};
