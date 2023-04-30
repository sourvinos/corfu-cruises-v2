import { Injectable } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { Observable } from 'rxjs'
// Custom
import { ModalActionResultComponent } from '../components/modal-action-result/modal-action-result.component'

@Injectable({ providedIn: 'root' })

export class ModalActionResultService {

    //#region variables

    private response: any
    public iconStyle: any

    //#endregion

    constructor(public dialog: MatDialog) { }

    //#region public methods

    public open(message: string, iconStyle: string, actions: string[]): Observable<boolean> {
        this.response = this.dialog.open(ModalActionResultComponent, {
            height: '30rem',
            width: '25rem',
            data: {
                actions: actions,
                iconStyle: iconStyle,
                message: message,
            },
            panelClass: 'dialog'
        })
        return this.response.afterClosed()
    }

    //#endregion

}
