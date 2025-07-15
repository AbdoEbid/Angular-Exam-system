import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';   
import { ExamListComponent } from './components/student/exams/exam-list/exam-list';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HttpClientModule, 
    RouterOutlet
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  title = 'angular';
}
