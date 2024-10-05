import { Injectable, inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateFn, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LocalStorageCleanupService } from '../services/LocalStorageCleanupService';
import { AuthService } from '../services/auth.service';




export const ReloadGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const _auth = inject(AuthService);
    const localStorageCleanupService = inject(LocalStorageCleanupService)
    
    // localStorageCleanupService.setupBeforeUnloadListener()
    
    // const token = JSON.parse(localStorage.getItem('interviewInProgress') || '');
    return true
  };
  