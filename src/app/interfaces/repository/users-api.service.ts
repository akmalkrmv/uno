import { Observable } from 'rxjs';
import { User } from '@models/user';

export interface IUsersApiService {
  users$: Observable<any[]>;

  createUser(name?: string): Observable<User>;
  saveToken(userId: string, token: string): Promise<void>;

  getByIds(userIds: string[]): Observable<User[]>;
  findById(userId: string): Observable<User>;

  addOrUpdate(user: any): Promise<any>;
  update(user: User): Promise<void>;
  remove(userId: string): Promise<void>;
}
