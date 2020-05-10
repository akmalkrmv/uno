export interface IUser {
  id?: string;
  created?: number;
  name?: string;
  phoneNumber?: string;
  photoURL?: string;
  email?: string;
  role?: string;
  fcmTokens?: any;
  friends?: string[];
}
