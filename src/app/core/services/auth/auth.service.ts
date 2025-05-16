import { inject, Injectable } from '@angular/core';
import { LoginRequest, LoginResponse } from '../../models/auth.models';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private authGateway = 'http://192.168.1.36:5421/auth';
  // private authGateway = 'http://192.168.1.36:8181';

  login(payload: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.authGateway}/login`, payload);
  }
}
