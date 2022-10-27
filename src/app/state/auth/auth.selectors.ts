import { createSelector, createFeatureSelector } from '@ngrx/store';
import { AuthState } from './auth.reducer';

export const selectAuthSlice = createFeatureSelector<AuthState>('auth');

export const selectAuthUser = createSelector(
    selectAuthSlice,
    (auth) => auth.authUser
);

export const selectAuthUserId = createSelector(
    selectAuthUser,
    (authUser) => authUser?._id || null
);

export const selectAuthToken = createSelector(
    selectAuthSlice,
    (auth) =>  auth.authToken
);

export const selectLastAuthTime = createSelector(
    selectAuthSlice,
    (auth) => auth.lastAuthTime
);