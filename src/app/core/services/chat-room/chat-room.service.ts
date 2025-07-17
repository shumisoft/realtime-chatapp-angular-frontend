import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ChatRoom, CreateChatRoomRequest, PaginatedChatRooms } from '../../models/message.model';

@Injectable({
  providedIn: 'root',
})
export class ChatRoomService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `http://localhost:5421/chat/`;

  create(body: CreateChatRoomRequest): Observable<ChatRoom> {
    return this.http.post<ChatRoom>(`${this.baseUrl}/rooms`, body);
  }

  getById(chatId: number): Observable<ChatRoom> {
    return this.http.get<ChatRoom>(`${this.baseUrl}/rooms/${chatId}`);
  }

  update(chatId: number, body: Partial<ChatRoom>): Observable<ChatRoom> {
    return this.http.put<ChatRoom>(`${this.baseUrl}/rooms/${chatId}`, body);
  }

  delete(chatId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/rooms/${chatId}`);
  }

  getMyRooms(page = 0, size = 10): Observable<PaginatedChatRooms> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<PaginatedChatRooms>(`${this.baseUrl}/rooms/my`, { params });
  }
}
