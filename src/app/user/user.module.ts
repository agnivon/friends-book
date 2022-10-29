import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomePageComponent } from '../home-page/home-page.component';
import { ProfileCardComponent } from '../profile-card/profile-card.component';
import { SharedModule } from '../shared/shared.module';
import { PostsListComponent } from '../posts-list/posts-list.component';
import { NewPostDialogComponent } from '../new-post-dialog/new-post-dialog.component';
import { PostCardComponent } from '../post-card/post-card.component';
import { NetworkPageComponent } from '../network-page/network-page.component';
import { FriendsListComponent } from '../friends-list/friends-list.component';
import { UserListComponent } from '../user-list/user-list.component';
import { UpdatePostDialogComponent } from '../update-post-dialog/update-post-dialog.component';
import { FriendsPageComponent } from '../friends-page/friends-page.component';
import { SettingsPageComponent } from '../settings-page/settings-page.component';
import { AdminPageComponent } from '../admin-page/admin-page.component';
import { UserBadgesComponent } from '../user-badges/user-badges.component';
import { VisiblePostsPipe } from '../pipes/visibleposts.pipe';

@NgModule({
  declarations: [
    HomePageComponent,
    ProfileCardComponent,
    PostsListComponent,
    HomePageComponent,
    NewPostDialogComponent,
    PostCardComponent,
    NetworkPageComponent,
    FriendsListComponent,
    UserListComponent,
    UpdatePostDialogComponent,
    FriendsPageComponent,
    SettingsPageComponent,
    AdminPageComponent,
    UserBadgesComponent,
    VisiblePostsPipe
  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class UserModule { }
