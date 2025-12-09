import { withInterceptors } from '@angular/common/http';
import { jwtInterceptor } from '../interceptors/auth/jwt.interceptor';

export const appInterceptorProviders = [withInterceptors([jwtInterceptor])];
