import { createAction, props } from "@ngrx/store";
import { FriendRequest, User } from "../../models/user.model";


export const getUsers = createAction(
    '[User] Get Users'
);

export const setUsers = createAction(
    '[User] Set Users',
    props<{ users: User[] }>()
);

export const getFriendRequests = createAction(
    '[User] Get Friend Requests'
);

export const setFriendRequests = createAction(
    '[User] Set Friend Requests',
    props<{ friendRequests: FriendRequest[] }>()
);

export const createFriendRequest = createAction(
    '[User] Create Friend Request',
    props<{ userId: string, friendId: string }>()
);

export const updateFriendRequestById = createAction(
    '[User] Update Friend Request by Id',
    props<{ userId: string, friendId: string, status?: string }>()
);