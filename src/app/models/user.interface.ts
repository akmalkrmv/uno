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

export interface IUserInfo {
  id?: string;
  name?: string;
  photoURL?: string;
}

export function toUserInfo(user: IUser): IUserInfo {
  // Dublicate only secure info
  return {
    id: user.id,
    name: user.name,
    photoURL: user.photoURL,
  };
}
