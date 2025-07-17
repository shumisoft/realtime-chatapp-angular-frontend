import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PageResponse } from '../../models/page.models';
import { EditUserRequest, User } from '../../models/user.models';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly userGateway = 'http://localhost:5421/users';

  getPrincipalUser(): Observable<User> {
    return this.http.get<User>(`${this.userGateway}/me`);
  }

  updatePrincipalUser(payload: EditUserRequest): Observable<User> {
    return this.http.patch<User>(`${this.userGateway}/me`, payload);
  }

  getUserByUsername(username: string): Observable<User> {
    return this.http.get<User>(`${this.userGateway}/lookup`, {
      params: {
        username,
      },
    });
  }

  searchUsers(
    query: string,
    page: number = 0,
    size: number = 10,
  ): Observable<PageResponse<Partial<User>>> {
    return this.http.get<PageResponse<Partial<User>>>(`${this.userGateway}/search`, {
      params: {
        q: query,
        page,
        size,
      },
    });
  }
}
