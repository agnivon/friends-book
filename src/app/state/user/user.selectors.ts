import { createFeatureSelector, createSelector } from "@ngrx/store";
import { selectAuthUser, selectAuthUserId } from "../auth/auth.selectors";
import { UserState } from "./user.reducer";


export const selectUserSlice = createFeatureSelector<UserState>('user');

export const selectUsers = createSelector(
    selectUserSlice,
    user => user.users
);

export const selectUserById = (userId: string) => createSelector(
    selectUsers,
    users => users.find(user => user.id === userId)
);

export const selectFriendRequests = createSelector(
    selectUserSlice,
    user => user.friendRequests
);

export const selectAuthUserFriendRequests = createSelector(
    selectFriendRequests,
    selectAuthUserId,
    (friendRequests, authUserId) => friendRequests.filter(fr => fr.userId === authUserId || fr.friendId === authUserId)
);

export const selectAcceptedAuthUserFriendRequests = createSelector(
    selectAuthUserFriendRequests,
    (friendRequests) => friendRequests.filter(fr => !fr.status.toLowerCase().includes("pending"))
);

export const selectAuthUserFriends = createSelector(
    selectAuthUserId,
    selectUsers,
    selectAcceptedAuthUserFriendRequests,
    (authUserId, users, friendRequests) => {
        //console.log(friendRequests)
        const friendIds = friendRequests.map(fr => fr.userId === authUserId ? fr.friendId : fr.userId);
        //const friendIdsSet = new Set(friendIds);
        return users.filter(u => friendIds.includes(u.id));
    }
);