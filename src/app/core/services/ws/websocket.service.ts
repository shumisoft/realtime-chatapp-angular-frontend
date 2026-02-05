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

  private pendingSubscriptions: { topic: string; subject: Subject<any> }[] = [];

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

      onConnect: () => {
        this.connected = true;

        // Restore all pending subscriptions
        for (const sub of this.pendingSubscriptions) {
          this.client.subscribe(sub.topic, (msg: IMessage) =>
            sub.subject.next(JSON.parse(msg.body)),
          );
        }
      },

      onStompError: (frame) => {
        console.error('STOMP ERROR', frame);
      },

      onWebSocketClose: () => {
        console.warn('WS CLOSED');
        this.connected = false;
      },
    });

    this.client.activate();
  }

  subscribe<T>(topic: string): Observable<T> {
    const subject = new Subject<T>();

    if (this.connected) {
      this.client.subscribe(topic, (msg: IMessage) => {
        subject.next(JSON.parse(msg.body));
      });
    } else {
      // store for later subscription when connection is ready
      this.pendingSubscriptions.push({ topic, subject });
    }

    return subject.asObservable();
  }

  publish(destination: string, body: any): void {
    if (!this.connected) return;

    this.client.publish({
      destination,
      body: JSON.stringify(body),
    });
  }
}
