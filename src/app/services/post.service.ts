import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, of } from 'rxjs';
import { NewPost, Post, UpdatedPost } from '../models/post.model';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  baseApiUrl = `http://3.17.216.66:3000`;

  constructor(private http: HttpClient, private alertService: AlertService, private router: Router) { }

  handleError(observable: Observable<any>) {
    return observable.pipe(catchError((err: HttpErrorResponse) => {
      this.alertService.createErrorAlert(err.message);
      if (err.status === 401) {
        this.router.navigate(['/login']);
      }
      return of(null);
    }));
  }

  createPost(post: NewPost) {
    const url = `${this.baseApiUrl}/posts/createpost`;
    return this.http.post<{ message: string }>(url, post);
  }

  getPostById(postId: string) {
    const url = `${this.baseApiUrl}/posts/${postId}`;
    return this.http.get<Post>(url);
  }

  getPosts() {
    const url = `${this.baseApiUrl}/posts`;
    return this.http.get<Post[]>(url);
  }

  getPostsByUserId(userId: string) {
    const url = `${this.baseApiUrl}/posts/findpostbyuserid`;
    return this.http.post<Post[]>(url, { id: userId });
  }

  /* getPostsByUserId(userId: string | null | undefined) {
    if (userId) {
      const url = `${this.baseApiUrl}/posts/findpostbyuserid`;
      return this.handleError(this.http.post<Post[]>(url, { id: userId }));
    }
    return of(null);
  } */

  updateManyPostsByUserId(userId: string, photoId: string) {
    const url = `${this.baseApiUrl}/posts/updatemanyposts`;
    return this.http.post<object>(url, {
      userId, photoId
    });
  }

  updatePostById(postId: string, post: UpdatedPost) {
    const url = `${this.baseApiUrl}/posts/${postId}`;
    return this.http.put<any>(url, post);
  }

  deletePostById(postId: string | null) {
    const url = `${this.baseApiUrl}/posts/${postId}`;
    return this.http.delete<any>(url);
  }

}
