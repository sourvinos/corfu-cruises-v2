import { Component, HostListener } from '@angular/core'
// Custom
import { InteractionService } from '../../../services/interaction.service'
import { LocalStorageService } from '../../../services/local-storage.service'
import { MessageCalendarService } from '../../../services/messages-calendar.service'
import { MessageHintService } from 'src/app/shared/services/messages-hint.service'
import { MessageLabelService } from 'src/app/shared/services/messages-label.service'
import { MessageSnackbarService } from 'src/app/shared/services/messages-snackbar.service'

@Component({
    selector: 'language-menu',
    templateUrl: './language-menu.component.html',
    styleUrls: ['../../../../../assets/styles/dropdown-menu.css', './language-menu.component.css']
})

export class LanguageMenuComponent {

    //#region variables

    public imgIsLoaded = false

    //#endregion

    constructor(private interactionService: InteractionService, private localStorageService: LocalStorageService, private messageCalendarService: MessageCalendarService, private messageHintService: MessageHintService, private messageLabelService: MessageLabelService, private messageSnackbarService: MessageSnackbarService) { }

    //#region listeners

    @HostListener('mouseenter') onMouseEnter(): void {
        document.querySelectorAll('.sub-menu').forEach((item) => {
            item.classList.remove('hidden')
        })
    }

    //#endregion

    //#region public methods

    public doLanguageTasks(language: string): string {
        this.saveLanguage(language)
        this.loadMessages()
        return language
    }

    public getStoredLanguage(): string {
        return this.localStorageService.getItem('language') == '' ? this.doLanguageTasks('en-GB') : this.localStorageService.getItem('language')
    }

    public hideMenu(): void {
        document.querySelectorAll('.sub-menu').forEach((item) => {
            item.classList.add('hidden')
        })
    }

    public imageIsLoading(): any {
        return this.imgIsLoaded ? '' : 'skeleton'
    }

    public loadImage(): void {
        this.imgIsLoaded = true
    }

    //#endregion

    //#region private methods

    private loadMessages(): void {
        this.messageCalendarService.getMessages()
        this.messageHintService.getMessages()
        this.messageLabelService.getMessages()
        this.messageSnackbarService.getMessages()
        this.interactionService.updateDateAdapters()
        this.interactionService.updateMenus()
    }

    private saveLanguage(language: string): void {
        this.localStorageService.saveItem('language', language)
    }

    //#endregion

}
