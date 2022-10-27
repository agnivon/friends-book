import { createFeatureSelector, createSelector } from "@ngrx/store";
import { selectAuthUser } from "../auth/auth.selectors";
import { PostState } from "./post.reducer";


export const selectPostSlice = createFeatureSelector<PostState>('post');

export const selectPosts = createSelector(
    selectPostSlice,
    post => post.posts
);

export const selectUserPosts = createSelector(
    selectPostSlice,
    selectAuthUser,
    (post, authUser) => post.posts.filter(post => post.userId === authUser?._id)
);

export const selectPostByUserId = (userId: string) => {
    return createSelector(
        selectPosts,
        posts => posts.find((post) => post.userId === userId)
    )
}

export const selectPostById = (postId: string) => {
    return createSelector(
        selectPosts,
        posts => posts.find((post) => post.id === postId)
    )
}