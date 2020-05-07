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
  name?: string;
  photoUrl?: string;
  creator?: any;
  created?: number;
  users?: any[];
  offers?: Offer[];
  answers?: Answer[];
}

export class IceCandidate {
  id?: string;
  senderId: string;
  recieverId: string;
  candidates: any;
}
