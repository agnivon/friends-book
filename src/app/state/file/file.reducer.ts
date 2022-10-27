import { SafeUrl } from "@angular/platform-browser";
import { createReducer, on } from "@ngrx/store";

import * as FileActions from "./file.actions";


export interface FileState {
    [fileId: string]: SafeUrl
}

export const initialState: FileState = {};

export const fileReducer = createReducer(
    initialState,
    on(FileActions.storeFile, (state, { fileId, fileUrl }) => ({
        ...state,
        [fileId]: fileUrl
    }))
);