import { Component, OnInit, NgZone } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ExamService } from '../../../Services/exam';
import { CourseService, Course } from '../../../Services/course.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  selector: 'app-admin-add-exam',
  templateUrl: './exam-add.html',
  styleUrls: ['./exam-add.css']
})
export class AdminAddExamComponent implements OnInit {
  courses: Course[] = [];
  examForm!: FormGroup;

  showModal = false;
  modalMessage = '';
  isSuccess = false;

  isLoadingCourses = false;
  loadCoursesError = '';
  createdExamID: number | null = null;

  constructor(
    private fb: FormBuilder,
    private examService: ExamService,
    private courseService: CourseService,
    private router: Router,
    private ngZone: NgZone // ✅ ضروري هنا
  ) {}

  ngOnInit(): void {
    this.examForm = this.fb.group({
      name: ['', Validators.required],
      examDate: ['', Validators.required],
      courseID: [null, Validators.required]
    });

    this.loadCourses();
  }

  loadCourses() {
    this.isLoadingCourses = true;
    this.loadCoursesError = '';

    this.courseService.getAllCourses().subscribe({
      next: (data) => {
        this.courses = data;
        this.isLoadingCourses = false;
      },
      error: (err) => {
        this.loadCoursesError = 'Failed to load courses.';
        this.isLoadingCourses = false;
        console.error('Load courses error:', err);
      }
    });
  }

  onSubmit(): void {
    if (this.examForm.invalid) return;

    this.examService.createExam(this.examForm.value).subscribe({
      next: (res) => {
        this.ngZone.run(() => { // ✅ هنا المفتاح
          this.modalMessage = '✅ Exam created successfully!';
          this.showModal = true;
          this.isSuccess = true;
          this.createdExamID = res.examID;
        });
      },
      error: (err) => {
        this.ngZone.run(() => { // ✅ كمان هنا
          this.modalMessage = '❌ Failed to create exam.';
          this.showModal = true;
          this.isSuccess = false;
        });
        console.error('Create exam error:', err);
      }
    });
  }

  closeModal(): void {
    this.showModal = false;
    if (this.isSuccess && this.createdExamID) {
      this.router.navigate(['/admin/exams', this.createdExamID, 'questions']);
    }
  }
}
