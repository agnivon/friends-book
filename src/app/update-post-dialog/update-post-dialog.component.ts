import { HttpEventType } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { NewPostDialogComponent } from '../new-post-dialog/new-post-dialog.component';
import { AlertService } from '../services/alert.service';
import { FileService } from '../services/file.service';
import { PostService } from '../services/post.service';
import { updatePostById } from '../state/post/post.actions';
import { selectPostById } from '../state/post/post.selectors';

@Component({
  selector: 'app-update-post-dialog',
  templateUrl: './update-post-dialog.component.html',
  styleUrls: ['./update-post-dialog.component.css']
})
export class UpdatePostDialogComponent implements OnInit {

  updatePostForm = this.fb.group({
    username: ['', [Validators.required]],
    profession: ['', [Validators.required]],
    post: ['', [Validators.required]]
  });

  post$ = this.store.select(selectPostById(this.data.postId));

  postImageId: string | null = null;
  photoUploadSubscription: Subscription | null = null;
  photoUploadProgress: number = 100;
  postUploadPending: boolean = false;

  constructor(public dialogRef: MatDialogRef<NewPostDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { postId: string }, private fb: FormBuilder, private postService: PostService, private fileService: FileService, private alertService: AlertService, private store: Store) { }

  ngOnInit(): void {
    /*  this.user$.subscribe(authUser => { if (authUser) this.user = authUser }); */
    this.post$.subscribe(post => {
      if (post) {
        this.updatePostForm.setValue({
          username: post.userName,
          profession: post.profession,
          post: post.post
        });
        this.postImageId = post.postImageId;
      }
    })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  handleFormSubmit() {
    if (this.updatePostForm.valid) {
      const formValue = this.updatePostForm.value;
      this.postUploadPending = true;
      const updatedPost = {
        post: formValue.post!,
        userName: formValue.username!,
        postImageId: this.postImageId || "",
        profession: formValue.profession!
      };
      this.store.dispatch(updatePostById({ postId: this.data.postId, updatedPost }));
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
    return this.updatePostForm.get('username') as FormControl;
  }

  get profession(): FormControl {
    return this.updatePostForm.get('profession') as FormControl;
  }

  get post(): FormControl {
    return this.updatePostForm.get('post') as FormControl;
  }

}
