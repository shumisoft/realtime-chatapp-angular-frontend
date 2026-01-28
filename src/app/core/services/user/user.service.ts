import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EditUserRequest, UserDTOResponse } from '../../models/user.models';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly userGateway = 'http://localhost:5421/users';

  getPrincipalUser(): Observable<UserDTOResponse> {
    return this.http.get<UserDTOResponse>(`${this.userGateway}/me`);
  }

  updatePrincipalUser(payload: EditUserRequest): Observable<UserDTOResponse> {
    return this.http.patch<UserDTOResponse>(`${this.userGateway}/me`, payload);
  }

  getUserById(userId: string): Observable<UserDTOResponse> {
    return this.http.get<UserDTOResponse>(`${this.userGateway}/lookup`, {
      params: {
        username: userId,
      },
    });
  }
}
