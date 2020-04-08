import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { WebsocketService } from "./websocket.service";

const CHAT_URL = "wss://arcane-refuge-42132.herokuapp.com/";
// const CHAT_URL = "ws://localhost:3000/";

export interface Message {
  type: "offer" | "answer" | "other";
  senderId: string;
  data: any;
}

@Injectable({
  providedIn: "root",
})
export class ChatService {
  public messages: Subject<Message>;

  constructor(wsService: WebsocketService) {
    this.messages = <Subject<Message>>wsService.connect(CHAT_URL).pipe(
      map(
        (response: MessageEvent): Message => {
          return JSON.parse(response.data);
        }
      )
    );
  }
}
