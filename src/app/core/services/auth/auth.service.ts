import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENV_CONFIG } from '../../config/app.env.config';
import { LoginRequest, LoginResponse, RegisterRequest } from '../../models/auth.models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly env = inject(ENV_CONFIG);
  private readonly http = inject(HttpClient);
  private readonly authGateway = `${this.env.gatewayUri}/auth`;

  login(payload: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.authGateway}/login`, payload);
  }

  register(payload: RegisterRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.authGateway}/register`, payload);
  }
}
