import { inject, Injectable } from '@angular/core';
import { WebsocketService } from '../ws/websocket.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Message, PaginatedMessages } from '../../models/message.model';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `http://localhost:5421/chat/`;

  private readonly ws = inject(WebsocketService);

  // --------------------------
  // WS METHODS
  // --------------------------

  connect(token: string): void {
    this.ws.connect(token);
  }

  listenToChat(chatId: number): Observable<Message> {
    return this.ws.subscribe(`/topic/rooms/${chatId}`);
  }

  sendMessage(dto: Partial<Message>): void {
    this.ws.publish('/app/chat.sendMessage', dto);
  }

  // --------------------------
  // REST APIs
  // --------------------------

  create(chatId: number, dto: Partial<Message>): Observable<Message> {
    return this.http.post<Message>(`${this.baseUrl}/rooms/${chatId}/messages`, dto);
  }

  getMessages(chatId: number, page = 0, size = 15): Observable<PaginatedMessages> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<PaginatedMessages>(`${this.baseUrl}/rooms/${chatId}/messages`, { params });
  }

  getById(messageId: string): Observable<Message> {
    return this.http.get<Message>(`${this.baseUrl}/messages/${messageId}`);
  }

  updateStatus(messageId: string): Observable<Message> {
    return this.http.put<Message>(`${this.baseUrl}/messages/${messageId}`, {});
  }
}
