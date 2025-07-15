// src/app/components/student/student-register/student-register.ts
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService, RegisterPayload } from '../../Services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-student-register',
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './student-register.html',
  styleUrls: ['./student-register.css']
})
export class StudentRegisterComponent {
  name = '';
  email = '';
  password = '';
  errorMsg = '';

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    const payload: RegisterPayload = {
      name: this.name,
      email: this.email,
      password: this.password
    };

    this.authService.registerStudent(payload).subscribe({
      next: (student) => {
        // ✅ حفظ البيانات باستخدام نفس المفاتيح اللي بيستخدمها الـ login
        localStorage.setItem('user', JSON.stringify(student));
        localStorage.setItem('role', 'student');

        // ✅ التوجيه على صفحة الامتحانات
        this.router.navigate(['/exams']);
      },
      error: (err) => {
        this.errorMsg = err?.error || '❌ Registration failed. Try again.';
        console.error(err);
      }
    });
  }
}
