export interface QuestionWithAnswers {
  questionID: number;
  body: string;
  answers: {
    answerID: number;
    body: string;
  }[];
}
