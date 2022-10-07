import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { AppRoutingModule } from '../app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { AlertService } from '../services/alert.service';
import { authInterceptor } from '../interceptors/auth.interceptor';
import { PostService } from '../services/post.service';
import { UserService } from '../services/user.service';
import { FileService } from '../services/file.service';
import { PlaceholderDirective } from '../directives/placeholder.directive';

@NgModule({
  declarations: [
    PlaceholderDirective
  ],
  imports: [
    CommonModule,
    MaterialModule,
    AppRoutingModule,
    ReactiveFormsModule
  ],
  exports: [
    MaterialModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    PlaceholderDirective
  ],
  providers: [
    AuthService,
    AlertService,
    PostService,
    UserService,
    FileService,
    authInterceptor
  ]
})
export class SharedModule { }
