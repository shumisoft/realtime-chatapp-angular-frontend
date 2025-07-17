import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ChatRoomMember } from '../../models/message.model';

@Injectable({
  providedIn: 'root',
})
export class ChatMembersService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `http://localhost:5421/chat/rooms`;

  getMembers(chatId: number): Observable<ChatRoomMember[]> {
    return this.http.get<ChatRoomMember[]>(`${this.baseUrl}/${chatId}/members`);
  }

  addMember(chatId: number, body: Partial<ChatRoomMember>) {
    return this.http.post(`${this.baseUrl}/${chatId}/members`, body);
  }

  removeMember(chatId: number, memberId: string) {
    return this.http.delete(`${this.baseUrl}/${chatId}/members/${memberId}`);
  }
}
