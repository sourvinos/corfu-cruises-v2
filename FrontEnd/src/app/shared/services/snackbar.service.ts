import { Injectable, NgZone } from '@angular/core'
import { MatSnackBar } from '@angular/material/snack-bar'
// Custom
import { SnackbarComponent } from '../components/snackbar/snackbar.component'

@Injectable({ providedIn: 'root' })

export class SnackbarService {

    constructor(private zone: NgZone, public snackBar: MatSnackBar) { }

    //#region public methods

    public open(message: string | string[], type: string, duration = 1500): void {
        this.zone.run(() => {
            let errors = ''
            if (typeof (message) === 'object') {
                message.forEach(element => {
                    errors += element + '<br />'
                })
            }
            if (typeof (message) === 'string') {
                errors = message
            }
            this.snackBar.openFromComponent(SnackbarComponent, {
                data: {
                    html: errors
                },
                duration: duration,
                panelClass: [type],
            })
        })
    }

    //#endregion

}
