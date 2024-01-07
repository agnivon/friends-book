import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';
import { FileIdBlobMap } from '../models/file.model';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  baseApiUrl = `http://3.17.216.66:3000`;
  fetchedFiles: FileIdBlobMap = {}

  constructor(private http: HttpClient, private alertService: AlertService, private sanitizer: DomSanitizer, private router: Router) { }

  handleError(observable: Observable<any>) {
    return observable.pipe(catchError((err: HttpErrorResponse) => {
      this.alertService.createErrorAlert(err.message);
      if (err.status === 401) {
        this.router.navigate(['/login']);
      }
      return of(null);
    }));
  }

  uploadFile(file: FormData) {
    if (file) {
      const url = `${this.baseApiUrl}/files/uploadfile`;
      return this.handleError(this.http.post<{ uploadId: string }>(url, file, {
        reportProgress: true,
        observe: 'events'
      }));
    }
    return of(null);
  }

  /* getFileById(fileId: string): Observable<SafeUrl> {
    if (fileId in this.fetchedFiles) {
      const file = this.fetchedFiles[fileId];
      return of(this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file)));
    } else {
      const url = `${this.baseApiUrl}/files/${fileId}`;
      return this.http.get(url, { responseType: 'blob' }).pipe(map((file: Blob) => {
        this.fetchedFiles[fileId] = file;
        return this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file));
      }));
    }
  } */

  getFileById(fileId: string): Observable<Blob> {
      const url = `${this.baseApiUrl}/files/${fileId}`;
      return this.http.get(url, { responseType: 'blob' });
  }
}
