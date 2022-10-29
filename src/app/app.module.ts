import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TemplateModule } from './template/template.module';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { authReducer } from './state/auth/auth.reducer';
import { AuthEffects } from './state/auth/auth.effects';
import { postReducer } from './state/post/post.reducer';
import { PostEffects } from './state/post/post.effects';
import { userReducer } from './state/user/user.reducer';
import { UserEffects } from './state/user/user.effects';
import { fileReducer } from './state/file/file.reducer';
import { FileEffects } from './state/file/file.effects';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    TemplateModule,
    SharedModule,
    AuthModule,
    UserModule,
    StoreModule.forRoot({ 
      auth: authReducer,
      post: postReducer,
      user: userReducer,
      file: fileReducer 
    }, {}),
    EffectsModule.forRoot([
      AuthEffects,
      PostEffects,
      UserEffects,
      FileEffects
    ]),
    StoreDevtoolsModule.instrument({
      maxAge: 100,
      logOnly: environment.production
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
