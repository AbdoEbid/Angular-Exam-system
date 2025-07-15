import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Exam {
  examID: number;
  name: string;
  examDate: string;
  courseID: number | null;
}

@Injectable({
  providedIn: 'root'
})
export class ExamService {
  private baseUrl = 'https://localhost:7155/api/Exam'; 

  constructor(private http: HttpClient) {}

  getAllExams(): Observable<Exam[]> {
    return this.http.get<Exam[]>(this.baseUrl);
  }

  getExamById(id: number): Observable<Exam> {
    return this.http.get<Exam>(`${this.baseUrl}/${id}`);
  }

  deleteExam(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  updateExam(exam: Exam): Observable<any> {
    return this.http.put(`${this.baseUrl}/${exam.examID}`, exam);
  }

  getQuestionsByExamId(examId: number, studentId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/WithQuestions/${examId}/${studentId}`);
  }

  submitExamAnswers(payload: {
    studentId: number;
    examId: number;
    answers: { questionId: number; answerId: number }[];
  }): Observable<any> {
    return this.http.post(`${this.baseUrl}/Submit`, payload);
  }

  submitExam(payload: {
    studentId: number;
    examId: number;
    answers: { questionId: number; answerId: number }[];
  }): Observable<any> {
    return this.http.post(`${this.baseUrl}/StudentAnswer`, payload, {
      responseType: 'text' as 'json'
    });
  }

  getResult(studentId: number, examId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/Result/${studentId}/exam/${examId}`);
  }

  createExam(exam: any): Observable<any> {
    return this.http.post(this.baseUrl, exam);
  }
}
