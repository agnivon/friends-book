import { createReducer, on } from '@ngrx/store';

import { storeAuthUser, deleteAuthUser, setLastAuthTime, updateStoredAuthUser } from './auth.actions';
import { AuthUser } from 'src/app/models/auth.model';
import { updateAuthUser } from '../user/user.actions';
import { state } from '@angular/animations';

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
    on(storeAuthUser, (state, { authUser, authToken = state.authToken, lastAuthTime = state.lastAuthTime }) => ({ authUser, authToken, lastAuthTime })),
    on(updateStoredAuthUser, (state, { updatedAuthUser }) => ({
        ...state, authUser: {
            ...state.authUser!,
            ...updatedAuthUser
        }
    })),
    on(setLastAuthTime, (state) => ({ ...state, lastAuthTime: Date.now() })),
    on(deleteAuthUser, (state) => ({ authUser: null, authToken: null, lastAuthTime: null }))
);