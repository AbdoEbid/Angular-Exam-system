import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';


@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const role = localStorage.getItem('role');
    const user = localStorage.getItem('user');

    if (role === 'admin' && user) {
      return true;
    }

    alert('⛔ Unauthorized. Admin only.');
    this.router.navigate(['/login']);
    return false;
  }
}
