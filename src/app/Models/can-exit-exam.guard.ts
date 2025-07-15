import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable, of } from 'rxjs';
import { ExamDetailsComponent } from '../components/student/exams/exam-details/exam-details';

@Injectable({
  providedIn: 'root'
})
export class CanExitExamGuard implements CanDeactivate<ExamDetailsComponent> {
  canDeactivate(component: ExamDetailsComponent): Observable<boolean> {
    if (!component.isSubmitted) {
      component.showErrorModal(
        'Cannot Exit',
        'You must submit the exam before leaving.'
      );
      return of(false);
    }
    return of(true);
  }
}
