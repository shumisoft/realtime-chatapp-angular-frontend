import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ENV_CONFIG } from '../../config/app.env.config';
import { OnlineStatusType, UserStatus, UserStatusResponse } from '../../models/user-status.model';

@Injectable({
  providedIn: 'root',
})
export class UserStatusService {
  private readonly http = inject(HttpClient);
  private readonly env = inject(ENV_CONFIG);

  private readonly apiUrl = `${this.env.gatewayUri}/chat/user-status`;

  getUserStatuses(userIds: (string | null | undefined)[]): Observable<UserStatusResponse> {
    const validIds = userIds?.filter((id): id is string => !!id);

    const uniqueIds = [...new Set(validIds)];

    if (!uniqueIds || uniqueIds.length === 0) {
      return of({});
    }

    return this.http.post<UserStatusResponse>(`${this.apiUrl}/batch`, uniqueIds);
  }

  getDisplayStatus(status: UserStatus): string {
    if (status.status === OnlineStatusType.ONLINE) {
      return 'Online';
    }

    if (!status.lastSeen) {
      return 'Offline';
    }

    const lastSeenDate = new Date(Number(status.lastSeen));
    return `Last seen ${this.timeAgo(lastSeenDate)}`;
  }

  private timeAgo(date: Date): string {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + 'y ago';

    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + 'm ago';

    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + 'd ago';

    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + 'h ago';

    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + 'm ago';

    return 'just now';
  }
}
