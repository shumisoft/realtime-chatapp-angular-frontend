import { HttpBackend, HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, switchMap } from 'rxjs';
import { ENV_CONFIG } from '../../config/app.env.config';
import { PresignedUrlResponse } from '../../models/storage.models';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private readonly http = inject(HttpClient);
  private readonly env = inject(ENV_CONFIG);

  private readonly externalHttp: HttpClient;

  private readonly apiUrl = `${this.env.gatewayUri}/storage`;

  constructor(private readonly handler: HttpBackend) {
    this.externalHttp = new HttpClient(this.handler);
  }

  /**
   * Main Method: Handles the full upload flow.
   * 1. Gets Presigned URL
   * 2. Puts file to Minio
   * 3. Returns the public view URL
   */
  uploadFile(file: File): Observable<string> {
    return this.getPresignedUrl(file).pipe(
      switchMap((response) => {
        return this.uploadToMinio(response.uploadUrl, file).pipe(map(() => response.viewUrl));
      }),
    );
  }

  private getPresignedUrl(file: File): Observable<PresignedUrlResponse> {
    return this.http.post<PresignedUrlResponse>(`${this.apiUrl}/presigned-url`, {
      filename: file.name,
      contentType: file.type,
    });
  }

  private uploadToMinio(url: string, file: File): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': file.type,
    });

    return this.externalHttp.put(url, file, { headers, reportProgress: true });
  }
}
