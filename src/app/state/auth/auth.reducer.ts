import { createReducer, on } from '@ngrx/store';

import { storeAuthUser, deleteAuthUser, setLastAuthTime } from './auth.actions';
import { AuthUser } from 'src/app/models/auth.model';

export type AuthState = {
    authUser: AuthUser | null
    authToken: string | null
    lastAuthTime: number | null
};

export const initialState: AuthState = {
    authUser: null,
    authToken: null,
    lastAuthTime: null
};

export const authReducer = createReducer(
    initialState,
    on(storeAuthUser, (state, { authUser, authToken, lastAuthTime = null }) => ({ authUser, authToken, lastAuthTime })),
    on(setLastAuthTime, (state) => ({ ...state, lastAuthTime: Date.now() })),
    on(deleteAuthUser, (state) => ({ authUser: null, authToken: null, lastAuthTime: null }))
);