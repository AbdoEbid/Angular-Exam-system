import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Question } from '../Models/question';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private baseUrl = 'https://localhost:7155/api/Question';

  constructor(private http: HttpClient) {}

  addQuestion(question: Question): Observable<any> {
    return this.http.post(this.baseUrl, question);
  }
}
