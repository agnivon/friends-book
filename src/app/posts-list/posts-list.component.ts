import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { DisplayPost, Post } from '../models/post.model';
import { FileService } from '../services/file.service';

@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.css']
})
export class PostsListComponent implements OnInit {

  @Input() posts: Post[] | null | undefined;
  @Output() postsUpdated = new EventEmitter();

  displayPosts: DisplayPost[] | null | undefined;

  constructor(private fileService: FileService) { }

  getPlaceholder(dimensions: number) {
    return `https://via.placeholder.com/${dimensions}`;
  }

  postComparator(post1: DisplayPost, post2: DisplayPost) {
    const post1CreatedDate = Date.parse(post1.createdDate);
    const post2CreatedDate = Date.parse(post2.createdDate);
    return post1CreatedDate > post2CreatedDate ? -1 : 1;
  }

  fetchPostImages(post: DisplayPost) {
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
  }

  handlePostsUpdated() {
    this.postsUpdated.emit();
  }

  ngOnInit(): void {
  }

  ngOnChanges() { 
    const postSlice = this.posts?.slice(this.posts.length - 20);
    console.log(postSlice);
    postSlice?.forEach((post: DisplayPost) => this.fetchPostImages(post));
    postSlice?.sort(this.postComparator);
    this.displayPosts = postSlice;
  }

}
