import { Injectable } from '@angular/core'

@Injectable({ providedIn: 'root' })

export class EmojiService {

    public getEmoji(emoji: string): string {
        switch (emoji) {
            case 'error': return '❌'
            case 'null': return '🚫'
            case 'ok': return '✔️'
            case 'wildcard': return '⭐'
            case 'remarks': return '🔔'
            case 'red-circle': return '🔴'
            case 'yellow-circle': return '🟡'
            case 'green-circle': return '🟢'
        }

    }

}
