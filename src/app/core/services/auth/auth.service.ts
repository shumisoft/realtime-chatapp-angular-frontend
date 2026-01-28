import { inject, Injectable } from '@angular/core';
import { LoginRequest, LoginResponse, RegisterRequest } from '../../models/auth.models';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly authGateway = 'http://localhost:5421/auth';

  login(payload: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.authGateway}/login`, payload);
  }

  register(payload: RegisterRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.authGateway}/register`, payload);
  }
}
