import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExamService, Exam } from '../../../../Services/exam'; 
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-exam-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './exam-list.html',
  styleUrls: ['./exam-list.css']
})
export class ExamListComponent implements OnInit {
  exams: Exam[] = [];

  constructor(private examService: ExamService, private router: Router) {}

  ngOnInit(): void {
  const role = localStorage.getItem('role');
  const userRaw = localStorage.getItem('user');

  if (role !== 'student' || !userRaw) {
    alert('⛔ Unauthorized. Please login first.');
    this.router.navigate(['/login']);
    return;
  }

  const student = JSON.parse(userRaw);
  if (!student || !student.studentID) {
    alert('⛔ Invalid student session.');
    this.router.navigate(['/login']);
    return;
  }

  this.examService.getAllExams().subscribe({
    next: (data) => {
      this.exams = data;
    },
    error: (err) => console.error('Error loading exams', err)
  });
}


  logout() {
  localStorage.removeItem('user');
  localStorage.removeItem('role');
  this.router.navigate(['/login']);
}


  trackByExamId(index: number, exam: Exam): number {
    return exam.examID;
  }
}
