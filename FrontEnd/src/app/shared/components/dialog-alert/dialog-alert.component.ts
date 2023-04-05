import { Component, Inject } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
// Custom
import { MessageLabelService } from '../../services/message-label.service'

@Component({
    selector: 'dialog-alert',
    templateUrl: './dialog-alert.component.html',
    styleUrls: ['./dialog-alert.component.css']
})

export class DialogAlertComponent {

    //#region variables

    private feature = 'dialog'
    public content: any
    public iconStyle: any
    public titleColor = ''
    public justifyFooter = 'center-buttons'

    //#endregion

    constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<DialogAlertComponent>, private messageLabelService: MessageLabelService) {
        this.iconStyle = data.iconStyle
        this.justifyFooter = data.justifyFooter
    }

    //#region lifecycle hooks

    ngOnInit(): void {
        this.content = this.data.message
    }

    //#endregion

    //#region public methods

    public getLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public isObject(): boolean {
        return typeof this.content === 'object'
    }

    public onClose(): void {
        this.dialogRef.close()
    }

    //#endregion

}
