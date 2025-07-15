import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { ExamService } from '../../../../Services/exam';
import { QuestionWithAnswers } from '../../../../Models/QuestionWithAnswers';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-exam-details',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './exam-details.html',
  styleUrls: ['./exam-details.css']
})
export class ExamDetailsComponent implements OnInit {
  examId!: number;
  studentId!: number;
  questions: QuestionWithAnswers[] = [];
  studentAnswers: { [questionId: number]: number } = {};
  isSubmitted: boolean = false;
  isSubmitting: boolean = false;
  isLoading: boolean = true;
  result: any;
  examName: string = '';

  showModal: boolean = false;
  modalTitle: string = '';
  modalMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private examService: ExamService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const role = localStorage.getItem('role');
    const userRaw = localStorage.getItem('user');

    if (role !== 'student' || !userRaw) {
      this.showErrorModal('Authentication Required', 'Please login first.');
      this.router.navigate(['/login']);
      return;
    }

    const student = JSON.parse(userRaw);
    if (!student?.studentID) {
      this.showErrorModal('Invalid Session', 'Student info missing.');
      this.router.navigate(['/login']);
      return;
    }

    this.studentId = student.studentID;
    this.examId = Number(this.route.snapshot.paramMap.get('id'));
    localStorage.setItem('examInProgress', 'true');

    this.examService.getQuestionsByExamId(this.examId, this.studentId).subscribe({
      next: (res) => {
        if (res.alreadySubmitted) {
          this.isSubmitted = true;
          this.result = {
            correctAnswers: res.correctAnswers,
            totalQuestions: res.totalQuestions,
            scorePercentage: res.scorePercentage
          };
          localStorage.removeItem('examInProgress');
        } else {
          this.questions = res.questions;
          this.examName = res.examName || 'Exam';
        }
        this.isLoading = false; // ✅ انتهاء التحميل
      },
      error: (err) => {
        console.error('Error loading exam:', err);
        this.showErrorModal('Exam Error', 'Failed to load exam. Please try again later.');
        this.isLoading = false; // ✅ برضو في حالة الخطأ
      }
    });
  }

  submitAnswers() {
    if (this.isSubmitting) return;

    const allAnswered = this.questions.every(q => this.studentAnswers[q.questionID] !== undefined);
    if (!allAnswered) {
      this.showErrorModal(
        'Incomplete Exam',
        'You must answer all questions before submitting the exam.'
      );
      return;
    }

    this.isSubmitting = true;
    this.showSuccessModal('Submitting Exam', 'Please wait, submitting your answers...');

    const payload = {
      studentId: this.studentId,
      examId: this.examId,
      answers: Object.entries(this.studentAnswers).map(([questionId, answerId]) => ({
        questionId: Number(questionId),
        answerId: answerId
      }))
    };

    this.examService.submitExam(payload).subscribe({
      next: () => {
        this.examService.getResult(this.studentId, this.examId).subscribe({
          next: (result) => {
            this.result = result;
            this.isSubmitted = true;
            localStorage.removeItem('examInProgress');
            this.modalTitle = 'Exam Submitted';
            this.modalMessage = `Your score: ${result.correctAnswers}/${result.totalQuestions} (${result.scorePercentage}%)`;
          },
          error: (err) => {
            console.error('Error getting result:', err);
            this.showErrorModal('Result Error', 'Failed to retrieve exam results.');
          }
        });
      },
      error: (err) => {
        console.error('Error submitting exam:', err);
        this.showErrorModal('Submission Error', 'Failed to submit exam. Please try again.');
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }

  showSuccessModal(title: string, message: string) {
    this.modalTitle = title;
    this.modalMessage = message;
    this.showModal = true;
  }

  showErrorModal(title: string, message: string) {
    this.modalTitle = title;
    this.modalMessage = message;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }
}
