export interface Offer {
  id?: string;
  from: string;
  to: string;
  description: any;
}

export interface Answer {
  id?: string;
  from: string;
  to: string;
  description: any;
}

export interface Room {
  id?: string;
  users?: any[];
  offers?: Offer[];
  answers?: Answer[];
}

