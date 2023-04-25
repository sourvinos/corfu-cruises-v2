import { Injectable } from '@angular/core'

@Injectable({ providedIn: 'root' })

export class EmojiService {

    public getEmoji(emoji: string): string {
        switch (emoji) {
            case 'email': return '📬'
            case 'question': return '🤔'
            case 'error': return '❌'
            case 'green-circle': return '🟢'
            case 'null': return '🚫'
            case 'ok': return '✔️'
            case 'red-circle': return '🔴'
            case 'remarks': return '🔔'
            case 'warning-triangle': return '⚠️'
            case 'wildcard': return '⭐'
            case 'yellow-circle': return '🟡'
        }

    }

}
