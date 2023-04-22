import { Injectable } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { Observable } from 'rxjs'
// Custom
import { CheckInEmailDialogComponent } from '../../user-interface/email-dialog/check-in-email-dialog.component'
// Custom

@Injectable({ providedIn: 'root' })

export class CheckInEmailDialogService {

    //#region variables

    private response: any

    //#endregion

    constructor(public dialog: MatDialog) { }

    //#region public methods

    public open(message: any, iconStyle: string, justifyFooter = 'center', actions: string[]): Observable<boolean> {
        return this.openDialog(message, iconStyle, justifyFooter, actions)
    }

    //#endregion

    //#region private methods

    private openDialog(apiObject: any, iconStyle: string, justifyFooter = 'center', actions: string[]): Observable<boolean> {
        this.response = this.dialog.open(CheckInEmailDialogComponent, {
            height: '30rem',
            width: '25rem',
            data: {
                message: apiObject,
                justifyFooter: justifyFooter,
                actions: actions
            },
            panelClass: 'dialog'
        })
        return this.response.afterClosed()
    }

    //#endregion

}