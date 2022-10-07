import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, of } from 'rxjs';
import { NewPost, Post } from '../models/post.model';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  baseApiUrl = `https://nodejs-fb-app.herokuapp.com`;

  constructor(private http: HttpClient, private alertService: AlertService, private router: Router) { }

  handleError(observable: Observable<any>) {
    return observable.pipe(catchError((err: HttpErrorResponse) => {
      this.alertService.createErrorAlert(err.message);
      if(err.status === 401) {
        this.router.navigate(['/login']);
      }
      return of(null);
    }));
  }

  createPost(post: NewPost) {
    const url = `${this.baseApiUrl}/posts/createpost`;
    return this.handleError(this.http.post<{ message: string }>(url, post));
  }

  getPostById(postId: string | null) {
    if (postId) {
      const url = `${this.baseApiUrl}/posts/${postId}`;
      return this.handleError(this.http.get<Post>(url));
    }
    return of(null);
  }

  getPosts() {
    const url = `${this.baseApiUrl}/posts`;
    return this.handleError(this.http.get<Post[]>(url));
  }

  getPostsByUserId(userId: string | null | undefined) {
    if (userId) {
      const url = `${this.baseApiUrl}/posts/findpostbyuserid`;
      return this.handleError(this.http.post<Post[]>(url, { id: userId }));
    }
    return of(null);
  }

  updateManyPostsByUserId(userId: string | null, body: object) {
    if(userId) {
      const url = `${this.baseApiUrl}/posts/updatemanyposts`;
      return this.handleError(this.http.post<object>(url, body));
    }
    return of(null);
  }

  updatePostById(postId: string | null, post: Post) {
    if (postId) {
      const url = `${this.baseApiUrl}/posts/${postId}`;
      return this.handleError(this.http.put<any>(url, post));
    }
    return of(null);
  }

  deletePostById(postId: string | null) {
    if(postId) {
      const url = `${this.baseApiUrl}/posts/${postId}`;
      return this.handleError(this.http.delete<any>(url));
    }
    return of(null);
  }

}
