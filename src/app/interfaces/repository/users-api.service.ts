import { Observable } from 'rxjs';
import { IUser } from '@models/index';

export interface IUsersApiService {
  getByIds(userIds: string[]): Observable<IUser[]>;
  findById(userId: string): Observable<IUser>;

  saveToken(userId: string, token: string): Promise<void>;
  addIfNotExists(user: any): Promise<any>;
  update(user: IUser): Promise<void>;
  remove(userId: string): Promise<void>;
}
