import { Routes } from '@angular/router';
import { CanExitExamGuard } from './Models/can-exit-exam.guard';
import { AuthGuard } from './Models/auth.guard';
import { AdminGuard } from './Models/admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
    path: 'login',
    loadComponent: () => import('./components/student-login/student-login').then(m => m.StudentLoginComponent),
  },
  {
    path: 'register',
    loadComponent: () => import('./components/student-register/student-register').then(m => m.StudentRegisterComponent),
  },

  // ✅ الطالب
  {
    path: 'exams',
    loadComponent: () => import('./components/student/exams/exam-list/exam-list').then(m => m.ExamListComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'exam/:id',
    loadComponent: () => import('./components/student/exams/exam-details/exam-details').then(m => m.ExamDetailsComponent),
    canActivate: [AuthGuard],
    canDeactivate: [CanExitExamGuard]
  },

  // ✅ الأدمن
  {
    path: 'admin/exams',
    loadComponent: () => import('./components/admin/exam-list/exam-list').then(m => m.AdminExamListComponent),
    canActivate: [AdminGuard]
  },
  {
    path: 'admin/exam/add',
    loadComponent: () => import('./components/admin/exam-add/exam-add').then(m => m.AdminAddExamComponent),
    canActivate: [AdminGuard]
  },
  {
    path: 'admin/exam/edit/:id',
    loadComponent: () => import('./components/admin/exam-edit/exam-edit').then(m => m.AdminEditExamComponent),
    canActivate: [AdminGuard]
  },
  {
    path: 'admin/exam/:id',
    loadComponent: () => import('./components/admin/exam-details/exam-details').then(m => m.AdminExamDetailsComponent),
    canActivate: [AdminGuard]
  },
  {
    path: 'admin/exams/:examID/questions',
    loadComponent: () => import('./components/admin/question-add/question-add').then(m => m.QuestionAddComponent),
    canActivate: [AdminGuard]
  },

  { path: '**', redirectTo: 'login' }
];
