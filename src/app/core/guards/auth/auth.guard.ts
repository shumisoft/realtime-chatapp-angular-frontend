import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { selectIsLoggedIn } from '../../store/auth/auth.selectors';

export const authGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);
  const router = inject(Router);

  /** This could be done, but it's not recommended.
   * Subscribing inside a guard creates a manual subscription that is never cleaned up.
   * Guards expect you to return a boolean/UrlTree/Observable/Promise,
   * not to imperatively navigate inside a subscription.
   */
  // store.select(selectIsLoggedIn).subscribe((loggedIn) => {
  //  if (!loggedIn) {
  //    router.navigate(['/auth/login']);
  //    return false;
  //  }
  // });
  // return true;

  /** Recommended subscription-free way:
   * ✔ 1. Following method does NOT trigger navigation inside the guard becuase
   * Guards should return:
   *   - "true" → allow
   *   - "false" → block
   *   - "UrlTree" → redirect cleanly
   * Returning UrlTree is Angular’s recommended, cleanest method.
   * O
   * ✔ 2. It avoids race conditions and double navigation
   * When you call "router.navigate(['/auth/login'])" inside a guard,
   * Angular already is in the middle of navigating.
   * Triggering navigation inside a navigation lifecycle often causes:
   *   - Navigation errors
   *   - "Navigation canceled" warnings
   *   - Rare redirect loops
   *   - Extra render cycles
   * Returning "UrlTree" avoids all that.
   *
   * ✔ 3. It allows guards to run synchronously/non-destructively
   * Angular handles the redirect naturally.
   * You’re only `describing` the navigation, not `performing` it.
   *
   * ✔ 4. It automatically stops the current navigation
   * The previous version returns "false", but since you already called "navigate()",
   * Angular has to start a new navigation manually → not ideal.
   *
   * Recommended:
   * ✔ Best practice
   * ✔ Pure guard
   * ✔ No side effects
   * ✔ Cleanest redirect
   */

  return store.select(selectIsLoggedIn).pipe(
    map((loggedIn) => {
      return loggedIn ? true : router.createUrlTree(['/auth/login']);
    })
  );
};
