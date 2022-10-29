import { createAction, props } from "@ngrx/store";
import { ActionMessage } from "src/app/models/action.models";
import { FriendRequest, UpdatedUser, User } from "../../models/user.model";

export const getUsers = createAction(
    '[User] Get Users'
);

export const setUsers = createAction(
    '[User] Set Users',
    props<{ users: User[] }>()
);

export const updateAuthUser = createAction(
    '[User] Update Auth User',
    props<{ updatedUser: UpdatedUser } & ActionMessage>()
)

export const updateUserById = createAction(
    '[User] Update User by Id',
    props<{ userId: string, updatedUser: UpdatedUser } & ActionMessage>()
)

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
    props<{ userId: string, friendId: string, requestId: string, status?: string }>()
);
