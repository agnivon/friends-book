import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { catchError, EMPTY, map, mergeMap, of, take } from "rxjs";
import { AlertService } from "src/app/services/alert.service";
import { FileService } from "src/app/services/file.service";

import * as FileActions from "./file.actions";
import * as FileSelectors from "./file.selectors";

@Injectable()
export class FileEffects {
    $getFileById = createEffect(() => this.action$.pipe(
        ofType(FileActions.getFileById),
        mergeMap(action => this.store.select(FileSelectors.selectFileById(action.fileId))
            .pipe(
                take(1),
                mergeMap(fileUrl => {
                    if (fileUrl) {
                        return of(FileActions.filePresent())
                    } else {
                        return this.fileService.getFileById(action.fileId).pipe(
                            map((file: Blob) => {
                                const fileUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file));
                                return FileActions.storeFile({
                                    fileId: action.fileId,
                                    fileUrl
                                });
                            }
                            )
                        )
                    }
                })
            )
        ),
        catchError(err => this.handleError(err))
    ));

    handleError(err: HttpErrorResponse) {
        this.alertService.createErrorAlert(err.message);
        return EMPTY;
    }

    constructor(private action$: Actions, private store: Store, private fileService: FileService, private alertService: AlertService, private sanitizer: DomSanitizer) { }
}