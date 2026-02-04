import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ChatMembersService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `http://localhost:5421/chat/members`;

  getMembers(chatId: number) {
    return this.http.get(`${this.baseUrl}/rooms/${chatId}/members`);
  }

  addMember(chatId: number, body: any) {
    return this.http.post(`${this.baseUrl}/rooms/${chatId}/members`, body);
  }

  removeMember(chatId: number, memberId: string) {
    return this.http.delete(`${this.baseUrl}/rooms/${chatId}/members/${memberId}`);
  }
}
