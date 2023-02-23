import { Component, Inject } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
// Custom
import { LedgerVM } from '../../../classes/view-models/list/ledger-vm'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'

@Component({
    selector: 'ledger-customer-summary-and-reservations',
    templateUrl: './ledger-summary-and-reservations.component.html',
    styleUrls: ['../../../../../../assets/styles/dialogs.css', './ledger-summary-and-reservations.component.css']
})

export class LedgerCustomerSummaryAndReservationsComponent {

    //#region variables

    private feature = 'ledgerList'
    public customerReservations: LedgerVM

    //#endregion

    constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<LedgerCustomerSummaryAndReservationsComponent>, private messageLabelService: MessageLabelService) { }

    //#region public methods

    public close(): void {
        this.dialogRef.close()
    }

    public getLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    //#endregion


}
