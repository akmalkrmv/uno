import { Observable } from 'rxjs';
import { RommUserMap } from '@models/room-user';

export interface IRoomUserApiService {
  maps$: Observable<RommUserMap[]>;

  // READ
  findByIds(roomId: string, userId: string): Observable<RommUserMap>;

  userRoomIds(userId: string): Observable<string[]>;
  roomUserIds(roomId: string): Observable<string[]>;
  roomOtherUserIds(roomId: string, userId: string): Observable<string[]>;

  // UPDATE
  joinRoom(roomId: string, userId: string): Observable<string>;
  leaveRoom(roomId: string, userId: string): Observable<any>;

  // DELETE
  removeByUserId(userId: string): Observable<any>;
  removeByRoomId(roomId: string): Observable<any>;
  remove(id: string): Promise<void>;
}
