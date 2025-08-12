import { inject, Injectable, OnDestroy } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import { Observable, Subject, Subscription, interval } from 'rxjs';
import SockJS from 'sockjs-client';
import { ENV_CONFIG } from '../../config/app.env.config';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService implements OnDestroy {
  private readonly env = inject(ENV_CONFIG);

  private client!: Client;
  private connected = false;

  // Track the heartbeat subscription so we can cancel it on disconnect
  private appHeartbeatSub?: Subscription;

  private readonly HEARTBEAT_INTERVAL_MS = 20000; // 20secs
  private readonly STOMP_HEARTBEAT_MS = 20000; // 20s
  private pendingSubscriptions: { topic: string; subject: Subject<any> }[] = [];

  private readonly baseUrl = this.env.gatewayUri;

  constructor() {}

  ngOnDestroy() {
    this.stopApplicationHeartbeat();
    if (this.client) {
      this.client.deactivate();
    }
  }

  connect(jwtToken: string) {
    if (this.connected) return;

    this.client = new Client({
      // Use SockJS fallback
      webSocketFactory: () => new SockJS(`${this.baseUrl}/ws`),

      connectHeaders: {
        Authorization: `Bearer ${jwtToken}`,
      },

      // 1. PROTOCOL LEVEL HEARTBEAT (Keeps the socket connection alive)
      // Sends a ping every 20s to stop proxies/Load Balancers from closing the socket
      heartbeatOutgoing: this.STOMP_HEARTBEAT_MS,
      heartbeatIncoming: 0, // 0 = Client doesn't demand server heartbeats

      debug: (msg) => console.debug('STOMP:', msg),

      onConnect: () => {
        this.connected = true;
        console.info('✅ WebSocket Connected');

        // 2. APPLICATION LEVEL HEARTBEAT (Updates Redis "Online" Status)
        this.startApplicationHeartbeat();

        // Restore all pending subscriptions
        this.processPendingSubscriptions();
      },

      onStompError: (frame) => {
        console.error('❌ STOMP ERROR', frame);
      },

      onWebSocketClose: () => {
        console.warn('⚠️ WS CLOSED');
        this.connected = false;
        this.stopApplicationHeartbeat(); // Stop sending heartbeats immediately
      },
    });

    this.client.activate();
  }

  subscribe<T>(destination: string): Observable<T> {
    const subject = new Subject<T>();

    if (this.connected) {
      this.client.subscribe(destination, (msg: IMessage) => {
        subject.next(JSON.parse(msg.body));
      });
    } else {
      // Store for later subscription when connection is ready
      this.pendingSubscriptions.push({ topic: destination, subject });
    }

    return subject.asObservable();
  }

  publish(destination: string, body: any): void {
    if (!this.connected) {
      console.warn('Cannot publish, client not connected');
      return;
    }

    this.client.publish({
      destination,
      body: JSON.stringify(body),
    });
  }

  // ← NEW: Add disconnect method
  disconnect(): void {
    console.info('[WebSocket] 🔴 Disconnecting...');

    this.stopApplicationHeartbeat();

    if (this.client && this.connected) {
      this.client.deactivate();
      this.connected = false;
      console.info('[WebSocket] 💀 Disconnected');
    }

    // Clear pending subscriptions
    this.pendingSubscriptions = [];
  }

  private startApplicationHeartbeat() {
    this.stopApplicationHeartbeat(); // Ensure no duplicate loops

    this.appHeartbeatSub = interval(this.HEARTBEAT_INTERVAL_MS).subscribe(() => {
      if (this.connected) {
        // Send empty body, the backend just needs the Principal from the header
        this.publish('/app/heartbeat', {});
      }
    });
  }

  private stopApplicationHeartbeat() {
    if (this.appHeartbeatSub) {
      this.appHeartbeatSub.unsubscribe();
      this.appHeartbeatSub = undefined;
    }
  }

  private processPendingSubscriptions() {
    if (this.pendingSubscriptions.length === 0) return;

    // Process all pending subscriptions
    this.pendingSubscriptions.forEach((sub) => {
      this.client.subscribe(sub.topic, (msg: IMessage) => sub.subject.next(JSON.parse(msg.body)));
    });

    // Clear the array so we don't double-subscribe on re-connects
    this.pendingSubscriptions = [];
  }
}
