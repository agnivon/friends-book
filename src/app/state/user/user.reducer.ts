import { createReducer, on } from "@ngrx/store";
import { FriendRequest, User } from "src/app/models/user.model";

import * as UserActions from "./user.actions";


export interface UserState {
    users: User[];
    friendRequests: FriendRequest[];
}

export const initialState: UserState = {
    users: [],
    friendRequests: []
}

export const userReducer = createReducer(
    initialState,
    on(UserActions.setUsers, (state, action) => ({
        ...state,
        users: action.users
    })),
    on(UserActions.setFriendRequests, (state, action) => ({
        ...state,
        friendRequests: action.friendRequests
    }))
);