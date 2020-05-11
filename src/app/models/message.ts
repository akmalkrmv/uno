import { IUserInfo } from './user.interface';

export class Message {
  id?: string;
  created?: number;
  roomId: string;
  senderId: string;
  content: string;
  sender: IUserInfo;
}
