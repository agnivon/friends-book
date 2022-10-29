import { createAction, props } from "@ngrx/store";
import { ActionMessage } from "src/app/models/action.models";
import { NewPost, Post, UpdatedPost } from "../../models/post.model";

export const createPost = createAction(
    '[Post] Create Post',
    props<{ newPost: NewPost }>()
);

export const getPosts = createAction(
    '[Post] Get Posts',
);

export const setPosts = createAction(
    '[Post] Set Posts',
    props<{ posts: Post[] }>()
);

export const updatePostById = createAction(
    '[Post] Update Post by Id',
    props<{ postId: string, updatedPost: UpdatedPost }>()
);

export const updateManyPostsByUserId = createAction(
    '[Post] Update Many Posts by User Id',
    props<{ userId: string, photoId: string } & ActionMessage>()
);

export const deletePostById = createAction(
    '[Post] Delete Post by Id',
    props<{ postId: string }>()
);