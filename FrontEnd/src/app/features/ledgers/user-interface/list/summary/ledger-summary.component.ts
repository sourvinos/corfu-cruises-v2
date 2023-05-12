import { Component, Input } from '@angular/core'
// Custom
import { EmojiService } from 'src/app/shared/services/emoji.service'
import { LedgerPortGroupVM } from '../../../classes/view-models/list/ledger-port-group-vm'
import { MessageLabelService } from 'src/app/shared/services/message-label.service'

@Component({
    selector: 'ledger-customer-summary',
    templateUrl: './ledger-summary.component.html',
    styleUrls: ['../../../../../../assets/styles/dialogs.css', './ledger-summary.component.css']
})

export class LedgerCustomerSummaryComponent {

    //#region variables

    @Input() portGroup: LedgerPortGroupVM[]
    private feature = 'ledgerList'

    //#endregion

    constructor(private emojiService: EmojiService, private messageLabelService: MessageLabelService) { }

    //#region public methods

    public getEmoji(emoji: string): string {
        return this.emojiService.getEmoji(emoji)
    }

    public getLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    //#endregion

}
