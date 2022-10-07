import { Component, Input, OnInit } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { Post } from '../models/post.model';
import { FriendRequest, User } from '../models/user.model';
import { AuthService } from '../services/auth.service';
import { FileService } from '../services/file.service';
import { UserService } from '../services/user.service';
import { PostService } from '../services/post.service';

@Component({
  selector: 'app-profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.css']
})
export class ProfileCardComponent implements OnInit {

  @Input() user: User | null | undefined;
  @Input() userPosts: Post[] | null | undefined;
  @Input() friendRequests: FriendRequest[] | null | undefined = [];

  profilePhotoUrl: string | SafeUrl | null | undefined;
  connections: number | null | undefined;
  noOfUserPosts: number | null | undefined;

  constructor(private userService: UserService, private auth: AuthService, private file: FileService, private postService: PostService) { }

  getPlaceholder(dimensions: number) {
    return `https://via.placeholder.com/${dimensions}`;
  }

  ngOnInit(): void {
  }

  ngOnChanges() {

    this.connections = this.friendRequests?.filter(request => {
      return request.userId === this.user?.id && !request.status.includes('pending');
    }).length || 0;

    this.noOfUserPosts = this.userPosts?.length || 0;

    this.file.getFileById(this.user?.photoId).subscribe((photoUrl: SafeUrl | null) => {
      if (photoUrl) {
        this.profilePhotoUrl = photoUrl;
      }
    });
  }
}
