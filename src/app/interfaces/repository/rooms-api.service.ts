import { Observable } from 'rxjs';
import { Room } from '@models/room';

export interface IRoomsApiService {
  rooms$: Observable<Room[]>;

  createRoom(creatorId: string): Observable<string>;
  update(room: Room): Promise<void>;
  remove(roomId: string): Promise<void>;
}
