import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { DisplayPost, Post } from '../models/post.model';
import { FileService } from '../services/file.service';
import { listenToScrollEnd, paginatedListGenerator, unSubToScrollEnd } from '../utils';

import { selectPosts } from '../state/post/post.selectors';
import { Store } from '@ngrx/store';
import { getFileById } from '../state/file/file.actions';
import { selectFileById } from '../state/file/file.selectors';

@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.css']
})
export class PostsListComponent implements OnInit {

  /* @Input() posts: Post[] = []; */
  /* @Output() postsUpdated = new EventEmitter(); */

  posts$ = this.store.select(selectPosts);

  displayPosts: DisplayPost[] = [];

  //displayPosts: IteratorResult<DisplayPost[], void> | undefined;

  /* sliceSize = 20;
  slicePointer = this.sliceSize; */
  paginatedPostList: Generator<Post[], void, unknown> | undefined;
  scrollEndHandler: Function | undefined;
  displayPostsUpdating = false;

  constructor(private fileService: FileService, private store: Store) { }

  getPlaceholder(dimensions: number) {
    return `https://via.placeholder.com/${dimensions}`;
  }

  /* postComparator(post1: DisplayPost, post2: DisplayPost) {
    const post1CreatedDate = Date.parse(post1.createdDate);
    const post2CreatedDate = Date.parse(post2.createdDate);
    return post1CreatedDate > post2CreatedDate ? -1 : 1;
  } */

  /* fetchPostImages(post: DisplayPost) {
    this.fileService.getFileById(post.postImageId).subscribe((imageUrl: SafeUrl | null) => {
      if (imageUrl) {
        post.postImageUrl = imageUrl;
      }
    });
    this.fileService.getFileById(post.userPhotoId).subscribe((imageUrl: SafeUrl | null) => {
      if (imageUrl) {
        post.userPhotoUrl = imageUrl;
      }
    });
  } */

  fetchPostImages(post: DisplayPost) {
    const { postImageId, userPhotoId } = post;
    if(postImageId) {
      this.store.dispatch(getFileById({ fileId: postImageId }));
      post.postImageUrl = this.store.select(selectFileById(postImageId));
    }
    
    if(userPhotoId) {
      this.store.dispatch(getFileById({ fileId: userPhotoId }));
      post.userPhotoUrl = this.store.select(selectFileById(userPhotoId));
    }
  }

  /* setDisplayPosts() {
    if (this.posts) {
      this.displayPostsUpdating = true;

      const sliceStart = this.posts.length - this.slicePointer;
      const sliceEnd = sliceStart + this.sliceSize;
      const postSlice = this.posts.slice(sliceStart, sliceEnd).map(post => ({...post}));

      postSlice.forEach((post: DisplayPost) => this.fetchPostImages(post));
      //postSlice.sort(this.postComparator);
      //postSlice.reverse();

      this.displayPosts = this.displayPosts?.concat(postSlice);
      this.displayPostsUpdating = false;
      console.log(this.displayPosts);
    }
  } */

  setDisplayPosts() {
    this.displayPostsUpdating = true;
      const newPosts = this.paginatedPostList?.next().value;
      if(newPosts) {
        newPosts.forEach(post => this.fetchPostImages(post));
        this.displayPosts = this.displayPosts.concat(newPosts);
      }
      this.displayPostsUpdating = false;
      //console.log(this.displayPosts);
  }

  /* handlePostsUpdated() {
    this.postsUpdated.emit();
  } */

  handleScrollEnd() {
    if (!this.displayPostsUpdating) {
      //this.slicePointer += 20;
      this.setDisplayPosts();
    }
  }

  ngOnInit(): void {
    this.scrollEndHandler = listenToScrollEnd(() => {
      this.handleScrollEnd();
    });
    this.posts$.subscribe(posts => {
      if (posts.length) {
        //console.log(posts);
        this.displayPosts = [];
        this.paginatedPostList = paginatedListGenerator<Post>(posts);
        this.setDisplayPosts();
      }
    });
  }

  ngOnDestroy(): void {
    unSubToScrollEnd(this.scrollEndHandler);
  }

  ngOnChanges() {
    this.setDisplayPosts();
  }

}
