import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { exhaustMap } from 'rxjs';
import { selectAcessToken } from '../../store/auth/auth.selectors';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(Store);

  // Do not attach token on auth endpoints
  const bypassUrls = ['/auth/login', '/auth/register'];

  if (bypassUrls.some((url) => req.url.includes(url))) return next(req);

  return store.select(selectAcessToken).pipe(
    exhaustMap((token) => {
      if (!token) {
        return next(req);
      }

      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });

      return next(authReq);
    })
  );
};
