import { Injectable } from '@angular/core'

@Injectable({ providedIn: 'root' })

export class ButtonClickService {

    //#region public methods

    public clickOnButton(event: KeyboardEvent, buttonId: string): void {
        event.preventDefault()
        const button = document.getElementById(buttonId)
        if (button && !button.attributes['disabled']) {
            button.click()
        }
    }

    //#endregion

}
