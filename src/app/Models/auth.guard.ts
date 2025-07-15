import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const role = localStorage.getItem('role');
    const user = localStorage.getItem('user');

    if (role === 'student' && user) {
      return true;
    }

    alert('⛔ Unauthorized. Please login first.');
    this.router.navigate(['/login']);
    return false;
  }
}
