import { createAction, props } from "@ngrx/store";
import { AlertMessageType } from "../../models/alert.model";
import { AuthUser, UserLoginCredentials, UserRegistrationData } from "../../models/auth.model";

export const storeAuthUser = createAction(
    '[Auth] Store Auth User',
    props<{ authUser: AuthUser, authToken: string, lastAuthTime?: number, hydrated?: boolean }>()
);

export const setLastAuthTime = createAction(
    '[Auth] Set Last Auth Time'
);

export const deleteAuthUser = createAction(
    '[Auth] Delete Auth User'
);

export const checkAuthStatus = createAction(
    '[Auth] Check Auth Status'
);

export const registerUser = createAction(
    '[Auth] Register User',
    props<{ userRegistrationData: UserRegistrationData }>()
);

export const authenticateUser = createAction(
    '[Auth] Authenticate User',
    props<{ userLoginCredentials: UserLoginCredentials }>()
);

export const logoutUser = createAction(
    '[Auth] Logout User',
    props<{ message?: string, messageType?: AlertMessageType }>()
);

export const hydrateUser = createAction(
    '[Auth] Hydrate User'
);