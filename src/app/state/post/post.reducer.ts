import { createReducer, on } from '@ngrx/store';
import { Post } from 'src/app/models/post.model';
import * as PostActions from './post.actions';

export interface PostState {
    posts: Post[]
   /*  userPosts: Post[] */
}

export const initialState: PostState = {
    posts: [],
    /* userPosts: [] */
}

export const postReducer = createReducer(
    initialState,
    on(PostActions.setPosts, (state, action) => ({
        ...state,
        posts: action.posts
    })),
    /* on(PostActions.setPostsByUserId, (state, action) => ({
        ...state,
        userPosts: action.userPosts
    })) */
);