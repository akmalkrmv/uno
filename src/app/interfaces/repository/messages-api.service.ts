import { Observable } from 'rxjs';
import { Message } from '@models/index';

export interface IMessagesApiService {
  messages$: Observable<Message[]>;

  create(payload: Message): Observable<string>;
  update(data: Message): Promise<void>;
  remove(id: string): Promise<void>;
}
