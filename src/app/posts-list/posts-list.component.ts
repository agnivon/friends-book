import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { DisplayPost, Post } from '../models/post.model';
import { FileService } from '../services/file.service';
import { bodyScrollEndEvent, listenToScrollEnd, paginatedListGenerator, unSubToScrollEnd } from '../utils';

import { selectPosts } from '../state/post/post.selectors';
import { Store } from '@ngrx/store';
import { getFileById } from '../state/file/file.actions';
import { selectFileById } from '../state/file/file.selectors';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.css']
})
export class PostsListComponent implements OnInit {

  posts$ = this.store.select(selectPosts);

  displayPosts: DisplayPost[] = [];

  paginatedPostList: Generator<Post[], void, unknown> | undefined;
  scrollEndSubscription: Subscription | undefined;
  displayPostsUpdating = false;

  constructor(private fileService: FileService, private store: Store) { }

  getPlaceholder(dimensions: number) {
    return `https://via.placeholder.com/${dimensions}`;
  }

  fetchPostImages(post: DisplayPost) {
    const { postImageId, userPhotoId } = post;
    if (postImageId) {
      this.store.dispatch(getFileById({ fileId: postImageId }));
      post.postImageUrl = this.store.select(selectFileById(postImageId));
    }

    if (userPhotoId) {
      this.store.dispatch(getFileById({ fileId: userPhotoId }));
      post.userPhotoUrl = this.store.select(selectFileById(userPhotoId));
    }
  }

  fetchAllPostImages() {
    this.displayPosts.forEach(post => this.fetchPostImages(post));
  }

  setDisplayPosts() {
    const newPosts = this.paginatedPostList?.next().value;
    if (newPosts) {
      this.displayPosts = this.displayPosts.concat(newPosts);
    }
    this.fetchAllPostImages();
  }

  ngOnInit(): void {
    this.scrollEndSubscription = bodyScrollEndEvent.subscribe(scrollEnd => {
      if(scrollEnd) this.setDisplayPosts();
    })
    this.posts$.subscribe(posts => {
      if (posts.length) {
        this.paginatedPostList = paginatedListGenerator<Post>(posts, 20, this.displayPosts.length);
        this.displayPosts = [];
        this.setDisplayPosts();
      }
    });
  }

  ngOnDestroy(): void {
    this.scrollEndSubscription?.unsubscribe();
  }

  ngOnChanges() {
    this.setDisplayPosts();
  }

}
