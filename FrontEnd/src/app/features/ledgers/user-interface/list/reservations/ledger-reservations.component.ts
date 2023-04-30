import { Component, Inject, Input } from '@angular/core'
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
// Custom
import { DateHelperService } from 'src/app/shared/services/date-helper.service'
import { DialogService } from 'src/app/shared/services/dialog.service'
import { EmojiService } from 'src/app/shared/services/emoji.service'
import { LedgerVM } from '../../../classes/view-models/list/ledger-vm'
import { MessageLabelService } from 'src/app/shared/services/message-label.service'
import { environment } from 'src/environments/environment'

@Component({
    selector: 'ledger-customer-reservations',
    templateUrl: './ledger-reservations.component.html',
    styleUrls: ['../../../../../../assets/styles/dialogs.css', './ledger-reservations.component.css']
})

export class LedgerCustomerReservationListComponent {

    //#region variables

    @Input() customerReservations: LedgerVM
    private feature = 'ledgerList'

    //#endregion

    constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dateHelperService: DateHelperService, private dialogService: DialogService, private emojiService: EmojiService, private messageLabelService: MessageLabelService) { }

    //#region public methods

    public formatDateToLocale(date: string, showWeekday = false, showYear = false): string {
        return this.dateHelperService.formatISODateToLocale(date, showWeekday, showYear)
    }

    public getEmoji(emoji: string): string {
        return this.emojiService.getEmoji(emoji)
    }

    public getIcon(filename: string): string {
        return environment.criteriaIconDirectory + filename + '.svg'
    }

    public getLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public hasRemarks(remarks: string): boolean {
        return remarks.length > 0 ? true : false
    }

    public showRemarks(remarks: string): void {
        this.dialogService.open(remarks, 'info', ['ok'])
    }

    //#endregion

}
