import { HttpEventType } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AuthUser } from '../models/auth.model';
import { AlertService } from '../services/alert.service';
import { FileService } from '../services/file.service';
import { PostService } from '../services/post.service';
import { selectAuthUser } from '../state/auth/auth.selectors';
import { createPost } from '../state/post/post.actions';

@Component({
  selector: 'app-new-post-dialog',
  templateUrl: './new-post-dialog.component.html',
  styleUrls: ['./new-post-dialog.component.css']
})
export class NewPostDialogComponent implements OnInit {

  newPostForm = this.fb.group({
    username: ['', [Validators.required]],
    profession: ['', [Validators.required]],
    post: ['', [Validators.required]]
  })

  user$ = this.store.select(selectAuthUser);
  user: AuthUser | undefined;
  postImageId: string | null = null;
  photoUploadSubscription: Subscription | null = null;
  photoUploadProgress: number = 0;
  postUploadPending: boolean = false;

  constructor(public dialogRef: MatDialogRef<NewPostDialogComponent>,
    /* @Inject(MAT_DIALOG_DATA) public data: { user$: Observable<AuthUser | null> }, */ private fb: FormBuilder, private postService: PostService, private fileService: FileService, private alertService: AlertService, private store: Store) { }

  ngOnInit(): void {
    this.user$.subscribe(authUser => { if (authUser) this.user = authUser });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  /* handleFormSubmit() {
    if (this.newPostForm.valid) {
      const formValue = this.newPostForm.value;
      const user = this.user;
      this.postUploadPending = true;
      this.postService.createPost({
        post: formValue.post!,
        userId: this.user!._id,
        userName: formValue.username!,
        userPhotoId: this.user!.photoId,
        postImageId: this.postImageId || "",
        isAdmin: this.user!.isAdmin,
        profession: formValue.profession!
      }).subscribe((response: { message: string } | null) => {
        if (response) {
          this.alertService.createAlert("Post successfully created");
          this.dialogRef.close(true)
        } else {
          this.alertService.createAlert("Post creation failed");
          this.dialogRef.close(false)
        }
        this.postUploadPending = false;
      })
    }
  } */

  handleFormSubmit() {
    if (this.newPostForm.valid) {
      const formValue = this.newPostForm.value;
      const user = this.user;
      this.postUploadPending = true;
      const newPost = {
        post: formValue.post!,
        userId: this.user!._id,
        userName: formValue.username!,
        userPhotoId: this.user!.photoId,
        postImageId: this.postImageId || "",
        isAdmin: this.user!.isAdmin,
        profession: formValue.profession!
      };
      this.store.dispatch(createPost({ newPost }));
      this.postUploadPending = false;
      this.dialogRef.close();
    }
  }

  handlePhotoUpload(event: any) {

    const photo: File = event.target.files[0];

    if (photo) {
      const formData = new FormData();
      formData.append("picture", photo);
      const upload$ = this.fileService.uploadFile(formData)
      this.photoUploadSubscription = upload$.subscribe((event) => {
        if (event.type == HttpEventType.Response) {
          if (event.status == 200)
            this.postImageId = event.body.uploadId;
          else
            this.resetPhotoUpload();
        }
      });
      upload$.subscribe(event => {
        if (event.type == HttpEventType.UploadProgress) {
          this.photoUploadProgress = Math.round(100 * (event.loaded / event.total));
        }
      })
    }
  }

  cancelPhotoUpload() {
    this.photoUploadSubscription?.unsubscribe();
    this.resetPhotoUpload();
  }

  resetPhotoUpload() {
    this.postImageId = null;
    this.photoUploadSubscription = null;
    this.photoUploadProgress = 0;
  }

  get username(): FormControl {
    return this.newPostForm.get('username') as FormControl;
  }

  get profession(): FormControl {
    return this.newPostForm.get('profession') as FormControl;
  }

  get post(): FormControl {
    return this.newPostForm.get('post') as FormControl;
  }
}
