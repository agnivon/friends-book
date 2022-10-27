import { SafeUrl } from "@angular/platform-browser";
import { createAction, createSelector, props } from "@ngrx/store";


export const uploadFile = createAction(
    '[File] Upload File',
    props<{ file: FormData }>()
);

export const getFileById = createAction(
    '[File] Get File By Id',
    props<{ fileId: string }>()
);

export const storeFile = createAction(
    '[File] Store File',
    props<{ fileId: string, fileUrl: SafeUrl }>()
);

export const filePresent = createAction(
    '[File] File already present'
);