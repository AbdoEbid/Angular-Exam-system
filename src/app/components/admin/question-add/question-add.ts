import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Question } from '../../../Models/question';
import { QuestionService } from '../../../Services/question.service';

@Component({
  selector: 'app-question-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './question-add.html'
})
export class QuestionAddComponent implements OnInit {
  questionForm!: FormGroup;
  examID!: number;
  showModal: boolean = false;
  modalMessage: string = '';
  addedQuestions: number = 0;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private questionService: QuestionService
  ) {}

  ngOnInit(): void {
    this.examID = Number(this.route.snapshot.paramMap.get('examID'));

    this.questionForm = this.fb.group({
      body: ['', Validators.required],
      mark: [1, [Validators.required, Validators.min(1)]],
      type: ['TF', Validators.required], // ✅ بدل questionType
      answers: this.fb.array([])
    });

    this.setInitialAnswers();
  }

  get answers(): FormArray {
    return this.questionForm.get('answers') as FormArray;
  }

  addAnswer(): void {
    this.answers.push(
      this.fb.group({
        body: ['', Validators.required],
        isCorrect: [false]
      })
    );
  }

  removeAnswer(index: number): void {
    if (this.answers.length > 1) this.answers.removeAt(index);
  }

  setInitialAnswers(): void {
    this.answers.clear();

    const type = this.questionForm.get('type')?.value;
    if (type === 'TF') {
      this.answers.push(this.fb.group({ body: 'True', isCorrect: false }));
      this.answers.push(this.fb.group({ body: 'False', isCorrect: false }));
    } else {
      this.addAnswer();
      this.addAnswer();
    }
  }

  onTypeChange(): void {
    this.setInitialAnswers();
  }

  onSubmit(): void {
    if (this.questionForm.invalid) return;

    const question: Question = {
      ...this.questionForm.value,
      examID: this.examID
    };

    this.questionService.addQuestion(question).subscribe({
      next: () => {
        this.addedQuestions++;
        this.modalMessage = `✅ Question ${this.addedQuestions} added successfully.`;
        this.showModal = true;
        this.resetForm();
      },
      error: (err) => {
        console.error(err);
        this.modalMessage = '❌ Failed to add question.';
        this.showModal = true;
      }
    });
  }

  resetForm(): void {
    this.questionForm.patchValue({
      body: '',
      mark: 1,
      type: 'TF' // ✅ بدل questionType
    });
    this.setInitialAnswers();
  }

  closeModal(): void {
    this.showModal = false;
  }

  finish(): void {
    this.router.navigate(['/admin/exams']);
  }
}
