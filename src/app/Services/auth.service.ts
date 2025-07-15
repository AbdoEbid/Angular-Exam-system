// src/app/Services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface Student {
  studentID: number;
  name: string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = 'https://localhost:7155/api/Auth';

  constructor(private http: HttpClient) {}

  loginStudent(payload: LoginPayload): Observable<Student> {
    return this.http.post<Student>(`${this.baseUrl}/login`, payload);
  }

  registerStudent(payload: RegisterPayload): Observable<Student> {
    return this.http.post<Student>(`${this.baseUrl}/register`, payload);
  }
}
