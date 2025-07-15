import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExamService, Exam } from '../../../Services/exam';
import { CourseService } from '../../../Services/course.service';  // استيراد خدمة الكورسات

@Component({
  standalone: true,
  selector: 'app-admin-edit-exam',
  templateUrl: './exam-edit.html',
  styleUrls: ['./exam-edit.css'],
  imports: [CommonModule, RouterModule, FormsModule]
})
export class AdminEditExamComponent implements OnInit {
  examId!: number;
  exam: Exam = { examID: 0, name: '', examDate: '', courseID: null };
  courses: any[] = [];   // قائمة الكورسات
  isLoading = true;
  showModal = false;
  modalMessage = '';

  constructor(
    private route: ActivatedRoute,
    private examService: ExamService,
    private CourseService: CourseService,    // حقن الخدمة
    private router: Router
  ) {}

  ngOnInit(): void {
    const role = localStorage.getItem('role');
    if (role !== 'admin') {
      this.router.navigate(['/login']);
      return;
    }

    this.loadCourses();

    this.examId = Number(this.route.snapshot.paramMap.get('id'));
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

  loadCourses() {
    this.CourseService.getAllCourses().subscribe({
      next: (data) => this.courses = data,
      error: (err) => console.error('Failed to load courses', err)
    });
  }

  saveExam() {
    this.examService.updateExam(this.exam).subscribe({
      next: () => {
        this.modalMessage = '✅ Exam updated successfully!';
        this.showModal = true;
      },
      error: (err) => {
        console.error('Error updating exam', err);
        this.modalMessage = '❌ Failed to update exam.';
        this.showModal = true;
      }
    });
  }

  closeModalAndRedirect() {
    this.showModal = false;
    this.router.navigate(['/admin/exams']);
  }
}
