import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { Component, Input } from '@angular/core'
import { EmojiService } from '../../services/emoji.service'
import { Router } from '@angular/router'

@Component({
    selector: 'list-no-results',
    templateUrl: './list-no-results.component.html',
    styleUrls: ['./list-no-results.component.css']
})

export class ListNoResultsComponent {

    @Input() parentUrl: string
    @Input() feature: string

    constructor(private emojiService: EmojiService, private messageLabelService: MessageLabelService, private router: Router) { }

    public getEmoji(emoji: string): string {
        return this.emojiService.getEmoji(emoji)
    }

    public getLabel(id: string): string {
        return this.messageLabelService.getDescription(this.feature, id)
    }

    public goBack(): void {
        this.router.navigate([this.parentUrl])
    }

}
