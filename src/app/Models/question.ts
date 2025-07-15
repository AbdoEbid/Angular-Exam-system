// models/question.ts

export interface Answer {
  answerID?: number;           
  body: string;
  isCorrect: boolean;
}

export interface Question {
  questionID?: number;        
  body: string;
  mark: number;
  examID: number;
  Type: 'TF' | 'ChooseOne' | 'ChooseAll'; 
  answers: Answer[];
}
