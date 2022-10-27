import { createFeatureSelector, createSelector } from "@ngrx/store";
import { selectAuthUser } from "../auth/auth.selectors";
import { UserState } from "./user.reducer";


export const selectUserSlice = createFeatureSelector<UserState>('user');

export const selectUsers = createSelector(
    selectUserSlice,
    user => user.users
);

export const selectFriendRequests = createSelector(
    selectUserSlice,
    user => user.friendRequests
);

export const selectUserFriendRequests = createSelector(
    selectFriendRequests,
    selectAuthUser,
    (friendRequests, authUser) => friendRequests.filter(fr => fr.userId === authUser?._id)
);

export const selectAcceptedUserFriendRequests = createSelector(
    selectUserFriendRequests,
    (friendRequests) => friendRequests.filter(fr => !fr.status.toLowerCase().includes("pending"))
);