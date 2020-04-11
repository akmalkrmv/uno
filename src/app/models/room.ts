export class IOffer {
  id?: string;
  from: string;
  to: string;
  description: any;
}

export class Offer extends IOffer {}
export class Answer extends IOffer {}

export interface Room {
  id?: string;
  users?: any[];
  offers?: Offer[];
  answers?: Answer[];
}
