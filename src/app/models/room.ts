export class IOffer {
  id?: string;
  type: 'offer' | 'answer';
  sender: string;
  receiver: string;
  description: any;
}

export class Offer extends IOffer {}
export class Answer extends IOffer {}

export interface Room {
  id?: string;
  name?: string;
  photoURL?: string;
  creator?: any;
  created?: number;
  users?: any[];
  offers?: Offer[];
  answers?: Answer[];
}

export class IceCandidate {
  id?: string;
  sender: string;
  reciever: string;
  candidates: any;
}
