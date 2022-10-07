import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DisplayPost, Post } from '../models/post.model';
import { AlertService } from '../services/alert.service';
import { PostService } from '../services/post.service';

@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.css']
})
export class PostCardComponent implements OnInit {

  @Input() post: DisplayPost | undefined;
  @Output() postsUpdated = new EventEmitter();

  constructor(private postService: PostService, private alertService: AlertService) { }

  getPlaceholder(dimensions: number) {
    return `https://via.placeholder.com/${dimensions}`;
  }

  handleDeletePost(postId: string) {
    this.postService.deletePostById(postId).subscribe((deleted: any | null) => {
      if(deleted != null) {
        this.alertService.createAlert("Post successfully deleted");
        this.postsUpdated.emit();
      }
    })
  }

  ngOnInit(): void {
  }

}
