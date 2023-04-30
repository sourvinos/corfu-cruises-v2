import { Injectable } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { Observable } from 'rxjs'
// Custom
import { DialogAlertComponent } from '../components/dialog-alert/dialog-alert.component'

@Injectable({ providedIn: 'root' })

export class DialogService {

    //#region variables

    private response: any

    //#endregion

    constructor(public dialog: MatDialog) { }

    //#region public methods

    public open(message: any, iconStyle: string, actions: string[]): Observable<boolean> {
        return typeof message === 'object'
            ? this.openObjectDialog(message, iconStyle, actions)
            : this.openStringDialog(message, iconStyle, actions)
    }

    //#endregion

    //#region private methods

    private openObjectDialog(apiObject: any, iconStyle: string, actions: string[]): Observable<boolean> {
        this.response = this.dialog.open(DialogAlertComponent, {
            height: '30rem',
            width: '25rem',
            data: {
                message: apiObject,
                iconStyle: iconStyle,
                actions: actions
            },
            panelClass: 'dialog'
        })
        return this.response.afterClosed()
    }

    private openStringDialog(message: string | object, iconStyle, actions: string[]): Observable<boolean> {
        this.response = this.dialog.open(DialogAlertComponent, {
            height: '30rem',
            width: '25rem',
            data: {
                message: message,
                iconStyle: iconStyle,
                actions: actions
            },
            panelClass: 'dialog'
        })
        return this.response.afterClosed()
    }

    //#endregion

}
