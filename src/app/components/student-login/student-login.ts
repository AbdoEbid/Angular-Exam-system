import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-student-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './student-login.html',
  styleUrls: ['./student-login.css']
})
export class StudentLoginComponent {
  email = '';
  password = '';
  errorMessage = '';

  constructor(private http: HttpClient, private router: Router) {}

  login() {
  const payload = {
    email: this.email,
    password: this.password
  };

  this.http.post<any>('https://localhost:7155/api/Auth/combined-login', payload).subscribe({
    next: (res) => {
      localStorage.setItem('user', JSON.stringify(res.data));
      localStorage.setItem('role', res.role);

      if (res.role === 'student') {
        this.router.navigate(['/exams']);
      } else if (res.role === 'admin') {
        this.router.navigate(['/admin/exams']);
      } else {
        this.errorMessage = '❌ Unknown user role.';
      }
    },
    error: (err) => {
      console.error(err);
      this.errorMessage =
        err?.error?.message || '❌ Invalid email or password.';
    }
  });
}

}
