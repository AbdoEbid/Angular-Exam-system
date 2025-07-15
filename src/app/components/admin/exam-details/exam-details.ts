import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ExamService, Exam } from '../../../Services/exam';

@Component({
  standalone: true,
  selector: 'app-admin-exam-details',
  templateUrl: './exam-details.html',
  styleUrls: ['./exam-details.css'],
  imports: [CommonModule, RouterModule]
})
export class AdminExamDetailsComponent implements OnInit {
  examId!: number;
  exam!: Exam;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private examService: ExamService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const role = localStorage.getItem('role');
    if (role !== 'admin') {
      alert('⛔ Unauthorized. Admins only.');
      this.router.navigate(['/login']);
      return;
    }

    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam || isNaN(Number(idParam))) {
      console.error('❌ Invalid exam ID');
      this.router.navigate(['/admin/exams']);
      return;
    }

    this.examId = Number(idParam);
    this.examService.getExamById(this.examId).subscribe({
      next: (data) => {
        this.exam = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load exam', err);
        this.router.navigate(['/admin/exams']);
      }
    });
  }

  backToList() {
    this.router.navigate(['/admin/exams']);
  }
}
