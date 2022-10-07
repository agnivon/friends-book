import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { User } from '../models/user.model';
import { AlertService } from '../services/alert.service';
import { FileService } from '../services/file.service';
import { PostService } from '../services/post.service';

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

  postImageId: string | null = null;
  photoUploadSubscription: Subscription | null = null;
  photoUploadProgress: number = 0;
  postUploadPending: boolean = false;

  constructor(public dialogRef: MatDialogRef<NewPostDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user: User }, private fb: FormBuilder, private postService: PostService, private fileService: FileService, private alertService: AlertService) { }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  handleFormSubmit() {
    if (this.newPostForm.valid) {
      const formValue = this.newPostForm.value;
      const user = this.data.user;
      this.postUploadPending = true;
      this.postService.createPost({
        post: formValue.post!,
        userId: user._id,
        userName: formValue.username!,
        userPhotoId: user.photoId,
        postImageId: this.postImageId || "",
        isAdmin: user.isAdmin,
        profession: formValue.profession!
      }).subscribe((response: { message: string } | null) => {
        if (response) {
          this.alertService.createAlert("Post successfully created");
          this.dialogRef.close(true)
        } else {
          //this.alertService.createAlert("Post creation failed");
          this.dialogRef.close(false)
        }
        this.postUploadPending = false;
      })
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
