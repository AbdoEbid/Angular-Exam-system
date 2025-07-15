import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ExamService, Exam } from '../../../Services/exam';

@Component({
  selector: 'app-admin-exam-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './exam-list.html',
  styleUrls: ['./exam-list.css']
})
export class AdminExamListComponent implements OnInit {
  exams: Exam[] = [];
  showModal: boolean = false;
  selectedExamId: number | null = null;

  constructor(private examService: ExamService, private router: Router) {}

  ngOnInit(): void {
    const role = localStorage.getItem('role');
    if (role !== 'admin') {
      this.router.navigate(['/login']);
      return;
    }
    this.loadExams();
  }

  loadExams() {
    this.examService.getAllExams().subscribe({
      next: data => this.exams = data,
      error: err => console.error('Failed to load exams', err)
    });
  }

  confirmDelete(id: number) {
    this.selectedExamId = id;
    this.showModal = true;
  }

  deleteConfirmed() {
    if (this.selectedExamId !== null) {
      this.examService.deleteExam(this.selectedExamId).subscribe({
        next: () => {
          this.loadExams();
          this.closeModal();
        },
        error: err => {
          console.error('Error deleting exam', err);
          this.closeModal();
        }
      });
    }
  }

  closeModal() {
    this.showModal = false;
    this.selectedExamId = null;
  }

  goToDetails(id: number) {
    this.router.navigate(['/admin/exam', id]);
  }

  editExam(id: number) {
    this.router.navigate(['/admin/exam/edit', id]);
  }

  addNewExam() {
    this.router.navigate(['/admin/exam/add']);
  }

  logout() {
    localStorage.removeItem('role');
    localStorage.removeItem('studentId');
    this.router.navigate(['/login']);
  }
}
