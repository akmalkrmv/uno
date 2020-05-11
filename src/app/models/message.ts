import { IUserInfo } from './user.interface';

export class Message {
  id?: string;
  created?: number;
  content: string;
  roomId: string;
  senderId: string;
  sender: IUserInfo;
  type: 'message' | 'event';
}
