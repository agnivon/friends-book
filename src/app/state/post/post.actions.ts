import { createAction, props } from "@ngrx/store";
import { NewPost, Post, UpdatedPost } from "../../models/post.model";


export const createPost = createAction(
    '[Post] Create Post',
    props<{ newPost: NewPost }>()
);

/* export const getPostById = createAction(
    '[Post] Get Post by Id',
    props<{ postId: string }>()
); */

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

/* export const getPostsByUserId = createAction(
    '[Post] Get Posts by User Id',
    props<{ userId: string }>()
); */

/* export const setPostsByUserId = createAction(
    '[Post] Set Posts by User Id',
    props<{ userPosts: Post[] }>()
) */

export const deletePostById = createAction(
    '[Post] Delete Post by Id',
    props<{ postId: string }>()
);