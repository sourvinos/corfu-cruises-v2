import { Component, Inject } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
// Custom
import { MessageLabelService } from '../../services/message-label.service'

@Component({
    selector: 'modal-action-result',
    templateUrl: './modal-action-result.component.html',
    styleUrls: ['./modal-action-result.component.css']
})

export class ModalActionResultComponent {

    //#region variables

    private feature = 'modal-action-result'
    public content: string
    public iconStyle: any
    public titleColor = ''

    //#endregion

    constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<ModalActionResultComponent>, private messageLabelService: MessageLabelService) {
        this.iconStyle = data.iconStyle
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

    public onClose(): void {
        this.dialogRef.close()
    }

    //#endregion

}
