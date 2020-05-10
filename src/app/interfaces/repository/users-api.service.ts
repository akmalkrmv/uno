import { Observable } from 'rxjs';
import { IUser } from '@models/user';

export interface IUsersApiService {
  users$: Observable<IUser[]>;

  getByIds(userIds: string[]): Observable<IUser[]>;
  findById(userId: string): Observable<IUser>;

  saveToken(userId: string, token: string): Promise<void>;
  addIfNotExists(user: any): Promise<any>;
  update(user: IUser): Promise<void>;
  remove(userId: string): Promise<void>;
}
