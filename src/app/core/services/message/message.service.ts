import { inject, Injectable } from '@angular/core';
import { WebsocketService } from '../ws/websocket.service';
import { HttpClient, HttpParams } from '@angular/common/http';

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

  connect(token: string) {
    this.ws.connect(token);
  }

  listenToChat(chatId: number) {
    return this.ws.subscribe(`/topic/chat/${chatId}`);
  }

  sendMessage(dto: any) {
    this.ws.publish('/app/chat.sendMessage', dto);
  }

  // --------------------------
  // REST APIs
  // --------------------------

  create(chatId: number, dto: any) {
    return this.http.post(`${this.baseUrl}/rooms/${chatId}/messages`, dto);
  }

  getMessages(chatId: number, page = 0, size = 15) {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get(`${this.baseUrl}/rooms/${chatId}/messages`, { params });
  }

  getById(messageId: string) {
    return this.http.get(`${this.baseUrl}/messages/${messageId}`);
  }

  updateStatus(messageId: string) {
    return this.http.put(`${this.baseUrl}/messages/${messageId}`, {});
  }
}
