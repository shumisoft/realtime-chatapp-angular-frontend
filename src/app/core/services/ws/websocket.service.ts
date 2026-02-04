import { Injectable } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import { Observable, Subject } from 'rxjs';
import SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private client!: Client;
  private connected = false;

  private readonly baseUrl = 'http://localhost:5421';

  constructor() {}

  connect(jwtToken: string) {
    if (this.connected) return;

    this.client = new Client({
      webSocketFactory: () => new SockJS(`${this.baseUrl}/ws`),
      connectHeaders: {
        Authorization: `Bearer ${jwtToken}`,
      },

      debug: (msg) => console.log('STOMP:', msg),

      onConnect: (frame) => {
        this.connected = true;
        console.log('🟢 STOMP CONNECTED', frame);
      },

      onStompError: (frame) => {
        console.error('🔴 STOMP ERROR', frame);
      },

      onWebSocketClose: (evt) => {
        console.warn('🟡 STOMP CLOSED', evt);
        this.connected = false;
      },
    });

    this.client.activate();
  }

  subscribe(topic: string): Observable<any> {
    const subject = new Subject<any>();
    this.client.onConnect = () => {
      this.client.subscribe(topic, (msg: IMessage) => {
        subject.next(JSON.parse(msg.body));
      });
    };

    return subject.asObservable();
  }

  publish(destination: string, body: any) {
    if (!this.connected) return;

    this.client.publish({
      destination,
      body: JSON.stringify(body),
    });
  }
}
