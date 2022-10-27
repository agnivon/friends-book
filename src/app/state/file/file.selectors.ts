import { createFeatureSelector, createSelector } from "@ngrx/store";
import { FileState } from "./file.reducer";


export const selectFileSlice = createFeatureSelector<FileState>('file');


export const selectFileById = (id: string) => createSelector(
    selectFileSlice,
    (files) => files[id]
);
